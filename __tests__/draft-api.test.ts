import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock supabase-server
const mockSingle = vi.fn();
const mockEq = vi.fn();
const mockSelect = vi.fn();
const mockUpsert = vi.fn();
const mockDelete = vi.fn();
const mockDeleteEq = vi.fn();

function buildSupabaseMock() {
  mockDeleteEq.mockResolvedValue({ error: null });
  mockDelete.mockReturnValue({ eq: mockDeleteEq });
  mockUpsert.mockResolvedValue({ error: null });
  mockSingle.mockResolvedValue({ data: null, error: { code: "PGRST116" } });
  mockEq.mockReturnValue({ single: mockSingle });
  mockSelect.mockReturnValue({ eq: mockEq });
  return {
    from: vi.fn(() => ({
      select: mockSelect,
      upsert: mockUpsert,
      delete: mockDelete,
    })),
  };
}

vi.mock("@/lib/supabase-server", () => ({
  getSupabaseServerClient: () => buildSupabaseMock(),
}));

import { GET, PUT, DELETE } from "@/app/api/draft/route";

function makeGetReq(email: string | null): Request {
  const url = email
    ? "http://localhost/api/draft?email=" + encodeURIComponent(email)
    : "http://localhost/api/draft";
  return new Request(url, { method: "GET" });
}

function makePutReq(body: unknown): Request {
  return new Request("http://localhost/api/draft", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

function makeDeleteReq(email: string | null): Request {
  const url = email
    ? "http://localhost/api/draft?email=" + encodeURIComponent(email)
    : "http://localhost/api/draft";
  return new Request(url, { method: "DELETE" });
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/draft", () => {
  it("returns 400 for missing email", async () => {
    const res = await GET(makeGetReq(null));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid_email");
  });

  it("returns 400 for invalid email (no @)", async () => {
    const res = await GET(makeGetReq("notanemail"));
    expect(res.status).toBe(400);
  });

  it("returns draft: null when no row exists", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } });
    const res = await GET(makeGetReq("user@example.com"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.draft).toBeNull();
  });

  it("returns draft data when row exists", async () => {
    const fakeDraft = { activeStep: "llc_name", version: 1, savedAt: "2026-05-19T00:00:00Z", hadDocumentFiles: false };
    mockSingle.mockResolvedValueOnce({ data: { draft_data: fakeDraft }, error: null });
    const res = await GET(makeGetReq("user@example.com"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.draft).toEqual(fakeDraft);
  });

  it("normalizes email to lowercase", async () => {
    mockSingle.mockResolvedValueOnce({ data: null, error: { code: "PGRST116" } });
    await GET(makeGetReq("User@Example.COM"));
    expect(mockEq).toHaveBeenCalledWith("email", "user@example.com");
  });
});

describe("PUT /api/draft", () => {
  it("returns 400 for invalid email", async () => {
    const res = await PUT(makePutReq({ email: "bad", draft_data: {} }));
    expect(res.status).toBe(400);
  });

  it("returns 400 for missing draft_data", async () => {
    const res = await PUT(makePutReq({ email: "user@example.com" }));
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid_draft");
  });

  it("returns 400 for invalid JSON", async () => {
    const req = new Request("http://localhost/api/draft", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: "not-json",
    });
    const res = await PUT(req);
    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBe("invalid_json");
  });

  it("upserts and returns ok: true", async () => {
    mockUpsert.mockResolvedValueOnce({ error: null });
    const res = await PUT(makePutReq({ email: "user@example.com", draft_data: { activeStep: "service" } }));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockUpsert).toHaveBeenCalledWith(expect.objectContaining({ email: "user@example.com" }));
  });

  it("returns 500 on db error", async () => {
    mockUpsert.mockResolvedValueOnce({ error: { message: "db fail" } });
    const res = await PUT(makePutReq({ email: "user@example.com", draft_data: { activeStep: "service" } }));
    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/draft", () => {
  it("returns 400 for missing email", async () => {
    const res = await DELETE(makeDeleteReq(null));
    expect(res.status).toBe(400);
  });

  it("deletes and returns ok: true", async () => {
    mockDeleteEq.mockResolvedValueOnce({ error: null });
    const res = await DELETE(makeDeleteReq("user@example.com"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(mockDeleteEq).toHaveBeenCalledWith("email", "user@example.com");
  });
});
