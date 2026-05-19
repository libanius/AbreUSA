# 09 Build Status

## Current Phase

Phase 11: Customer Dashboard Journey. All tasks through P11-T06 (plus correction flow + document upload + admin notifications + automated test suite) are complete, deployed, and production-verified.

---

## Last Completed Task

Task ID: Cross-Device Draft via Supabase

Title: `onboarding_drafts` table + `/api/draft` GET/PUT/DELETE + server sync + banner — deployed 2026-05-19.

Result:

- `supabase/schema.sql`: `onboarding_drafts (email PK, draft_data jsonb, updated_at)`. RLS enabled; anon/authenticated revoked.
- `app/api/draft/route.ts`: GET (fetch draft by email), PUT (upsert), DELETE (clear). Service-role client. Normalizes email to lowercase.
- `lib/draft-storage.ts`: `syncDraftToServer` (fire-and-forget PUT), `loadDraftFromServer` (GET), `clearServerDraft` (DELETE).
- `components/guided-intake-shell.tsx`: server sync on every auto-save when email is valid; useEffect checks server 1s after valid email entered at `applicant_contact` step; blue "Rascunho salvo encontrado" banner with Recuperar/Ignorar; clears server draft on order confirmation.
- Test suite: 56 tests, 6 files (12 new: `draft-api.test.ts` covering GET/PUT/DELETE happy paths and error cases).

---

## Previous Last Completed Task

Task ID: Automated Test Suite + Document Upload Route

Title: Vitest test suite (44 tests, 5 files, all passing) + `POST /api/customer/orders/[id]/documents` route — deployed 2026-05-19 (dpl_CXTXY5hLGL8xJqygw3c1nNSG2XpF).

Result:

- `POST /api/customer/orders/[id]/documents`: session auth + order status check (`customer_reviewing`) + email ownership → validates MIME type → uploads to Supabase storage (`{orderId}/{doc_type}_r{timestamp}.{ext}`) → inserts document record with 90-day retention → fires admin email notification.
- Automated test suite: 44 tests, 5 test files (preprocess-document, draft-storage, send-status-email, extract-document, customer-documents), all passing.
- `extract-document/route.ts`: restored `pdf_requires_image` check; updated to pass `null` for text params to match new 6-arg `extractDocuments` signature.
- `__tests__/helpers/order-documents-route.ts`: helper re-export resolving `[id]` path for vitest.
- Test infrastructure: vitest v4.1.6, plain-object request mocks, `vi.fn()` mocks for Supabase/auth. 56 tests, 6 files.

---

## Current Task

None. Awaiting next owner/operator priority.

---

## Next Task

Owner/operator selects. Candidates in priority order:

1. Custom production domain (abre-usa.com or similar).
2. AbreUSA-branded transactional email sender migration (away from Brightscale domain).

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
  - Post-Phase 11 extraction fix (2026-05-18): full PDF + HEIC extraction pipeline deployed.
  - Status email notifications (2026-05-18): `lib/send-status-email.ts` created with `sendApprovedEmail`, `sendSubmittedEmail`, `sendCompletedEmail`. Admin PATCH route fires appropriate email on status transition (approved, submitted, completed). Fire-and-forget, same pattern as correction email. Deployment: `dpl_2n3kLz7Ktpt1wPTb18pokjmDq3sN`.
  - Vercel Cron retention automation (2026-05-19): `app/api/cron/delete-eligible-documents/route.ts` + `vercel.json` with `0 3 * * *` schedule. Processes up to 20 documents/run. `CRON_SECRET` added to Vercel env. Unauthorized requests return 401. Deployment: `dpl_DFEovHc3TEUVF8wsq7MkqFqbviHb`.
  - Onboarding draft / resume (2026-05-19): `lib/draft-storage.ts` + auto-save useEffect (800ms debounce) + resume banner + document re-upload warning. localStorage, same-browser scope. Deployment: `dpl_HDaLLiQqzTX43w8wbPNvqyPSUGpV`. `app/api/cron/delete-eligible-documents/route.ts` + `vercel.json` with `0 3 * * *` schedule. Processes up to 20 documents/run. `CRON_SECRET` added to Vercel env. Unauthorized requests return 401. Deployment: `dpl_DFEovHc3TEUVF8wsq7MkqFqbviHb`. `lib/send-status-email.ts` created with `sendApprovedEmail`, `sendSubmittedEmail`, `sendCompletedEmail`. Admin PATCH route fires appropriate email on status transition (approved, submitted, completed). Fire-and-forget, same pattern as correction email. Deployment: `dpl_2n3kLz7Ktpt1wPTb18pokjmDq3sN`. heic-convert (pure JS) converts HEIC→JPEG before sharp; pdfjs-dist 3.x extracts text from PDFs for GPT-4o text extraction path. Blank/scanned PDFs (no text) return confidence=0 gracefully. Automated test suite (scripts/test-extraction.mjs) — 7/7 tests pass.
- Phase 11:
  - P11-T01: Customer dashboard lookup MVP (protocol + email, safe DTO).
  - P11-T02: Production deploy and verification.
  - P11-T03: Rate limiting (IP + lookup tuple, Supabase RPC).
  - P11-T04: Full authenticated customer account — signup, login, password reset, email verification, session-based dashboard.
  - P11-T05: Customer document download via 60s signed URL with ownership check.
  - P11-T06: Customer correction workflow — admin sets `customer_reviewing`, writes correction notes; customer corrects safe fields; status returns to `ready_for_review` with audit event.

---

## What Is Implemented

### Onboarding Draft / Resume
- `lib/draft-storage.ts`: `saveDraft`, `loadDraft`, `clearDraft` (localStorage key `abreusa_onboarding_draft`, versioned). Also: `syncDraftToServer`, `loadDraftFromServer`, `clearServerDraft` (fire-and-forget fetch wrappers for `/api/draft`).
- Auto-save: debounced 800ms useEffect saves all serialisable form state on every change — also syncs to Supabase server when email is known.
- Resume banner (local): shown on mount if localStorage draft exists with step beyond "service" — two actions: "Continuar rascunho" or "Começar do zero".
- Resume banner (cross-device): shown in `applicant_contact` step when a server draft is found for the entered email — blue banner with "Recuperar" / "Ignorar".
- Document re-upload warning: orange alert shown in the documents step when the customer had files in the previous session (`hadDocumentFiles: true`), with dismiss button.
- Draft cleared (local + server) automatically on successful order confirmation.
- Does NOT persist actual `File` objects — customer must re-select documents on resume.
- `app/api/draft/route.ts`: GET/PUT/DELETE. Service-role. Email normalized to lowercase. `onboarding_drafts` table (RLS on, anon/authenticated revoked).

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
- Vercel Cron retention automation: `/api/cron/delete-eligible-documents` runs daily at 03:00 UTC. Deletes up to 20 eligible `sensitive_upload` documents per run (retention_eligible_at ≤ now, deletion_status ≠ success). Records `document_deletion_attempted`, `document_deleted`, or `document_deletion_failed` audit events with `actor_type: system`. Protected by `CRON_SECRET`.
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
- Automated correction email: sent when admin sets `customer_reviewing` (with correction notes, protocol, LLC name, dashboard link).
- Automated status emails: sent to customer on `approved`, `submitted`, and `completed` transitions. Fire-and-forget, only fires on transition (not re-save).
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
- Admin pagination (MVP: low order volume assumed).
- Customer uploading replacement documents.
- Customer editing EIN details, members, or registered agent.
- Admin-customer messaging thread within the portal.
- Social auth (Google, GitHub).
- Draft resume (server-side / cross-device) — IMPLEMENTED: `onboarding_drafts` table + `/api/draft` route + server sync on auto-save + banner on new device.
- EIN-only and Registered Agent-only dedicated flows (Post-MVP).
- Payment processing (Post-MVP).
- Multi-state LLC formation (Post-MVP).
- Operating Agreement generation (Post-MVP).


---

## Exact Next Step To Resume

### Current Phase
Phase 11 complete (P11-T01 through P11-T06 + enhancement). Awaiting next phase or priority selection.

### Last Completed Task
`Onboarding Enhancement` — Chat assistant (Modelo B), localStorage draft save/resume, and doc re-upload warning. Deployed 2026-05-19.

### Current Task
None.

### Next Action
Owner/operator selects next priority. Top candidate: automated status-triggered email to customer when admin sets `customer_reviewing` (so customer is notified immediately without checking the dashboard manually).

Resume command:
Read `AGENTS.md`, `/docs/START-HERE.md`, `/docs/07-roadmap.md`, and this file. P11-T06 with correction notes is complete and verified. Choose the next priority and update the App Spine before implementation.

---

## Blockers And Risks

- Production alias: `https://abre-usa.vercel.app`. Current production deployment: `dpl_9GrzP7cT62kDLu42dr9QmtSDkdE9`.
- Supabase Auth Site URL: `https://abre-usa.vercel.app` (corrected 2026-05-14; was `http://localhost:3000`).
- `https://abre-usa.vercel.app/auth/confirm` in Supabase Allowed Redirect URLs.
- `http://localhost:3000/**` in Supabase Redirect URLs for local dev.
- `ADMIN_EMAIL=contact@brightscalegroup.com` set in `.env.local` and Vercel production.
- Admin user: email-confirmed, owner/operator verified access.
- Vercel account: `abreusaonline-7459`. Project linked.
- Confirmation email verified in production: `AUS-2026-0014` received at `brightscalegroup@gmail.com`.
- Custom domain deferred; controlled launch continues on Vercel URL.
- AbreUSA-branded email sender deferred; Brightscale sender in use.
- Manual document deletion (P8-T11) and Vercel Cron automation (daily 03:00 UTC) both implemented. Verify against a real eligible document to confirm end-to-end cron flow.
- OCR: full pipeline deployed to production (2026-05-18, dpl_8ww61dyucHw2TUeLMqYm2GXCanDk). Images (JPEG, JPG, PNG, GIF, WebP) and HEIC/HEIF (via heic-convert, pure JS, no libheif required). PDFs: text extracted via pdfjs-dist 3.x (legacy/build); if no extractable text (scanned PDF), returns confidence=0 gracefully. GPT-4o Vision used for image inputs only.
- Admin login has no rate limiting or brute-force protection (acceptable for MVP internal use).
- Node/npm not in default PATH on this machine — use `PATH=/usr/local/opt/node@22/bin:$PATH` for local shell commands.
- Project path contains a curly apostrophe (U+2019) — use Python subprocess for shell operations; avoid direct shell `cd` into the path.
