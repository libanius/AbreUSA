# 09 Build Status

## Current Phase

Phase 12 complete. Mobile upload and PDF extraction incidents are closed. Phase 13 remains blocked on the domain decision.

---

## Last Completed Task

Task ID: `INC-2026-06-08-02`

Title: Restore automatic extraction for uploaded PDF documents.

Result:

- Root cause confirmed: `/api/extract-document` returned `pdf_requires_image` before the existing PDF preprocessing path.
- Removed the obsolete early return.
- PDF buffers now reach the OpenAI Responses API as `input_file` with structured JSON output.
- Supports PDFs with selectable text and scanned/image-based PDFs.
- PDF fix verification deployment: `dpl_EqSrgJ3wqcA9dUaqwX47pXWGXBVu`.
- Production alias: `https://abre-usa.vercel.app`.
- Local PDF verification returned `200` and extracted name, birth date, nationality, passport number, and expiration.
- Production PDF verification returned `200` with the same five fields.
- 65 tests across 8 files pass.
- Lint passes with zero errors and two pre-existing warnings.
- Production build passes.

---

## Phase 12 Completed Tasks

- **P12-T01** — Automated test suite (44 tests, 5 files): `preprocess-document`, `draft-storage`, `send-status-email`, `extract-document`, `customer-documents`. The temporary `pdf_requires_image` regression was corrected by `INC-2026-06-08-02`; `__tests__/helpers/order-documents-route.ts` remains the re-export bridge for `[id]` path resolution.
- **P12-T02** — Assistente Virtual com instruções externalizadas: `content/assistant-instructions.md` (identidade, tom, escopo, conhecimento técnico, FAQs, regras). `app/api/chat-assistant/route.ts` lê via `fs.readFileSync`. `next.config.ts` com `outputFileTracingIncludes` para bundling no Vercel.
- **P12-T03** — Cross-device draft via Supabase (descrito acima).

---

## Current Task

None. Awaiting Phase 13 domain decision.

## Next Task

Owner/operator confirms the target AbreUSA domain, then execute Phase 13 domain and email branding tasks.

---

## Completed Tasks (all phases)

- App Spine approved as official source of truth.
- Phases 1–5: planning, foundation, UI scaffold, step flow, review/approval.
- Phase 6 (P6-T01–T09): full onboarding flow, persistence, approval, confirmation.
- Phase 7 (P7-T01–T05): RLS, storage lockdown, service-role enforcement.
- Phase 8 (P8-T01–T14): Resend email, admin portal, retention metadata, audit log, manual deletion, production launch (AUS-2026-0014 verified).
- Phase 8.5 (P8.5-T01–T04): UX cleanup, address reuse, production redeploy.
- Phase 9 (P9-T01–T03): AI-ready onboarding, OpenAI GPT-4o Vision OCR.
- Phase 10 (P10-T01–T06): OCR wired, prefill, extraction review, robustness pipeline (sharp), HEIC/HEIF, PDF text extraction, production verified (AUS-2026-0020).
- Phase 11 (P11-T01–T06 + enhancements):
  - P11-T01: Customer dashboard lookup MVP (protocol + email, safe DTO).
  - P11-T02: Production deploy and verification.
  - P11-T03: Rate limiting (IP + lookup tuple, Supabase RPC).
  - P11-T04: Full authenticated customer account (signup, login, password reset, email verification, session-based dashboard).
  - P11-T05: Customer document download via 60s signed URL with ownership check.
  - P11-T06: Customer correction workflow (admin sets `customer_reviewing` + correction notes; customer corrects safe fields; status → `ready_for_review` + audit event).
  - Post-P11: Status email notifications (`sendApprovedEmail`, `sendSubmittedEmail`, `sendCompletedEmail`) on admin status transitions. Deployed `dpl_2n3kLz7Ktpt1wPTb18pokjmDq3sN`.
  - Post-P11: Vercel Cron retention automation (`/api/cron/delete-eligible-documents`, daily 03:00 UTC, up to 20 docs/run, protected by `CRON_SECRET`). Deployed `dpl_DFEovHc3TEUVF8wsq7MkqFqbviHb`.
  - Post-P11: `POST /api/customer/orders/[id]/documents` — customer document upload during correction (session auth + status check + MIME validation + Supabase storage + DB insert + admin notification).
- Phase 12 (P12-T01–T03): automated test suite (56 tests), externalised assistant instructions, cross-device draft via Supabase. Deployed `dpl_FAk6M1cnX29C3z89zJ8Th5bbtB8b`.

---

## What Is Implemented

### Onboarding Draft / Resume
- `lib/draft-storage.ts`: `saveDraft`, `loadDraft`, `clearDraft` (localStorage, key `abreusa_onboarding_draft`, versioned). `syncDraftToServer`, `loadDraftFromServer`, `clearServerDraft` (fire-and-forget fetch wrappers for `/api/draft`).
- Auto-save: debounced 800ms useEffect on every state change — also syncs to Supabase when email is valid.
- Resume banner (same device): shown on mount if localStorage draft exists beyond "service" step. Actions: "Continuar rascunho" / "Começar do zero".
- Resume banner (cross-device): shown at `applicant_contact` step when server draft found for entered email. Actions: "Recuperar" / "Ignorar". Blue banner, distinct from the amber local-draft banner.
- Document re-upload warning: orange alert in documents step when `hadDocumentFiles: true`. Dismiss button.
- Draft cleared (localStorage + Supabase) on successful order confirmation.
- File objects not persisted — customer must re-select documents on resume.
- `app/api/draft/route.ts`: GET/PUT/DELETE. Service-role. Email normalized to lowercase.
- `supabase/migrations/20260519120000_onboarding_drafts.sql`: `onboarding_drafts` table. RLS on; anon/authenticated revoked.

### Onboarding Flow
- 15-step `document_assisted` path; 14-step `manual` path.
- Document upload with EXIF auto-rotation, JPEG normalization, HEIC/HEIF conversion, and direct PDF extraction through OpenAI file input.
- GPT-4o Vision OCR → extraction review → editable pre-fill.
- Member/owner and EIN responsible-party checkbox pre-fills.
- Approval step: loading state, fail-closed, retry on error.
- Confirmation screen links to `/dashboard` with protocol prefilled.

### Virtual Assistant
- `app/api/chat-assistant/route.ts`: streams GPT-4o responses with form context injected per step.
- `content/assistant-instructions.md`: editable training file (identity, role, tone, scope, technical knowledge, 8 FAQs, behavior rules). Read at runtime via `fs.readFileSync`. Included in Vercel bundle via `outputFileTracingIncludes`.

### Persistence
- `/api/orders` (service-role): persists `orders`, `applicants`, `llcs`, `members`, `registered_agents`, `ein_details`, `generated_forms`, `documents`.
- Private Supabase `documents` storage bucket. RLS on all 8 order tables; anon/authenticated revoked.
- `correction_notes` column on `orders`.

### Admin Portal
- Supabase Auth login at `/admin/login`.
- Order list (`/admin/orders`): newest first, with applicant data.
- Order detail (`/admin/orders/[id]`): full data + signed document URLs (60 min) + status dropdown + correction notes textarea.
- Status transitions fire appropriate emails (approved → `sendApprovedEmail`; submitted → `sendSubmittedEmail`; completed → `sendCompletedEmail`; customer_reviewing → correction email with notes).
- Manual document deletion with audit events.
- Vercel Cron: `/api/cron/delete-eligible-documents` daily 03:00 UTC — deletes up to 20 eligible `sensitive_upload` documents/run, records audit events. Protected by `CRON_SECRET`.
- `ADMIN_EMAIL` env var guards admin routes from customer sessions.

### Customer Dashboard
- `/dashboard/login`, `/dashboard/register`, `/dashboard/reset-password`, `/dashboard/update-password`: full Supabase Auth email+password flow.
- `/auth/confirm`: OTP token exchange for signup confirmation and password recovery.
- Authenticated `/dashboard`: session-based, all orders by email, no credential re-entry.
- Unauthenticated fallback: protocol + email lookup with IP + tuple rate limiting (Supabase RPC).
- Safe customer DTO: protocol, service, status, dates, applicant, LLC, document checklist, form checklist, timeline.
- "Ver documento" (authenticated only): 60s signed URL from `/api/customer/documents/[id]/signed-url`. Deleted docs show no button; direct call returns 410.
- Correction form (`customer_reviewing` status, authenticated): orange banner + admin notes + editable fields (phone, residential address, LLC name/activity/address) + document re-upload (`POST /api/customer/orders/[id]/documents`) → `ready_for_review` + audit event.

### Email
- Order confirmation after approval.
- Correction notification when admin sets `customer_reviewing`.
- Status emails on `approved`, `submitted`, `completed` transitions.
- Sender: `noreply@notifications.brightscalegroup.com` (temporary; migration pending).

### Test Suite
- vitest v4.1.6. 65 tests, 8 files. All passing.

### Infrastructure
- Next.js 16 App Router + React 19 + Tailwind 4 + Supabase + Vercel + OpenAI GPT-4o.
- `proxy.ts` middleware: admin route protection + customer redirect logic.
- `/progress/index.html`: bilingual stakeholder progress dashboard.

---

## What Is NOT Implemented

- **Custom production domain** — awaiting owner domain decision. No code required.
- **AbreUSA-branded email sender** — code ready (1-line change); awaiting domain verification in Resend.
- Admin pagination (MVP: low order volume; not a priority).
- Customer editing EIN details, members, or registered agent (Post-MVP).
- Admin-customer messaging thread (Post-MVP).
- Social auth — Google, GitHub (Post-MVP).
- EIN-only and Registered Agent-only dedicated flows (Post-MVP).
- Payment processing (Post-MVP).
- Multi-state LLC formation (Post-MVP).
- Operating Agreement generation (Post-MVP).

---

## Exact Next Step To Resume

### Current Phase
Phase 12 complete. Incidents `INC-2026-06-08-01` and `INC-2026-06-08-02` closed.

### Last Completed Task
`INC-2026-06-08-02` — PDF extraction regression fix. Deployed and production-verified as `dpl_EqSrgJ3wqcA9dUaqwX47pXWGXBVu`.

### Current Task
None.

### Next Action
1. Owner/operator confirms the target domain.
2. Configure the custom domain in Vercel and update Supabase Auth URLs.
3. Verify the domain in Resend, change the sender, deploy, and verify delivery.

Resume command:
Read `AGENTS.md`, `docs/START-HERE.md`, `docs/07-roadmap.md`, and this file. Confirm the target domain and execute Phase 13 in the documented order.

---

## Blockers And Risks

- **Production alias**: `https://abre-usa.vercel.app`.
- Supabase Auth Site URL: `https://abre-usa.vercel.app`. Allowed Redirect: `https://abre-usa.vercel.app/auth/confirm`. Local dev: `http://localhost:3000/**`.
- `ADMIN_EMAIL=contact@brightscalegroup.com` in `.env.local` and Vercel production.
- Admin user: email-confirmed, owner/operator verified.
- Vercel account: `abreusaonline-7459`. Supabase project: `wihfneccjwmtxzvivfzf`.
- Custom domain deferred; controlled launch on Vercel URL.
- AbreUSA-branded email sender deferred; Brightscale sender in use.
- Vercel Cron (daily 03:00 UTC) implemented but not yet verified against a real eligible document in production.
- Admin login has no rate limiting (acceptable for MVP internal use).
- Onboarding now prepares large browser-decodable images below the safe client-side budget. Oversized PDF/HEIC/HEIF files require a smaller file or JPG conversion.
- PDF extraction depends on OpenAI Responses file input and remains subject to the 1.75 MB client upload budget.
- Node/npm not in default PATH — use `PATH=/usr/local/opt/node@22/bin:$PATH`.
- Project path contains curly apostrophe (U+2019) — use Python subprocess for shell operations.
