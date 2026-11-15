const originalLogo = fetch("../assets/fuse-wordmark.svg").then((r) => {
  if (!r.ok) throw new Error("Logo asset unavailable");
  return r.text();
});
const palette = [
  ["Fuse Blue", "#1e4afb"],
  ["Aquamarine", "#57f0ad"],
  ["Summer Sky", "#33c0fd"],
  ["Purple", "#8456ef"],
  ["Orange Yellow", "#ffc759"],
  ["Coral", "#ff7a6c"],
];
const tones = {
  human: {
    title: "Good people. Great momentum.",
    copy: "Less fluff. More progress. Let’s work out what moves your business forward.",
    kicker: "GROWTH STARTS WITH A CONVERSATION",
  },
  intelligent: {
    title: "Challenge the obvious.",
    copy: "Ask sharper questions. Connect strategy, technology and data. Make the next move count.",
    kicker: "CLEAR THINKING. CONNECTED EXPERTISE.",
  },
  curious: {
    title: "What happens if we try?",
    copy: "Follow a better question. Explore the possibilities. Turn a fresh perspective into progress.",
    kicker: "STAY OPEN. KEEP EXPERIMENTING.",
  },
};
let bg = palette[0][1];
const stage = document.getElementById("stage");
document.getElementById("swatches").innerHTML = palette
  .map(
    ([n, c], i) =>
      `<button style="background:${c}" data-colour="${c}" aria-label="${n} ${c}" aria-pressed="${i === 0}"></button>`,
  )
  .join("");
function luminance(hex) {
  const rgb = hex
    .slice(1)
    .match(/../g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}
function update() {
  const ink = document.getElementById("ink").value,
    tone = document.getElementById("tone").value,
    format = document.getElementById("format").value;
  stage.style.background = bg;
  stage.style.color = ink;
  stage.dataset.format = format;
  document.getElementById("stage-title").textContent =
    document.getElementById("headline").value || tones[tone].title;
  document.getElementById("stage-copy").textContent = tones[tone].copy;
  document.getElementById("stage-kicker").textContent =
    format === "card" ? "BRAND / STRATEGY / MOMENTUM" : tones[tone].kicker;
  document.getElementById("format-label").textContent =
    format === "proposal"
      ? "A BETTER NEXT CHAPTER ↗"
      : format === "card"
        ? "LET’S TALK ↗"
        : `BE ${tone === "human" ? "A HUMAN" : tone.toUpperCase()} ↗`;
  const a = luminance(bg),
    b = luminance(ink),
    ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  document.getElementById("contrast").textContent =
    `${ratio.toFixed(2)}:1 contrast. ${ratio >= 4.5 ? "Passes WCAG AA for normal text." : ratio >= 3 ? "Passes AA for large text only. Choose another ink for body copy." : "Fails AA for text. Try dark ink or another background."}`;
  document
    .querySelectorAll("[data-colour]")
    .forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.colour === bg)),
    );
}
document.querySelectorAll("[data-colour]").forEach(
  (b) =>
    (b.onclick = () => {
      bg = b.dataset.colour;
      const l = luminance(bg),
        white = 1.05 / (l + 0.05),
        dark = (l + 0.05) / (luminance("#111824") + 0.05);
      document.getElementById("ink").value =
        white >= dark ? "#ffffff" : "#111824";
      update();
    }),
);
document
  .querySelectorAll("select,input")
  .forEach((el) => el.addEventListener("input", update));
document.getElementById("reset-fuse").onclick = () => {
  bg = palette[0][1];
  document.getElementById("ink").value = "#ffffff";
  document.getElementById("tone").value = "human";
  document.getElementById("format").value = "poster";
  document.getElementById("headline").value = "";
  update();
};
const esc = (s) =>
  s.replace(
    /[<>&"']/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[c],
  );
document.getElementById("export").onclick = async () => {
  const logoText = await originalLogo;
  const logoInner = logoText.slice(
    logoText.indexOf(">") + 1,
    logoText.lastIndexOf("</svg>"),
  );
  const ink = document.getElementById("ink").value,
    format = document.getElementById("format").value,
    H = format === "card" ? 720 : 1000;
  function wrap(text, n) {
    const lines = [""];
    for (const word of text.split(" ")) {
      if ((lines[lines.length - 1] + " " + word).length > n) lines.push(word);
      else
        lines[lines.length - 1] += (lines[lines.length - 1] ? " " : "") + word;
    }
    return lines;
  }
  const title = wrap(
      document.getElementById("stage-title").textContent,
      format === "card" ? 38 : 28,
    ),
    copy = wrap(document.getElementById("stage-copy").textContent, 78),
    font = format === "card" ? 52 : 70;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:serif="http://www.serif.com/" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="${H}" viewBox="0 0 1200 ${H}"><rect width="1200" height="${H}" fill="${bg}"/><g fill="${ink}" font-family="Arial,sans-serif"><svg x="70" y="60" width="400" height="108" viewBox="145 140 1210 325" fill="currentColor" style="color:${ink}">${logoInner}</svg><text x="70" y="235" font-size="18">${esc(document.getElementById("stage-kicker").textContent)}</text>${title.map((l, i) => `<text x="70" y="${335 + i * (font + 16)}" font-size="${font}" font-weight="bold">${esc(l)}</text>`).join("")}${copy.map((l, i) => `<text x="70" y="${365 + title.length * (font + 16) + i * 30}" font-size="23">${esc(l)}</text>`).join("")}<path d="M70 ${H - 120}H1130" stroke="${ink}"/><text x="70" y="${H - 82}" font-size="17">FUSE GROWTH STUDIO</text><text x="70" y="${H - 35}" font-size="14">Original supplied logo / new portfolio composition. Not a master template.</text></g></svg>`;
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
  const a = document.createElement("a");
  a.href = url;
  a.download = "fuse-portfolio-composition.svg";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
update();
