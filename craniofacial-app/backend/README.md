# Backend Architecture Scaffold

This folder is set up for the Backend and AI Engineering team to directly integrate their models and FastAPI application.

## Directory Structure
- `/models/`: Drop your `.pt`, `.pth`, or `.h5` model weight files here.
- `/scripts/`: Place your PyTorch/TensorFlow inference logic and data preprocessing scripts (e.g. DICOM processing) here.
- `/api/`: Define your FastAPI routes, serializers, and controllers here.
- `main.py`: The entry point for the FastAPI server.
- `requirements.txt`: List your Python dependencies (e.g., `fastapi`, `uvicorn`, `torch`, `pydicom`).

## Connecting to the Frontend
Once your API is running (usually on `http://localhost:8000`), simply point the frontend API calls inside `src/services/api.ts` to your new endpoints.
