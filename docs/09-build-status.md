# 09 Build Status

## Current Phase

Phase 11: Customer Dashboard Journey. P11-T01 through P11-T06 (plus correction notes enhancement) are complete, deployed, and production-verified.

---

## Last Completed Task

Task ID: `P11-T06` + correction notes + automated correction email

Title: Customer correction workflow — with admin-written instructions.

Result:

- `PATCH /api/customer/orders/[id]/correction`: session auth + status check (`customer_reviewing`) + email ownership check → updates safe applicant and LLC fields → moves order to `ready_for_review` → records `customer_correction_submitted` audit event.
- `CorrectionForm` component on `/dashboard`: orange banner, displays admin correction notes prominently, lists `missing_information_flags` as hints, two-section form (Seus Dados / Dados da LLC).
- `correction_notes TEXT` column added to `orders` via Supabase migration `20260514230000_correction_notes.sql`.
- `StatusUpdater` admin component updated: selecting `customer_reviewing` reveals a textarea "Instrucoes para o cliente"; notes are sent alongside the status and stored in `correction_notes`.
- Customer `CorrectionForm` shows notes in a bordered white box with the heading "Instrucoes da equipe AbreUSA" when notes are present.
- Notes cleared automatically when order leaves `customer_reviewing`.
- Production deployment: `dpl_ioqnAy9LjaSz7xGv4utiuSz46pry`.
- Full end-to-end flow verified in production by owner/operator (2026-05-14).
- Enhancement deployed `dpl_ilo4c9nen...` (2026-05-18): automated transactional email to customer when admin sets `customer_reviewing`. Portuguese e-mail includes protocol, LLC name, correction notes, and dashboard link. Fire-and-forget via Resend. Only fires on status transition (not re-save). Verified locally and in production.

---

## Current Task

None. Awaiting next owner/operator priority.

---

## Next Task

Owner/operator selects. Candidates in priority order:

1. Custom production domain (abre-usa.com or similar).
2. AbreUSA-branded transactional email sender migration (away from Brightscale domain).
3. Vercel Cron retention automation (auto-delete eligible sensitive uploads after 90 days).
4. Automated email for other status transitions (e.g. `completed`, `approved`).

---

## Completed Tasks

- App Spine approved as official source of truth.
- Phases 1–5 complete (planning, foundation, UI scaffold, step flow, review/approval).
- Phase 6: P6-T01 through P6-T09 complete.
- Phase 7: P7-T01 through P7-T05 complete — RLS, storage lockdown, service-role enforcement.
- Phase 8: P8-T01 through P8-T14 complete — Resend email, admin portal, retention metadata, audit log, manual deletion, production launch (AUS-2026-0014 verified).
- Phase 8.5: P8.5-T01 through P8.5-T04 complete — UX cleanup, address reuse, production redeploy.
- Phase 9: P9-T01 through P9-T03 complete — AI-ready onboarding, OpenAI GPT-4o Vision OCR.
- Phase 10: P10-T01 through P10-T06 complete — OCR wired, prefill, extraction review, robustness pipeline (sharp), production verified with AUS-2026-0020.
- Phase 10 robustness fix: image normalization pipeline, HEIC/HEIF, PDF guidance, MIME allowlist expansion.
  - Post-Phase 11 extraction fix (2026-05-18): full PDF + HEIC extraction pipeline deployed. heic-convert (pure JS) converts HEIC→JPEG before sharp; pdfjs-dist 3.x extracts text from PDFs for GPT-4o text extraction path. Blank/scanned PDFs (no text) return confidence=0 gracefully. Automated test suite (scripts/test-extraction.mjs) — 7/7 tests pass.
- Phase 11:
  - P11-T01: Customer dashboard lookup MVP (protocol + email, safe DTO).
  - P11-T02: Production deploy and verification.
  - P11-T03: Rate limiting (IP + lookup tuple, Supabase RPC).
  - P11-T04: Full authenticated customer account — signup, login, password reset, email verification, session-based dashboard.
  - P11-T05: Customer document download via 60s signed URL with ownership check.
  - P11-T06: Customer correction workflow — admin sets `customer_reviewing`, writes correction notes; customer corrects safe fields; status returns to `ready_for_review` with audit event.

---

## What Is Implemented

### Onboarding Flow
- 15-step `document_assisted` path; 14-step `manual` path.
- Step 3 (doc_assisted): document upload (passport + address proof); EXIF auto-rotation, JPEG normalization, HEIC/HEIF support via sharp.
- Step 4 (doc_assisted): extraction review — GPT-4o Vision OCR, editable pre-filled fields, fallback on failure.
- Step 5 (doc_assisted): applicant contact pre-filled from extraction.
- Steps 6–12 (doc_assisted): LLC data with stepOffset = 2.
- Step 9: member/owner checkbox pre-fills from applicant contact.
- Step 12: EIN responsible party checkbox pre-fills from primary member.
- Approval step: loading state, fail-closed, retry on error.
- Confirmation screen links to `/dashboard` with protocol prefilled.

### Persistence
- Server-side `/api/orders` route (service-role) persists: `orders`, `applicants`, `llcs`, `members`, `registered_agents`, `ein_details`, `generated_forms`, `documents`.
- Private Supabase `documents` storage bucket.
- RLS enabled on all 8 order tables; anon/authenticated roles revoked.
- Phase 9/10 fields: entry mode, extraction status, extracted data, confidence, extraction errors, user confirmation, agent summary, missing information flags.
- `correction_notes` column on `orders`.

### Admin Portal
- Supabase Auth login at `/admin/login`.
- Order list at `/admin/orders` (newest first, with applicant data).
- Full order detail at `/admin/orders/[id]`: applicant, LLC, members, registered agent, EIN, forms, documents with signed URLs.
- Status dropdown: auto-saves for all statuses; when `customer_reviewing` is selected, reveals textarea for correction notes (saved alongside status).
- Document signed URLs (60 min): view and download.
- Document retention: 90-day window for sensitive uploads, 1-year for generated forms.
- Manual deletion workflow with audit events.
- `ADMIN_EMAIL` env var protects admin routes from customer sessions.

### Customer Dashboard
- `/dashboard/login`, `/dashboard/register`, `/dashboard/reset-password`, `/dashboard/update-password`: full Supabase Auth email+password flow.
- `/auth/confirm`: OTP token exchange for signup confirmation and password recovery.
- Authenticated `/dashboard`: session-based, fetches all orders by email, no re-entry of credentials.
- Unauthenticated fallback: protocol + email lookup with rate limiting (IP + tuple, Supabase RPC).
- Safe customer DTO: protocol, service, status, dates, applicant, LLC, document checklist, form checklist, timeline. No storage paths, signed URLs, or admin notes exposed.
- "Ver documento" button (authenticated only): fetches 60s signed URL from `/api/customer/documents/[id]/signed-url`, opens in new tab. Deleted documents show no button; direct API call returns 410.
- Automated correction email: when admin sets `customer_reviewing`, Resend sends a Portuguese email to the applicant with protocol, LLC name, correction notes (if any), and dashboard link. Fire-and-forget; only fires on transition into the status.
- Correction form (authenticated, `customer_reviewing` status only): orange banner, shows admin correction notes prominently, editable fields (phone, residential address, LLC name/activity/address), submit → `ready_for_review` + audit event.

### Email
- Resend transactional email: order confirmation to applicant after approval.
- Sender: `noreply@notifications.brightscalegroup.com` (temporary Brightscale domain).

### Infrastructure
- Next.js 16 App Router + React 19 + Tailwind 4.
- Supabase (Auth, Postgres, Storage).
- Vercel (deployment, production alias `https://abre-usa.vercel.app`).
- `proxy.ts` middleware: admin route protection, customer redirect logic.
- `/progress/index.html`: bilingual stakeholder progress dashboard.

---

## What Is NOT Implemented

- Custom production domain.
- AbreUSA-branded email sender (temporary Brightscale sender in use).
- Vercel Cron retention automation (manual deletion only — manual workflow implemented, automation deferred).
- Admin pagination (MVP: low order volume assumed).
- Customer uploading replacement documents.
- Customer editing EIN details, members, or registered agent.
- Admin-customer messaging thread within the portal.
- Social auth (Google, GitHub).
- Draft resume / progressive onboarding.
- EIN-only and Registered Agent-only dedicated flows (Post-MVP).
- Payment processing (Post-MVP).
- Multi-state LLC formation (Post-MVP).
- Operating Agreement generation (Post-MVP).
- Conversational onboarding UI.

---

## Exact Next Step To Resume

### Current Phase
Phase 11 complete (P11-T01 through P11-T06 + enhancement). Awaiting next phase or priority selection.

### Last Completed Task
`P11-T06` + correction notes + automated correction email — verified in production by owner/operator on 2026-05-18.

### Current Task
None.

### Next Action
Owner/operator selects next priority. Top candidate: automated status-triggered email to customer when admin sets `customer_reviewing` (so customer is notified immediately without checking the dashboard manually).

Resume command:
Read `AGENTS.md`, `/docs/START-HERE.md`, `/docs/07-roadmap.md`, and this file. P11-T06 with correction notes is complete and verified. Choose the next priority and update the App Spine before implementation.

---

## Blockers And Risks

- Production alias: `https://abre-usa.vercel.app`. Current production deployment: `dpl_ioqnAy9LjaSz7xGv4utiuSz46pry`.
- Supabase Auth Site URL: `https://abre-usa.vercel.app` (corrected 2026-05-14; was `http://localhost:3000`).
- `https://abre-usa.vercel.app/auth/confirm` in Supabase Allowed Redirect URLs.
- `http://localhost:3000/**` in Supabase Redirect URLs for local dev.
- `ADMIN_EMAIL=contact@brightscalegroup.com` set in `.env.local` and Vercel production.
- Admin user: email-confirmed, owner/operator verified access.
- Vercel account: `abreusaonline-7459`. Project linked.
- Confirmation email verified in production: `AUS-2026-0014` received at `brightscalegroup@gmail.com`.
- Custom domain deferred; controlled launch continues on Vercel URL.
- AbreUSA-branded email sender deferred; Brightscale sender in use.
- Manual document deletion implemented (P8-T11). Verify against a real eligible document before enabling widely.
- Vercel Cron retention automation remains deferred until manual deletion is validated in production.
- OCR: full pipeline — images (JPEG, JPG, PNG, GIF, WebP) and HEIC/HEIF (via heic-convert, pure JS, no libheif required). PDFs: text extracted via pdfjs-dist 3.x (legacy/build); if no extractable text (scanned PDF), returns confidence=0 gracefully. GPT-4o Vision used for image inputs only.
- Admin login has no rate limiting or brute-force protection (acceptable for MVP internal use).
- Node/npm not in default PATH on this machine — use `PATH=/usr/local/opt/node@22/bin:$PATH` for local shell commands.
- Project path contains a curly apostrophe (U+2019) — use Python subprocess for shell operations; avoid direct shell `cd` into the path.
