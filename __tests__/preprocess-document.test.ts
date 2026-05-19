import { describe, it, expect, vi } from "vitest";
import {
  ACCEPTED_MIME_TYPES,
  IMAGE_MIME_TYPES,
  PDF_MIME_TYPES,
  preprocessFile,
} from "@/lib/preprocess-document";

// Mock sharp so tests don't need native binaries
vi.mock("sharp", () => {
  const chain = {
    rotate: () => chain,
    resize: () => chain,
    jpeg: () => chain,
    toBuffer: async () => Buffer.from("fake-jpeg-data"),
  };
  return { default: () => chain };
});

describe("MIME type sets", () => {
  it("accepts JPEG variants", () => {
    expect(IMAGE_MIME_TYPES.has("image/jpeg")).toBe(true);
    expect(IMAGE_MIME_TYPES.has("image/jpg")).toBe(true);
  });

  it("accepts PNG", () => {
    expect(IMAGE_MIME_TYPES.has("image/png")).toBe(true);
  });

  it("accepts HEIC/HEIF", () => {
    expect(IMAGE_MIME_TYPES.has("image/heic")).toBe(true);
    expect(IMAGE_MIME_TYPES.has("image/heif")).toBe(true);
  });

  it("accepts PDF", () => {
    expect(PDF_MIME_TYPES.has("application/pdf")).toBe(true);
  });

  it("ACCEPTED_MIME_TYPES is union of image and pdf types", () => {
    for (const t of IMAGE_MIME_TYPES) expect(ACCEPTED_MIME_TYPES.has(t)).toBe(true);
    for (const t of PDF_MIME_TYPES) expect(ACCEPTED_MIME_TYPES.has(t)).toBe(true);
  });

  it("rejects unknown types", () => {
    expect(ACCEPTED_MIME_TYPES.has("text/plain")).toBe(false);
    expect(ACCEPTED_MIME_TYPES.has("application/zip")).toBe(false);
    expect(ACCEPTED_MIME_TYPES.has("video/mp4")).toBe(false);
  });
});

describe("preprocessFile", () => {
  it("returns { kind: pdf } for application/pdf", async () => {
    const result = await preprocessFile(Buffer.from(""), "application/pdf");
    expect(result.kind).toBe("pdf");
  });

  it("returns { kind: image, mimeType: image/jpeg } for JPEG input", async () => {
    const result = await preprocessFile(Buffer.from("fake"), "image/jpeg");
    expect(result.kind).toBe("image");
    if (result.kind === "image") {
      expect(result.mimeType).toBe("image/jpeg");
      expect(result.buffer).toBeInstanceOf(Buffer);
    }
  });

  it("returns { kind: image } for PNG input", async () => {
    const result = await preprocessFile(Buffer.from("fake"), "image/png");
    expect(result.kind).toBe("image");
  });

  it("throws with errorCode unsupported_file_type for unknown MIME", async () => {
    await expect(preprocessFile(Buffer.from(""), "text/plain")).rejects.toMatchObject({
      errorCode: "unsupported_file_type",
    });
  });

  it("normalizes MIME type case", async () => {
    const result = await preprocessFile(Buffer.from("fake"), "IMAGE/JPEG");
    expect(result.kind).toBe("image");
  });
});
