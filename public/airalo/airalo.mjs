import {
  scenes,
  sourceScreens,
  selectScene,
  nextScene,
  previousScene,
} from "./journey.mjs";
const $ = (selector) => document.querySelector(selector);
let current = scenes[0],
  opener;
const tablist = $("#scene-tabs");
for (const [index, scene] of scenes.entries()) {
  const button = document.createElement("button");
  button.id = `tab-${scene.id}`;
  button.role = "tab";
  button.setAttribute("aria-controls", "scene-panel");
  button.dataset.scene = scene.id;
  const number = document.createElement("span");
  number.textContent = String(index + 1).padStart(2, "0");
  number.setAttribute("aria-hidden", "true");
  const label = document.createElement("strong");
  label.textContent = scene.label;
  button.append(number, label);
  tablist.append(button);
  button.onclick = () => render(scene.id, true);
  button.onkeydown = (event) => {
    if (
      ![
        "ArrowDown",
        "ArrowUp",
        "ArrowRight",
        "ArrowLeft",
        "Home",
        "End",
      ].includes(event.key)
    )
      return;
    event.preventDefault();
    const i = scenes.findIndex((s) => s.id === current.id);
    const next =
      event.key === "Home"
        ? scenes[0]
        : event.key === "End"
          ? scenes.at(-1)
          : scenes[
              (i +
                (["ArrowDown", "ArrowRight"].includes(event.key)
                  ? 1
                  : scenes.length - 1)) %
                scenes.length
            ];
    render(next.id, true);
    $(`#tab-${next.id}`).focus();
  };
}
function render(id, announce = false) {
  current = selectScene(id);
  const index = scenes.findIndex((scene) => scene.id === current.id);
  for (const button of tablist.children) {
    const selected = button.dataset.scene === current.id;
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
  }
  $("#scene-panel").setAttribute("aria-labelledby", `tab-${current.id}`);
  $("#scene-panel").dataset.scene = current.id;
  $("#scene-image").src = `assets/${current.image}`;
  $("#scene-image").alt =
    `My ${current.label.toLowerCase()} screenshot: ${current.data}, ${current.days}, Airmoney ${current.airmoney}.`;
  for (const [id, value] of Object.entries({
    "scene-tag": current.tag,
    "scene-count": `${String(index + 1).padStart(2, "0")} / 07`,
    "scene-status": current.status,
    "scene-title": current.title,
    "scene-reason": current.reason,
    "scene-data": current.data,
    "scene-days": current.days,
    "scene-airmoney": current.airmoney,
    "message-text":
      current.notification ||
      "I start with the ready card, before a connection message is shown.",
  }))
    $(`#${id}`).textContent = value;
  $("#message-preview").classList.toggle("quiet", !current.notification);
  $("#capture-caption").textContent = "Demo values · screenshot replay.";
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = index === scenes.length - 1 ? "↺" : "→";
  $("#next-scene").replaceChildren(
    document.createTextNode(current.action + " "),
    arrow,
  );
  $("#previous-scene").disabled = index === 0;
  if (announce)
    $("#scene-announcement").textContent =
      `${current.label}. ${current.status}. ${current.data}, ${current.days}, Airmoney ${current.airmoney}.`;
}
$("#next-scene").onclick = () => {
  render(nextScene(current.id).id, true);
  $("#next-scene").focus({ preventScroll: true });
};
$("#previous-scene").onclick = () => render(previousScene(current.id).id, true);
function openImage(screen, button) {
  opener = button;
  $("#image-title").textContent = screen.title;
  $("#image-caption").textContent = screen.detail;
  $("#original-image").src = `assets/${screen.image}`;
  $("#original-image").alt = screen.title;
  $("#image-dialog").showModal();
  $("#close-image").focus();
}
function openCurrent(event) {
  openImage(
    {
      image: current.image,
      title: current.label,
      detail: `My original screenshot · ${current.data} · ${current.days} · ${current.airmoney}.`,
    },
    event.currentTarget,
  );
}
$("#zoom-screen").onclick = openCurrent;
$("#phone-zoom").onclick = openCurrent;
$("#close-image").onclick = () => $("#image-dialog").close();
$("#image-dialog").addEventListener("close", () =>
  opener?.focus({ preventScroll: true }),
);
for (const [index, screen] of sourceScreens.entries()) {
  const button = document.createElement("button");
  button.className = "gallery-screen";
  const image = document.createElement("img");
  image.src = `assets/${screen.image}`;
  image.alt = "";
  image.width = 942;
  image.height = 2048;
  image.loading = "lazy";
  const number = document.createElement("small");
  number.textContent = String(index + 1).padStart(2, "0");
  const title = document.createElement("strong");
  title.textContent = screen.title;
  const detail = document.createElement("span");
  detail.textContent = screen.detail;
  button.append(image, number, title, detail);
  button.onclick = () => openImage(screen, button);
  $("#screen-gallery").append(button);
}
const preference = matchMedia("(prefers-reduced-motion: reduce)");
let reduced = preference.matches;
function motion() {
  document.documentElement.classList.toggle("reduced", reduced);
  $("#motion").setAttribute("aria-pressed", String(reduced));
  $("#motion").textContent = reduced ? "Motion reduced" : "Reduce motion";
}
$("#motion").onclick = () => {
  reduced = !reduced;
  motion();
};
preference.addEventListener("change", (event) => {
  reduced = event.matches;
  motion();
});
motion();
render(current.id);
