import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";

import { storage } from "../config/firebase";

async function compressImage(file, maxWidth = 1600, quality = 0.8) {
  return new Promise((resolve) => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      let { width, height } = image;

      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");

      ctx.drawImage(image, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          resolve(
            new File([blob], file.name, {
              type: "image/jpeg",
            })
          );
        },
        "image/jpeg",
        quality
      );
    };

    image.src = URL.createObjectURL(file);
  });
}

export async function uploadWorkPhotos(workId, files) {
  const uploaded = [];

  for (const file of files) {
    const compressed = await compressImage(file);

    const fileName =
      Date.now() +
      "_" +
      Math.random().toString(36).substring(2) +
      ".jpg";

    const storageRef = ref(
      storage,
      `workPhotos/${workId}/${fileName}`
    );

    await uploadBytes(storageRef, compressed);

    const url = await getDownloadURL(storageRef);

    uploaded.push({
      name: file.name,
      fileName,
      url,
    });
  }

  return uploaded;
}

export async function deletePhoto(path) {
  await deleteObject(ref(storage, path));
}