// Shared copy and routes for application-specific portfolio links.
// Add a ready entry here when a new concept has a working prototype.
export const highlights = {
  hilo: {
    name: "Hilo",
    kind: "concept",
    eyebrow: "AN INDEPENDENT IDEA FOR HILO",
    title: ["I designed AI summaries", "for GP conversations."],
    summary:
      "I explored how Hilo could explain a repeated blood-pressure change and help someone prepare questions for a GP. I built a working prototype with fictional histories and AI-generated summaries.",
    caption:
      "A morning review, a plain-English explanation and questions for a GP.",
    status: "Independent concept · fictional data",
    href: "hilo/",
    image: "assets/hilo-preview.png",
    imageAlt:
      "My independent Hilo prototype showing the guided summary step with fictional data",
    action: "Try my Hilo concept ↗",
  },
  royal: {
    name: "Royal London",
    kind: "client",
    eyebrow: "ROYAL LONDON / LAUNCHED IN 2024",
    title: ["I redesigned Royal London’s", "employer website."],
    summary:
      "I redesigned Royal London’s employer website, including its information architecture, navigation and page templates. Explore the archived original screens in a task-led preview.",
    caption: "Follow an employer task through my original website screens.",
    status: "Launched · original screens from 2024",
    href: "prototypes/royal.html",
    image: "assets/royal/home-after.jpeg",
    imageAlt: "My redesigned Royal London employer homepage, archived in 2024",
    action: "Explore my Royal London work ↗",
  },
  braze: {
    name: "Braze",
    kind: "client",
    eyebrow: "BRAZE / KNOWLEDGE & SALES TOOLS",
    title: ["I designed Braze’s", "knowledge and sales tools."],
    summary:
      "At Braze, I designed knowledge-space pages, ROI interface guidance and sales materials. Explore my original screens and full-resolution slide exports. Proprietary ROI calculations are not included.",
    caption:
      "Explore the knowledge space, ROI input layout and original slide designs.",
    status: "Selected assignments · 2021–2023",
    href: "prototypes/braze.html",
    image: "assets/braze/hub-after.png",
    imageAlt: "My original Braze knowledge-space design",
    action: "Explore my Braze work ↗",
  },
  capital: {
    name: "Express Capital Financing",
    kind: "client",
    eyebrow: "EXPRESS CAPITAL / PITCHED CONCEPT",
    title: ["I designed a clearer", "property deal calculator."],
    summary:
      "I designed a fix-and-flip calculator concept with guided inputs and a visible result. Try the illustrative portfolio calculator to explore the cost breakdown. The original proposal was pitched, not shipped.",
    caption: "Change the inputs and see how an illustrative deal adds up.",
    status: "Pitched concept · illustrative calculations",
    href: "prototypes/calculator.html",
    image: "assets/capital.jpg",
    imageAlt: "My Express Capital calculator concept",
    action: "Try my calculator preview ↗",
  },
  fuse: {
    name: "Fuse Growth Studio",
    kind: "client",
    eyebrow: "FUSE GROWTH STUDIO / BRAND SYSTEM",
    title: ["I designed the logo", "and brand guidelines."],
    summary:
      "I created Fuse Growth Studio’s logo and brand guidelines. Explore the original vector artwork in a working playground for colour, contrast and composition.",
    caption: "Explore my original logo, colour choices and brand compositions.",
    status: "Delivered brand identity · 2023",
    href: "prototypes/fuse.html",
    image: "assets/fuse-wordmark.svg",
    imageAlt: "My original Fuse Growth Studio wordmark",
    action: "Explore my Fuse brand system ↗",
  },
  nevis: {
    name: "Nevis Range",
    kind: "client",
    eyebrow: "NEVIS RANGE / MAPS & WAYFINDING",
    title: ["I redesigned maps", "and matching trail signs."],
    summary:
      "I redesigned Nevis Range’s trail and piste maps, using matching names, numbers and grades across maps and signs. Explore my historical artwork through a schematic 3D preview, not a current navigation map.",
    caption:
      "Zoom into the artwork, explore the 3D preview and view print mockups.",
    status: "Historical work · schematic 3D preview",
    href: "prototypes/nevis.html",
    image: "assets/nevis-hi.jpg",
    imageAlt: "My historical Nevis Range mountain-bike trail map",
    action: "Explore my Nevis map ↗",
  },
  xps: {
    name: "XPS",
    kind: "concept",
    eyebrow: "AN INDEPENDENT IDEA FOR XPS",
    title: ["I designed a clearer", "retirement request."],
    summary:
      "For my independent XPS concept, I connected a member’s next step to the administrator’s review, so both can see what is needed and who acts next. Try the working demo with fictional case details and supplied samples.",
    caption:
      "Follow a sample request from the member’s task to the administrator’s review, then see the update from both sides.",
    status: "Independent concept · fictional case",
    href: "xps/",
    image: "xps/assets/preview.png",
    imageAlt:
      "My independent XPS prototype with connected member and administrator perspectives",
    action: "Try my XPS concept ↗",
  },
};

export function isReady(story) {
  return Boolean(story && story.ready !== false && story.href && story.title);
}

export function selectHighlight(search, registry = highlights) {
  // Query values never become HTML, routes or copy. Only allowlisted keys select a story.
  const params = new URLSearchParams(search);
  for (const [name, value] of params) {
    const key =
      name.toLowerCase() === "highlight"
        ? value.toLowerCase()
        : name.toLowerCase();
    if (Object.hasOwn(registry, key))
      return isReady(registry[key]) ? key : null;
  }
  return null;
}

export function remainingConcepts(selected, registry = highlights) {
  return Object.entries(registry).filter(
    ([key, story]) =>
      key !== selected && story.kind === "concept" && isReady(story),
  );
}
