# 09 Build Status

## Current Phase

Phase 10: AI Document Extraction / OCR.

Phases 1–9 are complete. Phase 10 is implemented, deployed to production, and verified. Source of truth: GitHub issue #3, `Phase 10 — AI Document Extraction / OCR`.

## Last Completed Task

Task ID: `P10-T05`

Title: Production redeploy and OCR route verification.

Result:

- Production env now includes `OPENAI_API_KEY`.
- Local `npm run build` passed before deploy.
- Vercel production deploy completed successfully.
- Deployment ID: `dpl_8UtvGpSfHWJGM5zV1DPDKyG9UCtr`.
- Production deployment URL: `https://abre-oy9dnh2vh-abre-usa-s-projects.vercel.app`.
- Production alias: `https://abre-usa.vercel.app`.
- `npx vercel inspect https://abre-usa.vercel.app` reports status `Ready`.
- Production health checks passed:
  - `/` returns `200`.
  - `/admin/login` returns `200`.
  - `/admin/orders` redirects unauthenticated users to `/admin/login`.
- Production `/api/extract-document` verified with a generated JPEG test image. GPT-4o Vision returned passport and address fields with `confidence: 100`.

## Current Task

Task ID: `None active`

Title: Awaiting next owner/operator priority.

Phase 10 is complete and deployed. Next step is choosing the next Post-MVP priority.

Stop checkpoint:

- Date: 2026-05-14.
- Latest deployment: `dpl_8UtvGpSfHWJGM5zV1DPDKyG9UCtr`.
- Local docs reviewed before stopping: `/docs/09-build-status.md`, `/docs/07-roadmap.md`, `/progress/index.html`.
- No implementation task is currently in progress.

## Next Task

Choose the next owner/operator-directed priority. Candidates: payment, customer dashboard, branded sender/domain, retention Cron automation, EIN-only flow, Registered Agent-only flow, admin audit enhancements, or broader onboarding evolution.

## Completed Tasks

- App Spine approved as official source of truth.
- Phases 1–5 complete (planning, foundation, UI scaffold, step flow, review/approval).
- Phase 6 complete: P6-T01 through P6-T09.
  - P6-T01: Phase 6 planning.
  - P6-T02: Local confirmation flow.
  - P6-T03: Persistence boundary documented.
  - P6-T04: Supabase persistence implemented.
  - P6-T05: Server-side collision-resistant protocol number generation.
  - P6-T06: Applicant contact step (name, email, phone) added.
  - P6-T07: Document file upload to Supabase private storage.
  - P6-T08: Email/customer handoff plan.
  - P6-T09: Phase 6 exit review and Phase 7 planning.
- Phase 7 complete: P7-T01 through P7-T05.
  - P7-T01: Security hardening plan.
  - P7-T02: Server-side persistence boundary.
  - P7-T03: Production credential and RLS/storage lockdown plan.
  - P7-T04: Service-role enforcement and lockdown SQL artifact (`supabase/rls-storage-lockdown.sql`).
  - P7-T05: Supabase RLS and storage lockdown applied and verified (AUS-2026-0009).
- Phase 8 complete:
  - P8-T01: Resend email integration live. Confirmation email delivered to applicant after order approval. Verified with AUS-2026-0010.
  - P8-T02: Admin review portal live and verified.
  - P8-T03: Strategic evolution system synchronization complete.
  - P8-T04: Onboarding architecture discovery and Decision Gate review complete.
  - P8-T05: Launch-blocking operational Decision Gates reviewed.
  - P8-T06: Initial retention and customer data lifecycle policy confirmed.
  - P8-T07: Retention automation and deletion workflow architecture complete.
  - P8-T08: Retention metadata and audit-log implementation planning complete.
  - P8-T09: Retention metadata and audit event foundation implemented.
  - P8-T09V: Authenticated admin retention/audit verification complete.
  - P8-T10: Retention deletion workflow implementation planning complete.
  - P8-T11: Manual retention deletion workflow foundation implemented.
  - P8-T12: Production deployment readiness planning complete.
  - P8-T13: Production deployment and customer flow verification complete.
  - P8-T13V: Authenticated production admin verification complete.
  - P8-T14: All launch operations confirmed. Email bug fixed (void → await). Production confirmation email received in real inbox (AUS-2026-0014). Controlled MVP launch complete.
- Phase 8.5 complete:
  - P8.5-T01: Guided onboarding UX cleanup complete. Choice/card steps auto-advance, input/upload/review steps keep explicit Continue/Confirm, active Articles previews are hidden behind short education cards, sticky footer navigation is implemented, lint/build/browser verification passed, and `/api/orders` persistence/upload regression check passed with `AUS-2026-0015`.
  - P8.5-T02: Same-as-residential company address reuse complete. Applicant residential address, copied LLC principal address, and boolean relationship flag persist correctly. Verified with `AUS-2026-0016`.
  - P8.5-T03: Phase 8.5 production deployment complete. `https://abre-usa.vercel.app` now points to deployment `dpl_FKGnAAzFvdhVNkeazTgXxugx7HsQ`.
  - P8.5-T04: Committed Phase 8.5 state redeployed to production. `https://abre-usa.vercel.app` now points to deployment `dpl_49uw5re5UDZQnVBDPJPPwqDufjSn`.
- Phase 9 complete:
  - P9-T01: AI-ready onboarding entry mode foundation implemented from GitHub issue #2 and verified with `AUS-2026-0017`.
  - P9-T02: Real AI OCR document extraction implemented via OpenAI GPT-4o Vision. Lint and build verified.
  - P9-T03: Document-assisted flow corrected. Documents now collected at step 3 (immediately after entry mode). `totalSteps` fixed to 14 for both modes. `stepOffset` pattern applied to all middle steps. Lint and build verified.
- Phase 10 complete and deployed:
  - P10-T01: Real OCR extraction wired into document-assisted flow. `handleContinueFromDocuments` (doc_assisted) triggers OpenAI GPT-4o Vision, navigates to `extraction_review` at step 4, populates editable fields on success, shows fallback on failure. `onConfirmExtraction` prefills `applicantContact` (name + residential address). `totalSteps` = 15 for doc_assisted, 14 for manual. `stepOffset` = 2 for doc_assisted, 0 for manual. Lint and build verified.
  - P10 debug: Structured extraction errors. MIME type allowlist (`image/jpeg`, `image/png`, `image/gif`, `image/webp`) — PDF now returns `unsupported_file_type` error code instead of silent 500. Error code shown in extraction_review failure block. `extractionErrors` stored in order payload for admin visibility. Documents step shows image format hint for doc_assisted mode. Lint and build verified.
  - P10-T02: Prefill sócio from extraction data. Member/owner step shows "Usar meus dados como sócio da LLC" checkbox when doc_assisted extraction confirmed. Prefills first member fullName and address from confirmed applicant data. All 12 hardcoded "Passo N" eyebrows replaced with dynamic `currentStep`. Lint and build verified.
  - P10-T03: Prefill EIN Responsible Party from primary member. EIN step shows "Usar o sócio principal como responsável pelo EIN" checkbox when primary member has a name. Prefills `responsiblePartyName` and optionally `responsiblePartyPassportNumber` from extraction. Lint and build verified.
  - P10-T04: Approval loading state and error retry. Button shows "Processando...", loading StatusMessage shown during persistence, error StatusMessage + retry on failure. `handleContinueToConfirmation` fail-closed: only navigates to confirmation on Supabase success. Lint and build verified.
  - P10-T05: Production redeploy complete. `https://abre-usa.vercel.app` now points to `dpl_8UtvGpSfHWJGM5zV1DPDKyG9UCtr`; home/admin health checks passed; production OCR route verified with JPEG extraction and `confidence: 100`.

## What Is Implemented

- Full guided onboarding: 15 steps for `document_assisted`, 14 steps for `manual`.
- Post-service onboarding entry mode choice: `manual` and `document_assisted`.
- **Document-assisted path (15 steps):**
  - Step 3: Document upload (passport + address proof). Disclosure message; image format hint.
  - Step 4: Extraction review — OCR runs automatically via OpenAI GPT-4o Vision after upload. Loading spinner during extraction. On success: editable pre-filled fields (name, DOB, nationality, passport number, expiration, street, city, state, ZIP). On failure: error code shown, friendly fallback, flow never blocked.
  - Step 5: Applicant contact — pre-filled with confirmed extraction data (name + residential address).
  - Steps 6–12: LLC data with `stepOffset = 2`.
  - Step 9: Member/owner — "Usar meus dados como sócio da LLC" checkbox pre-fills first member from applicant contact data.
  - Step 12: EIN — "Usar o sócio principal como responsável pelo EIN" checkbox pre-fills Responsible Party from primary member + optionally passport number from OCR.
  - Steps 13–15: Review, approval, confirmation.
- **Manual path (14 steps):** unchanged from Phase 8.5. Documents at step 11.
- Dynamic step numbering: all step eyebrows use `currentStep` (no hardcoded step numbers).
- Extraction error codes: `missing_openai_api_key`, `file_not_provided`, `unsupported_file_type`, `extraction_api_failed`. Errors propagated from route → client → UI → order payload.
- Approval step: loading state ("Processando..."), success/failure handling, retry on error.
- Applicant contact step (name, email, phone, residential address).
- Company principal address can reuse the applicant residential address through a checkbox.
- Persisted order data stores the copied LLC principal address plus `principal_same_as_applicant_address`.
- Local review screen, generated preview shells (Articles of Organization + SS-4), approval gate.
- Confirmation screen with server-generated collision-resistant protocol number (`AUS-YYYY-NNNN`).
- Supabase persistence via server-side `/api/orders` route using `SUPABASE_SERVICE_ROLE_KEY`:
  - `orders`, `applicants`, `llcs`, `members`, `registered_agents`, `ein_details`, `generated_forms`, `documents` tables.
  - Phase 9/10 fields on `orders`: entry mode, extraction status, extracted data, confidence, extraction errors, user confirmation flag, agent summary, missing information flags.
- Document file upload to Supabase private `documents` storage bucket.
- RLS enabled on all 8 order tables. Anon/authenticated roles fully revoked.
- Storage bucket is private.
- Server-side persistence fails closed without `SUPABASE_SERVICE_ROLE_KEY`.
- Resend transactional email: applicant receives order confirmation after approval.
  - Sender: `noreply@notifications.brightscalegroup.com`.
  - Email includes protocol number, service name, and next-steps message.
- Admin review portal at `/admin`:
  - Supabase Auth login at `/admin/login`. Auth guard via `proxy.ts`.
  - Order list at `/admin/orders` (newest first, with applicant data).
  - Full order detail at `/admin/orders/[id]`, including applicant residential address, LLC principal address, address relationship, extraction status, and extracted data.
  - Supabase signed URLs for private document access (open in tab + download).
  - Status dropdown with server-side PATCH update.
  - Logout clears session.
- `.env.example` documents all required environment variables (`OPENAI_API_KEY` included).
- `/progress/index.html` bilingual stakeholder dashboard.
- Strategic evolution operating model: `AGENTS.md`, `/docs/START-HERE.md`, `/docs/COMMANDS.md`, `/docs/10-decision-gates.md`.
- Document retention: 90-day sensitive upload retention, 1-year generated files, long-term customer metadata.
- Manual admin deletion workflow with audit events (`document_deletion_attempted`, `document_deleted`, `document_deletion_failed`).
- Key files:
  - `lib/extract-document.ts` — OpenAI GPT-4o Vision extraction logic.
  - `app/api/extract-document/route.ts` — POST extraction route with MIME validation.
  - `lib/supabase-server.ts` — service-role Supabase client.
  - `lib/supabase-ssr.ts` — SSR auth client.
  - `lib/supabase-browser.ts` — browser auth client.
  - `lib/supabase-middleware.ts` — Edge-safe auth client (proxy).
  - `lib/persist-order.ts`, `lib/persist-order-server.ts` — order persistence.
  - `lib/resend.ts`, `lib/send-confirmation-email.ts` — email.
  - `proxy.ts` — Next.js 16 route protection.
  - `supabase/schema.sql`, `supabase/rls-storage-lockdown.sql`.

## What Is NOT Implemented

- AbreUSA-branded sender domain migration (temporary Brightscale sender in use).
- Custom production domain (temporary Vercel URL deployed and verified).
- Vercel Cron retention automation.
- Reviewer access scope refinement beyond the single authenticated admin MVP model.
- Payment processing (Post-MVP).
- Customer dashboard (Post-MVP).
- EIN-only and Registered Agent-only dedicated flows (Post-MVP).
- Admin pagination (MVP assumes low order volume).
- Automated status-triggered emails to applicant (Post-MVP).
- Conversational onboarding UI or chat experience.
- AI-guided onboarding layer beyond current extraction/prefill.
- Progressive onboarding/draft resume system.
- State-based onboarding orchestration layer.
- Central state machine or workflow engine for onboarding.
- Multi-state LLC formation (Post-MVP).
- Operating Agreement generation (Post-MVP).
- Decision Gates are not resolved decisions; they are tracking controls for unresolved questions.

## Exact Next Step To Resume

1. Choose the next owner/operator-directed Post-MVP priority.
2. Recommended candidates: payment, customer dashboard, branded sender/domain, retention Cron automation, EIN-only flow, Registered Agent-only flow, admin audit enhancements, or broader onboarding evolution.
3. Before starting the next phase, update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` with the new phase/task.

Resume command prompt:

Read `AGENTS.md`, `/docs/START-HERE.md`, `/docs/07-roadmap.md`, and this file. Select the next owner/operator-directed priority and update the App Spine before implementation.

## Blockers And Risks

- Production confirmation email verified: `AUS-2026-0014` received at `brightscalegroup@gmail.com` on 2026-05-09.
- Permanent admin user exists, is email-confirmed, and owner/operator confirmed access.
- Correct AbreUSA Vercel account is authenticated as `abreusaonline-7459`.
- Vercel project is linked. Current production deployment: `dpl_8UtvGpSfHWJGM5zV1DPDKyG9UCtr` (Phase 10).
- Custom domain is deferred; controlled launch continues on `https://abre-usa.vercel.app`.
- AbreUSA domain email migration remains deferred; temporary Brightscale sender in use.
- Manual physical deletion is implemented (P8-T11). In-browser verification against a real eligible document is recommended before enabling for production use.
- Automated retention Cron (Vercel Cron) remains deferred until manual deletion is verified in production.
- OCR extraction only supports image files (JPEG, PNG, GIF, WebP). PDF uploads are accepted for Supabase storage but return `unsupported_file_type` error for extraction — customer sees friendly fallback and can continue manually.
- Admin portal has no rate limiting or brute-force protection on the login page (acceptable for MVP internal use).
- Default PATH does not include Node/npm on this machine; use `PATH=/usr/local/opt/node@22/bin:$PATH` for local commands.
- The project path contains a curly apostrophe (U+2019); use Python subprocess or `pathlib.Path.cwd()` for shell commands — do not use shell `find | head -1` pattern.
