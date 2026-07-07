import SimpleITK as sitk
import matplotlib.pyplot as plt

img = sitk.ReadImage(
    "outputs/35545c48-5d26-4bd7-8e4a-4d5b1b3f7f04/preprocessed.nrrd"
)

arr = sitk.GetArrayFromImage(img)

print(arr.shape)

plt.imshow(arr[arr.shape[0]//2], cmap="gray")
plt.show()