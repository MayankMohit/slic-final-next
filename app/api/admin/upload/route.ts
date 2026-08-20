import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { isAuthenticated } from "@/lib/auth";

/**
 * Issues short-lived tokens for direct browser-to-Blob uploads.
 *
 * The file never passes through this function. Routing it through a serverless
 * handler would cap uploads at the 4.5MB request body limit, which a single
 * article screenshot can exceed. Instead the browser asks here for a token,
 * this route decides whether to grant one, and the upload goes straight to
 * Vercel Blob.
 *
 * The token is therefore the whole security boundary: everything the client is
 * allowed to do has to be pinned in onBeforeGenerateToken, because after that
 * point there is no server of ours in the path.
 */

const ALLOWED_CONTENT_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
];

const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        // Checked here rather than in middleware: this is the only moment a
        // token can be withheld, and middleware does not run for every
        // deployment path.
        if (!(await isAuthenticated())) {
          throw new Error("Not authorised");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_UPLOAD_BYTES,
          // Two posts with a cover named "hero.png" must not overwrite each
          // other, and a guessable path would let anyone probe for drafts.
          addRandomSuffix: true,
        };
      },
      // No onUploadCompleted on purpose. There is nothing to record — the URL
      // is written into the post document when the editor saves — and merely
      // supplying the callback makes the SDK warn on every upload that it
      // cannot work out a callbackUrl, which is true and unfixable on
      // localhost: Vercel Blob cannot reach a machine with no public address.
    });

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json(
      { error: message },
      { status: message === "Not authorised" ? 401 : 400 },
    );
  }
}
