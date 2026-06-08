import { afterEach, describe, expect, it, vi } from "vitest";
import { OrderPersistenceError, persistOrder } from "@/lib/persist-order";
import type { PersistOrderPayload } from "@/lib/order-persistence-types";

const payload = {
  applicant: {
    name: "Test Customer",
    email: "test@example.com",
    phone: "123",
  },
  order: {
    serviceType: "florida_llc",
    status: "approved",
    approvedAt: "2026-06-08T00:00:00.000Z",
  },
  llc: {
    legalName: "Test LLC",
    state: "FL",
    businessActivityLabel: "Consulting",
    principalStreet: "100 Test Ave",
    principalCity: "Miami",
    principalState: "FL",
    principalZip: "33101",
    managementType: "member_managed",
    memberCount: 1,
  },
  members: [
    {
      fullName: "Test Customer",
      address: "100 Test Ave",
      ownershipPercentage: "100",
    },
  ],
  registeredAgent: {
    choice: "abreusa",
    name: "",
    address: "",
    city: "",
    state: "FL",
    zip: "",
  },
  generatedForms: [
    {
      formType: "florida_articles_of_organization",
      customerApproved: true,
    },
  ],
} satisfies PersistOrderPayload;

afterEach(() => {
  vi.restoreAllMocks();
});

describe("persistOrder", () => {
  it("returns a payload-specific error for HTTP 413", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(new Response("too large", { status: 413 })),
    );

    await expect(persistOrder(payload)).rejects.toMatchObject<
      Partial<OrderPersistenceError>
    >({
      code: "payload_too_large",
    });
  });

  it("returns the persisted order result on success", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        Response.json({
          orderId: "order-id",
          protocolNumber: "AUS-2026-9999",
        }),
      ),
    );

    await expect(persistOrder(payload)).resolves.toEqual({
      orderId: "order-id",
      protocolNumber: "AUS-2026-9999",
    });
  });
});
