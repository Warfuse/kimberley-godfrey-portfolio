import { createCase, transition, caseSummary, samples } from "./case-model.mjs";
const $ = (s) => document.querySelector(s);
let state = createCase(),
  view = "member",
  composer = null,
  chosen = null,
  reviewChoice = null,
  error = "",
  opener;
const panel = $("#case-view");
const labels = [
  "Request received",
  "Confirm details",
  "Prepare quotation",
  "Next steps ready",
];
function sidebar(info) {
  return `<aside class="case-sidebar" aria-label="Request progress"><div class="member-identity"><strong>${info.member}</strong><span>Fictional scheme member</span></div><ol class="progress">${labels.map((label, i) => `<li class="${i < info.step ? "done" : i === info.step ? "current" : ""}" ${i === info.step ? 'aria-current="step"' : ""}>${label}</li>`).join("")}</ol><div class="sidebar-context"><strong>One shared case</strong>${info.reference}<br>Retirement quotation request<br>Example Pension Scheme</div></aside>`;
}
function history(info) {
  return `<h4 class="history-title">Your request history</h4><ol class="history">${[
    ...info.events,
  ]
    .reverse()
    .map(
      (event) =>
        `<li><div><strong>${event.title}</strong><p>${event.detail}</p></div></li>`,
    )
    .join("")}</ol>`;
}
function status(info) {
  return `<span class="status-pill ${info.tone}">${view === "admin" ? info.admin : info.label}</span>`;
}
function errorMessage() {
  return error
    ? `<div class="error" id="form-error" tabindex="-1"><strong>Check this step.</strong> ${error}</div>`
    : "";
}
function memberComposer() {
  if (composer === "choose")
    return `<section class="composer" aria-labelledby="compose-title"><p class="eyebrow">YOUR TASK / 1 OF 2</p><h4 id="compose-title" tabindex="-1">Choose a sample document.</h4><p>Try this step with one of the supplied examples. No files leave your device because no real document is selected or uploaded.</p>${errorMessage()}<form id="sample-form" novalidate><fieldset ${error ? 'aria-describedby="form-error"' : ""}><legend>Which sample would you like to use?</legend>${Object.entries(
      samples,
    )
      .map(
        ([key, sample]) =>
          `<label class="sample-option"><input type="radio" name="sample" value="${key}" ${chosen === key ? "checked" : ""}><span><strong>${sample.name}</strong><small>${sample.description}</small></span></label>`,
      )
      .join(
        "",
      )}</fieldset><div class="composer-actions"><button class="button primary" type="submit">Review sample <span aria-hidden="true">→</span></button><button class="button secondary" type="button" data-action="cancel">Cancel</button></div></form></section>`;
  return `<section class="composer" aria-labelledby="compose-title"><p class="eyebrow">YOUR TASK / 2 OF 2</p><h4 id="compose-title" tabindex="-1">Check before you send.</h4><p>This sample will be attached to the fictional request.</p><dl class="review-detail"><div><dt>Member</dt><dd>Alex Morgan · fictional person</dd></div><div><dt>Document</dt><dd>${samples[chosen].name}</dd></div><div><dt>Sent to</dt><dd>Example administration team · demo only</dd></div></dl><p class="fixture-callout">This is a supplied sample. It contains no real member information and nothing is sent to XPS.</p><div class="composer-actions"><button class="button primary" data-action="submit">Send sample to the team <span aria-hidden="true">→</span></button><button class="button secondary" data-action="choose">Change sample</button></div></section>`;
}
function member(info) {
  return `<div class="case-heading"><div><h3 id="view-heading" tabindex="-1">Your retirement request</h3><p>A clear next step, with a record of what happens.</p></div>${status(info)}</div>${composer ? memberComposer() : `<section class="task-card">${state.stage === "preparing" || state.stage === "ready" ? '<span class="confirmation-mark" aria-hidden="true">✓</span>' : ""}<div class="task-meta"><span class="eyebrow">${info.owner === "You" ? "YOUR NEXT STEP" : "NO ACTION NEEDED FROM YOU"}</span><span class="owner">Who acts next: <strong>${info.owner}</strong></span></div><h4>${info.memberTitle}</h4><p>${info.memberText}</p>${info.returned ? '<div class="return-note">The team could not read the previous sample. Try the clear sample instead. Your request is still open.</div>' : ""}<button class="button primary" data-action="${state.stage === "needs_document" ? "choose" : state.stage === "ready" ? "update" : "switch-admin"}">${info.next} <span aria-hidden="true">↗</span></button></section>`}<div class="info-row"><div><h4>What happens next?</h4><p>${info.help}</p></div><div><h4>Prefer some help?</h4><p>You can ask your scheme’s team to explain the task or discuss another way to provide information.</p></div></div>${history(info)}`;
}
function admin(info) {
  let action;
  if (state.stage === "needs_document")
    action = `<div class="task-card"><p class="eyebrow">WAITING FOR THE MEMBER</p><h4>The request stays open.</h4><p>${info.returned ? "A clearer sample has been requested. The member can see what needs to change." : "The member needs to provide the sample address confirmation before this example can move forward."}</p><button class="button primary" data-action="switch-member">See the member’s task ↗</button></div>`;
  else if (state.stage === "under_review")
    action = `<section class="composer"><p class="eyebrow">YOUR REVIEW / SAMPLE INFORMATION</p><h4 id="review-title">Check the supplied sample.</h4><dl class="review-detail"><div><dt>Document</dt><dd>${info.sample.name}</dd></div><div><dt>Fixture check</dt><dd>${info.sample.readable ? "Clear sample · details match this fictional case" : "Unreadable sample · a clearer copy is needed"}</dd></div></dl><p class="fixture-callout">This is a predefined fixture, not an automated document or identity check.</p>${errorMessage()}<form id="admin-form" novalidate><fieldset style="border:0;padding:0;margin:0" ${error ? 'aria-describedby="form-error"' : ""}><legend class="admin-legend">How should this case continue?</legend><label class="admin-choice"><input type="radio" name="decision" value="accept" ${reviewChoice === "accept" ? "checked" : ""}>Confirm the sample address check</label><label class="admin-choice"><input type="radio" name="decision" value="return" ${reviewChoice === "return" ? "checked" : ""}>Request a clearer sample</label></fieldset><div class="composer-actions"><button type="submit" class="button primary">Update the request <span aria-hidden="true">→</span></button></div></form></section>`;
  else if (state.stage === "preparing")
    action = `<section class="task-card"><span class="confirmation-mark" aria-hidden="true">✓</span><p class="eyebrow">ADDRESS CHECK COMPLETE</p><h4>The member’s task is complete.</h4><p>The member can now see that the team is preparing the quotation. In this demo, you can also advance to a final sample update. No benefit calculation is performed.</p><button class="button primary" data-action="ready">Mark sample update ready →</button><button class="button secondary" data-action="switch-member">See the member’s update ↗</button></section>`;
  else
    action = `<section class="task-card"><span class="confirmation-mark" aria-hidden="true">✓</span><p class="eyebrow">DEMO COMPLETE</p><h4>The sample update is available.</h4><p>Both perspectives show the same completed case. The member can open and save the fictional next-step summary.</p><button class="button primary" data-action="switch-member">See what the member sees ↗</button></section>`;
  return `<div class="admin-bar"><strong>Case review</strong><span>1 fictional case · shared member history</span></div><div class="case-heading"><div><h3 id="view-heading" tabindex="-1">${info.member} <span style="font-size:12px;font-weight:400;letter-spacing:0">/ ${info.reference}</span></h3><p>Retirement quotation request · Example Pension Scheme</p></div>${status(info)}</div>${action}${history(info)}`;
}
function guide() {
  const states = {
    needs_document: [
      "01",
      state.returned
        ? "Try the corrected sample."
        : "Start with the member’s next step.",
      state.returned
        ? "Choose the clear sample, send it and return to the review."
        : "As the member, select a sample and review it before sending.",
    ],
    under_review: [
      "02",
      "Now review the same case.",
      "Switch to Administrator. Check the sample and choose how to continue.",
    ],
    preparing: [
      "03",
      "See the handoff from the member’s side.",
      "Switch to Member to see the updated explanation. The team now acts next.",
    ],
    ready: [
      "✓",
      "The same case, explained on both sides.",
      "Open the member’s sample update, or restart to explore another route.",
    ],
  };
  const [index, heading, text] = states[state.stage];
  $("#guide-index").textContent = index;
  $("#guide-title").textContent = heading;
  $("#guide-text").textContent = text;
}
function render(focus) {
  const info = caseSummary(state);
  panel.setAttribute("aria-labelledby", `${view}-tab`);
  panel.innerHTML = `<div class="case-layout">${sidebar(info)}<div class="case-main">${view === "member" ? member(info) : admin(info)}</div></div>`;
  document.querySelectorAll("[data-view]").forEach((tab) => {
    const selected = tab.dataset.view === view;
    tab.setAttribute("aria-selected", String(selected));
    tab.tabIndex = selected ? 0 : -1;
  });
  $("#admin-count").hidden = state.stage !== "under_review";
  guide();
  if (focus)
    requestAnimationFrame(() => $(focus)?.focus({ preventScroll: true }));
}
function announce(text) {
  $("#announcer").textContent = text;
}
function setView(next, focus = true) {
  view = next;
  composer = null;
  error = "";
  reviewChoice = null;
  render(focus ? "#view-heading" : null);
  announce(
    `${next === "member" ? "Member" : "Administrator"} view. ${caseSummary(state).label}.`,
  );
}
function apply(action) {
  try {
    state = transition(state, action);
    error = "";
    composer = null;
    chosen = null;
    reviewChoice = null;
    render("#view-heading");
    announce(
      `${caseSummary(state).label}. Who acts next: ${caseSummary(state).owner}.`,
    );
  } catch (e) {
    error = e.message;
    render("#form-error");
  }
}
document.querySelectorAll("[data-view]").forEach((tab) => {
  tab.onclick = () => setView(tab.dataset.view);
  tab.onkeydown = (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    event.preventDefault();
    const next =
      event.key === "Home"
        ? "member"
        : event.key === "End"
          ? "admin"
          : view === "member"
            ? "admin"
            : "member";
    setView(next, false);
    $(`#${next}-tab`).focus();
  };
});
panel.addEventListener("change", (event) => {
  if (event.target.name === "sample")
    chosen = Object.hasOwn(samples, event.target.value)
      ? event.target.value
      : null;
  if (event.target.name === "decision")
    reviewChoice = ["accept", "return"].includes(event.target.value)
      ? event.target.value
      : null;
});
panel.addEventListener("submit", (event) => {
  event.preventDefault();
  if (event.target.id === "sample-form") {
    if (!chosen) {
      error = "Choose one of the sample documents to continue.";
      render("#form-error");
    } else {
      composer = "review";
      error = "";
      render("#compose-title");
    }
  }
  if (event.target.id === "admin-form") {
    if (!reviewChoice) {
      error =
        "Choose whether to confirm the check or request a clearer sample.";
      render("#form-error");
    } else apply({ type: reviewChoice === "accept" ? "ACCEPT" : "RETURN" });
  }
});
panel.addEventListener("click", (event) => {
  const action = event.target.closest("[data-action]")?.dataset.action;
  if (action === "choose") {
    composer = "choose";
    error = "";
    render("#compose-title");
  }
  if (action === "cancel") {
    composer = null;
    error = "";
    chosen = null;
    render("#view-heading");
  }
  if (action === "submit") apply({ type: "SUBMIT", sample: chosen });
  if (action === "ready") apply({ type: "READY" });
  if (action === "switch-admin") setView("admin");
  if (action === "switch-member") setView("member");
  if (action === "update") {
    $("#update-content").innerHTML =
      `<p><strong>Alex Morgan · DEMO-1042</strong></p><p>Your sample request has been reviewed. The sample address check is complete and this demo has reached its final next-step update.</p>${history(caseSummary(state))}`;
    openDialog("update-dialog", event.target.closest("button"));
  }
});
$("#reset").onclick = () => {
  state = createCase();
  chosen = null;
  reviewChoice = null;
  composer = null;
  error = "";
  view = "member";
  render();
  $("#member-tab").focus();
  announce("Demo restarted. The member needs to confirm their sample address.");
};
function openDialog(id, button) {
  opener = button;
  $(`#${id}`).showModal();
}
$("#help-open").onclick = (event) =>
  openDialog("help-dialog", event.currentTarget);
document
  .querySelectorAll("[data-close]")
  .forEach(
    (button) => (button.onclick = () => $(`#${button.dataset.close}`).close()),
  );
document
  .querySelectorAll("dialog")
  .forEach((dialog) => dialog.addEventListener("close", () => opener?.focus()));
$("#download-update").onclick = () => {
  const content = `INDEPENDENT XPS PORTFOLIO CONCEPT\nFICTIONAL CASE / NOT A PENSION QUOTATION\n\nAlex Morgan — DEMO-1042\n\n${state.events.map((event) => `${event.title}\n${event.detail}`).join("\n\n")}\n\nNo benefit amounts, eligibility decision or financial advice. Nothing has been sent to XPS.`;
  const url = URL.createObjectURL(new Blob([content], { type: "text/plain" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = "fictional-retirement-request-update.txt";
  link.click();
  URL.revokeObjectURL(url);
  announce("Fictional sample update downloaded.");
};
const motionPreference = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = motionPreference.matches;
function motion() {
  document.documentElement.classList.toggle("reduced", reduced);
  $("#motion").setAttribute("aria-pressed", String(reduced));
  $("#motion").textContent = reduced ? "Motion reduced" : "Reduce motion";
}
$("#motion").onclick = () => {
  reduced = !reduced;
  motion();
};
motionPreference.addEventListener("change", (event) => {
  reduced = event.matches;
  motion();
});
motion();
render();
