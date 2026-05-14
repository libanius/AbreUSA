import "server-only";

import { createHash } from "node:crypto";
import { getSupabaseServerClient } from "@/lib/supabase-server";

type RateLimitResponse = {
  allowed?: boolean;
  retry_after_seconds?: number;
  remaining?: number;
  reason?: string;
};

export type DashboardRateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
  reason: string;
};

const IP_MAX_ATTEMPTS = 30;
const LOOKUP_MAX_ATTEMPTS = 8;
const WINDOW_SECONDS = 15 * 60;
const BLOCK_SECONDS = 15 * 60;

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

function normalizeProtocol(protocol: string) {
  return protocol.trim().toUpperCase();
}

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function toRateLimitResult(value: RateLimitResponse | null): DashboardRateLimitResult {
  return {
    allowed: value?.allowed === true,
    retryAfterSeconds:
      typeof value?.retry_after_seconds === "number" ? value.retry_after_seconds : BLOCK_SECONDS,
    reason: typeof value?.reason === "string" ? value.reason : "unknown",
  };
}

async function checkIdentifier({
  identifier,
  maxAttempts,
}: {
  identifier: string;
  maxAttempts: number;
}) {
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.rpc("check_customer_dashboard_rate_limit", {
    p_identifier: identifier,
    p_max_attempts: maxAttempts,
    p_window_seconds: WINDOW_SECONDS,
    p_block_seconds: BLOCK_SECONDS,
  });

  if (error) {
    throw new Error(`Failed to check customer dashboard rate limit: ${error.message}`);
  }

  return toRateLimitResult(data as RateLimitResponse | null);
}

export async function checkCustomerDashboardRateLimit({
  ipAddress,
  protocol,
  email,
}: {
  ipAddress: string;
  protocol: string;
  email: string;
}): Promise<DashboardRateLimitResult> {
  const normalizedProtocol = normalizeProtocol(protocol);
  const normalizedEmail = normalizeEmail(email);
  const normalizedIp = ipAddress.trim() || "unknown";
  const ipIdentifier = `dashboard:ip:${hashIdentifier(normalizedIp)}`;
  const lookupIdentifier = `dashboard:lookup:${hashIdentifier(`${normalizedProtocol}:${normalizedEmail}`)}`;

  const ipResult = await checkIdentifier({
    identifier: ipIdentifier,
    maxAttempts: IP_MAX_ATTEMPTS,
  });

  if (!ipResult.allowed) {
    return ipResult;
  }

  return checkIdentifier({
    identifier: lookupIdentifier,
    maxAttempts: LOOKUP_MAX_ATTEMPTS,
  });
}
