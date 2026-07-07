import shutil

def predict(volume_path: str) -> str:
    print(f"[FAKE] Running maxilla model on {volume_path}")
    fake_mask_path = volume_path.replace("preprocessed.nrrd", "maxilla_mask.nrrd")
    shutil.copy(volume_path, fake_mask_path)
    return fake_mask_path