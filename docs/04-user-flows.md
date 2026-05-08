# 04 User Flows

## Primary Flow: Complete Package

Service: Florida LLC + EIN.

1. Customer lands on AbreUSA intelligent form.
2. Customer starts the guided flow.
3. Customer selects Complete Package.
4. Customer enters LLC name and optional alternatives.
5. System validates that the name uses an LLC-compatible suffix.
6. Customer selects business activity.
7. Customer selects number of members.
8. Customer enters each member's name, address, and ownership percentage.
9. Customer enters Florida principal office address.
10. Customer selects Registered Agent option.
11. Customer answers EIN/IRS SS-4 questions.
12. Customer uploads passport.
13. Customer uploads U.S. address proof.
14. System extracts document data and shows extracted fields.
15. Customer reviews LLC, EIN, applicant, and document data.
16. System generates Florida Articles of Organization preview.
17. System generates IRS SS-4 preview.
18. Customer approves order for AbreUSA submission.
19. System shows protocol number and next-step timeline.

## Flow: Florida LLC Only

1. Customer selects Florida LLC.
2. Customer completes LLC name, business activity, members, address, and Registered Agent steps.
3. Customer uploads required documents.
4. Customer reviews data.
5. System generates Florida Articles of Organization preview.
6. Customer approves order.
7. System shows protocol number.

EIN-specific review and SS-4 generation are hidden unless EIN is included.

## Flow: EIN Only

Status: Deferred. Post-MVP or Decision Needed.

1. Customer selects EIN Number.
2. Customer skips LLC formation steps that are not needed.
3. Customer answers EIN/IRS SS-4 questions.
4. Customer uploads required identity and address documents.
5. Customer reviews responsible party and entity data.
6. System generates IRS SS-4 preview.
7. Customer approves order.
8. System shows protocol number.

The exact EIN-only input requirements must be confirmed during architecture planning because the customer may already have an LLC.

## Flow: Registered Agent Only

Status: Deferred. Post-MVP or Decision Needed.

1. Customer selects Registered Agent.
2. Customer provides required business/contact information.
3. Customer reviews service request.
4. Customer approves order.
5. System shows protocol number.

The current prototype branches this service through LLC-style steps. Production implementation should clarify the minimal RA-only intake before execution.

## Core Flow

1. Welcome and value statement.
2. Service selection.
3. LLC name entry and validation.
4. Business activity selection.
5. Member count selection.
6. Member data collection.
7. Principal Florida business address collection.
8. Registered Agent selection.
9. EIN and IRS SS-4 questions when service includes EIN.
10. Document upload.
11. AI-assisted document extraction.
12. Customer review.
13. Generated Florida Articles of Organization and IRS SS-4 previews.
14. Customer approval.
15. Submission confirmation with protocol number.

## Onboarding Architecture Discovery

Status: P8-T04 complete as documentation-only planning.

The current production baseline remains the guided 13-step intake for Complete Package and Florida LLC paths. Future onboarding evolution must preserve the current compliance-sensitive review and approval gates unless the App Spine is updated.

## Candidate State-Based Onboarding Model

The current linear flow can be mapped into these candidate onboarding states:

1. `service_discovery`:
   - Customer chooses Complete Package or Florida LLC.
   - Future conversational onboarding may help the customer understand which service fits.
2. `applicant_identity`:
   - Customer provides applicant name, email, and phone.
   - Future progressive onboarding may use this state as the earliest resume/contact anchor.
3. `entity_profile`:
   - Customer enters LLC name and business activity.
4. `ownership_structure`:
   - Customer selects member count and enters member data.
5. `principal_address`:
   - Customer enters the Florida principal business address.
6. `registered_agent_selection`:
   - Customer selects AbreUSA, self, or other Registered Agent.
7. `tax_setup`:
   - Complete Package only.
   - Customer answers EIN/IRS SS-4 questions.
8. `document_collection`:
   - Customer uploads passport and U.S. address proof.
9. `document_review`:
   - Customer reviews extracted or manually entered document fields.
10. `customer_review`:
    - Customer reviews all intake, document, and service data.
11. `form_preview`:
    - System shows Florida Articles preview and IRS SS-4 preview when EIN is included.
12. `customer_approval`:
    - Customer explicitly approves the reviewed data for AbreUSA review.
13. `order_received`:
    - System persists the order and shows protocol number.
14. `internal_review`:
    - AbreUSA reviews the order in the admin portal.
15. `missing_information`:
    - Future state for orders that require customer correction or extra documents.
16. `agency_submission`:
    - Future state for AbreUSA action after internal review.
17. `completed` or `blocked`:
    - Final operational states.

## Conversational Onboarding Options

Recommended low-risk roles:

- Explain confusing fields without changing the underlying guided flow.
- Help the customer choose between Complete Package and Florida LLC.
- Explain document requirements.
- Help summarize review issues before approval.

Higher-risk roles that require Decision Gate resolution:

- Replacing the guided flow with a chat-first intake.
- Making legal, tax, or service eligibility recommendations.
- Auto-filling sensitive fields without explicit customer review.
- Moving the customer across approval or submission gates automatically.

## AI-Guided Onboarding Options

Recommended low-risk roles:

- Plain-language guidance in Portuguese.
- Field completeness checks.
- Non-final document extraction suggestions.
- Review summaries that require customer confirmation.

Blocked until Decision Gates are resolved:

- Autonomous legal/tax advice.
- Final service recommendation without human/customer confirmation.
- Autonomous passport or address proof interpretation without review.
- AI-driven order submission or status changes.

## Progressive Onboarding Options

Progressive onboarding is not implemented.

Potential future model:

- Save draft after applicant contact.
- Resume by secure magic link or authenticated customer account.
- Show customer progress by onboarding state, not only step number.
- Allow missing-information correction after internal review.

This requires resolving the progressive onboarding and resume Decision Gate before implementation.
