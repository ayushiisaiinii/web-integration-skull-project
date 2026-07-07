import os
import numpy as np
import SimpleITK as sitk
from PIL import Image


def generate_slices(volume_path: str, output_dir: str):
    """Reads the preprocessed CT volume and writes every axial and sagittal
    slice out as a PNG so the frontend can just <img src=...> them."""
    image = sitk.ReadImage(volume_path)
    array = sitk.GetArrayFromImage(image)  # shape: (z, y, x), values 0-1 from preprocessing

    axial_dir = f"{output_dir}/axial"
    sagittal_dir = f"{output_dir}/sagittal"
    os.makedirs(axial_dir, exist_ok=True)
    os.makedirs(sagittal_dir, exist_ok=True)

    arr_uint8 = (np.clip(array, 0, 1) * 255).astype(np.uint8)

    z_count = arr_uint8.shape[0]
    for z in range(z_count):
        Image.fromarray(arr_uint8[z, :, :]).save(f"{axial_dir}/{z}.png")

    x_count = arr_uint8.shape[2]
    for x in range(x_count):
        Image.fromarray(arr_uint8[:, :, x]).save(f"{sagittal_dir}/{x}.png")

    return z_count, x_count