# 09 Build Status

## Current Phase

Phase 8: Post-MVP Expansion and strategic evolution.

Phases 1–7 are complete. P8-T01 (Resend email) and P8-T02 (admin portal) are complete.
P8-T03 through P8-T11 are complete. Retention metadata, audit event foundation, deletion workflow planning, and manual retention deletion workflow are complete.

## Last Completed Task

Task ID: `P8-T11`

Title: Manual retention deletion workflow foundation.

Result:

- Server-side authenticated DELETE endpoint at `/api/admin/documents/[id]` implemented.
- Eligibility checks: retention_category === sensitive_upload, retention_eligible_at <= now(), deletion_status !== success, retention_status !== deleted, storage_path set.
- `document_deletion_attempted` audit event created before storage removal.
- Supabase Storage file removed only after attempt event is persisted.
- On success: document updated (retention_status = deleted, deletion_status = success, deleted_at, deleted_by, deletion_reason, deletion_audit_id) and `document_deleted` audit event created.
- On failure: document updated (deletion_status = failed) and `document_deletion_failed` audit event created.
- `DeleteDocumentButton` client component added to admin order detail page.
- Delete button appears only when retention_eligible_at has passed and document is not already deleted.
- Admin must click Delete file then Confirm before deletion proceeds.
- Customer operational metadata untouched.
- Vercel Cron remains out of scope.

## Current Task

Task ID: `P8-T11`

Title: Manual retention deletion workflow foundation.

Status: Complete.

Result:

- `/api/admin/documents/[id]` DELETE route implemented with full eligibility and safety checks.
- `document_deletion_attempted` audit event fires before storage removal.
- Success and failure paths both create audit events and update document metadata.
- Admin UI delete button with two-step confirmation added to order detail page.

## Next Task

Task ID: `P8-T12`

Title: To be determined by next planning session.

Candidates:

- Vercel Cron automated retention scan (DG-017 deferred).
- Production deployment environment variable configuration.
- AbreUSA-branded sender domain migration.
- Additional audit event types (admin login/logout, signed URL events).

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
- Phase 8 in progress:
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

## What Is Implemented

- Full guided 13-step intake for Complete Package (LLC + EIN) and Florida LLC paths.
- Applicant contact step (name, email, phone) — step 2.
- Document collection for passport and U.S. address proof.
- Local review screen, generated preview shells (Articles of Organization + SS-4), approval gate.
- Confirmation screen with server-generated collision-resistant protocol number (`AUS-YYYY-NNNN`).
- Supabase persistence via server-side `/api/orders` route using `SUPABASE_SERVICE_ROLE_KEY`:
  - `orders`, `applicants`, `llcs`, `members`, `registered_agents`, `ein_details`, `generated_forms`, `documents` tables.
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
  - Full order detail at `/admin/orders/[id]`.
  - Supabase signed URLs for private document access (open in tab + download).
  - Status dropdown with server-side PATCH update.
  - Logout clears session.
- `.env.example` documents all required environment variables.
- `/progress/index.html` bilingual stakeholder dashboard.
- Strategic evolution operating model:
  - `AGENTS.md` includes Strategic Evolution Rules.
  - `/docs/START-HERE.md` explains App Spine-first execution.
  - `/docs/COMMANDS.md` includes strategic evolution, App Spine sync, and Decision Gate review prompts.
  - `/docs/10-decision-gates.md` tracks unresolved strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration decisions.
- Roadmap now supports onboarding orchestration evolution, conversational onboarding architecture, AI-guided onboarding layer, progressive onboarding systems, and state-based onboarding.
- P8-T04 onboarding architecture discovery:
  - Current 13-step guided flow remains the canonical baseline.
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
- Vercel production deployment (temporary Vercel URL acceptable if possible; env vars not yet set in Vercel dashboard).
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

Open a new planning session to confirm P8-T12.

P8-T11 is fully implemented and the build is clean. The next task must be determined from the following candidates:

- Vercel Cron automated retention scan (DG-017 deferred; requires manual deletion to be verified in production first).
- Production deployment: set `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in Vercel dashboard, then deploy.
- AbreUSA-branded sender domain migration (Decision Needed before long-term production use).
- Additional audit event types: admin login/logout, signed URL creation, document open/download intent.

## Blockers And Risks

- `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must be set in Vercel environment variables before production deployment.
- AbreUSA domain email migration is a Decision Needed item before long-term production use.
- Manual physical deletion is implemented (P8-T11). In-browser verification against a real eligible document is recommended before enabling for production use.
- Automated retention Cron (Vercel Cron) remains deferred until manual deletion is verified in production.
- EIN-only and Registered Agent-only flows remain deferred (Post-MVP).
- New onboarding concepts can invalidate current UX assumptions; DG-005 through DG-009 now have proposed direction but still need confirmation before implementation.
- AI-guided onboarding introduces privacy, PII, passport-data, legal/tax guidance, and compliance risks.
- Onboarding orchestration may require architecture changes before UI changes.
- Admin portal has no rate limiting or brute-force protection on the login page (acceptable for MVP internal use).
- Default PATH does not include Node/npm on this machine; use `PATH=/usr/local/opt/node@22/bin:$PATH` for local commands.
- The project path contains a curly apostrophe (U+2019); use Python with `chr(0x2019)` to resolve the correct directory — do not use shell `find | head -1` pattern.
