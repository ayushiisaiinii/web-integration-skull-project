import numpy as np
import SimpleITK as sitk
from skimage import measure
import trimesh


def nrrd_mask_to_mesh(mask_path: str, threshold: float = 0.5) -> trimesh.Trimesh:
    image = sitk.ReadImage(mask_path)
    spacing = image.GetSpacing()           # (x, y, z) mm per voxel
    array = sitk.GetArrayFromImage(image)   # array axis order is (z, y, x)

    verts, faces, normals, _ = measure.marching_cubes(array, level=threshold)

    # reorder (z,y,x) -> (x,y,z), scale voxel indices into real-world mm
    verts_mm = verts[:, [2, 1, 0]] * np.array(spacing)

    return trimesh.Trimesh(vertices=verts_mm, faces=faces, vertex_normals=normals)


def clean_mesh(mesh: trimesh.Trimesh) -> trimesh.Trimesh:
    mesh.remove_unreferenced_vertices()
    mesh.fill_holes()

    components = mesh.split(only_watertight=False)
    if len(components) > 1:
        mesh = max(components, key=lambda m: len(m.faces))

    trimesh.smoothing.filter_laplacian(mesh, iterations=5)
    return mesh


def reconstruct(mask_path: str, stl_path: str, obj_path: str):
    mesh = nrrd_mask_to_mesh(mask_path)
    mesh = clean_mesh(mesh)
    mesh.export(stl_path)
    mesh.export(obj_path)
    return stl_path, obj_path