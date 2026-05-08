# 05 Platform Strategy

## Default Architecture

Defined by `AGENTS.md`:

- Next.js frontend.
- Supabase backend.
- Vercel deployment.
- Cloudflare domain/DNS.

## Current Technical Context

Current repo context:

- Framework scaffold: Next.js 16 App Router.
- React: 19.
- Tailwind: 4.
- shadcn initialized before this App Spine reset.
- Existing production product is not yet implemented in Next.js.
- Existing standalone `index.html` prototype is product evidence, not production architecture.

## Next.js Instruction

Before editing Next.js code, read the relevant guides in `node_modules/next/dist/docs/` because this Next.js version may differ from prior conventions.

## Foundation Planning Items

To be confirmed during roadmap Phase 1:

- Next.js 16 App Router architecture.
- Routing strategy.
- Component structure.
- Styling/design system boundaries.
- Storage strategy for orders and documents.
- AI extraction provider or placeholder strategy.
- Security and privacy requirements for sensitive documents.

## Phase 1 Architecture Plan

Status: planned as documentation-only foundation work.

This plan defines the intended technical direction before product code begins. It does not implement product behavior.

## App Architecture

Confirmed direction:

- Use the existing Next.js 16 App Router scaffold as the production application foundation.
- Treat the standalone `index.html` prototype as product evidence only.
- Build the production experience as a guided app flow, not as a static HTML port.
- Keep customer-facing UI Portuguese-first.
- Keep U.S. government form labels in English where they represent official form language.

Decision Needed:

- Confirm whether the guided flow should be implemented as one route with internal step state or multiple route segments per step.

Proposed default for next planning pass:

- Single route for the customer intake flow first, with internal step state, because the current MVP is one guided form experience and the flow requires preserving in-progress data across steps.

## Route Strategy

Planned route groups:

- Customer intake route for the guided AbreUSA flow.
- Generated form preview route or section for customer review.
- Confirmation route or section after approval.

Decision Needed:

- Whether admin/internal review routes are part of MVP or deferred.
- Whether customer resumes drafts by URL/token in MVP or only completes in one session.

## Component Strategy

Planned component boundaries:

- App shell: shared layout, page container, progress header.
- Step primitives: step wrapper, step navigation, validation display.
- Input primitives: text fields, selects, toggles, steppers, upload zones.
- Business steps: service selection, LLC name, business activity, members, address, Registered Agent, EIN questions, documents, review.
- Generated form previews: Florida Articles of Organization preview and IRS SS-4 preview.
- Confirmation components: approval controls, protocol display, next-step timeline.

Implementation rule:

- Components should follow the App Spine and roadmap phases. Phase 2 may create shell and primitives, but business flow logic belongs in Phase 3 or later.

## State And Data Flow

Planned data flow:

- Intake starts as client-side draft state.
- Structured order data maps to the product-level data model in `06-data-model.md`.
- Approval converts draft data into an internal AbreUSA order.
- Persisted order status uses the lifecycle defined in `06-data-model.md`.

Confirmed MVP direction:

- Draft persistence and resume links are deferred unless later required for MVP.

Decision Needed:

- Whether applicant email and phone become required before approval.

## Onboarding Orchestration Strategy

Status: P8-T04 architecture discovery complete. No orchestration code is implemented.

Current baseline:

- The customer intake remains a guided step flow.
- Local client state drives in-progress intake before approval.
- Approved orders persist through the server-side `/api/orders` boundary.
- Internal review happens through the admin portal.

Candidate future architecture:

- Keep the guided flow as the canonical user-facing baseline until a Decision Gate changes it.
- Add a state-based onboarding model above the step flow before adding conversational or AI-guided behavior.
- Treat conversational onboarding as an assistance layer first, not as the system of record.
- Treat AI-guided onboarding as advisory and reviewable unless a later Decision Gate explicitly expands scope.
- Use persisted onboarding states only after progressive onboarding, customer resume, or customer dashboard requirements are confirmed.

Recommended sequencing:

1. Resolve the onboarding state model.
2. Resolve progressive onboarding and resume assumptions.
3. Decide whether conversational onboarding supplements or replaces parts of the guided flow.
4. Define AI guardrails for PII, passport data, legal/tax guidance, and service recommendations.
5. Only then implement orchestration, conversational UI, AI guidance, or draft persistence.

Architecture constraint:

- Do not introduce a central workflow engine, AI orchestration layer, or customer draft persistence until the related Decision Gates are resolved.

## Supabase Strategy

Default backend platform from `AGENTS.md`: Supabase.

Planned Supabase responsibilities:

- Store approved or draft orders.
- Store applicant, LLC, member, EIN, Registered Agent, document, and generated form records.
- Store uploaded document files using private storage.
- Support internal review and status tracking when that phase is reached.

Planned schema areas:

- `orders`.
- `applicants`.
- `llcs`.
- `members`.
- `registered_agents`.
- `ein_details`.
- `documents`.
- `generated_forms`.

Decision Needed:

- Whether Phase 2/3 can use local-only state first, with Supabase introduced in Phase 6, or whether Supabase must be wired before intake implementation.
- Whether internal admin review is stored in the same app or handled outside the MVP.

## Document Storage And Security

Document handling is high-risk because passport and address proof files contain sensitive personal information.

Planned requirements:

- Use private storage for documents.
- Never expose raw document URLs publicly.
- Restrict document access to the owning customer session and authorized AbreUSA reviewers.
- Store extraction results separately from original files.
- Allow customer correction of extracted fields.
- Separate long-term customer memory from temporary sensitive processing storage.
- Do not treat AbreUSA as a permanent vault for sensitive identity documents.

Confirmed initial retention direction:

- Sensitive uploads are retained for 90 days after order completion or cancellation.
- Generated operational files are retained for 1 year.
- Customer operational metadata may be retained long-term for customer relationship, service history, operational follow-up, and business lifecycle support.

Recommended private Supabase Storage buckets:

- `private-documents` for sensitive temporary uploads.
- `generated-previews` for generated operational previews and files.
- `internal-summaries` for internal onboarding summaries and operational outputs.

Storage access rules:

- No permanent public URLs.
- Use signed URLs only.
- Signed URLs must be short-lived.
- Authenticated admin access only.
- Raw storage paths and bucket internals must not be exposed to customers.

Future implementation notes:

- The current bucket structure may need a migration from the existing `documents` bucket to the recommended separated buckets.
- Retention automation is not implemented yet.
- Deletion workflow, audit logging, reviewer access scopes, and future compliance framework requirements are tracked as Decision Gates.

Decision Needed later:

- Exact automation design for deletion workflows.
- Audit log depth for document access and deletion.
- Whether future compliance requirements require longer retention, legal hold, or customer data export/delete workflows.

## Customer Data Lifecycle Strategy

The long-term strategic value of AbreUSA is not indefinite storage of passports or sensitive uploads.

Long-term platform value should come from:

- Customer lifecycle relationship.
- Business operational support.
- Future services.
- Onboarding intelligence.
- Operational history.

Potential future services supported by long-term customer memory:

- Annual reports.
- Renewals.
- Bookkeeping.
- Banking guidance.
- Tax coordination.
- Compliance reminders.

Architecture principle:

- Long-term customer memory should store relationship and operational context.
- Temporary sensitive processing storage should store only what is needed to complete onboarding and operational processing.
- Sensitive uploads should be deleted according to the retention policy unless a later confirmed policy requires a hold or extension.

## AI Extraction Strategy

Current prototype uses simulated extraction. Real AI extraction is not confirmed for MVP.

Confirmed MVP direction:

- Use placeholder/manual extraction strategy for MVP.
- Real AI provider selection is deferred.

Planning constraint:

- Extracted data must always be reviewable and correctable by the customer.

## Generated Form Strategy

Planned forms:

- Florida Articles of Organization preview.
- IRS SS-4 preview when EIN is included.

Confirmed MVP direction:

- Use HTML preview first.
- PDF/export is deferred.

Decision Needed:

- Whether generated forms are stored as rendered artifacts or generated from structured data on demand.

Planning constraint:

- Generated forms are previews only until customer approval and AbreUSA processing.

## Payment Strategy

Confirmed MVP direction:

- Payment is out of MVP for now.
- Payment timing is deferred.

## Service Flow Gaps

The complete package and LLC-only flows are sufficiently defined for planning.

Confirmed MVP direction:

- EIN-only flow is deferred as Post-MVP or Decision Needed.
- Registered Agent-only flow is deferred as Post-MVP or Decision Needed.

Decision Needed before building those branches:

- EIN-only flow: required company data for customers who already have an LLC.
- Registered Agent-only flow: minimal intake requirements and whether LLC-style steps should be skipped.

Planning constraint:

- Do not invent final answers for these flows during implementation. Resolve them through a spec update before building those branches.

## Verification Strategy

Before product execution:

- Read relevant Next.js 16 docs in `node_modules/next/dist/docs/`.
- Verify lint and typecheck after code changes in future execution phases.
- Use browser verification after any UI implementation.
- Validate mobile and desktop layouts for the guided flow.
- Confirm sensitive document workflows before production deployment.

## Current Platform Boundary

No backend, storage, AI provider, deployment workflow, or domain configuration is considered implemented until explicitly completed in the roadmap and reflected in `09-build-status.md`.

## GitHub Pages Progress Dashboard

The stakeholder progress dashboard lives at:

- `/progress/index.html`

It is a static page and is separate from the Next.js product app.

Publishing setup:

1. Push the repository to GitHub.
2. In GitHub, open the repository settings.
3. Go to Settings -> Pages.
4. Set Source to `Deploy from a branch`.
5. Set Branch to `main`.
6. Set Folder to `/ root`.
7. Save.

Expected URL format:

- `https://<github-username>.github.io/<repo-name>/progress/`

For this repository, the expected format is:

- `https://libanius.github.io/AbreUSA/progress/`

Root Pages publishing is intentional so `/progress/` is served directly from the repository root. The root `.nojekyll` file is present to prevent GitHub Pages from applying Jekyll processing to static project files.
