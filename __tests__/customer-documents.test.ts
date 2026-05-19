import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/supabase-ssr", () => ({
  createSupabaseRouteHandlerClient: vi.fn(),
}));

vi.mock("@/lib/supabase-server", () => ({
  getSupabaseServerClient: vi.fn(),
}));

vi.mock("@/lib/send-status-email", () => ({
  sendAdminCorrectionNotification: vi.fn().mockResolvedValue(undefined),
}));

// Helper re-exports the route using a relative path (avoids alias resolution of [id])
import { POST } from "./helpers/order-documents-route";
import { createSupabaseRouteHandlerClient } from "@/lib/supabase-ssr";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type RouteHandler = (
  req: Request,
  ctx: { params: Promise<{ id: string }> },
) => Promise<Response>;

const ORDER_ID = "order-uuid-1";
const CUSTOMER_EMAIL = "customer@test.com";

function mockAuthClient(email: string | null) {
  (createSupabaseRouteHandlerClient as ReturnType<typeof vi.fn>).mockResolvedValue({
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: email ? { id: "user-1", email } : null },
      }),
    },
  });
}

function buildSupabaseMock(
  orderData: Record<string, unknown> | null,
  storageError: unknown = null,
) {
  let selectCallCount = 0;
  const storageMock = {
    from: vi.fn().mockReturnValue({
      upload: vi.fn().mockResolvedValue({ error: storageError }),
    }),
  };

  const fromImpl = vi.fn().mockImplementation(() => ({
    select: vi.fn().mockReturnThis(),
    eq: vi.fn().mockReturnThis(),
    single: vi.fn().mockImplementation(() => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return Promise.resolve({
          data: orderData,
          error: orderData ? null : { message: "not found" },
        });
      }
      return Promise.resolve({
        data: {
          protocol_number: "AUS-2026-0001",
          llcs: [{ legal_name: "Test LLC" }],
          applicants: [{ name: "João" }],
        },
        error: null,
      });
    }),
    insert: vi.fn().mockResolvedValue({ error: null }),
  }));

  const mock = { from: fromImpl, storage: storageMock };
  (getSupabaseServerClient as ReturnType<typeof vi.fn>).mockReturnValue(mock);
  return mock;
}

function makeReq(files: Record<string, File> = {}): Request {
  const fd = new FormData();
  for (const [key, file] of Object.entries(files)) fd.append(key, file);
  return {
    formData: () => Promise.resolve(fd),
  } as unknown as Request;
}

describe("POST /api/customer/orders/[id]/documents", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuthClient(null);
    buildSupabaseMock(null);
    const res = await (POST as RouteHandler)(makeReq(), { params: Promise.resolve({ id: ORDER_ID }) });
    expect(res.status).toBe(401);
  });

  it("returns 404 when order not found", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock(null);
    const res = await (POST as RouteHandler)(makeReq(), { params: Promise.resolve({ id: ORDER_ID }) });
    expect(res.status).toBe(404);
  });

  it("returns 409 when order status is not customer_reviewing", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock({
      id: ORDER_ID, status: "ready_for_review",
      applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }],
    });
    const res = await (POST as RouteHandler)(makeReq(), { params: Promise.resolve({ id: ORDER_ID }) });
    expect(res.status).toBe(409);
  });

  it("returns 403 when authenticated user is not the order owner", async () => {
    mockAuthClient("attacker@evil.com");
    buildSupabaseMock({
      id: ORDER_ID, status: "customer_reviewing",
      applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }],
    });
    const res = await (POST as RouteHandler)(makeReq(), { params: Promise.resolve({ id: ORDER_ID }) });
    expect(res.status).toBe(403);
  });

  it("returns 400 when no files are provided", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock({
      id: ORDER_ID, status: "customer_reviewing",
      applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }],
    });
    const res = await (POST as RouteHandler)(makeReq(), { params: Promise.resolve({ id: ORDER_ID }) });
    expect(res.status).toBe(400);
    const body = await res.json() as { error: string };
    expect(body.error).toMatch(/arquivo/i);
  });

  it("returns 422 for unsupported MIME type", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock({
      id: ORDER_ID, status: "customer_reviewing",
      applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }],
    });
    const res = await (POST as RouteHandler)(
      makeReq({ passport: new File(["data"], "hack.exe", { type: "application/octet-stream" }) }),
      { params: Promise.resolve({ id: ORDER_ID }) },
    );
    expect(res.status).toBe(422);
  });

  it("returns 200 with uploaded list on successful passport upload", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock({
      id: ORDER_ID, status: "customer_reviewing",
      applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }],
    });
    const res = await (POST as RouteHandler)(
      makeReq({ passport: new File(["data"], "passport.jpg", { type: "image/jpeg" }) }),
      { params: Promise.resolve({ id: ORDER_ID }) },
    );
    expect(res.status).toBe(200);
    const body = await res.json() as { ok: boolean; uploaded: string[] };
    expect(body.ok).toBe(true);
    expect(body.uploaded).toContain("passport");
  });

  it("returns 200 and both fields when both files are uploaded", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock({
      id: ORDER_ID, status: "customer_reviewing",
      applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }],
    });
    const res = await (POST as RouteHandler)(
      makeReq({
        passport: new File(["data"], "passport.jpg", { type: "image/jpeg" }),
        addressProof: new File(["data"], "bill.png", { type: "image/png" }),
      }),
      { params: Promise.resolve({ id: ORDER_ID }) },
    );
    expect(res.status).toBe(200);
    const body = await res.json() as { uploaded: string[] };
    expect(body.uploaded).toContain("passport");
    expect(body.uploaded).toContain("addressProof");
  });

  it("returns 500 when Supabase storage upload fails", async () => {
    mockAuthClient(CUSTOMER_EMAIL);
    buildSupabaseMock(
      { id: ORDER_ID, status: "customer_reviewing", applicants: [{ id: "app-1", email: CUSTOMER_EMAIL }] },
      { message: "storage error" },
    );
    const res = await (POST as RouteHandler)(
      makeReq({ passport: new File(["data"], "passport.jpg", { type: "image/jpeg" }) }),
      { params: Promise.resolve({ id: ORDER_ID }) },
    );
    expect(res.status).toBe(500);
  });
});
