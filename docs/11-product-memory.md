# 11 Product Memory

## Purpose

This document defines what AbreUSA should remember long term and what should remain temporary operational storage.

Strategic principle:

AbreUSA should not become a permanent storage vault for sensitive identity documents. The long-term platform asset should be customer relationship, onboarding intelligence, business lifecycle memory, and operational history.

## Data Architecture Principle

Separate:

1. Long-Term Customer Memory.
2. Temporary Sensitive Processing Storage.

## Long-Term Customer Memory

These may be retained operationally long term:

- Applicant profile.
- Name.
- Email.
- Phone or WhatsApp.
- Country.
- Language preference.
- Service history.
- Company metadata.
- Onboarding summaries.
- Protocol history.
- Status timeline.
- Operational notes.
- Lifecycle relationship data.

Purpose:

- Enable future operational relationship.
- Support follow-up services.
- Support business lifecycle operations.
- Improve onboarding intelligence.
- Preserve operational history without retaining sensitive uploads indefinitely.

## Temporary Sensitive Processing Storage

Sensitive uploads should be treated separately from long-term customer memory.

Examples:

- Passports.
- IDs.
- Proofs of address.
- Sensitive uploaded documents.

Default principle:

- Sensitive uploads are used for onboarding and operational processing.
- Sensitive uploads should not be retained indefinitely by default.
- Sensitive uploads should be removed according to the retention policy unless a later confirmed policy requires a hold or extension.

## Initial Retention Policy

Sensitive uploads:

- Retention: 90 days after order completion or cancellation.

Generated operational files:

- Examples: protocol previews, generated summaries, operational PDFs.
- Retention: 1 year.

Customer operational metadata:

- Retention: long-term operational retention allowed.

## Storage Architecture

Use private Supabase Storage buckets only.

Recommended buckets:

- `private-documents`.
- `generated-previews`.
- `internal-summaries`.

Rules:

- No permanent public URLs.
- Use signed URLs.
- Use short-lived access URLs.
- Require authenticated admin access.
- Do not expose raw storage paths or bucket internals to customers.

## Product Positioning

The platform should communicate:

"Documents are used for onboarding and operational processing purposes and may be removed after the process is completed."

Do not position AbreUSA as a permanent secure archive for identity documents.

## Customer Lifecycle Direction

The long-term strategic value of AbreUSA is:

- Customer lifecycle relationship.
- Business operational support.
- Future services.
- Onboarding intelligence.

Potential future services:

- Annual reports.
- Renewals.
- Bookkeeping.
- Banking guidance.
- Tax coordination.
- Compliance reminders.

## Governance

Open governance areas:

- Document retention automation.
- Deletion workflows.
- Reviewer access scopes.
- Audit logging.
- Future compliance framework needs.

Constraints:

- Do not introduce enterprise compliance complexity yet.
- Do not introduce legal claims about compliance certification.
- Do not overengineer security architecture for MVP.
- Focus on minimal responsible retention, operational clarity, risk reduction, and future customer lifecycle support.

## Retention Automation Architecture

Status: P8-T07 proposed architecture. Not implemented.

Recommended workflow:

1. Identify eligible sensitive uploads:
   - A sensitive upload becomes eligible for deletion 90 days after order completion or cancellation.
   - The file should be marked as `eligible_for_deletion` before physical deletion.
2. Review or process eligible files:
   - Controlled launch may use a manual admin SOP.
   - Future automation may use Vercel Cron or another scheduled server process.
3. Delete sensitive files:
   - Remove the object from private storage.
   - Keep non-sensitive metadata for operational history.
   - Record deletion outcome.
4. Preserve customer memory:
   - Do not delete applicant profile, service history, company metadata, protocol history, status timeline, or operational notes as part of sensitive file deletion.

## Deletion Audit Model

Deletion records should capture:

- Document ID.
- Order ID.
- Document type.
- Storage bucket.
- Storage path or path hash.
- Eligibility timestamp.
- Deleted timestamp.
- Actor or automation source.
- Deletion reason.
- Result: success, failed, skipped, or manually deferred.
- Error message when deletion fails.

Audit records should be operational metadata.

## Reviewer Access Scope

Initial MVP controlled launch:

- Single authenticated admin role.
- Short-lived signed URLs generated server-side.
- No public URLs.
- No customer access to raw storage paths.

Future reviewer scopes may include:

- Owner/admin.
- Internal reviewer.
- Operations.
- External accountant or tax reviewer.

Do not add granular role complexity until operational volume or external reviewer access requires it.
