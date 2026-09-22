import { compressImage } from "@/lib/compress-image";

export async function uploadImage(file: File, folder: "products" | "shops") {
  const uploadFile = await compressImage(file);

  const presignResponse = await fetch("/api/uploads/presign", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: uploadFile.type, folder }),
  });

  if (!presignResponse.ok) {
    throw new Error("Could not prepare the upload");
  }

  const { uploadUrl, publicUrl } = await presignResponse.json();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": uploadFile.type },
    body: uploadFile,
  });

  if (!uploadResponse.ok) {
    throw new Error("Upload failed");
  }

  return publicUrl as string;
}
