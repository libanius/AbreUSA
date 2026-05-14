# 09 Build Status

## Current Phase

Phase 10: AI Document Extraction / OCR.

Phases 1–7 are complete. P8-T01 through P8-T14 and Phase 8.5 are complete. Controlled MVP launch is fully verified: production deployment, authenticated admin portal, and production email confirmation are all confirmed.

Phase 9 foundation is implemented locally and verified. Source of truth: GitHub issue #2, `Phase 9 — AI-Ready Onboarding Foundation`.

## Last Completed Task

Task ID: `P9-T03`

Title: Correct document-assisted flow — documents move to step 3.

Result:

- App Spine (04-user-flows, 07-roadmap, 09-build-status, 08-decisions-log) updated before code.
- When customer selects `document_assisted` at step 2, flow immediately advances to document upload at step 3.
- After documents, flow continues through applicant contact, LLC data, and review — all middle steps offset by +1.
- `manual` path unchanged: documents remain at step 11, total 14 steps.
- `totalSteps` fixed to 14 for both modes (P9-T02 incorrectly set 15 for document_assisted).
- `progressItems` reordered: document_assisted lists Documentos at position 3; manual lists Documentos at position 11.
- `stepOffset = isDocumentAssisted ? 1 : 0` applied to all middle steps for consistent numbering.
- Back navigation corrected for documents, entry_mode, registered_agent, and review steps in both modes.
- Documents step disclosure message updated to inform customer that documents facilitate remaining steps.
- Documents step Continue button: "Continuar" / "Anexar documentos" (no OCR trigger in this step).
- Documents step eyebrow is now dynamic based on currentStep.
- Verification passed: `npm run lint`, `npm run build`.

## Current Task

Task ID: `P10-T04`

Title: Approval step loading state, "Processando..." feedback, and error retry.

Scope:
- handleContinueToConfirmation: on failure, set persistError state and stay on approval step (do not navigate to confirmation); on success, navigate as before.
- Approval step: show loading StatusMessage when isPersisting; show error StatusMessage with retry option when persistError is set.
- nextLabel: "Processando..." when isPersisting, else existing labels.
- Prevents double-submit; re-enables button on error for retry.
- Source of truth: GitHub issue #3, comment 2026-05-14T04:06:52Z.

## Next Task

Commit the completed Phase 9 state, then choose the next owner/operator-directed priority. Candidate next phases include production redeploy of Phase 9, payment, customer dashboard, real OCR/document extraction, branded sender/domain work, retention Cron automation, EIN-only flow, Registered Agent-only flow, or broader onboarding evolution.

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
  - P8.5-T03: Phase 8.5 production deployment complete. `https://abre-usa.vercel.app` now points to deployment `dpl_FKGnAAzFvdhVNkeazTgXxugx7HsQ`; production `/` and `/admin/login` return `200`, and `/admin/orders` redirects unauthenticated users to login.
  - P8.5-T04: Committed Phase 8.5 state redeployed to production. `https://abre-usa.vercel.app` now points to deployment `dpl_49uw5re5UDZQnVBDPJPPwqDufjSn`; production `/` and `/admin/login` return `200`, and `/admin/orders` redirects unauthenticated users to login.
- Phase 9 complete:
  - P9-T01: AI-ready onboarding entry mode foundation implemented from GitHub issue #2 and verified with `AUS-2026-0017`.
  - P9-T02: Real AI OCR document extraction implemented via OpenAI GPT-4o Vision. Lint and build verified.
  - P9-T03: Document-assisted flow corrected. Documents now collected at step 3 (immediately after entry mode). totalSteps fixed to 14 for both modes. stepOffset pattern applied to all middle steps. Lint and build verified.
- Phase 10 in progress:
  - P10-T01: Wiring real OCR extraction into document-assisted flow.

## What Is Implemented

- Full guided 14-step intake for Complete Package (LLC + EIN) and Florida LLC paths.
- Post-service onboarding entry mode choice supports `manual` and `document_assisted`.
- Document-assisted mode collects documents immediately at step 3 (before applicant contact and LLC data). Disclosure message informs customer that documents facilitate the remaining onboarding steps.
- Manual mode continues through the existing guided flow with documents at step 11.
- Applicant contact step (name, email, phone, residential address) — step 3.
- Company principal address can reuse the applicant residential address through a checkbox.
- Persisted order data stores the copied LLC principal address plus `principal_same_as_applicant_address`.
- Document collection for passport and U.S. address proof.
- Local review screen, generated preview shells (Articles of Organization + SS-4), approval gate.
- Confirmation screen with server-generated collision-resistant protocol number (`AUS-YYYY-NNNN`).
- Supabase persistence via server-side `/api/orders` route using `SUPABASE_SERVICE_ROLE_KEY`:
  - `orders`, `applicants`, `llcs`, `members`, `registered_agents`, `ein_details`, `generated_forms`, `documents` tables.
  - Phase 9 readiness fields on `orders`: entry mode, extraction status, extracted data placeholders, confidence, user confirmation flag, agent summary, and missing information flags.
- Document file upload to Supabase private `documents` storage bucket.
- RLS enabled on all 8 order tables. Anon/authenticated roles fully revoked.
- Storage bucket is private. Development storage policies removed.
- Server-side persistence fails closed without `SUPABASE_SERVICE_ROLE_KEY`.
- Resend transactional email: applicant receives order confirmation after approval.
  - Sender: `noreply@notifications.brightscalegroup.com`.
  - Email includes protocol number, service name, and next-steps message.
  - Email is skipped silently when `RESEND_API_KEY` is not set.
- Admin review portal at `/admin`:
  - Supabase Auth login at `/admin/login`. Auth guard via `proxy.ts`.
  - Order list at `/admin/orders` (newest first, with applicant data).
  - Full order detail at `/admin/orders/[id]`, including applicant residential address, LLC principal address, and address relationship.
  - Supabase signed URLs for private document access (open in tab + download).
  - Status dropdown with server-side PATCH update.
  - Logout clears session.
- `.env.example` documents all required environment variables.
- `/progress/index.html` bilingual stakeholder dashboard.
- Production email sending awaited before route response (`await sendConfirmationEmail`) to prevent serverless early-termination silently dropping emails.
- Strategic evolution operating model:
  - `AGENTS.md` includes Strategic Evolution Rules.
  - `/docs/START-HERE.md` explains App Spine-first execution.
  - `/docs/COMMANDS.md` includes strategic evolution, App Spine sync, and Decision Gate review prompts.
  - `/docs/10-decision-gates.md` tracks unresolved strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration decisions.
- Roadmap now supports onboarding orchestration evolution, conversational onboarding architecture, AI-guided onboarding layer, progressive onboarding systems, and state-based onboarding.
- P8-T04 onboarding architecture discovery:
  - Current 14-step guided flow remains the canonical baseline after Phase 9 entry mode selection.
  - Candidate onboarding states are documented.
  - Conversational onboarding is proposed as an assistive layer first.
  - AI-guided onboarding is proposed as advisory, customer-reviewable, and blocked from autonomous legal/tax advice or submission.
  - Progressive onboarding and central orchestration remain unimplemented until Decision Gates are resolved.
- P8-T05 launch gate review:
  - Document retention was classified for owner confirmation.
  - Current verified Brightscale sender was classified for temporary use.
  - Production deployment was classified for Vercel/env var confirmation.
- P8-T06 retention and customer memory policy:
  - Sensitive uploads retained for 90 days after order completion or cancellation.
  - Generated operational files retained for 1 year.
  - Customer operational metadata may be retained long-term.
  - AbreUSA should not become a permanent storage vault for sensitive documents.
  - Long-term platform value is customer relationship, onboarding intelligence, operational history, and business lifecycle memory.
  - Temporary Vercel-provided URL is acceptable for initial controlled deployment if possible.
- P8-T07 retention automation architecture:
  - Sensitive uploads become eligible for deletion after the 90-day retention window.
  - First mark uploads as `eligible_for_deletion`, then delete files with an audit record.
  - Customer operational metadata is preserved after sensitive file deletion.
  - Manual admin SOP is acceptable for controlled launch.
  - Vercel Cron is the preferred future automation path.
  - Single authenticated admin role remains the MVP reviewer access model.
- P8-T08 retention metadata planning:
  - Document retention fields are planned.
  - `audit_events` operational table is planned.
  - Admin retention status visibility is required before physical deletion.
  - First implementation slice is scoped with no file deletion and no Vercel Cron.
- P8-T09/P8-T09V retention metadata foundation:
  - Supabase schema includes document retention metadata and `audit_events`.
  - Admin detail shows document retention status.
  - Admin status update records `order_status_updated` audit event.
  - Moving an order to `completed` schedules sensitive uploads for retention eligibility 90 days later.
  - Verified with order ID `3c34ff96-f0eb-4e86-bb5c-609268b188d4`.
- P8-T11 manual retention deletion workflow:
  - `/api/admin/documents/[id]` DELETE route with server-side eligibility verification.
  - Checks: retention_category, retention_eligible_at <= now(), deletion_status, retention_status, storage_path.
  - `document_deletion_attempted` audit event created before storage removal.
  - `document_deleted` audit event on success; `document_deletion_failed` audit event on failure.
  - Document metadata updated on success: retention_status = deleted, deletion_status = success, deleted_at, deleted_by, deletion_reason, deletion_audit_id.
  - `DeleteDocumentButton` client component with two-step confirmation in admin order detail.
  - Customer operational metadata untouched. Vercel Cron out of scope.
- P8-T10 deletion workflow planning:
  - First physical deletion workflow is manual/admin-triggered.
  - Vercel Cron is deferred until manual deletion is verified.
  - Physical deletion requires server-side eligibility checks, admin confirmation, and audit events.
  - Customer operational memory remains separate from sensitive upload deletion.
- Key files:
  - `lib/supabase-server.ts` — service-role Supabase client.
  - `lib/supabase-ssr.ts` — SSR auth client (route handlers, server components).
  - `lib/supabase-browser.ts` — browser auth client (client components).
  - `lib/supabase-middleware.ts` — Edge-safe auth client (proxy).
  - `lib/persist-order.ts`, `lib/persist-order-server.ts` — order persistence.
  - `lib/resend.ts`, `lib/send-confirmation-email.ts` — email.
  - `proxy.ts` — Next.js 16 route protection.
  - `supabase/schema.sql`, `supabase/rls-storage-lockdown.sql`.

## What Is NOT Implemented

- AbreUSA-branded sender domain migration (temporary current sender is confirmed; branded sender remains a future improvement).
- Custom production domain (temporary Vercel URL is deployed and verified).
- Vercel Cron retention automation.
- Reviewer access scope refinement beyond the single authenticated admin MVP model.
- Audit logging for document access/login/logout/email events beyond current order status and planned deletion events.
- Payment processing (Post-MVP).
- Customer dashboard (Post-MVP).
- EIN-only and Registered Agent-only dedicated flows (deferred, Post-MVP).
- Admin pagination (MVP assumes low order volume).
- Admin status change audit log (Post-MVP).
- Automated status-triggered emails to applicant (Post-MVP).
- Real AI OCR/document extraction (Post-MVP).
- Signed URL strategy for reviewer access beyond admin portal (resolved for admin; Post-MVP for external reviewers).
- Automated retention Cron.
- Multi-state LLC formation (Post-MVP).
- Operating Agreement generation (Post-MVP).
- Conversational onboarding UI or chat experience; only assistive strategy is proposed.
- AI-guided onboarding layer; only guardrails and scope options are proposed.
- Progressive onboarding/draft resume system.
- State-based onboarding orchestration layer; candidate states are documented but not implemented.
- Central state machine or workflow engine for onboarding.
- Decision Gates are not resolved decisions; they are tracking controls for unresolved questions.

## Exact Next Step To Resume

Complete P10-T01: wire OCR extraction into document-assisted flow, implement editable extraction review at step 4, prefill applicant contact from confirmed extraction, run lint/build, and commit.

## Blockers And Risks

- Production confirmation email verified: `AUS-2026-0014` received at `brightscalegroup@gmail.com` on 2026-05-09.
- Permanent admin user exists, is email-confirmed, and owner/operator confirmed access.
- Correct AbreUSA Vercel account is authenticated as `abreusaonline-7459`.
- Vercel project is linked and deployed at `https://abre-usa.vercel.app`.
- Phase 8.5 committed state is deployed to production at `https://abre-usa.vercel.app`.
- Custom domain is deferred for now; controlled launch continues on `https://abre-usa.vercel.app`.
- AbreUSA domain email migration remains deferred; temporary sender remains in use.
- Manual physical deletion is implemented (P8-T11). In-browser verification against a real eligible document is recommended before enabling for production use.
- Automated retention Cron (Vercel Cron) remains deferred until manual deletion is verified in production.
- EIN-only and Registered Agent-only flows remain deferred (Post-MVP).
- New onboarding concepts can invalidate current UX assumptions; DG-005 through DG-009 now have proposed direction but still need confirmation before implementation.
- AI-guided onboarding introduces privacy, PII, passport-data, legal/tax guidance, and compliance risks.
- Onboarding orchestration may require architecture changes before UI changes.
- Admin portal has no rate limiting or brute-force protection on the login page (acceptable for MVP internal use).
- Default PATH does not include Node/npm on this machine; use `PATH=/usr/local/opt/node@22/bin:$PATH` for local commands.
- The project path contains a curly apostrophe (U+2019); use Python with `chr(0x2019)` to resolve the correct directory — do not use shell `find | head -1` pattern.
