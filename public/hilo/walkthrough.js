// One inline prompt at a time; visitors can always skip or leave the walkthrough.
export function guideStage({ enabled, chosen, view, busy, hasReport, urgent }) {
  if (!enabled || urgent || busy) return null;
  if (view === "ask") return hasReport ? "ready" : "generate";
  if (view === "overview") return chosen ? "explain" : "choose";
  return null;
}
const prompts = {
  choose: {
    step: "START HERE · 1 OF 3",
    title: "Choose a history to explore.",
    copy: "Select a scenario above, or start with the overnight example.",
    target: "#scenario",
    host: ".scenario-control",
    placement: "after",
    arrow: "up",
  },
  explain: {
    step: "NEXT · 2 OF 3",
    title: "Ask Hilo to explain this pattern.",
    copy: "Use the highlighted button below to continue.",
    target: '.insight-card [data-go="ask"]',
    host: ".insight-card .inline-actions",
    placement: "before",
    arrow: "down",
  },
  generate: {
    step: "FINAL STEP · 3 OF 3",
    title: "Generate your AI summary.",
    copy: "Hilo will explain this history and suggest questions for a GP.",
    target: "#generate",
    host: ".ask-bottom",
    placement: "before",
    arrow: "down",
  },
  ready: {
    step: "SUMMARY READY",
    title: "Read the explanation below.",
    copy: "Then use “Prepare GP questions” to continue the conversation preview.",
    target: "#report",
    host: "#report",
    placement: "before",
    arrow: "down",
  },
};
export function renderGuide(state, { useHistory, dismiss }) {
  document.querySelectorAll(".guide-callout").forEach((el) => el.remove());
  document.querySelectorAll("[data-guide-target]").forEach((el) => {
    el.classList.remove("guide-target");
    el.removeAttribute("data-guide-target");
    const ids = (el.getAttribute("aria-describedby") || "")
      .split(" ")
      .filter((id) => id && id !== "guide-prompt");
    if (ids.length) el.setAttribute("aria-describedby", ids.join(" "));
    else el.removeAttribute("aria-describedby");
  });
  const stage = guideStage(state),
    toggle = document.querySelector("#guide-toggle");
  toggle.textContent = state.enabled ? "Hide walkthrough" : "Show walkthrough";
  toggle.setAttribute("aria-pressed", String(state.enabled));
  if (!stage) {
    announce("");
    return;
  }
  const p = prompts[stage],
    target = document.querySelector(p.target),
    host = document.querySelector(p.host);
  if (!target || !host) return;
  const tip = document.createElement("aside");
  tip.className = `guide-callout guide-${stage}`;
  tip.setAttribute("aria-label", "Demo walkthrough");
  const arrow = document.createElement("span");
  arrow.className = `guide-arrow guide-arrow-${p.arrow}`;
  arrow.setAttribute("aria-hidden", "true");
  arrow.innerHTML =
    p.arrow === "up"
      ? '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 50C8 24 43 34 46 7M37 14L46 5L51 16"/></svg>'
      : '<svg viewBox="0 0 56 56" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6C8 32 43 22 46 49M37 42L46 51L51 40"/></svg>';
  tip.append(arrow);
  const text = document.createElement("div");
  text.className = "guide-copy";
  const step = document.createElement("small");
  step.textContent = p.step;
  text.append(step);
  const title = document.createElement("b");
  title.textContent = p.title;
  text.append(title);
  const copy = document.createElement("p");
  copy.id = "guide-prompt";
  copy.textContent = p.copy;
  text.append(copy);
  tip.append(text);
  if (stage === "choose") {
    const use = document.createElement("button");
    use.className = "primary";
    use.textContent = "Use this history →";
    use.onclick = useHistory;
    tip.append(use);
  }
  const close = document.createElement("button");
  close.className = "guide-close";
  close.setAttribute("aria-label", "Dismiss walkthrough");
  close.textContent = "×";
  close.onclick = dismiss;
  tip.append(close);
  host.insertAdjacentElement(
    p.placement === "before" ? "beforebegin" : "afterend",
    tip,
  );
  // Describe controls without moving focus or preventing normal navigation.
  target.classList.add("guide-target");
  target.setAttribute("data-guide-target", "");
  target.setAttribute(
    "aria-describedby",
    [target.getAttribute("aria-describedby") || "", "guide-prompt"]
      .filter(Boolean)
      .join(" "),
  );
  announce(`${p.step}. ${p.title} ${p.copy}`);
}
function announce(text) {
  const live = document.querySelector("#guide-status");
  if (live.textContent !== text) live.textContent = text;
}
