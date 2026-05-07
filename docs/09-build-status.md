# 09 Build Status

## Current Phase

Phase 6: Order Submission Workflow.

Phase 5 is complete. P6-T02 is complete. The next step is the Supabase persistence boundary task.

## Last Completed Task

Task ID: `P6-T02`

Title: Implement local submission confirmation and internal order payload shell.

Result:

- Non-submitting confirmation step added after local approval.
- Approved local intake state converts into a structured internal order payload object in client state.
- Local protocol placeholder is generated with the `AUS-YYYY-XXXX` shell format.
- Confirmation screen shows selected service, LLC name, local approved status, protocol, and AbreUSA review timeline.
- EIN payload fields appear only for Complete Package.
- Confirmation language states AbreUSA must review before any government submission.
- No backend calls, persistence, storage, real email, payment, or agency submission were introduced.
- `npm run lint` passes.
- `npm run build` passes.
- Browser verification passed for Complete Package and Florida LLC paths through confirmation.

## Current Task

None. P6-T02 is complete.

## Next Task

Task ID: `P6-T03`

Title: Plan or implement Supabase persistence boundary.

Status: Awaiting execution.

Scope:

- Review the verified local order payload shell from P6-T02.
- Decide the minimum Supabase persistence boundary for approved orders.
- Confirm whether applicant email and phone must be collected before persistence.
- Confirm document storage/security requirements that block or shape persistence.
- Decide whether P6-T03 is implementation or additional planning based on unresolved document retention and reviewer access decisions.
- Keep real agency submission, payment, and real email delivery out of scope unless the App Spine is updated.

Acceptance criteria:

- Persistence boundary is documented or implemented according to available decisions.
- Applicant contact requirements are resolved or explicitly blocked.
- Document storage/security dependencies are documented.
- Out-of-scope items remain explicit.
- `/docs/07-roadmap.md`, `/docs/09-build-status.md`, and `/progress/index.html` are updated after the task.

## Completed Tasks

- App Spine approved as official source of truth.
- Phase 1 Architecture Plan documented and approved.
- Phase 2 shell and all UI primitives implemented and closed.
- Phase 3 complete: P3-T01 through P3-T10 all closed.
  - Service selection, LLC name validation, business activity, member count, member data, business address, Registered Agent, and EIN questions all implemented in local state.
  - Phase 3 exit criteria passed: all navigation, branching, and validation verified.
- Phase 4 planning complete: P4-T01 closed.
  - First document collection implementation slice defined.
  - Local-only upload scope and placeholder/manual extraction confirmed for P4-T02.
- Phase 4 implementation complete: P4-T02 closed after lint/build verification.
  - Document collection added for Complete Package and Florida LLC paths.
  - Local file capture and manual extraction review implemented.
- Phase 4 browser verification complete: P4-T02V closed.
  - Complete Package and Florida LLC paths verified through document collection.
  - File attachment gate and manual extraction field editability verified.
- Phase 5 planning complete: P5-T01 closed.
  - First review and generated preview implementation slice defined.
  - Review screen data boundaries and generated preview scope documented.
- Phase 5 implementation complete: P5-T02 closed.
  - Local review screen and generated preview shells implemented.
  - Complete Package and Florida LLC paths verified through review.
- Phase 5 approval gate complete: P5-T03 closed.
  - Complete Package and Florida LLC paths verified through approval gate.
- Phase 6 planning complete: P6-T01 closed.
  - Local submission confirmation slice, order payload boundary, protocol/status assumptions, and persistence decision documented.
- Phase 6 local confirmation complete: P6-T02 closed.
  - Complete Package and Florida LLC paths verified through confirmation/protocol shell.
  - Local order payload shell verified, including EIN payload only for Complete Package.

## What Is Implemented

- Full guided intake for Complete Package path (steps 1–11) in local client state:
  - Service selection.
  - LLC name entry with suffix validation.
  - Business activity selection with custom "Other" entry.
  - Member count selection (1–10) with Single/Multi-Member context.
  - Member data entry per member (name, address, ownership percentage); gated on 100% total.
  - Business address entry (street, city, state FL, ZIP); gated on required fields.
  - Registered Agent selection (AbreUSA, self, other); branching to EIN for Complete Package.
  - EIN questions (reason, entity type, responsible party name and passport, start date, fiscal month).
- Document collection for passport and U.S. address proof in local client state.
- Editable placeholder/manual extraction review fields for passport and address proof targets.
- Local review screen from captured intake and document state.
- Florida Articles of Organization preview shell for Complete Package and Florida LLC.
- IRS Form SS-4 preview shell for Complete Package only.
- Local approval gate with explicit confirmation checkbox.
- Local confirmation/protocol shell after approval.
- Internal order payload object in client state for approved local orders.
- Florida LLC path implemented through review and local approval.
- Progress header and sidebar reflect 12-step flow.
- All state resets correctly when user returns to service selection.
- `/progress/index.html` available as stakeholder dashboard.

## What Is NOT Implemented

- Supabase persistence for approved orders.
- Production protocol generation with collision resistance.
- EIN-only and Registered Agent-only flows (deferred, Post-MVP).
- Supabase schema/storage implementation.
- Production document retention and reviewer access decisions.
- GitHub Pages must still be enabled in GitHub settings after the repo is pushed.

## Exact Next Step To Resume

Execute one task only:

`P6-T03: Plan or implement Supabase persistence boundary`

Deliverable:

- Review the verified local order payload shell.
- Decide the minimum persistence boundary and whether this task can implement it now.
- Resolve or explicitly block applicant contact, document storage, retention, and reviewer access prerequisites.
- Keep real agency submission, payment, and real email delivery out of scope unless confirmed.

## Blockers And Risks

- EIN-only flow remains deferred and must not be implemented yet.
- Registered Agent-only flow remains deferred and must not be implemented yet.
- Supabase is planned but deferred for the first Phase 4 implementation slice.
- Supabase is also deferred for P6-T02; persistence starts after the local order payload boundary is verified.
- Document retention and reviewer access rules remain unresolved before production storage.
- Default PATH in this shell does not include Node/npm; project commands run with `PATH=/usr/local/opt/node@22/bin:$PATH`.
- GitHub Pages still needs to be enabled in GitHub settings after pushing.
