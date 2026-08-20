import { upload } from "@vercel/blob/client";
import type { PostImage } from "@/lib/post-types";

/**
 * Sends a file straight from the browser to Vercel Blob.
 *
 * The bytes never touch our serverless functions — /api/admin/upload only
 * decides whether to hand out a token — which is what keeps a large screenshot
 * from hitting the 4.5MB request body limit.
 */

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ACCEPTED = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];

export const UPLOAD_ACCEPT_ATTR = ACCEPTED.join(",");

/**
 * Reads an image's true pixel dimensions before it leaves the browser.
 *
 * Blob URLs, unlike Sanity's, encode nothing about the file, so the ratio has
 * to be captured here and stored alongside the URL. Without it next/image
 * reserves the wrong box and every article image jumps on load.
 */
async function readDimensions(file: File) {
  const bitmap = await createImageBitmap(file);
  const dimensions = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return dimensions;
}

export async function uploadImage(file: File, alt = ""): Promise<PostImage> {
  if (!ACCEPTED.includes(file.type)) {
    throw new Error("Use a JPG, PNG, WebP, AVIF or GIF.");
  }
  // Checked here as well as in the token so the user gets a real message
  // instead of a failed upload after waiting for the transfer.
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new Error(
      `That file is ${(file.size / 1024 / 1024).toFixed(1)}MB — the limit is 8MB.`,
    );
  }

  const { width, height } = await readDimensions(file);

  const blob = await upload(`blog/${file.name}`, file, {
    access: "public",
    handleUploadUrl: "/api/admin/upload",
  });

  return { url: blob.url, width, height, alt };
}
