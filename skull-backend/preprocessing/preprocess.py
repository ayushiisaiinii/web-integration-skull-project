# TODO:
# Confirm with model team:
# 1. Target spacing (1mm? 0.5mm? etc.)
# 2. Whether normalization was used.
# 3. Whether denoising was used.

import sys
import os
import SimpleITK as sitk

def load_dicom_series(dicom_folder: str) -> sitk.Image:
    """Reads a folder of .dcm files as one 3D volume, correctly ordered."""
    reader = sitk.ImageSeriesReader()
    series_ids = reader.GetGDCMSeriesIDs(dicom_folder)

    if not series_ids:
        raise ValueError(f"No DICOM series found in {dicom_folder}")

    # If multiple series got extracted into one folder, just take the first
    dicom_names = reader.GetGDCMSeriesFileNames(dicom_folder, series_ids[0])
    reader.SetFileNames(dicom_names)
    volume = reader.Execute()
    return volume

# Default value for now. Change if model team specifies another spacing.
def resample_volume(volume: sitk.Image, target_spacing=(1.0, 1.0, 1.0)) -> sitk.Image:
    """Resamples to isotropic spacing so voxels represent equal real-world distance
    in every direction — required before marching cubes later, or meshes come out
    stretched/distorted."""
    original_spacing = volume.GetSpacing()
    original_size = volume.GetSize()

    new_size = [
        int(round(original_size[i] * (original_spacing[i] / target_spacing[i])))
        for i in range(3)
    ]

    resampler = sitk.ResampleImageFilter()
    resampler.SetOutputSpacing(target_spacing)
    resampler.SetSize(new_size)
    resampler.SetOutputDirection(volume.GetDirection())
    resampler.SetOutputOrigin(volume.GetOrigin())
    resampler.SetTransform(sitk.Transform())
    resampler.SetInterpolator(sitk.sitkLinear)

    return resampler.Execute(volume)


def normalize_intensity(volume: sitk.Image, min_hu=-1000, max_hu=2000) -> sitk.Image:
    """Clips to a bone-relevant Hounsfield range, then rescales to 0–1.
    Air is around -1000 HU, dense bone goes up to ~2000 HU — clipping outside
    that range removes irrelevant extremes before the model sees it."""
    clipped = sitk.Clamp(volume, lowerBound=min_hu, upperBound=max_hu)
    rescaled = sitk.RescaleIntensity(clipped, 0, 1)
    return rescaled


def denoise(volume: sitk.Image) -> sitk.Image:
    """Light smoothing to reduce scanner noise without blurring bone edges."""
    return sitk.CurvatureFlow(volume, timeStep=0.125, numberOfIterations=3)


def preprocess(dicom_folder: str, output_path: str):
    print(f"Reading DICOM series from {dicom_folder} ...")
    volume = load_dicom_series(dicom_folder)
    print(f"Original size: {volume.GetSize()}, spacing: {volume.GetSpacing()}")

    print("Resampling to isotropic spacing ...")
    volume = resample_volume(volume)

    print("Reducing noise ...")
    volume = denoise(volume)

    print("Normalizing intensity ...")
    volume = normalize_intensity(volume)

    print(f"Writing to {output_path} ...")
    sitk.WriteImage(volume, output_path)
    print("Done.")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python preprocess.py <dicom_folder> <output.nrrd>")
        sys.exit(1)

    preprocess(sys.argv[1], sys.argv[2])