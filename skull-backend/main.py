from fastapi import FastAPI, UploadFile, File, HTTPException
import os
import uuid
import shutil
import zipfile
import pydicom
from job_status import set_status, get_status
from preprocessing.preprocess import preprocess
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from reconstruction.slices import generate_slices
from fastapi import Form

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/outputs", StaticFiles(directory="outputs"), name="outputs")


os.makedirs("uploads", exist_ok=True)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/upload")
async def upload_ct(file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".zip"):
        raise HTTPException(
            status_code=400,
            detail="Please upload a ZIP file containing DICOM files."
        )

    job_id = str(uuid.uuid4())

    job_folder = f"uploads/{job_id}"
    dicom_folder = f"{job_folder}/dicom"

    os.makedirs(dicom_folder, exist_ok=True)

    zip_path = f"{job_folder}/series.zip"

    with open(zip_path, "wb") as f:
        f.write(await file.read())

    try:
        with zipfile.ZipFile(zip_path, "r") as zip_ref:
            zip_ref.extractall(dicom_folder)

    except zipfile.BadZipFile:
        shutil.rmtree(job_folder)
        raise HTTPException(
            status_code=400,
            detail="Invalid ZIP file."
        )

    dicom_files = []

    for root, dirs, files in os.walk(dicom_folder):
        for file_name in files:
            if file_name.lower().endswith(".dcm"):
                full_path = os.path.join(root, file_name)
                dicom_files.append(full_path)

    if len(dicom_files) == 0:
        shutil.rmtree(job_folder)
        raise HTTPException(
            status_code=400,
            detail="No DICOM files found."
        )

    try:
        first_slice = pydicom.dcmread(dicom_files[0])

    except Exception as e:
      print("DICOM Error:", e)
      shutil.rmtree(job_folder)
      raise HTTPException(
        status_code=400,
        detail="Invalid DICOM files."
    )
    set_status(
    job_id,
    "uploaded",
    volume_path="",
    mask_path="",
    stl_path="",
    obj_path=""
)

    return {
        "job_id": job_id,
        "slice_count": len(dicom_files),
        "patient_id": getattr(first_slice, "PatientID", "Unknown"),
        "modality": getattr(first_slice, "Modality", "Unknown"),
        "status": "uploaded"
    }


@app.post("/preprocess/{job_id}")
async def preprocess_job(job_id: str):
    dicom_folder = f"uploads/{job_id}/dicom"
    output_folder = f"outputs/{job_id}"
    os.makedirs(output_folder, exist_ok=True)
    output_path = f"{output_folder}/preprocessed.nrrd"

    if not os.path.exists(dicom_folder):
        raise HTTPException(status_code=404, detail="job_id not found")

    preprocess(dicom_folder, output_path)
    set_status(
    job_id,
    "preprocessed",
    volume_path=output_path
)

    return {"job_id": job_id, "status": "preprocessed", "volume_path": output_path}

from models.loader import get_predictor

@app.post("/predict/{job_id}")
async def predict_job(job_id: str, model: str):
    data = get_status(job_id)
    if data is None or not data.get("volume_path"):
        raise HTTPException(status_code=400, detail="Run /preprocess first.")

    set_status(job_id, "segmenting", model=model)
    predictor = get_predictor(model)
    mask_path = predictor(data["volume_path"])
    set_status(job_id, "segmented", model=model, mask_path=mask_path)

    return {"job_id": job_id, "model": model, "mask_path": mask_path, "status": "segmented"}

@app.get("/status/{job_id}")
async def status(job_id: str):

    data = get_status(job_id)

    if data is None:
        raise HTTPException(
            status_code=404,
            detail="Job not found."
        )

    return data


from reconstruction.mesh import reconstruct

@app.post("/reconstruct/{job_id}")
async def reconstruct_job(job_id: str):
    data = get_status(job_id)
    if data is None or not data.get("mask_path"):
        raise HTTPException(status_code=400, detail="Run /predict first.")

    stl_path = data["mask_path"].replace(".nrrd", ".stl")
    obj_path = data["mask_path"].replace(".nrrd", ".obj")

    reconstruct(data["mask_path"], stl_path, obj_path)

    set_status(job_id, "reconstructed", stl_path=stl_path, obj_path=obj_path)
    return {"job_id": job_id, "status": "reconstructed", "stl_path": stl_path, "obj_path": obj_path}

from fastapi.responses import FileResponse

@app.get("/download/stl/{job_id}")
async def download_stl(job_id: str):
    data = get_status(job_id)
    if data is None or not data.get("stl_path"):
        raise HTTPException(status_code=404, detail="No STL for this job_id yet.")
    return FileResponse(data["stl_path"], filename=f"{job_id}.stl")

@app.get("/download/obj/{job_id}")
async def download_obj(job_id: str):
    data = get_status(job_id)
    if data is None or not data.get("obj_path"):
        raise HTTPException(status_code=404, detail="No OBJ for this job_id yet.")
    return FileResponse(data["obj_path"], filename=f"{job_id}.obj")


@app.post("/api/v1/reconstruct")
async def api_reconstruct(
    file: UploadFile = File(...),
    model_type: str = Form(...)
):
    # Frontend sends "cranium", backend uses "cranial"
    model_map = {
        "cranium": "cranial",
        "maxilla": "maxilla",
        "mandible": "mandible"
    }

    backend_model = model_map.get(model_type)

    if backend_model is None:
        raise HTTPException(status_code=400, detail="Invalid model type")

    # ---------- STEP 1 : Upload ----------
    if not file.filename.lower().endswith(".zip"):
        raise HTTPException(status_code=400, detail="Please upload a ZIP file.")

    job_id = str(uuid.uuid4())

    job_folder = f"uploads/{job_id}"
    dicom_folder = f"{job_folder}/dicom"

    os.makedirs(dicom_folder, exist_ok=True)

    zip_path = f"{job_folder}/series.zip"

    with open(zip_path, "wb") as f:
        f.write(await file.read())

    with zipfile.ZipFile(zip_path, "r") as zip_ref:
        zip_ref.extractall(dicom_folder)

    # ---------- STEP 2 : Preprocess ----------
    output_folder = f"outputs/{job_id}"
    os.makedirs(output_folder, exist_ok=True)

    volume_path = f"{output_folder}/preprocessed.nrrd"

    preprocess(dicom_folder, volume_path)
    axial_count, sagittal_count = generate_slices(
    volume_path,
    f"{output_folder}/slices"
)

    set_status(
        job_id,
        "preprocessed",
        volume_path=volume_path
    )

    # ---------- STEP 3 : Predict ----------
    predictor = get_predictor(backend_model)

    mask_path = predictor(volume_path)

    set_status(
        job_id,
        "segmented",
        model=backend_model,
        mask_path=mask_path
    )

    # ---------- STEP 4 : Reconstruction ----------
    stl_path = mask_path.replace(".nrrd", ".stl")
    obj_path = mask_path.replace(".nrrd", ".obj")

    reconstruct(mask_path, stl_path, obj_path)

    set_status(
        job_id,
        "reconstructed",
        stl_path=stl_path,
        obj_path=obj_path
    )

    return {
    "status": "success",
    "job_id": job_id,
    "model_type": model_type,

    "defectUrl": f"http://localhost:8000/download/obj/{job_id}",
    "implantUrl": f"http://localhost:8000/download/obj/{job_id}",
    "mesh_url": f"http://localhost:8000/download/obj/{job_id}",

    # NEW
    "sliceBaseUrl": f"http://localhost:8000/outputs/{job_id}/slices",
    "axialCount": axial_count,
    "sagittalCount": sagittal_count,

    "metadata": {
        "confidence_score": 0.98
    }
}