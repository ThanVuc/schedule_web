"use client";

import imageCompression from "browser-image-compression";

export async function ConvertToWebP(file: File): Promise<File> {
  const options = {
    fileType: "image/webp",
    initialQuality: 0.8, 
    maxWidthOrHeight: 1920,
  };

  const compressedFile = await imageCompression(file, options);
  return compressedFile;
}

export async function ResizeImage(file: File, maxWidth: number, maxHeight: number): Promise<File> {
  const options = {
    maxWidthOrHeight: Math.max(maxWidth, maxHeight),
    useWebWorker: true,
  };
  const resizedFile = await imageCompression(file, options);
  return resizedFile;
}
