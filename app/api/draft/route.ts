import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const normalized = normalizeEmail(email);
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("onboarding_drafts")
    .select("draft_data")
    .eq("email", normalized)
    .single();
  if (error || !data) {
    return NextResponse.json({ draft: null });
  }
  return NextResponse.json({ draft: data.draft_data });
}

export async function PUT(request: Request): Promise<NextResponse> {
  let body: { email?: string; draft_data?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }
  const { email, draft_data } = body;
  if (!email || typeof email !== "string" || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  if (!draft_data || typeof draft_data !== "object") {
    return NextResponse.json({ error: "invalid_draft" }, { status: 400 });
  }
  const normalized = normalizeEmail(email);
  const supabase = getSupabaseServerClient();
  const { error } = await supabase
    .from("onboarding_drafts")
    .upsert({ email: normalized, draft_data: draft_data as Record<string, unknown>, updated_at: new Date().toISOString() });
  if (error) {
    return NextResponse.json({ error: "db_error" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  }
  const normalized = normalizeEmail(email);
  const supabase = getSupabaseServerClient();
  await supabase.from("onboarding_drafts").delete().eq("email", normalized);
  return NextResponse.json({ ok: true });
}
