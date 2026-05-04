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
