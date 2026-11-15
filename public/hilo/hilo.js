import { renderGuide } from "./walkthrough.js";
const $ = (s) => document.querySelector(s),
  screen = $("#screen"),
  scenarios = await fetch("scenarios.json").then((r) => r.json());
let scenario = "overnight",
  view = "overview",
  chartMode = "day",
  inspect = 3,
  question = "summary",
  report = null,
  reportMeta = null,
  busy = false,
  csrf = "",
  connected = false,
  epoch = 0,
  gpSaved = false,
  reviewed = false;
let guideEnabled = true,
  historyChosen = false;
function updateGuide() {
  renderGuide(
    {
      enabled: guideEnabled,
      chosen: historyChosen,
      view,
      busy,
      hasReport: !!report,
      urgent: s().urgent,
    },
    {
      useHistory: () => {
        historyChosen = true;
        navigate("overview");
        document
          .querySelector('.insight-card [data-go="ask"]')
          ?.focus({ preventScroll: true });
        document.querySelector(".insight-card")?.scrollIntoView({
          behavior: document.documentElement.classList.contains("reduced")
            ? "auto"
            : "smooth",
          block: "center",
        });
      },
      dismiss: () => {
        const target = document.querySelector("[data-guide-target]");
        guideEnabled = false;
        updateGuide();
        (target?.matches("button,select") ? target : $("#guide-toggle")).focus({
          preventScroll: true,
        });
      },
    },
  );
}
const prefs = {
  channel: "push",
  enabled: true,
  details: false,
  quiet: true,
  clock: "08:30",
  email: false,
  activity: false,
  movement: false,
};
const mean = (a) => {
    a = a.filter((v) => v !== null);
    return a.length ? a.reduce((x, y) => x + y, 0) / a.length : null;
  },
  num = (n) => (n === null ? "—" : Math.round(n)),
  delta = (n) => (n === null ? "—" : `${n > 0 ? "+" : ""}${n.toFixed(1)}`),
  s = () => scenarios[scenario];
function facts() {
  const recent = s().days.slice(-7),
    previous = s().days.slice(-14, -7);
  return {
    daySbp: mean(recent.map((d) => d.daySbp)),
    dayDbp: mean(recent.map((d) => d.dayDbp)),
    nightSbp: mean(recent.map((d) => d.nightSbp)),
    nightDbp: mean(recent.map((d) => d.nightDbp)),
    previous: mean(previous.map((d) => d.nightSbp)),
    nights: recent.filter((d) => d.nightSbp !== null).length,
    steps: mean(recent.map((d) => d.steps)),
    oldSteps: mean(previous.map((d) => d.steps)),
  };
}
function nightChanged() {
  const f = facts();
  return (
    f.nights >= 5 &&
    f.nightSbp !== null &&
    f.previous !== null &&
    f.nightSbp - f.previous >= 8
  );
}
function heading(title, subtitle, extra = "") {
  return `<div class="screen-heading"><div><h3>${title}</h3><p>${subtitle}</p></div>${extra}</div>`;
}
function toast(message) {
  $("#toast").textContent = message;
  setTimeout(() => ($("#toast").textContent = ""), 4000);
}
function navigate(next, focus = false) {
  if (next === "ask") historyChosen = true;
  view = next;
  document.querySelectorAll("[data-screen]").forEach((b) => {
    const on = b.dataset.screen === next;
    b.setAttribute("aria-selected", String(on));
    b.tabIndex = on ? 0 : -1;
  });
  screen.setAttribute("aria-labelledby", `nav-${next}`);
  render();
  if (focus) screen.focus({ preventScroll: true });
}
function urgentCard() {
  return `<section class="urgent-card"><p class="eyebrow">FICTIONAL SCENARIO</p><h4>Chest discomfort and breathlessness need urgent help.</h4><p>In this fictional scenario, Alex has persistent chest discomfort and shortness of breath. Someone experiencing these symptoms should call 999 for emergency help.</p><p>Do not wait for a routine update. This example is not live monitoring.</p><a href="https://www.nhs.uk/symptoms/chest-pain/" target="_blank" rel="noopener">NHS information on urgent symptoms ↗</a></section>`;
}
function overview() {
  const f = facts();
  screen.innerHTML =
    heading(
      "1. See what changed overnight.",
      "Alex’s fictional history · recent 7-day averages",
      `<span class="coverage" data-quality="${f.nights < 5 ? "limited" : "available"}">${f.nights}/7 nights with data</span>`,
    ) +
    (s().urgent ? urgentCard() : "") +
    (s().urgent ? "" : insight()) +
    `<div class="metrics"><div class="metric"><span>DAYTIME AVERAGE</span><strong>${num(f.daySbp)}/${num(f.dayDbp)}<small>mmHg</small></strong><small>Valid sample readings only</small></div><div class="metric"><span>NIGHT-TIME AVERAGE</span><strong>${num(f.nightSbp)}/${num(f.nightDbp)}<small>mmHg</small></strong><small>Diary window · ${f.nights} ${f.nights === 1 ? "night" : "nights"}</small></div><div class="metric"><span>OVERNIGHT CHANGE</span><strong>${delta(f.nights < 5 || f.nightSbp === null || f.previous === null ? null : f.nightSbp - f.previous)}<small>mmHg</small></strong><small>${f.nights < 5 ? "Coverage too limited to compare" : "Systolic · versus previous 7 days"}</small></div></div><section class="chart-card"><div class="chart-header"><h4>Your readings, in context.</h4><div class="segmented" aria-label="Chart period"><button data-chart="day" aria-pressed="${chartMode === "day"}">24 hours</button><button data-chart="month" aria-pressed="${chartMode === "month"}">4 weeks</button></div></div><div class="chart-area" id="chart"></div><div class="chart-legend"><span>Systolic</span><span>Diastolic</span>${chartMode === "day" ? "<span>Recorded sleep window</span>" : ""}</div><div class="chart-inspect"><label for="inspect">Inspect a ${chartMode === "day" ? "sample hour" : "day"}</label><input id="inspect" type="range" min="0" max="${chartMode === "day" ? 23 : 27}" step="1" value="${inspect}" aria-label="Inspect ${chartMode === "day" ? "sample hour" : "sample day"}"><output id="reading"></output></div><p class="chart-accessible">Fictional ${chartMode === "day" ? "hourly samples" : "daily daytime averages"}. Gaps remain visible; values are not interpolated.</p><details class="policy"><summary>Read the sample values as a table</summary><div id="data-table"></div></details></section><div class="policy"><details><summary>What triggered this example?</summary><p>The morning-review illustration requires at least five nights with readings and an increase of 8 mmHg or more in the recent night-time systolic average versus the previous seven days. This is a deliberately chosen demonstration rule, not a clinical threshold or validated Hilo alert policy. The sleep window is supplied by the fictional diary. Clinical interpretation and confirmation belong with a healthcare professional.</p></details></div>`;
  document.querySelectorAll("[data-chart]").forEach(
    (b) =>
      (b.onclick = () => {
        chartMode = b.dataset.chart;
        inspect = chartMode === "day" ? 3 : 27;
        overview();
      }),
  );
  $("#inspect").oninput = (e) => {
    inspect = +e.target.value;
    drawChart();
  };
  bindActions();
  drawChart();
  updateGuide();
}
function insight() {
  const f = facts();
  let title,
    copy,
    icon = "☾";
  if (f.nights < 5) {
    title = "There is not enough overnight data yet.";
    copy = `Only ${f.nights} of the last seven nights ${f.nights === 1 ? "has" : "have"} samples. A reliable overnight pattern cannot be inferred from this example. Keep the gap visible instead of filling it with a confident conclusion.`;
  } else if (nightChanged()) {
    title = "Your overnight pattern has changed.";
    copy = `The recent night-time systolic average is ${delta(f.nightSbp - f.previous)} mmHg versus the previous week. That describes a difference, not its cause. Consider bringing the trend and your sleep context to your GP.`;
  } else if (scenario === "quiet-week") {
    icon = "↗";
    title = "A quieter week needs a little context.";
    copy = prefs.activity
      ? `The simulated activity feed records fewer steps in the recent week. That can start a conversation about routine, but it does not prove why blood pressure changed.`
      : "We cannot infer movement from resting heart-rate readings. Connect the simulated activity feed to explore an optional movement reminder.";
  } else {
    icon = "◌";
    title = "A steadier pattern, with the context intact.";
    copy =
      "The sample does not meet this demo’s morning-review rule. That is not an all-clear or a clinical assessment. Keep following your existing care plan and raise concerns with your healthcare professional.";
  }
  return `<section class="insight-card"><span class="insight-icon" aria-hidden="true">${icon}</span><div><p class="eyebrow">${reviewed ? "REVIEWED / STORED IN THIS DEMO ONLY" : "A PROPOSED INSIGHT / NOT A DIAGNOSIS"}</p><h4>${title}</h4><p>${copy}</p><div class="inline-actions"><button class="primary" data-go="ask">2. Explain this with Hilo ✧</button><button class="plain" data-go="gp">Prepare GP questions ↗</button><button class="plain" id="review">${reviewed ? "Reviewed ✓" : "Mark as reviewed"}</button></div></div></section>`;
}
function drawChart() {
  const data =
    chartMode === "day"
      ? s().hourly.map((r) => ({
          label: `${String(r.hour).padStart(2, "0")}:00`,
          sbp: r.sbp,
          dbp: r.dbp,
          sleep: r.sleepWindow,
        }))
      : s().days.map((d) => ({
          label: d.date,
          sbp: d.daySbp,
          dbp: d.dayDbp,
          sleep: false,
        }));
  const W = Math.max(250, Math.min(900, $("#chart").clientWidth || 900)),
    H = 225,
    L = 38,
    R = 18,
    T = 16,
    B = 28,
    x = (i) => L + (i / (data.length - 1)) * (W - L - R),
    y = (n) => H - B - ((n - 50) / 160) * (H - T - B);
  const path = (key) => {
    let d = "",
      gap = true;
    data.forEach((p, i) => {
      if (p[key] === null) {
        gap = true;
        return;
      }
      d += `${gap ? "M" : "L"}${x(i).toFixed(1)},${y(p[key]).toFixed(1)} `;
      gap = false;
    });
    return d;
  };
  const p = data[Math.min(inspect, data.length - 1)];
  let bg = "";
  if (chartMode === "day")
    bg = `<rect x="${x(0)}" y="${T}" width="${x(7) - x(0)}" height="${H - T - B}" fill="#edf2e5"/><text x="${x(1)}" y="28" fill="#506647" font-size="10">${W < 500 ? "SLEEP WINDOW" : "RECORDED SLEEP WINDOW"}</text><rect x="${x(23) - 8}" y="${T}" width="8" height="${H - T - B}" fill="#edf2e5"/>`;
  $("#chart").innerHTML =
    `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Fictional ${chartMode === "day" ? "24-hour blood-pressure samples, with recorded sleep hours shaded" : "four-week daytime blood-pressure averages"}. Use the slider or table to inspect values.">${bg}${[60, 100, 140, 180].map((n) => `<path d="M${L} ${y(n)}H${W - R}" stroke="#dce5d4" stroke-width="1"/><text x="${L - 9}" y="${y(n) + 4}" text-anchor="end" fill="#5b7051" font-size="10">${n}</text>`).join("")}<path d="${path("sbp")}" fill="none" stroke="#0c7956" stroke-width="3" stroke-linejoin="round"/><path d="${path("dbp")}" fill="none" stroke="#6b7966" stroke-width="2" stroke-dasharray="5 5"/>${[0, Math.round((data.length - 1) / 3), Math.round(((data.length - 1) * 2) / 3), data.length - 1].map((i) => `<text x="${x(i)}" y="${H - 5}" text-anchor="middle" fill="#5e7353" font-size="10">${chartMode === "day" ? data[i].label : data[i].label.slice(5)}</text>`).join("")}<path d="M${x(inspect)} ${T}V${H - B}" stroke="#8f9e7d" stroke-dasharray="3 4"/>${p.sbp === null ? "" : `<circle cx="${x(inspect)}" cy="${y(p.sbp)}" r="5" fill="#0c7956" stroke="#fff" stroke-width="2"/>`}</svg>`;
  $("#reading").textContent =
    `${p.label} · ${p.sbp === null ? "No valid sample" : `${p.sbp}/${p.dbp} mmHg`}${p.sleep ? " · recorded sleep window" : ""}`;
  $("#data-table").innerHTML =
    `<table class="data-table"><thead><tr><th>${chartMode === "day" ? "Hour" : "Day"}</th><th>Systolic</th><th>Diastolic</th><th>Context</th></tr></thead><tbody>${data.map((d) => `<tr><td>${d.label}</td><td>${d.sbp ?? "Missing"}</td><td>${d.dbp ?? "Missing"}</td><td>${d.sleep ? "Recorded sleep" : "Fictional sample"}</td></tr>`).join("")}</tbody></table>`;
  $("#chart svg").onclick = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    inspect = Math.max(
      0,
      Math.min(
        data.length - 1,
        Math.round(
          ((((e.clientX - r.left) / r.width) * W - L) / (W - L - R)) *
            (data.length - 1),
        ),
      ),
    );
    $("#inspect").value = inspect;
    drawChart();
  };
}
const questions = {
  summary: "Summarise the pattern",
  gp: "Help me prepare for my GP",
  lifestyle: "Explore everyday habits",
};
function urgentView() {
  screen.innerHTML =
    heading(
      "Get help now.",
      "Fictional scenario · chest discomfort and breathlessness",
    ) +
    urgentCard() +
    `<button class="primary" id="return-example">Return to the overnight example →</button>`;
  $("#return-example").onclick = () => {
    scenario = "overnight";
    $("#scenario").value = scenario;
    report = null;
    epoch++;
    navigate("overview", true);
  };
}
function ask() {
  if (s().urgent) {
    urgentView();
    return;
  }
  screen.innerHTML =
    heading(
      "2. Ask Hilo to explain it.",
      "Understand the pattern. Decide what to discuss.",
    ) +
    `<section class="ask-intro"><h4>“Help me understand my recent readings.”</h4><p>Get a short explanation of what changed, what remains uncertain and questions you could take to your GP.</p></section><div class="ask-bottom"><button class="button primary" id="generate" ${busy ? "disabled" : ""}>${busy ? "Preparing your summary…" : "✧ Summarise my readings"}</button><small>AI-generated from this fictional history.<br>For understanding, not diagnosis.</small></div><details class="optional-context"><summary>Tailor the summary</summary><div class="ask-options" aria-label="Summary focus">${Object.entries(
      questions,
    )
      .map(
        ([k, v]) =>
          `<button data-question="${k}" aria-pressed="${question === k}">${v}</button>`,
      )
      .join(
        "",
      )}</div>${activityConsent()}</details><p class="status-message" id="ai-status" role="status" hidden></p><button class="plain sample-summary" id="example">View a sample summary</button><div id="report" class="report-panel"></div>`;
  document.querySelectorAll("[data-question]").forEach(
    (b) =>
      (b.onclick = () => {
        question = b.dataset.question;
        report = null;
        epoch++;
        ask();
        $(".optional-context").open = true;
        document.querySelector(`[data-question="${question}"]`).focus();
      }),
  );
  $("#activity-feed").onchange = (e) => {
    prefs.activity = e.target.checked;
    report = null;
    epoch++;
    ask();
    $(".optional-context").open = true;
    $("#activity-feed").focus();
  };
  $("#generate").onclick = generate;
  $("#example").onclick = showExample;
  if (report) renderReport();
  updateGuide();
}
function activityConsent() {
  return `<div class="data-consent"><input id="activity-feed" type="checkbox" ${prefs.activity ? "checked" : ""}><label for="activity-feed">Include a simulated connected activity feed<small>${prefs.activity ? `Recent daily steps: ${num(facts().steps).toLocaleString()} versus ${num(facts().oldSteps).toLocaleString()} in the previous week. ` : ""}This is fictional movement context, not activity inferred from resting heart rate.</small></label></div>`;
}
async function checkConnection() {
  try {
    const r = await fetch("/api/status", { cache: "no-store" });
    if (!r.ok) throw new Error();
    const d = await r.json();
    csrf = d.csrf;
    connected = d.connected;
  } catch {
    connected = false;
  }
}
async function generate() {
  if (s().urgent || busy) return;
  busy = true;
  updateGuide();
  const requestEpoch = epoch;
  report = null;
  $("#generate").disabled = true;
  $("#generate").textContent = "Preparing your summary…";
  $("#report").replaceChildren();
  const status = $("#ai-status");
  status.hidden = false;
  status.classList.remove("error");
  status.textContent = "Looking at the pattern and preparing your summary…";
  try {
    await checkConnection();
    if (!connected) throw new Error();
    const r = await fetch("/api/summary", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "X-Portfolio-Token": csrf,
      },
      body: JSON.stringify({
        scenario,
        question: question + (prefs.activity ? "-activity" : ""),
      }),
    });
    const data = await r.json();
    if (!r.ok) throw new Error();
    if (requestEpoch !== epoch) return;
    report = data.report;
    reportMeta = {
      source: "claude",
      model: data.model,
      generatedAt: data.generatedAt,
    };
    if (view === "ask" && !s().urgent) renderReport();
  } catch {
    if (view === "ask" && requestEpoch === epoch && $("#ai-status")) {
      $("#ai-status").hidden = false;
      $("#ai-status").textContent =
        "The summary is temporarily unavailable. Please try again, or view the sample summary.";
    }
  } finally {
    busy = false;
    const b = $("#generate");
    if (b) {
      b.disabled = false;
      b.textContent = "✧ Summarise my readings";
    }
    updateGuide();
  }
}
function renderReport() {
  const root = $("#report");
  root.replaceChildren();
  const add = (tag, text, parent = root) => {
    const el = document.createElement(tag);
    el.textContent = text;
    parent.appendChild(el);
    return el;
  };
  const source = add("div", "");
  source.className = "report-source";
  add(
    "span",
    reportMeta.source === "claude"
      ? "AI-GENERATED SUMMARY"
      : "SAMPLE SUMMARY · PREWRITTEN",
    source,
  );
  add("span", "FICTIONAL DATA ONLY", source);
  add("h4", report.headline);
  for (const [k, title] of [
    ["observations", "What the data shows"],
    ["discussion_points", "Questions for your GP"],
    ["lifestyle_ideas", "Everyday ideas to discuss or consider"],
  ]) {
    if (!report[k]?.length) continue;
    add("h5", title);
    const list = add("ul", "");
    for (const text of report[k]) add("li", text, list);
  }
  const u = add("p", report.uncertainty);
  u.className = "uncertainty";
  add(
    "p",
    "This is an educational portfolio demonstration, not a diagnosis, treatment recommendation or overall heart-health assessment. Do not change medicines based on it.",
  );
  const actions = add("div", "");
  actions.className = "inline-actions";
  const next = add("button", "3. Prepare GP questions →", actions);
  next.className = "primary";
  next.onclick = () => navigate("gp", true);
  const save = add("button", "Save sample summary ↓", actions);
  save.onclick = () => downloadReport();
  const print = add("button", "Print / save as PDF", actions);
  print.onclick = () => window.print();
  $("#ai-status").hidden = true;
  updateGuide();
}
function showExample() {
  const f = facts();
  if (s().urgent) return;
  report = {
    headline:
      f.nights < 5
        ? "Not enough overnight information to describe a reliable pattern"
        : "A pattern to understand, with context still to explore",
    observations: [
      `The recent fictional daytime average is ${num(f.daySbp)}/${num(f.dayDbp)} mmHg.`,
      `${f.nights} of seven recent nights contain sample data.${f.nights >= 5 ? ` The recent night-time systolic average differs by ${delta(f.nightSbp - f.previous)} mmHg from the previous week.` : " Missing nights limit interpretation."}`,
    ],
    discussion_points: [
      "What, if anything, does this repeated pattern mean in my circumstances?",
      "Would you like to confirm these readings with another measurement method or review my diary?",
    ],
    lifestyle_ideas: prefs.activity
      ? [
          "If comfortable and consistent with your clinician’s advice, consider a manageable movement break. This does not explain the blood-pressure pattern.",
        ]
      : [
          "A brief diary of sleep times and relevant context may help make a clinical conversation more useful.",
        ],
    uncertainty:
      "This prewritten sample uses fictional data. The readings alone cannot establish a cause or a diagnosis.",
  };
  reportMeta = { source: "authored" };
  renderReport();
}
function downloadReport() {
  if (!report) return;
  const text = `INDEPENDENT HILO PORTFOLIO CONCEPT / FICTIONAL DATA\n${reportMeta.source === "claude" ? "AI-drafted with Claude" : "Authored example, not AI-generated"}\n\n${report.headline}\n\n${Object.entries(
    {
      Observations: report.observations,
      "Questions for GP": report.discussion_points,
      "Everyday ideas": report.lifestyle_ideas,
    },
  )
    .map(
      ([title, items]) => title + "\n" + items.map((t) => "- " + t).join("\n"),
    )
    .join(
      "\n\n",
    )}\n\nUncertainty: ${report.uncertainty}\n\nEducational prototype only. Not a diagnosis or treatment recommendation. Do not change medication based on this report.\n`;
  download("hilo-fictional-summary.txt", text);
}
function delivery() {
  const sleeping = prefs.clock === "02:00",
    f = facts();
  if (s().urgent)
    return {
      allow: false,
      title: "Urgent symptoms use a separate route.",
      body: "No scheduled brief, AI explanation or movement prompt should delay emergency help in this scenario.",
      reason:
        "A scheduled notification is not the safety mechanism. The fixed symptom route is presented in the app.",
    };
  if (!prefs.enabled)
    return {
      allow: false,
      title: "Morning reviews are off.",
      body: "The pattern remains available in the app when Alex chooses to review it.",
      reason:
        "Respecting the person’s preference means not sending a non-urgent prompt.",
    };
  if (prefs.quiet && sleeping)
    return {
      allow: false,
      title: "Quiet hours are respected.",
      body: "This non-urgent review is held for the morning. It is still available in the app.",
      reason:
        "Night-time data does not automatically justify waking someone. Urgent symptoms follow a separate safety route.",
    };
  if (f.nights < 5)
    return {
      allow: false,
      title: "More data is needed first.",
      body: "There is not enough overnight coverage to describe a reliable pattern.",
      reason:
        "Avoid a confident push notification when the evidence is sparse.",
    };
  if (!nightChanged())
    return {
      allow: false,
      title: "No pattern-review prompt in this sample.",
      body: "The sample does not meet this demonstration rule. The history remains available in the app.",
      reason:
        "A quiet notification state is not a clinical all-clear. Do not equate fewer messages with lower risk.",
    };
  if (prefs.channel === "email" && !prefs.email)
    return {
      allow: false,
      title: "Email requires a separate opt-in.",
      body: "No weekly email preview is scheduled until the sample preference is enabled.",
      reason:
        "Email is an optional weekly recap linking back to detail, not the channel for urgent changes.",
    };
  return {
    allow: true,
    title: prefs.details
      ? "A change in your overnight pattern"
      : "Your Hilo review is ready",
    body: prefs.details
      ? "Your recent night-time readings differed from the previous week. See the context and questions for your GP."
      : "A little context for your week. Open the app when you have a moment.",
    reason:
      prefs.channel === "push"
        ? "Proposed morning push: a private invitation to review a non-urgent repeated pattern. Detail stays in the app."
        : prefs.channel === "email"
          ? "Optional weekly email: a recap with a link into the app, without raw readings or an attached health report."
          : "In-app inbox: the durable home for the pattern, supporting chart, uncertainty and next step.",
  };
}
function reminders() {
  const d = delivery();
  screen.innerHTML =
    heading(
      "The right message. The right moment.",
      "Explore proposed timing, channel and privacy choices.",
    ) +
    `<div class="notification-layout"><div class="settings-card"><h4>Alex’s simulated preferences</h4><div class="setting"><label><input type="checkbox" id="reviews" ${prefs.enabled ? "checked" : ""}> Morning pattern reviews</label><small>Preview only. No device permission is requested and nothing is sent.</small></div><div class="setting"><label for="channel">Where should the review appear?</label><select id="channel"><option value="push" ${prefs.channel === "push" ? "selected" : ""}>Morning push preview</option><option value="inapp" ${prefs.channel === "inapp" ? "selected" : ""}>In-app inbox</option><option value="email" ${prefs.channel === "email" ? "selected" : ""}>Weekly email preview</option></select></div><div class="setting"><label for="clock">Preview the time of day</label><select id="clock"><option value="08:30" ${prefs.clock === "08:30" ? "selected" : ""}>08:30 · after waking</option><option value="14:10" ${prefs.clock === "14:10" ? "selected" : ""}>14:10 · daytime</option><option value="02:00" ${prefs.clock === "02:00" ? "selected" : ""}>02:00 · recorded sleep window</option></select></div><div class="setting"><label><input type="checkbox" id="quiet" ${prefs.quiet ? "checked" : ""}> Quiet hours · 22:00–08:00</label></div><div class="setting"><label><input type="checkbox" id="privacy" ${prefs.details ? "checked" : ""}> Show more detail in previews</label><small>Off by default: medical context stays out of the lock-screen preview.</small></div>${prefs.channel === "email" ? `<div class="setting"><label><input type="checkbox" id="email" ${prefs.email ? "checked" : ""}> Opt in to a weekly email recap</label><small>This is a preview. No email address is collected.</small></div>` : ""}</div><div><div class="phone-preview"><div class="phone-time">${prefs.clock}</div><div class="notification-preview"><span><img src="assets/hilo-logo.png" alt="Hilo"><small>${prefs.channel === "email" ? "WEEKLY EMAIL" : prefs.channel === "inapp" ? "IN-APP INBOX" : "PUSH PREVIEW"}</small></span><h5>${d.title}</h5><p>${d.body}</p><button data-go="overview">${d.allow ? "Open the sample update ↗" : "View the sample context ↗"}</button></div><p class="phone-caption">${d.allow ? "PROPOSED DELIVERY" : "NOT SCHEDULED IN THIS STATE"}<br>PREVIEW ONLY · NO MESSAGES SENT</p></div></div></div><div class="routing-note"><b>Why this route?</b>${d.reason}</div><section class="movement-card"><p class="eyebrow">AN OPTIONAL NUDGE / ACTIVITY CONTEXT REQUIRED</p><h4>A small step, on your terms.</h4>${activityConsent()}<label class="data-consent"><input id="movement" type="checkbox" ${prefs.movement ? "checked" : ""}><span style="font-size:11px">Opt in to gentle movement reminders for this fictional person</span></label><div id="movement-state"></div></section><div class="policy"><details><summary>Push, in-app or email?</summary><p>Proposed policy: morning push for an opted-in, non-urgent repeated pattern; in-app for the full explanation and durable record; optional weekly email for a privacy-conscious recap. Clinical concern must not be delegated to a scheduled email, an unguaranteed push service or an AI response. Delivery rules in this prototype are design hypotheses, not a production medical-device policy.</p></details></div>`;
  const controls = {
    reviews: ["enabled", "checked"],
    channel: ["channel", "value"],
    clock: ["clock", "value"],
    quiet: ["quiet", "checked"],
    privacy: ["details", "checked"],
    email: ["email", "checked"],
    movement: ["movement", "checked"],
    "activity-feed": ["activity", "checked"],
  };
  for (const [id, [key, prop]] of Object.entries(controls)) {
    const el = document.getElementById(id);
    if (el)
      el.onchange = () => {
        prefs[key] = el[prop];
        if (key === "activity") {
          report = null;
          epoch++;
        }
        $("#demo-clock").textContent = prefs.clock;
        reminders();
        document.getElementById(id)?.focus();
      };
  }
  movementState();
  bindActions();
}
function movementState() {
  let reason = "",
    show = false;
  if (s().urgent)
    reason =
      "Suppressed: the urgent-symptom example must not receive an exercise suggestion.";
  else if (!prefs.activity)
    reason =
      "Not available: resting heart-rate data cannot establish inactivity. A simulated movement feed must be explicitly included.";
  else if (!prefs.movement)
    reason = "Not shown: Alex has not opted in to movement reminders.";
  else if (prefs.clock === "02:00")
    reason =
      "Held: this is the recorded sleep window. No movement prompt should interrupt sleep.";
  else if (s().sedentaryMinutes < 90)
    reason =
      "No nudge in this sample: the simulated movement feed does not show a long recent sedentary period.";
  else {
    show = true;
    reason =
      "Shown because the simulated activity feed records 125 sedentary minutes, Alex opted in, and the preview is outside the sleep window. The 90-minute trigger is a demonstration choice, not clinical guidance.";
  }
  $("#movement-state").innerHTML =
    (show
      ? `<div class="notification-preview"><h5>Would a small movement break fit your day?</h5><p>If comfortable and in line with your clinician’s advice, choose a short break that suits you—perhaps around the house. Skip it if you feel unwell or have been advised to limit activity.</p><div class="inline-actions"><button id="movement-yes">A short break sounds good</button><button id="movement-later">Not now</button></div></div>`
      : "") + `<p class="movement-reason">${reason}</p>`;
  if (show) {
    $("#movement-yes").onclick = () =>
      toast(
        "Choice recorded in this demonstration only. No health outcome is inferred.",
      );
    $("#movement-later").onclick = () =>
      toast("Prompt dismissed. There is no penalty or follow-up pressure.");
  }
}
function gp() {
  const f = facts();
  screen.innerHTML =
    heading(
      "3. Prepare your GP questions.",
      "A fictional trend and a few useful questions—not a diagnosis.",
    ) +
    (s().urgent ? urgentCard() : "") +
    `<div class="gp-layout"><section class="gp-card"><h4>The pattern, with its limits.</h4><p>Recent 7-day daytime average: <strong>${num(f.daySbp)}/${num(f.dayDbp)} mmHg</strong>.</p><p>Recent night-time average: <strong>${num(f.nightSbp)}/${num(f.nightDbp)} mmHg</strong>, based on ${f.nights} of seven nights. ${f.nights < 5 ? "Coverage is too sparse for this demo to suggest a reliable overnight pattern." : `Night-time systolic differs by ${delta(f.nightSbp - f.previous)} mmHg from the previous week.`}</p><p>Sleep window: ${s().sleepWindow}. ${prefs.activity ? "Movement context comes from a simulated connected feed." : "Activity context is not included; resting pulse is not used to infer exercise."}</p><p>These are fictional readings. Real measurements may require confirmation and interpretation in the context of your care.</p>${gpSaved ? '<p class="saved-note">Sample question saved from the insight ✓</p>' : ""}<button class="primary" id="save-gp">${gpSaved ? "Saved for this demo ✓" : "Save this sample question"}</button></section><section class="gp-card"><h4>Questions you might bring.</h4><label><input type="checkbox" checked data-gp-question>What could explain this pattern in my circumstances?</label><label><input type="checkbox" checked data-gp-question>Would you like to confirm it with another measurement method?</label><label><input type="checkbox" checked data-gp-question>What sleep, routine or symptom context would be useful to record?</label><label><input type="checkbox" data-gp-question>What activity changes would be appropriate for me?</label><button class="primary" id="gp-export">Export sample conversation brief ↓</button><p class="subtle" style="margin-top:15px">Exports a text file with fictional data and the selected questions. Does not contact a GP.</p></section></div><div class="inline-actions" style="margin-top:25px"><button data-go="ask">Ask for a plain-English explanation ✧</button><button data-go="overview">Back to the chart →</button></div>`;
  $("#save-gp").onclick = () => {
    gpSaved = true;
    gp();
    $("#save-gp").focus({ preventScroll: true });
    toast("Saved in this local demonstration. Nothing was sent.");
  };
  $("#gp-export").onclick = () => {
    const qs = [...document.querySelectorAll("[data-gp-question]:checked")].map(
      (el) => el.parentElement.textContent.trim(),
    );
    download(
      "hilo-fictional-gp-brief.txt",
      `INDEPENDENT HILO PORTFOLIO CONCEPT\nFICTIONAL DATA / NOT A MEDICAL REPORT\n\nSample: ${s().name}\nPeriod: ${s().period}\nRecent daytime average: ${num(f.daySbp)}/${num(f.dayDbp)} mmHg\nRecent night-time average: ${num(f.nightSbp)}/${num(f.nightDbp)} mmHg\nCoverage: ${f.nights}/7 nights\n\nQuestions:\n${qs.map((q) => "- " + q).join("\n")}\n\nThese synthetic readings are not a diagnosis. Do not change medication based on this brief. Seek appropriate clinical advice for real concerns.\n${s().urgent ? "The urgent-symptom demonstration should follow emergency guidance rather than wait for this brief." : ""}`,
    );
  };
  bindActions();
}
function download(name, text) {
  const url = URL.createObjectURL(new Blob([text], { type: "text/plain" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function bindActions() {
  document.querySelectorAll("[data-go]").forEach(
    (b) =>
      (b.onclick = () => {
        if (b.dataset.go === "gp") gpSaved = true;
        navigate(b.dataset.go, true);
      }),
  );
  const r = $("#review");
  if (r)
    r.onclick = () => {
      reviewed = true;
      overview();
      $("#review").focus({ preventScroll: true });
      toast("Marked as reviewed in the demonstration only.");
    };
}
function render() {
  screen.setAttribute("role", s().urgent ? "region" : "tabpanel");
  if (s().urgent) {
    screen.removeAttribute("aria-labelledby");
    screen.setAttribute("aria-label", "Urgent symptoms");
  } else {
    screen.removeAttribute("aria-label");
    screen.setAttribute("aria-labelledby", `nav-${view}`);
  }
  document.querySelector(".app-sidebar nav").hidden = s().urgent;
  if (s().urgent) urgentView();
  else ({ overview, ask, reminders, gp })[view]();
  $("#demo-clock").textContent = prefs.clock;
  updateGuide();
}
$("#guide-toggle").onclick = () => {
  guideEnabled = !guideEnabled;
  updateGuide();
};
const navs = [...document.querySelectorAll("[data-screen]")];
navs.forEach((b, i) => {
  b.onclick = () => navigate(b.dataset.screen);
  b.onkeydown = (e) => {
    let n;
    if (["ArrowDown", "ArrowRight"].includes(e.key)) n = (i + 1) % navs.length;
    if (["ArrowUp", "ArrowLeft"].includes(e.key))
      n = (i + navs.length - 1) % navs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = navs.length - 1;
    if (n !== undefined) {
      e.preventDefault();
      navigate(navs[n].dataset.screen);
      navs[n].focus();
    }
  };
});
$("#scenario").onchange = (e) => {
  historyChosen = true;
  view = "overview";
  scenario = e.target.value;
  report = null;
  gpSaved = false;
  reviewed = false;
  epoch++;
  inspect = chartMode === "day" ? 3 : 27;
  navigate("overview");
};
$("#hero-morning").onclick = () => {
  historyChosen = false;
  scenario = "overnight";
  $("#scenario").value = scenario;
  report = null;
  epoch++;
  navigate("overview");
  $("#experience").scrollIntoView({
    behavior: document.documentElement.classList.contains("reduced")
      ? "instant"
      : "smooth",
  });
};
let reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
try {
  const stored = localStorage.getItem("kim-reduce");
  if (stored !== null) reduce = stored === "true";
} catch {}
function setMotion() {
  document.documentElement.classList.toggle("reduced", reduce);
  $("#motion-toggle").setAttribute("aria-pressed", String(reduce));
  $("#motion-toggle").textContent = reduce ? "Motion reduced" : "Reduce motion";
}
setMotion();
$("#motion-toggle").onclick = () => {
  reduce = !reduce;
  setMotion();
  try {
    localStorage.setItem("kim-reduce", String(reduce));
  } catch {}
};
render();
checkConnection();
window.addEventListener("focus", checkConnection);

let resizePending = false;
window.addEventListener("resize", () => {
  if (view !== "overview" || resizePending) return;
  resizePending = true;
  requestAnimationFrame(() => {
    drawChart();
    resizePending = false;
  });
});
