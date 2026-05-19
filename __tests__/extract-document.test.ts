import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { POST } from "@/app/api/extract-document/route";
import type { NextRequest } from "next/server";

vi.mock("@/lib/extract-document", () => ({
  extractDocuments: vi.fn().mockResolvedValue({
    passport: { fullName: "Test User", confidence: 90 },
    address: { streetAddress: "123 Main St", confidence: 80 },
  }),
}));

vi.mock("@/lib/preprocess-document", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/preprocess-document")>();
  return {
    ...actual,
    preprocessFile: vi.fn().mockResolvedValue({
      kind: "image",
      buffer: Buffer.from("fake"),
      mimeType: "image/jpeg",
    }),
  };
});

// Bypass FormData entirely — directly control what formData.get() returns.
// This avoids Node.js FormData's inconsistent File.type preservation.
function makeFileMock(name: string, type: string) {
  const data = Buffer.from("fake");
  return { name, type, arrayBuffer: async (): Promise<ArrayBuffer> => data.buffer };
}

function makeReq(
  files: Record<string, ReturnType<typeof makeFileMock>> = {},
): NextRequest {
  return {
    formData: () => Promise.resolve({ get: (key: string) => files[key] ?? null }),
  } as unknown as NextRequest;
}

describe("POST /api/extract-document", () => {
  const originalKey = process.env.OPENAI_API_KEY;

  beforeEach(() => {
    process.env.OPENAI_API_KEY = "sk-test-key";
    vi.clearAllMocks();
  });

  afterEach(() => {
    if (originalKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = originalKey;
  });

  it("returns 503 when OPENAI_API_KEY is missing", async () => {
    delete process.env.OPENAI_API_KEY;
    const res = await POST(makeReq());
    expect(res.status).toBe(503);
    const body = await res.json() as { errorCode: string };
    expect(body.errorCode).toBe("missing_openai_api_key");
  });

  it("returns 422 when no files are provided", async () => {
    const res = await POST(makeReq());
    expect(res.status).toBe(422);
    const body = await res.json() as { errorCode: string };
    expect(body.errorCode).toBe("file_not_provided");
  });

  it("returns 422 for unsupported MIME type", async () => {
    const res = await POST(makeReq({ passport: makeFileMock("hack.exe", "application/octet-stream") }));
    expect(res.status).toBe(422);
    const body = await res.json() as { errorCode: string };
    expect(body.errorCode).toBe("unsupported_file_type");
  });

  it("returns 422 pdf_requires_image for PDF passport", async () => {
    const res = await POST(makeReq({ passport: makeFileMock("passport.pdf", "application/pdf") }));
    expect(res.status).toBe(422);
    const body = await res.json() as { errorCode: string };
    expect(body.errorCode).toBe("pdf_requires_image");
  });

  it("returns 422 pdf_requires_image for PDF address proof", async () => {
    const res = await POST(makeReq({ addressProof: makeFileMock("address.pdf", "application/pdf") }));
    expect(res.status).toBe(422);
    const body = await res.json() as { errorCode: string };
    expect(body.errorCode).toBe("pdf_requires_image");
  });

  it("returns 422 pdf_requires_image when both files are PDF", async () => {
    const res = await POST(makeReq({
      passport: makeFileMock("passport.pdf", "application/pdf"),
      addressProof: makeFileMock("address.pdf", "application/pdf"),
    }));
    expect(res.status).toBe(422);
    const body = await res.json() as { errorCode: string };
    expect(body.errorCode).toBe("pdf_requires_image");
  });

  it("returns 200 with extracted data for valid JPEG passport", async () => {
    const res = await POST(makeReq({ passport: makeFileMock("passport.jpg", "image/jpeg") }));
    expect(res.status).toBe(200);
    const body = await res.json() as { passport: unknown };
    expect(body.passport).toBeDefined();
  });

  it("returns 200 for PNG address proof only", async () => {
    const res = await POST(makeReq({ addressProof: makeFileMock("address.png", "image/png") }));
    expect(res.status).toBe(200);
  });
});
