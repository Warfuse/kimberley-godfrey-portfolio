import { mountReplay, showSourceDialog } from "./source-replay.mjs";
const src = (n) => "../assets/royal/" + n;
const headerLinks = [
  { label: "Manage your scheme", target: "manage", box: [47, 18, 18, 7] },
  { label: "Employer login", target: "login", box: [82, 1, 14, 8] },
];
const screens = [
  {
    id: "home",
    title: "Relaunched homepage · August 2024",
    src: src("home-after.jpeg"),
    note: "Royal London for Employers · relaunched homepage, August 2024.",
    transcript:
      "Header: Customer; Adviser; Asset Manager; Search; Contact us; Employer login; For Employers only. Navigation: About us; Our products; Manage your scheme; Help centre; Articles and insights. Hero: Let’s take the work out of workplace pensions. Find out more. Quick links: Online service; Communications toolkit; Financial wellbeing service; Guides.",
    links: [
      ...headerLinks,
      {
        label: "Communications toolkit",
        target: "toolkit",
        box: [28, 85, 22, 12],
      },
      { label: "Online service", target: "login", box: [5, 85, 22, 12] },
      { label: "What would you like to do?", target: "tasks" },
    ],
  },
  {
    id: "manage",
    title: "Manage your scheme · mega menu",
    src: src("navigation-after.jpeg"),
    note: "Manage your scheme · task-led navigation, 2024.",
    transcript:
      "Supporting you: Your employer duties; Online service; Communications toolkit; Yearly review guide; Tax year end. Supporting your employees: Mobile app; Financial wellbeing service; Retirement options and support. Tools and calculators: Salary exchange calculator. Bottom link: Manage your scheme. Close.",
    links: [
      {
        label: "Communications toolkit",
        target: "toolkit",
        box: [4, 65, 24, 7],
      },
      { label: "Yearly review guide", target: "review", box: [4, 72, 23, 7] },
      { label: "Supporting you", target: "supporting", box: [4, 44, 23, 8] },
      { label: "Your employer duties", target: "duties", box: [4, 53, 24, 7] },
      { label: "Online service", target: "login", box: [4, 59, 23, 7] },
      { label: "Close menu", target: "home", box: [89, 90, 8, 7] },
    ],
  },
  {
    id: "supporting",
    title: "Supporting you · original hub",
    src: src("supporting-you.jpeg"),
    note: "Supporting you · employer administration hub, 2024.",
    transcript:
      "Supporting you: employer duties, online service, communications toolkit, yearly review guide and tax year end. The screenshot is an original supplied page, not recreated guidance.",
    links: [
      { label: "Yearly review guide", target: "review" },
      { label: "Communications toolkit", target: "toolkit" },
      { label: "Manage your scheme", target: "manage" },
    ],
  },
  {
    id: "toolkit",
    title: "Communications toolkit · after",
    src: src("toolkit-after.jpeg"),
    note: "Original Communications toolkit after the redesign, archived 2 December 2024; final portfolio page 9.",
    transcript:
      "Communications toolkit. Useful resources. This page groups employee communications into topics rather than a list of downloads. The supplied capture shows the toolkit landing page; the full topic pages are not supplied.",
    links: [
      { label: "Compare support materials before", target: "before" },
      { label: "View original topic cards", target: "topics" },
      { label: "Manage your scheme", target: "manage" },
    ],
  },
  {
    id: "topics",
    title: "Communications toolkit · original topic cards",
    src: src("toolkit-topic-cards.jpeg"),
    note: "Original topic-card detail from final portfolio page 9. No topic text or advice has been invented.",
    transcript:
      "Visible topic cards: Welcome to your workplace pension; Introducing our mobile app; Transferring pension savings; Looking after your financial wellbeing. Each includes “View material”.",
    links: [
      { label: "Back to the toolkit", target: "toolkit" },
      { label: "View material", target: "material" },
    ],
  },
  {
    id: "tasks",
    title: "What would you like to do? · original task cards",
    src: src("task-cards.png"),
    note: "Original task cards from final portfolio page 12. The three journeys and CTA labels are preserved.",
    transcript:
      "What would you like to do? Set up a new workplace pension scheme — Get started. Switch your pension provider — See the benefits. Manage your scheme — Take a look.",
    links: [
      { label: "Manage your scheme", target: "manage", box: [67, 13, 32, 85] },
      {
        label: "Set up a new workplace pension scheme",
        target: "setup",
        box: [0, 13, 32, 85],
      },
      {
        label: "Switch your pension provider",
        target: "switch",
        box: [33, 13, 32, 85],
      },
      { label: "Back to the homepage", target: "home" },
    ],
  },
  {
    id: "before",
    title: "Support materials · before",
    src: src("toolkit-before.jpeg"),
    note: "Original pre-redesign Support materials page, archived 19 June 2024; final portfolio page 8.",
    transcript:
      "Support materials. Before the redesign, content appeared as lists of downloadable documents. This is a historical comparison, not current material.",
    links: [
      { label: "Compare the redesigned toolkit", target: "toolkit" },
      { label: "Back to the relaunched homepage", target: "home" },
    ],
  },
  {
    id: "home-before",
    title: "Homepage · before",
    src: src("home-before.jpeg"),
    note: "Original pre-redesign homepage and sidebar; final portfolio page 13, July 2024.",
    transcript:
      "Before: seven flat navigation links and a competing sidebar. The content is an archived comparison.",
    links: [{ label: "View the relaunched homepage", target: "home" }],
  },
];
function boundary(id) {
  if (id === "review") {
    const content = document.createElement("div");
    const intro = document.createElement("p");
    intro.textContent = "Choose the route that matches your yearly review.";
    content.append(intro);
    for (const label of [
      "I have changes to make",
      "I don’t have any changes to make",
    ]) {
      const b = document.createElement("button");
      b.className = "primary";
      b.style.margin = "8px";
      b.textContent = label;
      b.onclick = () => {
        const status = content.querySelector("[role=status]");
        status.textContent = `Selected route: “${label}”. This is the end of this portfolio preview.`;
      };
      content.append(b);
    }
    const status = document.createElement("p");
    status.setAttribute("role", "status");
    content.append(status);
    showSourceDialog("Yearly review guide", content);
    return;
  }
  const title =
    {
      login: "Employer online service",
      duties: "Your employer duties",
      material: "View material",
      setup: "Set up a new workplace pension scheme",
      switch: "Switch your pension provider",
    }[id] || "Portfolio preview";
  showSourceDialog(
    title,
    "This page is not included in the portfolio preview. Use the page selector to explore the available designs.",
  );
}
const replay = mountReplay(document.querySelector("#royal-replay"), {
  screens,
  initial: "home",
  onAction: boundary,
});
document
  .querySelectorAll("[data-route]")
  .forEach((b) => (b.onclick = () => replay.go(b.dataset.route)));
