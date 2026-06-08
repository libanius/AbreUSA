import { describe, expect, it } from "vitest";
import {
  MAX_COMBINED_UPLOAD_BYTES,
  MAX_PREPARED_FILE_BYTES,
  prepareUploadFile,
  validateCombinedUploadSize,
  validateUploadFile,
} from "@/lib/prepare-upload-file";

function makeFile(name: string, type: string, size: number) {
  return new File([new Uint8Array(size)], name, { type });
}

describe("upload preparation limits", () => {
  it("accepts a small JPEG without compression", async () => {
    const file = makeFile("passport.jpg", "image/jpeg", 250_000);

    expect(validateUploadFile(file)).toEqual({
      mimeType: "image/jpeg",
      needsCompression: false,
    });
    await expect(prepareUploadFile(file)).resolves.toBe(file);
  });

  it("marks a large JPEG for browser compression", () => {
    const file = makeFile(
      "passport.jpeg",
      "image/jpeg",
      MAX_PREPARED_FILE_BYTES + 1,
    );

    expect(validateUploadFile(file).needsCompression).toBe(true);
  });

  it("rejects an oversized PDF before network submission", () => {
    const file = makeFile(
      "address.pdf",
      "application/pdf",
      MAX_PREPARED_FILE_BYTES + 1,
    );

    expect(() => validateUploadFile(file)).toThrow(/PDF ou HEIC/);
  });

  it("infers JPEG type from extension when the browser omits MIME type", () => {
    const file = makeFile("passport.JPG", "", 100_000);

    expect(validateUploadFile(file).mimeType).toBe("image/jpeg");
  });

  it("rejects unsupported file formats", () => {
    const file = makeFile("passport.txt", "text/plain", 100);

    expect(() => validateUploadFile(file)).toThrow(/Formato não suportado/);
  });

  it("keeps the combined upload below the explicit payload budget", () => {
    const passport = makeFile("passport.jpg", "image/jpeg", 1_500_000);
    const address = makeFile("address.jpg", "image/jpeg", 1_500_000);

    expect(validateCombinedUploadSize([passport, address])).toBe(3_000_000);
    expect(3_000_000).toBeLessThan(MAX_COMBINED_UPLOAD_BYTES);
  });

  it("rejects documents that exceed the combined payload budget", () => {
    const firstSize = Math.floor(MAX_COMBINED_UPLOAD_BYTES / 2) + 1;
    const passport = makeFile("passport.jpg", "image/jpeg", firstSize);
    const address = makeFile("address.jpg", "image/jpeg", firstSize);

    expect(() => validateCombinedUploadSize([passport, address])).toThrow(
      /dois documentos juntos/,
    );
  });
});
