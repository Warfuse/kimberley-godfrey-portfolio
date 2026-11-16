# My XPS retirement-request exploration

## My task

I designed a small, connected prototype to show how I would approach a pension member's task and the administration team's handoff. I focused on a retirement quotation request, not an entire pension portal.

My intended reviewer is an XPS hiring manager. In about 90 seconds they should be able to understand my proposed problem, complete a task, switch perspective and see the consequence of the administrator's action.

## My problem hypothesis

A member needs to know whether a request has been received, what is needed from them and who acts next. An administrator needs an understandable case, a review action and a consistent member-facing explanation. I have not established that XPS's current platforms lack these features.

## My prototype scope

- One fictional person, Alex Morgan, and one Example Pension Scheme request.
- A sample address-confirmation task with review before submission.
- Two supplied sample fixtures: clear and unreadable. No file picker, actual document, personal data input or upload.
- Administrator review: confirm the sample check or request a clearer sample.
- A member update driven by the same case model.
- An optional final sample update and a downloadable fictional text summary, not a quotation.
- Help, reset, keyboard navigation and reduced motion.

The address-check requirement, statuses and review rules are hypotheses for this demo. They are not XPS policy, identity verification, a service-level promise or evidence of its actual workflow. I perform no benefit calculations, eligibility decisions, real submissions or notifications.

## My acceptance criteria

1. I can complete the member → administrator → member loop with a keyboard.
2. Each state explains what happened and who acts next.
3. I cannot bypass review or accept a fixture marked unreadable.
4. I can return an unreadable sample, replace it and continue the same case.
5. Member and administrator views show the same state and event history.
6. A member can find help without completing the digital task.
7. At mobile widths, controls remain labelled, readable and within the viewport.
8. No personal data, file, provider key, API request or persistent browser storage is needed.

## My approach

I keep this brief, the shared design reference, source references, decisions and checks in Git beside the implementation. I used AI coding assistance to implement and iterate on the local prototype. My portfolio explanation distinguishes this exploration from my original client work and from a researched or validated XPS service.
