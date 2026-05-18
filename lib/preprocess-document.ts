import sharp from "sharp";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const heicConvert = require("heic-convert") as (opts: {
  buffer: ArrayBuffer;
  format: "JPEG" | "PNG";
  quality?: number;
}) => Promise<ArrayBuffer>;

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
  | { kind: "pdf"; buffer: Buffer; mimeType: "application/pdf" };

export async function preprocessFile(
  buffer: Buffer,
  mimeType: string,
): Promise<PreprocessedFile> {
  const normalized = mimeType.toLowerCase().trim();

  if (PDF_MIME_TYPES.has(normalized)) {
    return { kind: "pdf", buffer, mimeType: "application/pdf" };
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
    // HEIC/HEIF: convert to JPEG first via heic-convert (pure JS — sharp does not
    // support HEIC on Vercel Lambda because libvips is compiled without libheif).
    if (mimeType.includes("heic") || mimeType.includes("heif")) {
      const arrayBuffer = buffer.buffer.slice(
        buffer.byteOffset,
        buffer.byteOffset + buffer.byteLength,
      );
      const jpegArrayBuffer = await heicConvert({
        buffer: arrayBuffer as ArrayBuffer,
        format: "JPEG",
        quality: 0.9,
      });
      buffer = Buffer.from(jpegArrayBuffer);
      mimeType = "image/jpeg";
    }

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
