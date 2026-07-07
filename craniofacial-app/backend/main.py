from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Craniofacial AI Backend")

# Allow frontend to access the API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Craniofacial AI Backend is running."}

@app.post("/api/v1/reconstruct")
async def run_reconstruction(dicom_file: UploadFile = File(...), anatomy: str = Form(...)):
    """
    Endpoint for the AI team to implement.
    Receives the DICOM file and the anatomy type (cranium, mandible, maxilla).
    Should process the file, run inference, and return URLs to the generated 3D meshes.
    """
    
    # 1. Save file temporarily
    # 2. Preprocess DICOM (scripts/preprocess.py)
    # 3. Run AI Inference (scripts/inference.py loading weights from models/)
    # 4. Generate .obj files for defect and implant
    # 5. Return JSON payload matching frontend expectations
    
    return {
        "status": "success",
        "anatomy": anatomy,
        "metadata": {
            "vertices": 24500,
            "faces": 48900,
            "confidence_score": 0.98
        },
        "defectUrl": "/models/defect_mesh.obj",
        "implantUrl": "/models/implant_mesh.obj"
    }
