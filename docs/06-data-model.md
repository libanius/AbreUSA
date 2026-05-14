# 06 Data Model

This document defines product-level data, not final database schema.

## Order

- orderId.
- protocolNumber.
- serviceType.
- status.
- onboardingEntryMode.
- documentExtractionStatus.
- extractedApplicantData.
- extractedAddressData.
- extractionConfidence.
- userConfirmedExtractedData.
- agentSummary.
- missingInformationFlags.
- createdAt.
- updatedAt.
- approvedAt.
- submittedAt.

Service type values:

- complete_llc_ein.
- florida_llc.
- ein.
- registered_agent.

Status values:

- draft.
- awaiting_documents.
- ready_for_review.
- customer_reviewing.
- approved.
- internal_review.
- submitted.
- completed.
- blocked.

Onboarding entry mode values:

- manual.
- document_assisted.

Document extraction status values:

- not_started.
- pending.
- completed.
- failed.

Phase 9 readiness fields:

- `onboardingEntryMode`: stores whether the customer chose manual onboarding or document-assisted onboarding after service selection.
- `documentExtractionStatus`: stores future extraction lifecycle state. Phase 9 does not run OCR, so the default is `not_started`.
- `extractedApplicantData`: JSON/object placeholder for future customer-reviewable applicant extraction values.
- `extractedAddressData`: JSON/object placeholder for future customer-reviewable address extraction values.
- `extractionConfidence`: optional future numeric confidence signal.
- `userConfirmedExtractedData`: whether the customer confirmed any extracted values before submission.
- `agentSummary`: future internal/assistive summary; must not replace structured customer-reviewed data.
- `missingInformationFlags`: JSON/object or array of future missing-information markers.

Phase 9 constraint:

- These fields prepare the architecture for Phase 10 or later. They must not be used to claim real OCR, automated passport parsing, proof-of-residence parsing, or autonomous AI behavior.

## Applicant

- fullName.
- dateOfBirth.
- nationality.
- passportNumber.
- passportExpiration.
- personalAddressStreet.
- personalAddressCity.
- personalAddressState.
- personalAddressZip.
- email.
- phone.

Applicant residential address source:

- Captured during the applicant/contact step.
- May be reused as the LLC/company principal address when the customer selects the same-address checkbox.

Email and phone are not present in the prototype but are likely required for production order handling.

## LLC

- legalName.
- alternateName1.
- alternateName2.
- state.
- businessActivityCode.
- businessActivityLabel.
- principalStreet.
- principalCity.
- principalState.
- principalZip.
- principalCounty.
- principalSameAsApplicantAddress.
- managementType.
- memberCount.

Initial state:

- Florida.

Address reuse:

- `principalSameAsApplicantAddress` stores whether the customer chose to reuse the applicant/residential address for the LLC/company principal address.
- When true, the persisted LLC principal address fields still contain the copied address values.
- When false, the persisted LLC principal address fields contain the separately entered company address.

Management type:

- member_managed for MVP unless changed.

## Member

- memberId.
- fullName.
- address.
- ownershipPercentage.
- isPrimaryApplicant.

Validation:

- At least one member.
- Ownership percentages should total 100.

## Registered Agent

- choice.
- name.
- address.
- city.
- state.
- zip.

Choice values:

- abreusa.
- self.
- other.

Default prototype value:

- AbreUSA Registered Agent Services LLC, Miami, FL.

Production details require legal/business confirmation.

## EIN / IRS SS-4

- reasonForApplying.
- hasEmployeesNext12Months.
- alreadyStartedActivities.
- startDate.
- fiscalClosingMonth.
- entityType.
- expectedEmployeeCount.
- firstPayrollDate.
- responsiblePartyName.
- responsiblePartyPassportNumber.

Reason values:

- new_business.
- banking.
- compliance.
- employees.
- other.

Entity type values:

- llc_single_disregarded.
- llc_multi_partnership.
- llc_c_corp_election.
- corporation.

## Documents

- documentId.
- orderId.
- documentType.
- fileName.
- mimeType.
- storagePath.
- uploadStatus.
- extractionStatus.
- extractedFields.
- reviewedByCustomer.
- retentionCategory.
- retentionEligibleAt.
- retentionStatus.
- deletionStatus.
- deletedAt.
- deletedBy.
- deletionReason.
- deletionAuditId.

Future extraction review readiness:

- Document upload can support a document-assisted onboarding path.
- Uploaded files remain governed by existing private storage and retention rules.
- Any future extracted values must remain editable and customer-confirmed before approval.

Document type values:

- passport.
- us_address_proof.

Extraction status values:

- not_started.
- processing.
- extracted.
- failed.
- manually_corrected.

Retention category values:

- sensitive_upload.
- generated_operational_file.
- customer_metadata.

Retention status values:

- active.
- eligible_for_deletion.
- deletion_pending.
- deleted.
- retained_by_exception.

Deletion status values:

- not_applicable.
- pending.
- success.
- failed.
- skipped.
- manually_deferred.

## Generated Forms

- formId.
- orderId.
- formType.
- generatedAt.
- generatedData.
- customerApproved.
- retentionCategory.
- retentionEligibleAt.
- retentionStatus.

Form type values:

- florida_articles_of_organization.
- irs_ss4.

## Protocol

Format shown in prototype:

- `AUS-2026-XXXX`

Production protocol format should be deterministic and collision-resistant.

## Onboarding State

This model is a planning layer from P8-T04. It is not implemented as a database schema yet.

Candidate state values:

- service_discovery.
- applicant_identity.
- entity_profile.
- ownership_structure.
- principal_address.
- registered_agent_selection.
- tax_setup.
- document_collection.
- document_review.
- customer_review.
- form_preview.
- customer_approval.
- order_received.
- internal_review.
- missing_information.
- agency_submission.
- completed.
- blocked.

Potential future fields:

- onboardingState.
- currentStepId.
- completedStates.
- lastCustomerActionAt.
- resumeTokenHash.
- resumeExpiresAt.
- customerCorrectionRequestedAt.
- customerCorrectionReason.
- aiAssistanceUsed.
- aiSummary.

Planning constraints:

- Onboarding state is not the same as order status, but the two must map cleanly.
- AI summaries or suggestions must not replace customer-reviewed structured data.
- Resume tokens or customer accounts require a separate security decision before implementation.
- Sensitive document data must remain governed by document retention and access-control decisions.

## Audit Event

This model is a P8-T08 planning layer. It is not implemented as a database schema yet.

Purpose:

- Preserve operational history for sensitive actions without retaining sensitive file contents indefinitely.

Candidate fields:

- auditEventId.
- orderId.
- documentId.
- actorId.
- actorEmail.
- actorType.
- eventType.
- eventSource.
- result.
- reason.
- metadata.
- errorMessage.
- createdAt.

Actor type values:

- admin.
- system.
- automation.

Event source values:

- admin_portal.
- api_route.
- vercel_cron.
- manual_sop.

Event type values:

- document_signed_url_created.
- document_open_intent.
- document_download_intent.
- document_marked_eligible_for_deletion.
- document_deletion_attempted.
- document_deleted.
- document_deletion_failed.
- order_status_updated.
- admin_login.
- admin_logout.

Result values:

- success.
- failed.
- skipped.
- manually_deferred.

Planning constraints:

- Audit events should not store raw file contents.
- Audit metadata may include storage bucket, path hash, document type, status transition, and non-sensitive operational context.
- First implementation should prioritize retention/deletion events and order status update events.

## Retention Implementation Planning

This model is a P8-T08 planning layer. It is not implemented yet.

Recommended first fields for existing `documents` records:

- `retention_category`: default `sensitive_upload`.
- `retention_eligible_at`: calculated from order completion or cancellation date plus 90 days.
- `retention_status`: starts as `active`.
- `deletion_status`: starts as `not_applicable` or `pending` when eligible.
- `deleted_at`.
- `deleted_by`.
- `deletion_reason`.
- `deletion_audit_id`.

Recommended first audit table:

- `audit_events`.

First implementation should not physically delete files until:

- Retention metadata exists.
- Admin can see retention status.
- Deletion audit events can be recorded.
- Manual SOP or automation trigger is confirmed.
