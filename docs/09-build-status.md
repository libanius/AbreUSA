# 09 Build Status

## Current Phase

Phase 8: Post-MVP Expansion and strategic evolution.

Phases 1–7 are complete. P8-T01 (Resend email) and P8-T02 (admin portal) are complete.
P8-T03 (strategic evolution system synchronization) and P8-T04 (onboarding architecture discovery) are complete.

## Last Completed Task

Task ID: `P8-T04`

Title: Onboarding architecture discovery and Decision Gate review.

Result:

- Current guided 13-step intake mapped to candidate onboarding states.
- `/docs/04-user-flows.md` updated with state-based onboarding, conversational onboarding, AI-guided onboarding, and progressive onboarding options.
- `/docs/05-platform-strategy.md` updated with onboarding orchestration strategy.
- `/docs/06-data-model.md` updated with candidate onboarding state values and future planning fields.
- `/docs/10-decision-gates.md` reviewed; DG-005 through DG-009 moved to `Proposed`.
- Decisions log updated with confirmed architecture direction: guided flow remains canonical; conversational and AI onboarding start as assistive layers.
- No product feature code was changed.

## Current Task

None. Awaiting confirmation for the next task.

## Next Task

Task ID: `P8-T05`

Title: Resolve launch-blocking operational Decision Gates.

Scope:

- Decide document retention policy.
- Decide AbreUSA sender domain migration timing.
- Confirm production deployment environment, Vercel env vars, domain, and launch access model.
- Do not write product feature code.

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

- AbreUSA-branded sender domain (Decision Needed: migrate from `notifications.brightscalegroup.com`).
- Vercel production deployment (env vars not yet set in Vercel dashboard).
- Payment processing (Post-MVP).
- Customer dashboard (Post-MVP).
- EIN-only and Registered Agent-only dedicated flows (deferred, Post-MVP).
- Admin pagination (MVP assumes low order volume).
- Admin status change audit log (Post-MVP).
- Automated status-triggered emails to applicant (Post-MVP).
- Real AI OCR/document extraction (Post-MVP).
- Signed URL strategy for reviewer access beyond admin portal (resolved for admin; Post-MVP for external reviewers).
- Document retention period policy (Decision Needed).
- Multi-state LLC formation (Post-MVP).
- Operating Agreement generation (Post-MVP).
- Conversational onboarding UI or chat experience; only assistive strategy is proposed.
- AI-guided onboarding layer; only guardrails and scope options are proposed.
- Progressive onboarding/draft resume system.
- State-based onboarding orchestration layer; candidate states are documented but not implemented.
- Central state machine or workflow engine for onboarding.
- Decision Gates are not resolved decisions; they are tracking controls for unresolved questions.

## Exact Next Step To Resume

Execute `P8-T05: Resolve launch-blocking operational Decision Gates`.

Deliverable: decide or explicitly defer document retention, AbreUSA sender domain migration, and production deployment environment requirements. No product feature code.

## Blockers And Risks

- `RESEND_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` must be set in Vercel environment variables before production deployment.
- AbreUSA domain email migration is a Decision Needed item before long-term production use.
- Document retention period is unresolved (Decision Needed).
- EIN-only and Registered Agent-only flows remain deferred (Post-MVP).
- New onboarding concepts can invalidate current UX assumptions; DG-005 through DG-009 now have proposed direction but still need confirmation before implementation.
- AI-guided onboarding introduces privacy, PII, passport-data, legal/tax guidance, and compliance risks.
- Onboarding orchestration may require architecture changes before UI changes.
- Admin portal has no rate limiting or brute-force protection on the login page (acceptable for MVP internal use).
- Default PATH does not include Node/npm on this machine; use `PATH=/usr/local/opt/node@22/bin:$PATH` for local commands.
- The project path contains a curly apostrophe (U+2019); use Python with `chr(0x2019)` to resolve the correct directory — do not use shell `find | head -1` pattern.
