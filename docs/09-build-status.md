# 09 Build Status

## Current Phase

Phase 11: Customer Dashboard Journey.

Phases 1–11 first production slice are complete. Phase 11 dashboard lookup is now rate-limited, deployed, and production-verified. A Phase 10 robustness fix (document extraction pipeline) is in progress locally.

## Last Completed Task

Task ID: `P11-T03`

Title: Add rate limiting to customer dashboard lookup.

Result:

- Supabase migration `20260514223000_customer_dashboard_rate_limits.sql` created and applied with `npx supabase db push`.
- Added shared rate-limit table and RPC: `customer_dashboard_rate_limits` and `check_customer_dashboard_rate_limit`.
- `/dashboard` checks rate limits before querying order data.
- Limits apply by hashed client IP and hashed protocol/email lookup tuple.
- Exceeded limits show the neutral Portuguese message: "Muitas tentativas de consulta foram feitas em pouco tempo. Aguarde alguns minutos e tente novamente."
- Production deployment is Ready.
- Deployment ID: `dpl_5DpoZY6usFF3qhubM9WXJdS8owLN`.
- Production URL: `https://abre-hcpnwburm-abre-usa-s-projects.vercel.app`.
- Production alias: `https://abre-usa.vercel.app`.
- Production `/dashboard` returns `200`.
- Valid production lookup with `AUS-2026-0020` and the applicant email returns the safe customer summary.
- Invalid production lookup returns the neutral not-found message.
- Exceeded-limit production lookup returns the neutral rate-limit message.
- Production `/` returns `200`.
- Production unauthenticated `/admin/orders` redirects to `/admin/login`.
- Sensitive-token checks confirmed no `storage_path`, signed URLs, download/view URLs, storage object paths, admin controls, audit records, or raw sensitive passport fields are exposed.
- Verification passed:
  - `npx supabase db push`.
  - `npm run lint`.
  - `npm run build`.
  - Local valid lookup.
  - Local invalid lookup.
  - Local exceeded-limit lookup.
  - Production valid lookup.
  - Production invalid lookup.
  - Production exceeded-limit lookup.

## Current Task

Task ID: `P10-robustness`

Title: Document extraction pipeline robustness fix — implemented and deployed to production.

Result (local + production):

- `lib/preprocess-document.ts` added: sharp-based image normalization pipeline. Auto-rotates EXIF orientation (critical for mobile photos), resizes to max 4096px, compresses to max 4MB, converts all images to JPEG for consistent OpenAI input.
- MIME allowlist expanded: `image/heic`, `image/heif`, `image/jpg`, `application/pdf` now accepted.
- PDF path: accepted in upload (input and MIME check), returns `pdf_requires_image` error with friendly customer guidance. PDF still uploaded to Supabase storage.
- HEIC/HEIF: converted to JPEG via sharp. Falls back with `heic_conversion_failed` if libvips HEIC support is unavailable.
- Image preprocessing errors surfaced with specific codes: `image_decode_failed`, `heic_conversion_failed`.
- Upload `<input accept>` updated: `.pdf,.jpg,.jpeg,.png,.heic,.heif,.webp`.
- Format hint updated: "Formatos aceitos: JPG, JPEG, PNG ou PDF. Fotos de celular também são aceitas quando compatíveis. Se estiver usando iPhone, prefira enviar como JPG/JPEG ou PDF caso a leitura automática falhe."
- extraction_review failed message is now context-aware: PDF-specific guidance shown when `errorCode === "pdf_requires_image"`.
- Lint and build verified.
- Production deployed: `dpl_H154NdEVXc2WUm1UJqm9c1ZPY91U` at `https://abre-nfx5wxbjr-abre-usa-s-projects.vercel.app`.
- Production alias: `https://abre-usa.vercel.app`.
- Production `/` returns 200.

## Next Task

Verify P10-robustness in production with a real PNG and JPEG mobile photo upload (document-assisted flow). Then choose next Phase 11 slice (`P11-T04` authenticated customer access or magic-link strategy).

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
  - P10-T06: Production document-assisted order persistence verified through `/api/orders` with `AUS-2026-0020`; extracted data, address reuse, EIN details, generated forms, and two private document records persisted.
- Phase 10 robustness fix complete (P10-robustness):
  - Image normalization pipeline via sharp: EXIF auto-rotation, max 4096px resize, 4MB compression, JPEG conversion.
  - MIME allowlist expanded to include HEIC/HEIF, PDF, image/jpg.
  - PDF: accepted and stored; returns `pdf_requires_image` with clear guidance.
  - HEIC/HEIF: converted to JPEG via sharp.
  - Error codes: `image_decode_failed`, `heic_conversion_failed`, `pdf_requires_image`.
  - Upload UI: accept attribute and format hint updated per spec.
  - Lint and build verified.
- Production deployed: `dpl_H154NdEVXc2WUm1UJqm9c1ZPY91U` at `https://abre-nfx5wxbjr-abre-usa-s-projects.vercel.app`.
- Production alias: `https://abre-usa.vercel.app`.
- Production `/` returns 200.
- Phase 11 first production slice complete:
  - P11-T01: Customer dashboard lookup MVP implemented locally. `/dashboard` supports protocol + applicant email lookup, returns a safe customer DTO, and hides sensitive document URLs/storage paths/raw files. Lint, build, valid lookup, invalid lookup, and sensitive-token HTML checks passed.
  - P11-T02: Customer dashboard lookup MVP deployed to production and verified at `https://abre-usa.vercel.app`. Valid lookup, invalid lookup, sensitive-token HTML checks, home health check, and admin unauthenticated redirect passed.
  - P11-T03: Customer dashboard lookup rate limiting implemented, applied to Supabase, deployed to production, and verified. `/dashboard` now rate limits by hashed IP and hashed protocol/email tuple before order lookup.

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
- Extraction error codes: `missing_openai_api_key`, `file_not_provided`, `unsupported_file_type`, `extraction_api_failed`, `image_decode_failed`, `heic_conversion_failed`, `pdf_requires_image`. Errors propagated from route → client → UI → order payload.
- Image normalization pipeline (`lib/preprocess-document.ts`): EXIF auto-rotation, resize, JPEG conversion via sharp. Supported input formats: JPEG, JPG, PNG, GIF, WebP, HEIC, HEIF. PDF: accepted for storage; returns `pdf_requires_image` with guidance.
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
- Customer dashboard journey:
  - `/dashboard` protocol + applicant email lookup implemented and deployed.
  - `/dashboard` lookup is rate-limited by hashed IP and hashed protocol/email tuple using a Supabase-backed shared counter.
  - Safe customer summary includes protocol, service, status, dates, applicant, LLC, document checklist/status, generated form checklist, and next-step timeline.
  - Signed document URLs, storage paths, raw uploaded files, admin controls, and audit records are not exposed.
  - Confirmation screen links to `/dashboard` with the protocol prefilled.
  - Full customer login/account portal is not implemented yet.
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
- Full authenticated customer dashboard/account portal.
- Customer magic-link access.
- Customer document download.
- Customer correction/missing-information workflow.
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

1. Choose the next Phase 11 customer dashboard slice.
2. Recommended: define `P11-T04` for authenticated customer access or magic-link strategy before adding customer document downloads or correction workflows.
3. Update `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` before implementation.

Resume command prompt:

Read `AGENTS.md`, `/docs/START-HERE.md`, `/docs/07-roadmap.md`, and this file. Resume by choosing and documenting the next Phase 11 customer dashboard slice. Recommended: `P11-T04` authenticated customer access or magic-link strategy.

## Blockers And Risks

- Production confirmation email verified: `AUS-2026-0014` received at `brightscalegroup@gmail.com` on 2026-05-09.
- Permanent admin user exists, is email-confirmed, and owner/operator confirmed access.
- Correct AbreUSA Vercel account is authenticated as `abreusaonline-7459`.
- Vercel project is linked. Current production deployment: `dpl_H154NdEVXc2WUm1UJqm9c1ZPY91U` (P10-robustness).
- Custom domain is deferred; controlled launch continues on `https://abre-usa.vercel.app`.
- AbreUSA domain email migration remains deferred; temporary Brightscale sender in use.
- Manual physical deletion is implemented (P8-T11). In-browser verification against a real eligible document is recommended before enabling for production use.
- Automated retention Cron (Vercel Cron) remains deferred until manual deletion is verified in production.
- OCR extraction supports image files (JPEG, JPG, PNG, GIF, WebP, HEIC, HEIF) after sharp normalization. PDF uploads are accepted for Supabase storage but return `pdf_requires_image` error — customer sees specific guidance to upload as image and can continue manually.
- Admin portal has no rate limiting or brute-force protection on the login page (acceptable for MVP internal use).
- Customer dashboard lookup is rate-limited, but still does not have full customer authentication, magic-link access, document downloads, or correction workflows.
- Default PATH does not include Node/npm on this machine; use `PATH=/usr/local/opt/node@22/bin:$PATH` for local commands.
- The project path contains a curly apostrophe (U+2019); use Python subprocess or `pathlib.Path.cwd()` for shell commands — do not use shell `find | head -1` pattern.
