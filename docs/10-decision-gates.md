# 10 Decision Gates

## Purpose

Decision Gates track unresolved strategic, UX, architecture, onboarding, compliance, scalability, and AI-orchestration decisions.

They prevent implementation from starting before the App Spine, roadmap, and operational assumptions are synchronized.

## How To Use Decision Gates

- Create or update a gate when a strategic conversation introduces unresolved direction.
- Treat gates as blockers when they affect architecture, data flow, compliance, security, customer UX, or AI behavior.
- Resolve or explicitly defer gates before writing product feature code.
- Link roadmap tasks to gates when sequencing depends on a decision.
- Keep `/docs/08-decisions-log.md` for confirmed decisions and this file for unresolved or gated decisions.

## Status Values

- `Open`: decision is unresolved.
- `Proposed`: recommended direction exists but is not confirmed.
- `Confirmed`: decision is resolved and should move to the decisions log.
- `Deferred`: intentionally postponed.
- `Blocked`: cannot proceed until outside input is available.

## Open Gates

### DG-001: Document Retention Policy

Category: Compliance, privacy, operations.

Status: Confirmed.

Decision:

- Sensitive uploads are retained for 90 days after order completion or cancellation.
- Generated operational files are retained for 1 year.
- Customer operational metadata may be retained long-term.
- AbreUSA should not act as a permanent vault for passports, IDs, proofs of address, or sensitive uploaded documents.

Blocks:

- Production compliance posture.
- Long-term document storage policy.

P8-T06 confirmation:

- Initial retention policy confirmed.
- Implementation automation is not built yet.
- Retention automation, deletion workflows, reviewer access scopes, audit logging, and future compliance framework needs remain separate gates.

Follow-up required:

- Implement deletion automation after architecture is approved.
- Define operational responsibility for deletion before public production at scale.

### DG-002: AbreUSA Sender Domain

Category: Operations, brand, email.

Status: Confirmed.

Decision:

- Use `noreply@notifications.brightscalegroup.com` temporarily.
- Migrate to an AbreUSA-branded sender later.

Blocks:

- Long-term production email branding.

P8-T06 confirmation:

- Keep `noreply@notifications.brightscalegroup.com` for development, controlled testing, and internal validation because it is already verified in Resend.
- Temporary use of the current configured email is confirmed.
- AbreUSA-branded sender migration remains a future operational improvement, not a blocker for controlled deployment.

Follow-up required:

- Final sender domain.
- Sender address, such as `noreply@abreusa.com`.

### DG-003: EIN-Only Flow Requirements

Category: Product, onboarding, data model.

Status: Deferred.

Decision needed:

- Required fields for customers who already have an LLC and only need EIN support.
- Whether EIN-only uses a separate shorter flow or existing LLC data sections.

Blocks:

- EIN-only implementation.

### DG-004: Registered Agent-Only Flow Requirements

Category: Product, onboarding, data model.

Status: Deferred.

Decision needed:

- Required fields for Registered Agent-only customers.
- Whether Registered Agent-only uses a dedicated shorter flow.

Blocks:

- Registered Agent-only implementation.

### DG-005: Conversational Onboarding Role

Category: UX, onboarding architecture, product strategy.

Status: Proposed.

Decision needed:

- Whether conversational onboarding supplements the current guided 13-step flow or replaces parts of it.
- Which moments should be conversational: service selection, eligibility, document guidance, review, or support.

Blocks:

- Conversational onboarding implementation.
- Any major redesign of the intake experience.

P8-T04 proposed direction:

- Start with conversational assistance layered on top of the guided flow.
- Do not replace the guided intake until compliance, UX, and data-capture risks are resolved.
- Candidate first moments: service explanation, field help, document guidance, and review support.

### DG-006: AI-Guided Onboarding Scope

Category: AI orchestration, compliance, onboarding architecture.

Status: Proposed.

Decision needed:

- Whether AI guidance only explains steps, recommends next actions, validates answers, extracts document data, or orchestrates the full onboarding session.
- Guardrails for PII, passport data, legal/tax guidance, and customer-facing recommendations.

Blocks:

- AI-guided onboarding layer.
- Real AI extraction expansion.

P8-T04 proposed direction:

- AI may explain steps, check completeness, summarize review issues, and suggest non-final document extraction values.
- AI must not provide autonomous legal/tax advice, final service recommendations, or unreviewed order submission.
- All AI-generated field values must remain customer-reviewable before approval.

### DG-007: Progressive Onboarding And Resume Model

Category: UX, persistence, account model.

Status: Proposed.

Decision needed:

- Whether customers can save drafts and resume later.
- Whether resume uses account login, secure magic link, protocol lookup, or admin-assisted recovery.

Blocks:

- Progressive onboarding UX.
- Draft persistence.
- Customer dashboard assumptions.

P8-T04 proposed direction:

- If implemented, save/resume should begin after applicant contact is captured.
- Preferred options to evaluate: secure magic link or authenticated customer account.
- Protocol lookup alone is not enough for resume access because orders contain sensitive data.

### DG-008: State-Based Onboarding Model

Category: Architecture, onboarding orchestration, status lifecycle.

Status: Proposed.

Decision needed:

- Canonical onboarding states beyond linear steps.
- How states map to customer progress, internal review, missing information, customer correction, submission, completion, and blocked status.

Blocks:

- State-based onboarding implementation.
- Status-triggered email automation.
- Customer dashboard progress model.

P8-T04 proposed direction:

- Use a state model above the current step flow before adding conversational, AI-guided, progressive, or dashboard experiences.
- Candidate states are documented in `/docs/04-user-flows.md` and `/docs/06-data-model.md`.
- Keep order status separate from onboarding state, but define a clear mapping before implementation.

### DG-009: Onboarding Orchestration Architecture

Category: Architecture, scalability, AI orchestration.

Status: Proposed.

Decision needed:

- Whether onboarding remains component-local state plus order persistence, or moves to a central orchestration layer/state machine/workflow model.
- Whether AI guidance reads from that orchestration layer.

Blocks:

- Onboarding orchestration layer.
- Complex progressive or conversational flows.

P8-T04 proposed direction:

- Keep current component-local intake state for the existing guided flow.
- Do not add a central workflow engine until progressive onboarding, customer resume, customer dashboard, or AI orchestration requires it.
- Treat conversational and AI layers as consumers of structured onboarding state, not as the source of truth.

### DG-010: Production Deployment Environment

Category: Deployment, security, operations.

Status: Proposed.

Decision:

- Use Vercel deployment if possible.
- A temporary Vercel-provided address is acceptable for initial controlled deployment.
- Production env vars still need to be configured before deploy works.

Blocks:

- Production deployment.

P8-T06 confirmation:

- Temporary Vercel URL is acceptable if Vercel provides one.
- Required env vars are documented in `.env.example`.
- `SUPABASE_SERVICE_ROLE_KEY` must be set only server-side and never exposed with a `NEXT_PUBLIC_` prefix.

Required before deployment:

- `NEXT_PUBLIC_SUPABASE_URL`.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- `SUPABASE_SERVICE_ROLE_KEY`.
- `RESEND_API_KEY`.
- Confirm Vercel project link.
- Confirm launch access model: internal-only, password/protected preview, controlled users, or public production.

### DG-011: Document Retention Automation

Category: Operations, privacy, architecture.

Status: Confirmed.

Decision needed:

- Whether deletion runs as a scheduled job, admin-triggered workflow, Supabase job, Vercel cron, or manual operational procedure first.
- How deletion success/failure is recorded.

Blocks:

- Automated enforcement of the 90-day sensitive upload retention policy.

P8-T07 proposed direction:

- Start with a two-step retention workflow before fully automatic deletion.
- Step 1: scheduled or admin-triggered scan marks sensitive uploads as `eligible_for_deletion` after the 90-day retention window.
- Step 2: admin review or scheduled deletion removes eligible files and records the result.
- Use Vercel Cron as the preferred future automation path if deployment is on Vercel; allow manual admin SOP first for controlled launch if cron is not ready.
- Do not delete customer operational metadata when deleting sensitive files.

P8-T08 confirmation:

- First implementation should add retention metadata and audit event structure before any physical deletion.
- File deletion remains out of scope for the first implementation slice.
- Manual-only operation is acceptable for the first slice; Vercel Cron can be added after metadata/audit foundations exist.

### DG-012: Deletion Workflow And Responsibility

Category: Operations, governance.

Status: Confirmed.

Decision needed:

- Who owns document deletion operations.
- Whether deletion is automatic only, admin-reviewed, or manually confirmed before removal.
- Whether deleted file metadata remains in the operational history after file removal.

Blocks:

- Operational deletion SOP.

P8-T07 proposed direction:

- AbreUSA operations owns deletion review.
- Deleted file metadata should remain in the operational record, but storage path access should no longer resolve to a retrievable file.
- Deletion records should include document ID, order ID, file type, deletion reason, deleted timestamp, actor or automation source, and success/failure.
- For MVP controlled launch, manual admin review is acceptable before automatic deletion is implemented.

P8-T08 confirmation:

- First implementation should preserve deletion responsibility as manual/admin-reviewed.
- Metadata should support later automation without requiring immediate automatic deletion.

### DG-013: Reviewer Access Scopes

Category: Security, admin, operations.

Status: Proposed.

Decision needed:

- Whether all admins can access all documents or whether reviewer roles/scopes are needed.
- Whether document access should be limited by order status, assignment, or time window.

Blocks:

- Role-based reviewer access.

P8-T07 proposed direction:

- Keep single admin role for MVP controlled launch.
- Restrict document access to authenticated admins only.
- Generate short-lived signed URLs server-side.
- Do not add granular role-based access until order volume, team size, or external reviewers require it.
- Future scopes may include owner/admin, reviewer, operations, and external accountant/tax reviewer.

### DG-014: Audit Logging Scope

Category: Security, operations, compliance.

Status: Confirmed.

Decision needed:

- Which actions need audit logging: document view, signed URL generation, download, status update, deletion, email send, and admin login.
- Whether audit logging is required before controlled launch or only before scale.

Blocks:

- Admin audit log implementation.

P8-T07 proposed direction:

- Audit logging should cover document signed URL generation, document download/open action intent, document deletion, status updates, and admin login/logout.
- For the first implementation slice, prioritize status updates and document deletion audit records.
- Store audit events as operational metadata, not customer-facing data.
- Do not introduce enterprise compliance claims or heavy compliance tooling for MVP.

P8-T08 confirmation:

- First implementation should create an operational `audit_events` model.
- Priority audit events: document retention eligibility, document deletion attempt/result, and order status update.
- Signed URL generation and admin login/logout can follow after the first audit foundation exists.

### DG-015: Future Compliance Framework Needs

Category: Compliance, privacy, scalability.

Status: Deferred.

Decision needed:

- Whether future scale requires a formal compliance framework, data processing agreement, customer data export/delete process, or legal hold process.

Blocks:

- Enterprise or regulated expansion.
