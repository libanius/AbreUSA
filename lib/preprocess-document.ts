import sharp from "sharp";

const MAX_DIMENSION = 4096;
const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export const IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export const PDF_MIME_TYPES = new Set(["application/pdf"]);

export const ACCEPTED_MIME_TYPES = new Set([
  ...IMAGE_MIME_TYPES,
  ...PDF_MIME_TYPES,
]);

export type PreprocessedFile =
  | { kind: "image"; buffer: Buffer; mimeType: "image/jpeg" }
  | { kind: "pdf" };

export async function preprocessFile(
  buffer: Buffer,
  mimeType: string,
): Promise<PreprocessedFile> {
  const normalized = mimeType.toLowerCase().trim();

  if (PDF_MIME_TYPES.has(normalized)) {
    return { kind: "pdf" };
  }

  if (IMAGE_MIME_TYPES.has(normalized)) {
    const processed = await normalizeImage(buffer, normalized);
    return { kind: "image", buffer: processed, mimeType: "image/jpeg" };
  }

  const err = new Error(`Unsupported MIME type: ${mimeType}`);
  (err as Error & { errorCode: string }).errorCode = "unsupported_file_type";
  throw err;
}

async function normalizeImage(buffer: Buffer, mimeType: string): Promise<Buffer> {
  try {
    // .rotate() with no args auto-rotates based on EXIF orientation and strips
    // the tag — critical for mobile phone photos (portrait shot saved as landscape).
    const pipeline = sharp(buffer)
      .rotate()
      .resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: "inside",
        withoutEnlargement: true,
      });

    const processed = await pipeline.jpeg({ quality: 85 }).toBuffer();

    if (processed.length > MAX_BYTES) {
      // File is still large after 85% quality — reduce further
      return sharp(buffer)
        .rotate()
        .resize(MAX_DIMENSION, MAX_DIMENSION, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 60 })
        .toBuffer();
    }

    return processed;
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    const isHeic =
      mimeType.includes("heic") ||
      mimeType.includes("heif") ||
      msg.toLowerCase().includes("heif") ||
      msg.toLowerCase().includes("heic");

    console.error(
      `[preprocess-document] Image normalization failed (${mimeType}): ${msg}`,
    );

    const customErr = new Error(`Image normalization failed: ${msg}`);
    (customErr as Error & { errorCode: string }).errorCode = isHeic
      ? "heic_conversion_failed"
      : "image_decode_failed";
    throw customErr;
  }
}
