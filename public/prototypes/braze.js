import { mountReplay, showSourceDialog } from "./source-replay.mjs";
const $ = (s) => document.querySelector(s),
  panel = $("#panel"),
  tabs = [...document.querySelectorAll("[data-tab]")];
let current = "hub",
  gallery = "Creative";
let reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
try {
  const v = localStorage.getItem("kim-reduce");
  if (v !== null) reduced = v === "true";
} catch {}
function motion() {
  document.documentElement.classList.toggle("reduced", reduced);
  $("#motion").textContent = `Motion: ${reduced ? "off" : "on"}`;
  $("#motion").setAttribute("aria-pressed", String(reduced));
}
motion();
$("#motion").onclick = () => {
  reduced = !reduced;
  motion();
  try {
    localStorage.setItem("kim-reduce", String(reduced));
  } catch {}
};
function selectTab(key) {
  current = key;
  tabs.forEach((b) => {
    const active = b.dataset.tab === key;
    b.setAttribute("aria-selected", String(active));
    b.tabIndex = active ? 0 : -1;
  });
  panel.setAttribute("aria-labelledby", `tab-${key}`);
  if (key === "hub") hub();
  else if (key === "value") value();
  else evidence();
}
tabs.forEach((b, i) => {
  b.onclick = () => selectTab(b.dataset.tab);
  b.onkeydown = (e) => {
    let n;
    if (["ArrowRight", "ArrowDown"].includes(e.key)) n = (i + 1) % tabs.length;
    if (["ArrowLeft", "ArrowUp"].includes(e.key))
      n = (i + tabs.length - 1) % tabs.length;
    if (e.key === "Home") n = 0;
    if (e.key === "End") n = tabs.length - 1;
    if (n !== undefined) {
      e.preventDefault();
      selectTab(tabs[n].dataset.tab);
      tabs[n].focus();
    }
  };
});
const hubPages = [
  {
    id: "home",
    title: "Industry Solutions",
    file: "hub-after.png",
    context:
      "Original landing screen. Resources; How-to-Guides; Projects; Meet the team. How can we help? Search content. FAQs. Submit an IS Request.",
  },
  {
    id: "resources",
    title: "Resources",
    file: "hub-resources.png",
    context:
      "Industry Specific Content. Retail & E-Commerce; Media & Entertainment; Quick Service Restaurants; Financial Services; Gaming; EdTech.",
  },
  {
    id: "guides",
    title: "Guides",
    file: "hub-projects.png",
    context:
      "How-To-Guides and Workshops. Visible links include Self Serve ROI Calculator and Creating a Business Case.",
  },
  {
    id: "team",
    title: "Meet the team",
    file: "hub-value-services.png",
    context:
      "Who are we? Our Mission. Team information is historical source content, not a current directory.",
  },
  {
    id: "faqs",
    title: "Frequently Asked Questions",
    file: "hub-team.png",
    context:
      "Frequently Asked Questions. Who does Industry Solutions work with? What industries do we prioritise? How do Industry Solutions assist in the Sales Cycle?",
  },
  {
    id: "industry",
    title: "Industry Agnostic Content",
    file: "hub-guides.png",
    context:
      "The Value Collection. Total Economic Impact. Original resource-link and report layouts.",
  },
  {
    id: "tenets",
    title: "Our Tenets",
    file: "hub-technical.png",
    context:
      "Think Big. Leveraging Curiosity & Creativity. Have An Opinion. Be Generous. Embrace the Grey.",
  },
  {
    id: "qsr",
    title: "Quick Service Restaurants",
    file: "hub-best-practices.png",
    context:
      "Understanding The Industry. QSR and On-Demand Industry Enablement Session. Industry Data.",
  },
];
const storySummaries = {
  hub: {
    title: "I redesigned Braze’s Industry Solutions knowledge space.",
    parts: [
      [
        "The problem & task",
        "Industry knowledge sat in dense Confluence pages. I was responsible for designing a clearer way for colleagues to find resources and guidance.",
      ],
      [
        "What I did & why",
        "I grouped the space into Resources, How-to-Guides, Projects and Meet the team, with search and topic links. These offered direct routes as well as keyword lookup.",
      ],
      [
        "What changed",
        "A redesigned knowledge space with direct entry points, search and a consistent layout across resource pages.",
      ],
    ],
  },
  value: {
    title: "I designed ROI tool guidance and business-case slides.",
    parts: [
      [
        "The problem & task",
        "Braze sales teams needed to explain the value of customer engagement. The brief was to simplify the process and make the ROI story easier to present.",
      ],
      [
        "What I did & why",
        "I created UI guidance for the spreadsheet tool and designed its business-case slide exports. Consistent inputs, labels and scenario layouts helped organise the explanation.",
      ],
      [
        "What changed",
        "UI guidance for the ROI tool and a set of reusable business-case slide templates covering assumptions, scenarios and projections.",
      ],
    ],
  },
  creative: {
    title: "I designed reference cards and visual sales materials.",
    parts: [
      [
        "The problem & task",
        "The team needed a memorable way to explain customer-engagement ideas and build confidence in sales conversations.",
      ],
      [
        "What I did & why",
        "I paired short explanations with illustrations in a playing-card format. I also designed scorecards, presentation layouts, identities and icons for related assignments.",
      ],
      [
        "What changed",
        "A 42-card reference set that also functions as playing cards, alongside scorecards, presentation layouts and visual identities.",
      ],
    ],
  },
};
function storyBrief(key) {
  const story = storySummaries[key];
  return `<section class="story-brief" aria-label="${key === "hub" ? "Knowledge-space" : key === "value" ? "ROI tool" : "Visual design"} project summary"><h3>${story.title}</h3><div class="star-grid">${story.parts.map(([title, text], i) => `<section><h4>${title}</h4><p>${text}</p></section>`).join("")}</div></section>`;
}
function hub() {
  panel.innerHTML =
    storyBrief("hub") +
    '<form class="search-form" id="source-search" role="search"><label class="sr-only" for="source-query">Search preview pages</label><input id="source-query" type="search" placeholder="Find a page: resources, guides, ROI…" maxlength="100"><button>Search</button></form><div id="source-results" aria-live="polite"></div><div id="hub-replay"></div>';
  const screens = hubPages.map((p) => ({
    id: p.id,
    title: p.title,
    src: "../assets/braze/" + p.file,
    alt: p.title + " — original Keynote screenshot",
    note: p.title + " · Industry Solutions knowledge-space design, 2021.",
    transcript: p.context,
    links:
      p.id === "home"
        ? [
            { label: "Resources", target: "resources", box: [27, 20, 10, 12] },
            { label: "How-to-Guides", target: "guides", box: [40, 20, 12, 12] },
            {
              label: "Projects",
              target: "projects-missing",
              box: [54, 20, 10, 12],
            },
            { label: "Meet the team", target: "team", box: [66, 20, 12, 12] },
            { label: "Search pages", target: "search", box: [30, 56, 43, 5] },
            { label: "FAQs", target: "faqs", box: [60, 62, 4, 4] },
          ]
        : p.id === "resources"
          ? [
              { label: "Quick Service Restaurants", target: "qsr" },
              { label: "Industry Agnostic Content", target: "industry" },
              { label: "Industry Solutions home", target: "home" },
            ]
          : p.id === "guides"
            ? [
                { label: "Self Serve ROI Calculator", target: "roi" },
                { label: "Creating a Business Case", target: "exports" },
                { label: "Industry Solutions home", target: "home" },
              ]
            : p.id === "team"
              ? [
                  { label: "Our Tenets", target: "tenets" },
                  { label: "Industry Solutions home", target: "home" },
                ]
              : [
                  { label: "Industry Solutions home", target: "home" },
                  { label: "Resources", target: "resources" },
                  { label: "How-to-Guides", target: "guides" },
                ],
  }));
  const replay = mountReplay($("#hub-replay"), {
    screens,
    initial: "home",
    onAction: (id) => {
      if (id === "roi") {
        selectTab("value");
        return;
      }
      if (id === "exports") {
        selectTab("value");
        showExports();
        return;
      }
      if (id === "search") {
        $("#source-query").focus();
        return;
      }
      showSourceDialog(
        "Projects",
        "This page is not included in the portfolio preview. Use the page selector to explore the available designs.",
      );
    },
  });
  $("#source-search").onsubmit = (e) => {
    e.preventDefault();
    const q = $("#source-query").value.toLowerCase().trim();
    const found = hubPages.filter((p) =>
      (p.title + " " + p.context).toLowerCase().includes(q),
    );
    const root = $("#source-results");
    root.replaceChildren();
    const count = document.createElement("p");
    count.className = "sample";
    count.textContent = q
      ? `${found.length} matching pages in this preview.`
      : "Enter a term to find a page.";
    root.append(count);
    if (q)
      for (const p of found) {
        const b = document.createElement("button");
        b.className = "secondary";
        b.style.margin = "0 8px 15px 0";
        b.textContent = p.title + " →";
        b.onclick = () => replay.go(p.id);
        root.append(b);
      }
  };
}
const fieldSpec = [
  [
    "New visitors per Month",
    "6 Month average number of new users that visit the mobile app per month",
    "75,000.00",
  ],
  ["Monthly User Growth Rate", "Projected growth rate of visitors", "2%"],
  ["Existing Active Free Users", "Existing Active Free Users", "100000000%"],
  ["Existing Active Subscribers", "Existing Active Subscribers", "50,000.00"],
  [
    "Subscriber Rate",
    "Average percentage of new and existing free users that subscribe",
    "0.03",
  ],
  [
    "Average Lifetime of Free Users",
    "Average number of months a free user uses the service",
    "1.50",
  ],
  ["Monthly Free User Value", "Monthly revenue per free user", "1.00"],
  [
    "Average Lifetime of Subscribers",
    "Average number of months a subscriber uses the service",
    "3.00",
  ],
  ["Monthly Subscriber Value", "Monthly revenue per subscriber", "5.00"],
];
let sheetValues = [
  "CoolShows",
  "Streaming",
  "Freemium",
  "Ace",
  "Mobile+Web",
  "$100,000",
  "2",
  ...fieldSpec.map((f) => f[2]),
];
let sheetTab = "input";
function value() {
  panel.innerHTML =
    storyBrief("value") +
    `<details class="source-explanation"><summary>About the interactive preview</summary><p>The slide designs and input layout are from my original work. Inputs can be edited for exploration; this portfolio preview does not connect to the original calculation service.</p></details><div class="sheet-actions"><button class="secondary" id="see-original">View the original input screen ↗</button><button class="secondary" id="reset-inputs">Reset example inputs</button></div><div class="original-sheet"><div class="sheet-title"><b>▣</b><span>New ROI build example</span><small>LOCAL RECONSTRUCTION</small></div><div class="sheet-ribbon">File　 Edit　 View　 Insert　 Format　 Data　 Tools　 Extensions　 Help</div><div class="sheet-scroll" tabindex="0" aria-label="Original spreadsheet layout, horizontally scrollable"><div class="sheet-body" id="sheet-body"></div></div><nav class="sheet-tabs" aria-label="Original worksheet tabs"><button data-sheet="overview">Overview</button><button data-sheet="input">Input</button><button data-sheet="exports">Slide Generation</button><button data-sheet="transaction">Transaction</button><button data-sheet="retention">Retention + Engagement</button></nav></div><p class="sample" style="margin-top:18px">Interactive input-layout preview. Example values; no live account connection.</p>`;
  $("#see-original").onclick = () => {
    const content = document.createElement("div");
    const img = document.createElement("img");
    img.src = "../assets/braze/roi-original.png";
    img.alt = "Original New ROI build example spreadsheet from my Keynote";
    img.style.width = "100%";
    const link = document.createElement("a");
    link.href = img.src;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open full-resolution original ↗";
    content.append(img, link);
    showSourceDialog("Original screenshot / slide 30", content);
  };
  $("#reset-inputs").onclick = () => {
    sheetValues = [
      "CoolShows",
      "Streaming",
      "Freemium",
      "Ace",
      "Mobile+Web",
      "$100,000",
      "2",
      ...fieldSpec.map((f) => f[2]),
    ];
    sheetTab = "input";
    drawSheet();
  };
  document.querySelectorAll("[data-sheet]").forEach(
    (b) =>
      (b.onclick = () => {
        const key = b.dataset.sheet;
        if (key === "input") {
          sheetTab = "input";
          drawSheet();
        } else if (key === "exports") {
          sheetTab = "exports";
          showExports();
        } else
          showSourceDialog(
            b.textContent,
            "This worksheet is not included in the portfolio preview. You can explore the Input layout and Slide Generation designs.",
          );
      }),
  );
  drawSheet();
  showExports();
}
function field(i, label) {
  return `<input aria-label="${label}" data-sheet-value="${i}" value="" maxlength="100" required>`;
}
function drawSheet() {
  $(".original-sheet").classList.remove("showing-sales-slides");
  $("#sheet-body").classList.remove("showing-exports");
  document
    .querySelectorAll("[data-sheet]")
    .forEach((b) =>
      b.setAttribute(
        "aria-current",
        b.dataset.sheet === sheetTab ? "page" : "false",
      ),
    );
  const root = $("#sheet-body");
  root.innerHTML = `<b>Instructions:</b><p>All fields highlighted in green are required. Click on a field header to see a detailed description.</p><table class="company-table"><tbody><tr><th>Company Name</th><td>${field(0, "Company Name")}</td></tr></tbody></table><p><b>Fill out the information below to get a list of the data needed from your account.</b></p><table class="context-table"><thead><tr>${["Industry", "Business Model", "Maturity", "SDK", "ACV", "Model Years"].map((t) => `<th>${t}</th>`).join("")}</tr></thead><tbody><tr>${["Industry", "Business Model", "Maturity", "SDK", "ACV", "Model Years"].map((t, i) => `<td>${field(i + 1, t)}</td>`).join("")}</tr></tbody></table><p>Metrics will autopopulate here depending on the above selections. <span class="source-only">Input-layout preview only; automatic calculations are not connected.</span></p><table class="metric-table"><thead><tr><th>Input</th><th>Input Definition</th><th>Metric</th></tr></thead><tbody>${fieldSpec.map(([name, definition], i) => `<tr><th><button data-definition="${i}">${name}</button></th><td>${definition}</td><td>${field(i + 7, name)}</td></tr>`).join("")}</tbody></table><p class="source-instruction">Once all required metrics have been filled in, buttons will appear below, linking you to the final results tab and a Google Form to request slides to be created for a Business Case</p><button class="sheet-run" id="sheet-run" disabled title="Calculations are not available in this portfolio preview">Run</button><p id="sheet-status" role="status" class="source-only">Calculations are not connected in this portfolio preview.</p><button class="sheet-export" id="slide-generation">Slide Generation</button>`;
  root.querySelectorAll("[data-sheet-value]").forEach((input) => {
    const i = +input.dataset.sheetValue;
    input.value = sheetValues[i];
    input.oninput = () => (sheetValues[i] = input.value);
  });
  root.querySelectorAll("[data-definition]").forEach(
    (b) =>
      (b.onclick = () => {
        const f = fieldSpec[+b.dataset.definition];
        showSourceDialog(f[0], f[1] + ".");
      }),
  );
  $("#slide-generation").onclick = showExports;
}
const exportSlides = [
  { file: 6, title: "Braze Business Case" },
  { file: 5, title: "Brand projections / section divider" },
  { file: 4, title: "Methodology & Sources / revenue projections" },
  { file: 1, title: "Business case structure and base assumptions" },
  { file: 3, title: "Methodology & Sources / editor capture" },
  { file: 2, title: "Business case inputs — Web" },
  { file: 11, title: "Detailed scenario calculations / section divider" },
  { file: 10, title: "Without Braze / scenario template" },
  { file: 7, title: "Braze Base / scenario template" },
  { file: 8, title: "Braze Low / scenario template" },
  { file: 9, title: "Braze High / scenario template" },
  { file: 12, title: "Brand’s 2 Year Projections / section divider" },
];
function showExports() {
  if (current !== "value") selectTab("value");
  sheetTab = "exports";
  document
    .querySelectorAll("[data-sheet]")
    .forEach((b) =>
      b.setAttribute(
        "aria-current",
        b.dataset.sheet === "exports" ? "page" : "false",
      ),
    );
  const root = $("#sheet-body");
  $(".original-sheet").classList.add("showing-sales-slides");
  root.classList.add("showing-exports");
  root.innerHTML =
    '<h4>My business-case slide designs</h4><p>Templates for presenting the assumptions, scenarios and projections in a sales conversation.</p><div id="export-replay" tabindex="0" aria-label="Original slide viewer. Left and right arrow keys change slides."></div><div class="sheet-actions"><button class="secondary" id="back-input">View the ROI input layout</button><span class="sample">Choose a slide or use the arrow keys. Use + to zoom.</span></div>';
  const screens = exportSlides.map((slide, i) => ({
    id: "export-" + i,
    title: String(i + 1).padStart(2, "0") + " / 12 — " + slide.title,
    src:
      "../assets/braze/exports/slide-" +
      String(slide.file).padStart(2, "0") +
      ".png",
    alt: slide.title + " — full-resolution original screenshot from my Keynote",
    note:
      slide.title +
      " · business-case presentation design." +
      (slide.file === 3 ? " Shown in the original slide editor." : ""),
    transcript:
      slide.title +
      ". Use the full-resolution image link to inspect the original asset. Empty scenario cells in the source remain empty.",
    links: [
      { label: "← Previous slide", target: "export-" + ((i + 11) % 12) },
      { label: "Next slide →", target: "export-" + ((i + 1) % 12) },
    ],
  }));
  const host = $("#export-replay");
  const viewer = mountReplay(host, { screens, initial: "export-0" });
  host.onkeydown = (e) => {
    if (
      e.target.closest("input,select,textarea") ||
      !["ArrowLeft", "ArrowRight"].includes(e.key)
    )
      return;
    e.preventDefault();
    const current = +host.querySelector("select").value.replace("export-", "");
    viewer.go("export-" + ((current + (e.key === "ArrowRight" ? 1 : 11)) % 12));
  };
  $("#back-input").onclick = () => {
    sheetTab = "input";
    root.classList.remove("showing-exports");
    drawSheet();
  };
}
const sourceItems = [
  {
    group: "Systems",
    src: "hub-before.png",
    title: "Knowledge hub / before",
    note: "The previous Confluence resource page.",
  },
  {
    group: "Systems",
    src: "hub-after.png",
    title: "Knowledge hub / after",
    note: "My redesigned Industry Solutions entry page, with clear routes to resources, guidance and team information.",
  },
  {
    group: "Systems",
    src: "roi-original.png",
    title: "ROI tool / original spreadsheet",
    note: "The spreadsheet-based input tool. My work included UI guidance and the business-case presentation designs.",
  },
  {
    group: "Systems",
    src: "roi-design-guidance.jpg",
    title: "UI guidance / making the tool clearer",
    note: "UI guidance covering colour, actions, labels, onboarding and flow.",
  },
  {
    group: "Systems",
    src: "exports/slide-01.png",
    title: "Business-case slide exports",
    note: "Business-case presentation templates. Explore all twelve in ROI tool & sales slides.",
  },
  {
    group: "Systems",
    src: "scorecard.jpg",
    title: "SMB end-of-year scorecard",
    note: "Year-end scorecard presentation design for the SMB team.",
  },
  {
    group: "Creative",
    src: "card-data.png",
    title: "Braze playing cards / Data",
    note: "Data reference card from the 42-card Braze deck.",
  },
  {
    group: "Creative",
    src: "card-stats.png",
    title: "Braze playing cards / Statistics",
    note: "An illustrated statistics card from the Braze reference deck.",
  },
  {
    group: "Creative",
    src: "industry-identity.jpg",
    title: "Industry Insights identity",
    note: "Identity design for Industry Insights.",
  },
  {
    group: "Creative",
    src: "elle-identity.jpg",
    title: "<elle/> / identity",
    note: "Brand identity for a women-in-tech mentorship initiative.",
  },
  {
    group: "Creative",
    src: "icons.jpg",
    title: "Icons / small stories in a small space",
    note: "Icons for customer-engagement concepts.",
  },
  {
    group: "Concept",
    src: "gamification.jpg",
    title: "McDonald’s / Art of the Possible",
    note: "A one-week gamification concept for a sales presentation. Concept work, not a launched consumer application.",
  },
];
function evidence() {
  panel.innerHTML =
    storyBrief("creative") +
    `<div class="gallery-filters" role="group" aria-label="Filter original work">${["Systems", "Creative", "Concept"].map((g) => `<button data-gallery="${g}" aria-pressed="${gallery === g}">${{ Systems: "Tools & sales material", Creative: "Cards, identity & icons", Concept: "Sales concept" }[g]}</button>`).join("")}</div><div class="evidence-grid" id="evidence-grid"></div>`;
  document.querySelectorAll("[data-gallery]").forEach(
    (b) =>
      (b.onclick = () => {
        gallery = b.dataset.gallery;
        document
          .querySelectorAll("[data-gallery]")
          .forEach((x) => x.setAttribute("aria-pressed", String(x === b)));
        galleryResults();
      }),
  );
  galleryResults();
}
function galleryResults() {
  const root = $("#evidence-grid");
  root.replaceChildren();
  for (const item of sourceItems.filter((x) => x.group === gallery)) {
    const fig = document.createElement("figure");
    fig.className = "evidence-item";
    const a = document.createElement("a");
    a.href = "../assets/braze/" + item.src;
    a.target = "_blank";
    a.rel = "noopener";
    const img = document.createElement("img");
    img.src = a.href;
    img.alt = item.title;
    img.loading = "lazy";
    a.append(img);
    const cap = document.createElement("figcaption");
    const title = document.createElement("b");
    title.textContent = item.title;
    cap.append(title);
    const note = document.createElement("p");
    note.textContent = item.note;
    cap.append(note);
    fig.append(a, cap);
    root.append(fig);
  }
}
if (location.hash === "#exports") {
  selectTab("value");
  showExports();
} else selectTab("hub");
