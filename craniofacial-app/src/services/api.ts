export const handleReconstructionSubmit = async (
  file: File,
  modelType: string
) => {

  const formData = new FormData();

  formData.append("file", file);
  formData.append("model_type", modelType);

  const response = await fetch(
    "http://localhost:8000/api/v1/reconstruct",
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`API Error ${response.status}`);
  }

  return await response.json();
};