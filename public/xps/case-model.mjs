/** One case model drives both perspectives. No personal data or browser storage. */
export const samples = Object.freeze({
  clear: {
    name: "Address confirmation — SAMPLE.pdf",
    description: "Clear sample · details match the fictional case",
    readable: true,
  },
  unclear: {
    name: "Address confirmation — UNCLEAR SAMPLE.pdf",
    description: "Unreadable sample · explore the return-for-information route",
    readable: false,
  },
});
export const stages = Object.freeze({
  needs_document: {
    label: "We need one more item",
    owner: "You",
    tone: "action",
    step: 1,
    memberTitle: "Confirm your address.",
    memberText:
      "Before we prepare your quotation, we need to check the address on this example request. Use a sample document to try this step.",
    next: "Add a sample document",
    admin: "Waiting for the member",
    help: "After you send the sample, the team checks it before preparing your quotation.",
  },
  under_review: {
    label: "Your sample is with the team",
    owner: "Administration team",
    tone: "review",
    step: 1,
    memberTitle: "You’ve sent what we need.",
    memberText:
      "Your sample document has been received. The team will check it next. You do not need to send it again.",
    next: "Review in Administrator view",
    admin: "A sample is ready to review",
    help: "The team checks the sample before confirming that this step is complete.",
  },
  preparing: {
    label: "We’re preparing your quotation",
    owner: "Administration team",
    tone: "review",
    step: 2,
    memberTitle: "Your address check is complete.",
    memberText:
      "Your sample document has been accepted. The next step is to prepare your quotation. You do not need to do anything now.",
    next: "Continue the administrator preview",
    admin: "Address confirmed · prepare quotation",
    help: "A real quotation would depend on scheme rules, checks and calculations. This example does not calculate benefits.",
  },
  ready: {
    label: "Your sample update is ready",
    owner: "You",
    tone: "complete",
    step: 3,
    memberTitle: "You can review the next steps.",
    memberText:
      "The sample request has reached its final demo step. Open the example update to see a clear record of what happened. This is not a pension quotation.",
    next: "Open the sample update",
    admin: "Sample case completed",
    help: "The demo update contains no benefit amounts or financial recommendation.",
  },
});
export function createCase() {
  return {
    stage: "needs_document",
    sample: null,
    returned: false,
    revision: 0,
    events: [
      { title: "Request received", detail: "12 November · fictional example" },
      {
        title: "Address confirmation requested",
        detail: "A sample task for this prototype",
      },
    ],
  };
}
export function transition(state, action) {
  if (!Object.hasOwn(stages, state.stage))
    throw new Error("Unsupported case state.");
  const result = structuredClone(state);
  let event;
  if (
    action.type === "SUBMIT" &&
    state.stage === "needs_document" &&
    Object.hasOwn(samples, action.sample)
  ) {
    result.sample = action.sample;
    result.stage = "under_review";
    result.returned = false;
    event = ["Sample document received", "The administration team acts next."];
  } else if (action.type === "RETURN" && state.stage === "under_review") {
    result.stage = "needs_document";
    result.sample = null;
    result.returned = true;
    event = [
      "A clearer sample requested",
      "The previous sample could not be read. The request stays open.",
    ];
  } else if (
    action.type === "ACCEPT" &&
    state.stage === "under_review" &&
    samples[state.sample]?.readable
  ) {
    result.stage = "preparing";
    event = [
      "Address check completed",
      "The sample is accepted. The team prepares the next step.",
    ];
  } else if (action.type === "READY" && state.stage === "preparing") {
    result.stage = "ready";
    event = [
      "Sample update ready",
      "The member can review the example update.",
    ];
  } else
    throw new Error(
      action.type === "ACCEPT" && state.stage === "under_review"
        ? "This sample is marked unreadable. Request a clearer sample instead."
        : "Complete the current step before continuing.",
    );
  result.revision++;
  result.events.push({ title: event[0], detail: event[1] });
  return result;
}
export function caseSummary(state) {
  const info = stages[state.stage];
  if (!info) throw new Error("Unsupported case state.");
  return {
    ...info,
    reference: "DEMO-1042",
    member: "Alex Morgan",
    scheme: "Example Pension Scheme",
    sample: state.sample ? samples[state.sample] : null,
    returned: state.returned,
    events: state.events,
  };
}
