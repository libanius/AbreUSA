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

### 2026-05-08: Guided Flow Remains Canonical Onboarding Baseline

Decision:

Keep the current guided 13-step intake as the canonical onboarding baseline while future conversational, AI-guided, progressive, and state-based onboarding concepts are evaluated.

Reason:

The existing guided flow already supports the working Complete Package and Florida LLC paths with customer review, generated previews, approval, persistence, email, and admin review. Replacing it with conversational or AI-led onboarding before resolving Decision Gates would risk invalidating compliance-sensitive review and data-capture assumptions.

### 2026-05-08: Conversational And AI Onboarding Must Start As Assistive Layers

Decision:

Treat future conversational onboarding and AI-guided onboarding as assistive layers first, not as the source of truth or autonomous submission authority.

Reason:

The product handles sensitive identity documents, business formation data, tax-related inputs, and customer approval. AI and conversation can help explain, check, summarize, and suggest, but structured customer-reviewed data and explicit approval must remain authoritative until a later confirmed decision expands scope.

### 2026-05-08: Launch Gates Require Owner Confirmation Before Public Production

Decision:

Do not proceed to broad public production launch until document retention, sender-domain strategy, and production deployment environment are confirmed.

Reason:

The app stores sensitive passport and address proof files, sends transactional customer email, and depends on server-only Supabase credentials. These are operational launch decisions, not product feature code decisions.

### 2026-05-08: Verified Brightscale Sender Remains Temporary

Decision:

Keep `noreply@notifications.brightscalegroup.com` as the temporary verified Resend sender for development, controlled testing, and internal validation.

Reason:

The sender is already verified and working. AbreUSA-branded email remains the desired long-term production direction, but migration requires domain/sender confirmation.

### 2026-05-08: Initial Document Retention And Customer Data Lifecycle Policy

Decision:

Adopt an initial retention and customer data lifecycle policy:

- Sensitive uploads are retained for 90 days after order completion or cancellation.
- Generated operational files are retained for 1 year.
- Customer operational metadata may be retained long-term.
- AbreUSA should not become a permanent storage vault for passports, IDs, proofs of address, or sensitive uploaded documents.

Reason:

The long-term asset of the platform should be customer relationship, onboarding intelligence, business lifecycle memory, and operational history, not indefinite storage of sensitive documents.

### 2026-05-08: Separate Customer Memory From Sensitive Processing Storage

Decision:

Separate long-term customer memory from temporary sensitive processing storage.

Long-term memory may include applicant profile, contact data, language preference, service history, company metadata, onboarding summaries, protocol history, status timeline, operational notes, and lifecycle relationship data.

Temporary sensitive processing storage includes passports, IDs, proofs of address, and sensitive uploaded documents.

Reason:

This creates operational clarity, reduces sensitive-document retention risk, and supports future lifecycle services without turning AbreUSA into a permanent archive for identity documents.

### 2026-05-08: Temporary Sender And Temporary Vercel URL Accepted For Controlled Launch

Decision:

Use the currently configured sender `noreply@notifications.brightscalegroup.com` temporarily. A Vercel-provided temporary deployment URL is acceptable for initial controlled deployment if Vercel provides one.

Reason:

This allows controlled operational validation without waiting for final brand-domain setup. Public or broader launch can still migrate to an AbreUSA-branded sender and custom domain later.

### 2026-05-08: Retention Enforcement Starts With Two-Step Deletion Workflow

Decision:

Retention enforcement should start with a two-step workflow:

1. Mark sensitive uploads as `eligible_for_deletion` after the 90-day retention window.
2. Delete eligible files with an audit record.

Manual admin SOP is acceptable for controlled launch if automation is not ready. Vercel Cron is the preferred future automation path if deployment runs on Vercel.

Reason:

This reduces risk compared with immediate fully automatic deletion, preserves operational visibility, and keeps customer operational memory separate from temporary sensitive storage.

### 2026-05-08: MVP Reviewer Access Remains Single Admin Role

Decision:

Keep the single authenticated admin role for MVP controlled launch. Continue using short-lived signed URLs generated server-side for document access. Do not add granular reviewer roles until order volume, team size, or external reviewer access requires it.

Reason:

The current admin model is enough for controlled launch. Granular reviewer scopes would add complexity before the operational need is proven.

### 2026-05-08: Retention Metadata And Audit Foundation Before Deletion

Decision:

Implement retention metadata and audit event foundations before any physical file deletion is implemented.

The first implementation slice should add document retention metadata, add an operational `audit_events` model, surface retention status in admin order detail, and avoid deleting files.

Reason:

Physical deletion without metadata, admin visibility, and audit records would create operational ambiguity. The foundation should make deletion eligibility visible and auditable before enforcement begins.

### 2026-05-09: First Physical Deletion Workflow Must Be Manual And Audited

Decision:

The first physical sensitive document deletion workflow should be manual/admin-triggered, server-side, and fully audited before any scheduled automation is introduced.

Required safeguards:

- Verify `retention_category = sensitive_upload`.
- Verify `retention_eligible_at <= now()` server-side.
- Verify the document has not already been deleted.
- Create `document_deletion_attempted` before storage removal.
- On success, create `document_deleted` and update deletion metadata on the document row.
- On failure, create `document_deletion_failed`, preserve the document record, and keep the item visible for follow-up.
- Preserve applicant profile, service history, company metadata, protocol history, status timeline, and operational notes.

Reason:

Manual audited deletion reduces sensitive-document retention risk without introducing premature scheduled automation. It also verifies the operational model before Vercel Cron or bulk deletion is considered.

### 2026-05-09: Retention Cron Deferred Until Manual Workflow Is Verified

Decision:

Do not add Vercel Cron or automated physical deletion yet. Cron remains the preferred future automation path after manual deletion behavior, audit records, failure handling, and admin review are verified.

Reason:

The project needs a safe, inspectable deletion path before unattended deletion runs against private storage. A manual-first workflow keeps MVP governance simple while preserving a clear path to scale.

### 2026-05-09: Production Deployment Readiness Is Next MVP Priority

Decision:

After P8-T11, prioritize production deployment readiness and controlled Vercel deployment verification before Vercel Cron, AbreUSA-branded sender migration, expanded audit logging, or new product features.

Reason:

The core MVP flow, admin portal, server-side persistence, security lockdown, email integration, retention metadata, audit foundation, and manual deletion workflow are already implemented. The main blocker to controlled MVP use is now operational deployment: Vercel project linkage, production environment variables, launch access model, deployment, and end-to-end verification on the deployed URL.

### 2026-05-09: Temporary Vercel Production Deployment Completed

Decision:

Deploy the MVP to Vercel under the AbreUSA account and use the temporary Vercel URL for controlled validation.

Result:

- Vercel account: `abreusaonline-7459`.
- Vercel project: `abre-usa-s-projects/abre-usa`.
- Production URL: `https://abre-usa.vercel.app`.
- Production env vars configured in Vercel.
- Deployed customer Complete Package flow verified with protocol `AUS-2026-0011`.

Reason:

The temporary Vercel URL is sufficient for controlled MVP validation while custom domain setup, branded sender migration, and broader launch decisions remain separate follow-up work.

### 2026-05-09: Admin Order Pages Must Be Dynamic

Decision:

Force dynamic rendering for production admin order list and order detail pages.

Files:

- `app/admin/orders/page.tsx`.
- `app/admin/orders/[id]/page.tsx`.

Reason:

The first authenticated production admin verification showed that the admin list/detail pages could be prerendered or cached, which prevented the newly created production test order `AUS-2026-0011` from appearing reliably. Admin review pages must read current operational data from Supabase on demand.

### 2026-05-10: Controlled Launch Stays On Temporary Vercel URL

Decision:

Continue controlled launch on the temporary Vercel URL for now.

Result:

- Current production URL remains `https://abre-usa.vercel.app`.
- Custom domain setup remains deferred.

Reason:

Owner/operator confirmed that the launch should continue on the Vercel URL instead of configuring a custom domain now.

### 2026-05-10: Temporary Sender Remains In Use

Decision:

Keep the current temporary sender and defer AbreUSA-branded sender migration.

Result:

- Current sender remains `noreply@notifications.brightscalegroup.com`.
- AbreUSA-branded sender migration remains a future operational improvement.

Reason:

Owner/operator confirmed that the temporary sender should remain in use for the controlled launch.

### 2026-05-10: Permanent Admin Access Confirmed

Decision:

Use `contact@brightscalegroup.com` as the permanent admin account for the current controlled launch.

Result:

- Supabase Auth contains a confirmed user for `contact@brightscalegroup.com`.
- Owner/operator confirmed access.

Reason:

The single authenticated admin model remains acceptable for MVP controlled launch, and the owner/operator confirmed account access.

### 2026-05-10: Production Email Receipt Requires Real Inbox Retest

Decision:

Do not treat `AUS-2026-0011` as proof of production email receipt.

Result:

- Owner/operator reported that the email did not arrive.
- Follow-up check showed `AUS-2026-0011` used `ana.prod@example.com`, which is not a real inspectable inbox.
- A new production email receipt test with a real inbox is required before closing P8-T14.

Reason:

The production email path produced no visible Vercel error logs, but receipt cannot be verified when the test order uses an example-domain address.

### 2026-05-09: Email Fire-and-Forget Bug Fixed

Decision:

Replace `void sendConfirmationEmail()` with `await sendConfirmationEmail()` in `app/api/orders/route.ts`.

Result:

- The fire-and-forget pattern caused silent email failures in production because Vercel terminated the serverless function before the Resend API call completed.
- Fix applied in commit `b3c3f0d`. Build passed. Redeployed to production.
- Production email confirmed received at `brightscalegroup@gmail.com` for `AUS-2026-0014`.

Reason:

Serverless Lambda functions on Vercel do not guarantee continuation after the response is returned. Any async work dispatched with `void` may be silently dropped. Email sending must be awaited before the route returns a response.

### 2026-05-09: Controlled MVP Launch Complete — P8-T14 Closed

Decision:

Close P8-T14 and declare the controlled MVP launch complete.

Result:

- Production email receipt confirmed with a real inspectable inbox (`brightscalegroup@gmail.com`) for `AUS-2026-0014`.
- Permanent admin access confirmed for `contact@brightscalegroup.com`.
- Controlled launch continues on `https://abre-usa.vercel.app`.
- Temporary sender `noreply@notifications.brightscalegroup.com` remains in use.
- No blocking operational tasks remain.

Reason:

All P8-T14 acceptance criteria are now met. The MVP product is live, verified, and operational. Next steps are Post-MVP priorities as directed by the owner/operator.

### 2026-05-13: Choice Steps Auto-Advance In Onboarding

Decision:

Choice/card steps auto-advance; input/upload/review steps require explicit Continue/Confirm.

Result:

- Simple predefined option selections should save the answer and advance immediately.
- Typed inputs, uploads, review, approval, and submission confirmation retain explicit user action.
- Mixed choice/input cases, such as selecting `Other`, remain explicit until required details are entered.
- Full Articles of Organization content should not sit inline between a question and Continue; it belongs in review or hidden-by-default detail UI.

Reason:

AbreUSA should feel like a Portuguese guided concierge experience, with one clear question at a time and less form-like friction before larger Post-MVP work.

### 2026-05-13: Company Address Can Reuse Applicant Residential Address

Decision:

The onboarding flow allows the LLC/company principal address to reuse the applicant/residential address through a checkbox. The system stores both the copied address and a boolean flag indicating whether the addresses are the same.

Result:

- Applicant residential address is captured during the applicant/contact step.
- The LLC/company principal address step includes a checkbox to use the previously provided residential address.
- When selected, the LLC principal address payload uses the residential address values and stores `principalSameAsApplicantAddress = true`.
- When not selected, the customer can enter a separate company principal address and the flag is false.
- Admin order detail should display the applicant residential address, company principal address, and whether they are the same.

Reason:

The guided onboarding should avoid asking customers to type the same address multiple times while preserving clear operational data for AbreUSA review.

### 2026-05-14: Phase 9 AI-Ready Onboarding Foundation

Decision:

AbreUSA uses anonymous initial onboarding followed by progressive applicant creation. After diagnosis and service selection, users can choose between document-assisted prefill or manual entry. Real AI OCR is a future capability; the MVP must not claim automatic extraction until implemented.

Result:

- Phase 9 is AI-Ready Onboarding Foundation.
- The onboarding flow should offer:
  - `Enviar documentos para facilitar o preenchimento`.
  - `Preencher manualmente`.
- Document-assisted onboarding may use the existing document upload infrastructure and prepare future extraction review surfaces.
- Manual onboarding continues through the existing guided flow.
- No real OCR, OpenAI API calls, passport parsing, proof-of-residence parsing, or autonomous AI behavior are implemented in Phase 9.

Reason:

Phase 8.5 improved onboarding UX. The next product step is preparing deterministic, safe onboarding structure for future AI-assisted flows without making unimplemented AI claims.

### 2026-05-13: Document-Assisted Flow — Documents Collected at Step 3

Decision:

When the customer selects `document_assisted` at step 2 (entry mode), documents (passport + address proof) are collected immediately at step 3, before any other onboarding data. The `manual` path continues to collect documents at step 11 (after all LLC/EIN data), preserving Phase 8.5 behavior.

Result:

- `document_assisted` flow order: service → entry_mode → documents → applicant_contact → llc_name → business_activity → member_count → member_data → business_address → registered_agent → ein_questions → review → approval → confirmation (14 steps, documents at 3).
- `manual` flow order: service → entry_mode → applicant_contact → llc_name → business_activity → member_count → member_data → business_address → registered_agent → ein_questions → documents → review → approval → confirmation (14 steps, documents at 11).
- `stepOffset = isDocumentAssisted ? 1 : 0` applied to all middle steps so step numbers are always consistent.
- Total steps is 14 for both modes.
- Disclosure message on documents step does not mention OpenAI; informs customer that documents facilitate remaining steps.

Reason:

The purpose of document-assisted mode is to use uploaded documents to pre-facilitate the remaining onboarding steps. Collecting documents first — before asking for applicant name, address, LLC data — makes the intended flow coherent. Collecting them late (as in the manual path) negates the facilitation purpose.

### 2026-05-13: Phase 10 — Real OCR Extraction Activated on Document-Assisted Path

Decision:

Phase 10 activates real document extraction via OpenAI GPT-4o Vision on the document-assisted onboarding path. The extraction_review step (step 4 in document-assisted mode) is now reachable. Confirmed extraction data prefills applicant contact fields.

Result:

- `handleContinueFromDocuments` (document_assisted): triggers server-side OCR, navigates to extraction_review while loading.
- extraction_review step at step 4: loading spinner, editable pre-filled fields on success, fallback message on failure. Customer must confirm before proceeding.
- `onConfirmExtraction`: prefills applicant_contact name and residential address from confirmed extraction data, then navigates to applicant_contact.
- totalSteps: 15 for document_assisted (adds extraction_review at step 4); 14 for manual (unchanged).
- stepOffset: 2 for document_assisted; 0 for manual.
- progressItems for document_assisted: 15 items with "Extração" at position 4.
- Extraction failure does not block the user. Customer sees a friendly message and continues manually.
- Manual path unchanged. Supabase persistence unchanged. Admin review unchanged.

Reason:

Phase 9 established the document-assisted path structure and positioned documents at step 3. Phase 10 completes the intended design by running real OCR after upload and using the result to prefill later onboarding fields — reducing manual data entry for document-assisted customers. The extraction_review step ensures the customer always reviews and confirms before confirmed data is used.

### 2026-05-14: Phase 11 Customer Dashboard Lookup MVP

Decision:

Start the customer dashboard journey with a protocol + applicant email lookup instead of a full customer account system.

Result:

- Phase 11 begins with `/dashboard`.
- Customers can view a safe order summary after submission using protocol number and applicant email.
- The dashboard may show order status, service, LLC name, applicant identity, document checklist status, generated form checklist, and next-step timeline.
- The dashboard must not expose document signed URLs, storage paths, admin-only controls, internal audit records, or raw sensitive files.
- Full customer login, magic links, draft resume, customer corrections, and document downloads remain future work.

Reason:

Customers need a simple way to check progress after receiving a protocol number. A protocol + email lookup delivers immediate value while avoiding the larger architecture and security decisions of a full customer account portal.
