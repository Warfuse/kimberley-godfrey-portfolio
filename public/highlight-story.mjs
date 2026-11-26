import {
  highlights,
  selectHighlight,
  remainingConcepts,
} from "./highlights.mjs";

const uiux = new URLSearchParams(location.search).has("uiux");
const selected = uiux ? null : selectHighlight(location.search);
const story = highlights[selected];
const feature = document.querySelector("[data-featured-story]");
const hero = document.querySelector(".intro");

function title(element, lines) {
  const emphasis = document.createElement("em");
  emphasis.textContent = lines[1];
  element.replaceChildren(
    document.createTextNode(lines[0]),
    document.createElement("br"),
    emphasis,
  );
}

if (uiux) {
  document.documentElement.dataset.highlight = "uiux";
  title(hero.querySelector("h1"), [
    "I understand people.",
    "I design for their needs.",
  ]);
  hero.querySelector(".hero-copy").textContent =
    "I’m a senior UX/UI designer and user researcher in Edinburgh. I use research, behavioural insights and visual design to create clear digital experiences.";
  document.querySelector(".hero-top .eyebrow").textContent =
    "KIMBERLEY GODFREY · SENIOR UX/UI DESIGNER & USER RESEARCHER";
  hero.querySelector(".tiny-note").textContent =
    "User research · Behavioural analytics · UX/UI design";
  document.title = "Kimberley Godfrey — Senior UX/UI Designer and User Researcher";
  document.querySelector('meta[name="description"]').content =
    hero.querySelector(".hero-copy").textContent;
  document.querySelector("#toolkit").hidden = false;
  document.querySelector("[data-uiux-link]").hidden = false;
  document.querySelector("#quick-title em").textContent =
    "A senior UX/UI designer and user researcher.";
  document.querySelector("#quick-dialog > p:nth-of-type(2)").textContent =
    "Senior UX/UI designer and user researcher · Edinburgh · UK remote";
  document.querySelector("#contact h2 em").textContent =
    "UX design or user research role.";
}

if (story) {
  document.documentElement.dataset.highlight = selected;
  // Airalo customises the featured showcase while preserving Kim’s introduction.
  if (story.updateHero !== false) {
    title(hero.querySelector("h1"), story.title);
    hero.querySelector(".hero-copy").textContent = story.summary;
    const primary = hero.querySelector(".hero-actions a");
    primary.href = story.href;
    primary.textContent = story.action;
    const note = hero.querySelector(".tiny-note");
    note.textContent = `Kimberley Godfrey · ${story.status}`;
    document.title = `${story.name} · Kimberley Godfrey — Senior User Interface and Experience Designer`;
    document.querySelector('meta[name="description"]').content = story.summary;
  }

  feature.hidden = false;
  feature.querySelector(".eyebrow").textContent = story.eyebrow;
  title(feature.querySelector("h2"), [
    "Explore my",
    `${story.name} ${story.displayType || (story.kind === "concept" ? "concept" : "work")}.`,
  ]);
  feature.querySelector("[data-feature-summary]").textContent = story.caption;
  const action = feature.querySelector(".pill");
  action.href = story.href;
  action.textContent = story.action;
  const art = feature.querySelector(".hilo-feature-art");
  art.classList.add("highlight-preview");
  art.href = story.href;
  art.setAttribute("aria-label", story.action.replace(" ↗", ""));
  const image = document.createElement("img");
  image.src = story.image;
  image.alt = story.imageAlt;
  const caption = document.createElement("strong");
  caption.textContent = story.name;
  const status = document.createElement("small");
  status.textContent = story.status;
  art.replaceChildren(image, caption, status);
}

// Unfeatured concepts stay with the work, never disappear when another story leads.
const collection = document.querySelector("[data-other-concepts]");
for (const [key, concept] of remainingConcepts(selected)) {
  const link = document.createElement("a");
  link.className = "concept-project";
  link.id = `${key}-concept`;
  link.href = concept.href;
  const image = document.createElement("img");
  image.src = concept.image;
  image.alt = concept.imageAlt;
  image.loading = "lazy";
  const text = document.createElement("div");
  const label = document.createElement("span");
  label.className = "eyebrow";
  label.textContent = concept.eyebrow;
  const heading = document.createElement("h3");
  heading.textContent = `My ${concept.name} ${concept.displayType || "concept"}`;
  const summary = document.createElement("p");
  summary.textContent = concept.caption;
  const status = document.createElement("small");
  status.textContent = concept.status;
  const action = document.createElement("span");
  action.className = "concept-action";
  action.textContent = concept.action;
  text.append(label, heading, summary, status, action);
  link.append(image, text);
  collection.append(link);
}
collection.hidden = !collection.children.length;

// Concept cards are created after the browser's first fragment lookup.
// Restore an existing deep link after the selected story changes the layout.
const conceptAnchor = [...collection.children].find(
  (card) => `#${card.id}` === location.hash,
);
if (conceptAnchor)
  requestAnimationFrame(() =>
    conceptAnchor.scrollIntoView({ block: "start", behavior: "instant" }),
  );
