# 08 Decisions Log

## Confirmed Decisions

### 2026-05-04: App Spine Created

Decision:

Create `/docs` as the official Product Memory System and single source of truth.

Reason:

Execution began before the product spine was established.

### 2026-05-04: Build Status Reset

Decision:

Set current Build Status to `Pre-Execution`.

Reason:

User explicitly stopped execution and requested reconstruction of product definition, docs, roadmap, and build status before continuing.

### 2026-05-04: Existing Prototype Treated As Product Evidence

Decision:

Use the existing `index.html` intelligent form prototype to reconstruct the product definition.

Reason:

It contains the clearest available representation of the intended AbreUSA flow.

### 2026-05-04: Documentation Naming Standardized

Decision:

Normalize `/docs` to the numbered file convention required by `AGENTS.md`.

Reason:

`AGENTS.md` defines the expected source-of-truth file names, and execution should not proceed while documentation naming is inconsistent.

### 2026-05-04: Next.js App Router As Production Foundation

Decision:

Use the existing Next.js 16 App Router scaffold as the production application foundation.

Reason:

`AGENTS.md` defines Next.js as the frontend architecture, and the repository already contains a Next.js 16 scaffold.

### 2026-05-04: Standalone Prototype Is Product Evidence Only

Decision:

Treat the standalone `index.html` prototype as product evidence, not production architecture.

Reason:

The prototype expresses the intended product flow, but production should follow the App Spine, Next.js architecture, and phased roadmap.

### 2026-05-04: Supabase Is Planned Backend Platform

Decision:

Use Supabase as the planned backend platform for orders, documents, generated forms, and status tracking.

Reason:

`AGENTS.md` defines Supabase as the default backend.

### 2026-05-04: Documents Require Private Storage

Decision:

Uploaded passport and address proof files must use private storage and must not be publicly exposed.

Reason:

The app handles sensitive identity and address documents.

### 2026-05-04: Generated Forms Remain Previews Until Approval

Decision:

Generated Florida Articles of Organization and IRS SS-4 outputs are previews until customer approval and AbreUSA processing.

Reason:

The App Spine requires AbreUSA to remain the filing/review authority and forbids labeling generated previews as submitted.

### 2026-05-04: Phase 1 Architecture Plan Approved

Decision:

Approve the Phase 1 Architecture Plan as the planning basis for Phase 2.

Reason:

The App Spine has been accepted and the architecture plan establishes the implementation direction without product code changes.

### 2026-05-04: EIN-Only Flow Deferred

Decision:

Defer EIN-only flow as Post-MVP or Decision Needed.

Reason:

The existing product spine flags EIN-only requirements as under-specified for customers who already have an LLC.

### 2026-05-04: Registered Agent-Only Flow Deferred

Decision:

Defer Registered Agent-only flow as Post-MVP or Decision Needed.

Reason:

The existing product spine flags Registered Agent-only intake requirements as under-specified.

### 2026-05-04: Placeholder / Manual Extraction For MVP

Decision:

Use placeholder/manual extraction strategy for MVP.

Reason:

Real AI extraction provider selection is not required for the MVP planning baseline and remains deferred.

### 2026-05-04: Payment Out Of MVP

Decision:

Keep payment out of MVP for now.

Reason:

Payment was previously a non-goal unless explicitly added, and the approved direction keeps it deferred.

### 2026-05-04: HTML Preview First

Decision:

Use HTML preview first for generated forms; defer PDF/export.

Reason:

HTML previews satisfy the MVP review requirement while avoiding export complexity before core flow validation.

### 2026-05-04: Draft Persistence Deferred

Decision:

Defer draft persistence/resume unless required later for MVP.

Reason:

The MVP can prioritize the guided completion flow before adding resumable drafts.

### 2026-05-07: Phase 6 Starts With Local Order Payload Shell

Decision:

Implement the first Phase 6 slice as a local confirmation/protocol shell that converts approved intake state into an internal order payload before Supabase writes begin.

Reason:

The approved local flow needs a clear order payload boundary, protocol/status language, and customer confirmation behavior before introducing persistence, private document storage, reviewer access, or operational submission workflows.

### 2026-05-07: Supabase Persistence Deferred Until After P6-T02

Decision:

Supabase persistence remains planned for Phase 6 but will not start in `P6-T02`.

Reason:

Persisting approved orders safely requires confirmed payload shape, applicant contact requirements, private document storage boundaries, document retention policy, and reviewer access rules. `P6-T02` will verify the local payload and confirmation surface first.

### 2026-05-07: P6-T03 Persistence Boundary Defined As Planning Only

Decision:

P6-T03 is a planning task. No Supabase implementation begins in this task.

Minimum persistence boundary for approved orders — when implemented in P6-T04 — covers these tables:

- `orders`: protocol number, service type, status, timestamps.
- `llcs`: all LLC fields from the verified local payload.
- `members`: all member fields from the verified local payload.
- `registered_agents`: all Registered Agent fields.
- `ein_details`: all EIN fields (Complete Package only).
- `generated_forms`: form type and customer approval status.

Explicitly blocked from this persistence boundary:

- `applicants`: email and phone are not in the intake flow; a product decision is required before adding these fields.
- `documents` and private storage bucket: document file storage requires resolved retention period and reviewer access model before production configuration.

RLS policies are not defined yet; required before production deployment.

Deliverables produced by P6-T03:

- `supabase/schema.sql`: SQL for the six implementable tables with blocked-table comments.
- `.env.local.example`: env var template for Supabase credentials.

Reason:

The local order payload shape is verified by P6-T02. A Supabase project does not yet exist and no credentials are available. Document storage requires resolved retention and access policies. Applicant contact fields are not in the current flow.

### 2026-05-07: Production Protocol Generation Via Postgres Sequence

Decision:

Replace client-side protocol generation with a server-side Postgres sequence.

Format: `AUS-YYYY-NNNN` where NNNN is a globally incrementing zero-padded counter.

Implementation: `order_protocol_seq` sequence in Supabase; `orders.protocol_number` default uses `nextval`. Client sends no `protocol_number`; Supabase generates and returns it.

Reason:

Client-side counter hardcoded to `0001` guarantees collision on the second order.

### 2026-05-07: Applicant Contact Fields Added To Intake Flow

Decision:

Add a new intake step after service selection to collect applicant name, email, and phone.

New step ID: `applicant_contact`. New state: `applicantContact: { name, email, phone }`.

Persisted to a new `applicants` table in Supabase.

Reason:

Email and phone are required for AbreUSA to contact the customer about order status. This unblocks the applicants table.

### 2026-05-07: Document File Upload To Supabase Private Bucket

Decision:

Upload passport and address proof files to a Supabase private storage bucket named `documents`.

Store file paths in a new `documents` table. Never expose raw URLs; use signed URLs for internal access.

Document retention period and reviewer access model remain unresolved; these are Phase 7 blockers, not implementation blockers for the upload itself.

Reason:

Files are currently captured only as local metadata. Uploading to private storage makes them available for AbreUSA internal review.

### 2026-05-07: Email Sending Deferred For MVP Handoff

Decision:

Do not implement automated email sending in Phase 6. Use the confirmation screen plus persisted applicant contact data for MVP handoff, and let AbreUSA follow up manually until an email provider/sender is confirmed.

Reason:

The app already persists protocol number, applicant contact, order data, and document files. Automated transactional email requires sender/domain/provider decisions and operational copy approval. Deferring implementation avoids adding an unconfirmed delivery dependency while preserving the customer handoff through the confirmation screen.

### 2026-05-07: Phase 6 Closed And Phase 7 Hardening Begins

Decision:

Close Phase 6 and move the project into Phase 7 production hardening, starting with Supabase security, document access, retention, and reviewer access planning.

Reason:

Approved orders are now persisted and traceable with server-generated protocol numbers. Applicant contact data and document files are persisted for manual AbreUSA follow-up, and the customer receives a clear confirmation screen and handoff timeline. Remaining risks are production hardening concerns rather than Phase 6 order submission blockers.

### 2026-05-07: Production Persistence Requires Server-Side Boundary

Decision:

Before production, approved-order persistence and document upload must move behind a server-side boundary. The browser must not directly insert sensitive order data into Supabase tables or directly upload passport/address files to the private `documents` bucket with the anon key.

Reason:

The current Phase 6 implementation was acceptable for development verification but depends on public client-side Supabase writes. Production RLS and storage hardening require a server-controlled write path so public table access can be denied and private document access can be controlled through server-side authorization and short-lived signed URLs.

### 2026-05-07: Production Supabase Writes Require Service Role

Decision:

Production approved-order persistence and document upload must use a server-only Supabase service-role credential. The production server path must fail closed when `SUPABASE_SERVICE_ROLE_KEY` is missing.

Reason:

RLS and storage lockdown will deny public anon table writes and direct bucket uploads. The server route needs a trusted credential to perform approved-order inserts and private document uploads after payload validation. The service-role key must remain server-only and must never be exposed with a `NEXT_PUBLIC_` prefix.

## Pending Confirmation Gates

### App Spine Confirmation

Question for user:

Confirm whether the generated `/docs` App Spine is approved as the official source of truth.

### Pricing Confirmation

Current prototype pricing:

- Complete Package: $499.
- Florida LLC: $299.
- EIN: $149.
- Registered Agent: $99/year.

Status:

Must be confirmed before production launch.

### Registered Agent Legal Entity Confirmation

Current prototype text:

- AbreUSA Registered Agent Services LLC.
- 1000 Brickell Ave, Miami, FL 33131.

Status:

Must be confirmed before production use.

### EIN-Only Intake Requirements

Status:

Deferred as Post-MVP or Decision Needed.

Decision Needed:

- Required existing LLC/company fields for EIN-only customers.
- Whether EIN-only skips LLC formation steps completely or asks for existing entity data.

### Registered Agent-Only Intake Requirements

Status:

Deferred as Post-MVP or Decision Needed.

Decision Needed:

- Minimal fields for Registered Agent-only service.
- Whether Registered Agent-only uses a separate shorter flow.
- Whether LLC-style steps should be skipped.

### AI Extraction Provider

Status:

Deferred.

MVP decision:

- Use placeholder/manual extraction strategy.

Decision Needed later:

- Real AI provider.

### Payment Scope

Status:

Not included in MVP.

Decision Needed later:

- Payment timing if included.

### PDF / Export Strategy

Status:

Deferred.

MVP decision:

- Use HTML preview first.

Decision Needed later:

- Downloadable PDF/export.
- Whether generated forms are persisted as artifacts or generated from structured order data.

### Draft Persistence

Status:

Deferred unless required later for MVP.

Decision Needed later:

- Whether unfinished customer drafts are saved.
- Whether customers can resume incomplete orders.

### Document Retention

Status:

Decision Needed:

- Retention period for uploaded passport and address proof files.
- Whether documents are deleted after submission or completion.

### 2026-05-07: Email Provider Selected — Resend

Decision:

Use Resend as the transactional email provider for applicant confirmation emails.

Reason:

Simplest integration path for Next.js. Free tier available. No SMTP configuration required. Official SDK for Node.js.

Constraints:

- `RESEND_API_KEY` is a server-side secret. Must never be exposed to the client (no `NEXT_PUBLIC_` prefix).
- Email delivery is best-effort for MVP. Email failure must not block order persistence.
- Integration structure must work (build, run, order flow) without `RESEND_API_KEY` configured.

### 2026-05-07: Temporary Email Sender — contact@brightscalegroup.com

Decision:

Use `noreply@notifications.brightscalegroup.com` as the sender address. Domain `notifications.brightscalegroup.com` verified in Resend (sending enabled, 2026-05-07).

Reason:

Domain verified and live sending confirmed on 2026-05-07.

Decision Needed:

Migrate sender to an AbreUSA domain email (e.g. `noreply@abreusa.com`) once the domain is verified in Resend. Update `lib/send-confirmation-email.ts` at that time.

### 2026-05-07: Email Failure Must Not Block Order Persistence

Decision:

Applicant confirmation email is fire-and-forget. Any Resend API error, missing key, or network failure must be caught silently. The order persistence result is returned to the client regardless of email outcome.

Reason:

Order data integrity is the primary MVP concern. Email is a convenience notification, not a transactional requirement.

### 2026-05-07: Admin Portal Auth — Supabase Auth

Decision:

Use Supabase Auth email/password login to protect the admin portal.

Reason:

Already configured in the project. Provides a proper session model with logout support.

Constraints:

- Admin user created manually in Supabase Auth dashboard.
- All admin data reads/writes use SUPABASE_SERVICE_ROLE_KEY server-side. Auth session verifies identity only.
- Single admin role for MVP.

### 2026-05-07: Admin Document Access — Supabase Signed URLs

Decision:

Generate 60-minute Supabase signed URLs server-side for admin document access. Open in new tab + download option.

Reason:

Storage bucket is private. Signed URLs are the correct Supabase mechanism for time-limited private file access.

### 2026-05-07: Admin Order Status Updates

Decision:

Admin can update order status via a dropdown on the order detail page. Persisted via server-side API route.

Valid values: draft, awaiting_documents, ready_for_review, customer_reviewing, approved, internal_review, submitted, completed, blocked.

Decision Needed later: audit log of status changes, automated status-triggered emails.

### 2026-05-08: Strategic Evolution System Added

Decision:

Strategic product evolution must be handled through impact analysis, App Spine synchronization, Decision Gates, roadmap sequencing, and user confirmation before implementation.

Reason:

The product may evolve through strategic conversations, especially around onboarding philosophy, conversational onboarding, AI-guided onboarding, progressive onboarding, state-based onboarding, and onboarding orchestration. These ideas can invalidate existing UX and architecture assumptions, so documentation and operational architecture must evolve before product feature code.

### 2026-05-08: Decision Gates Added As Operational Control

Decision:

Create `/docs/10-decision-gates.md` to track unresolved strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration decisions.

Reason:

The existing decisions log records confirmed decisions, but the project also needs an explicit place for unresolved gates that should block or sequence implementation.
