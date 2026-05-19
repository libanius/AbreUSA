import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

// Mock resend module
vi.mock("@/lib/resend", () => ({
  resend: null, // simulate missing API key
}));

import {
  sendApprovedEmail,
  sendSubmittedEmail,
  sendCompletedEmail,
  sendAdminCorrectionNotification,
} from "@/lib/send-status-email";

const BASE_PARAMS = {
  to: "test@example.com",
  applicantName: "João Silva",
  protocolNumber: "AUS-2026-0001",
  llcName: "Test LLC",
};

describe("send-status-email — when resend is null (no API key)", () => {
  it("sendApprovedEmail resolves without throwing", async () => {
    await expect(sendApprovedEmail(BASE_PARAMS)).resolves.toBeUndefined();
  });

  it("sendSubmittedEmail resolves without throwing", async () => {
    await expect(sendSubmittedEmail(BASE_PARAMS)).resolves.toBeUndefined();
  });

  it("sendCompletedEmail resolves without throwing", async () => {
    await expect(sendCompletedEmail(BASE_PARAMS)).resolves.toBeUndefined();
  });

  it("sendAdminCorrectionNotification resolves without throwing (no ADMIN_EMAIL)", async () => {
    delete process.env.ADMIN_EMAIL;
    await expect(
      sendAdminCorrectionNotification({
        protocolNumber: "AUS-2026-0001",
        llcName: "Test LLC",
        applicantName: "João Silva",
        eventType: "correction_submitted",
      }),
    ).resolves.toBeUndefined();
  });

  it("sendAdminCorrectionNotification resolves without throwing (documents_replaced)", async () => {
    delete process.env.ADMIN_EMAIL;
    await expect(
      sendAdminCorrectionNotification({
        protocolNumber: "AUS-2026-0001",
        llcName: "Test LLC",
        applicantName: "João Silva",
        eventType: "documents_replaced",
      }),
    ).resolves.toBeUndefined();
  });
});

describe("send-status-email — with resend configured", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("calls resend.emails.send with correct subject for approved", async () => {
    const mockSend = vi.fn().mockResolvedValue({ id: "test-id" });
    vi.doMock("@/lib/resend", () => ({ resend: { emails: { send: mockSend } } }));

    const { sendApprovedEmail: send } = await import("@/lib/send-status-email");
    await send(BASE_PARAMS);

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0]![0] as { subject: string; to: string };
    expect(call.subject).toContain("aprovado");
    expect(call.to).toBe(BASE_PARAMS.to);
  });

  it("calls resend.emails.send with correct subject for submitted", async () => {
    const mockSend = vi.fn().mockResolvedValue({ id: "test-id" });
    vi.doMock("@/lib/resend", () => ({ resend: { emails: { send: mockSend } } }));

    const { sendSubmittedEmail: send } = await import("@/lib/send-status-email");
    await send(BASE_PARAMS);

    expect(mockSend).toHaveBeenCalledOnce();
    const call = mockSend.mock.calls[0]![0] as { subject: string };
    expect(call.subject).toContain("submetido");
  });

  it("does not throw if resend.emails.send rejects", async () => {
    const mockSend = vi.fn().mockRejectedValue(new Error("Network error"));
    vi.doMock("@/lib/resend", () => ({ resend: { emails: { send: mockSend } } }));

    const { sendApprovedEmail: send } = await import("@/lib/send-status-email");
    await expect(send(BASE_PARAMS)).resolves.toBeUndefined();
  });
});
