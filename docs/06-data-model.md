# 06 Data Model

This document defines product-level data, not final database schema.

## Order

- orderId.
- protocolNumber.
- serviceType.
- status.
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
- managementType.
- memberCount.

Initial state:

- Florida.

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

Document type values:

- passport.
- us_address_proof.

Extraction status values:

- not_started.
- processing.
- extracted.
- failed.
- manually_corrected.

## Generated Forms

- formId.
- orderId.
- formType.
- generatedAt.
- generatedData.
- customerApproved.

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
