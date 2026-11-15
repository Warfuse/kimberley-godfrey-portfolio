/** Links original supplied screens. No invented intermediate screens or calculations. */
export function mountReplay(root, { screens, initial, onAction = () => {} }) {
  let current = screens.find((s) => s.id === initial) || screens[0],
    zoom = 1,
    zones = false;
  root.classList.add("replay");
  function go(id) {
    const screen = screens.find((s) => s.id === id);
    if (!screen) return onAction(id);
    current = screen;
    zoom = 1;
    render();
    root.querySelector(".replay-caption").focus({ preventScroll: true });
  }
  function render() {
    root.replaceChildren();
    const toolbar = document.createElement("div");
    toolbar.className = "replay-toolbar";
    const label = document.createElement("label");
    label.textContent = root.id === "export-replay" ? "Slide" : "Page";
    const select = document.createElement("select");
    select.setAttribute(
      "aria-label",
      root.id === "export-replay" ? "Choose a slide" : "Choose a page",
    );
    for (const s of screens) {
      const o = document.createElement("option");
      o.value = s.id;
      o.textContent = s.title;
      select.append(o);
    }
    select.value = current.id;
    select.onchange = () => go(select.value);
    label.append(select);
    toolbar.append(label);
    const tools = document.createElement("div");
    tools.className = "replay-tools";
    const btn = (text, label, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.setAttribute("aria-label", label);
      b.onclick = fn;
      return b;
    };
    const out = btn("−", "Zoom out original screen", () =>
        setZoom(zoom - 0.25),
      ),
      inside = btn("+", "Zoom in original screen", () => setZoom(zoom + 0.25)),
      fit = btn("Fit", "Fit original screen to width", () => setZoom(1)),
      toggle = btn("Clickable areas", "Show clickable areas", () => {
        zones = !zones;
        toggle.setAttribute("aria-pressed", String(zones));
        root.classList.toggle("show-zones", zones);
      });
    toggle.className = "hot-toggle";
    toggle.setAttribute("aria-pressed", String(zones));
    tools.append(out, inside, fit, toggle);
    toolbar.append(tools);
    root.append(toolbar);
    const status = document.createElement("div");
    status.className = "replay-status";
    status.setAttribute("role", "status");
    status.textContent = "Explore the designs below. Use + to zoom.";
    root.append(status);
    const scroll = document.createElement("div");
    scroll.className = "replay-scroll";
    scroll.tabIndex = 0;
    scroll.setAttribute(
      "aria-label",
      "Original screen. Scroll to inspect; use zoom controls for small text.",
    );
    const stage = document.createElement("div");
    stage.className = "source-stage";
    const img = document.createElement("img");
    img.src = current.src;
    img.alt = current.alt || current.title + " — original supplied screen";
    stage.append(img);
    const links = current.links || [];
    for (const link of links) {
      if (!link.box) continue;
      const h = btn("", link.label, () => go(link.target));
      h.className = "source-hotspot";
      const [x, y, w, hgt] = link.box;
      Object.assign(h.style, {
        left: x + "%",
        top: y + "%",
        width: w + "%",
        height: hgt + "%",
      });
      stage.append(h);
    }
    scroll.append(stage);
    root.append(scroll);
    const caption = document.createElement("div");
    caption.className = "replay-caption";
    caption.tabIndex = -1;
    const text = document.createElement("p");
    text.textContent = current.note;
    caption.append(text);
    const routes = document.createElement("div");
    routes.className = "replay-links";
    routes.setAttribute("role", "group");
    routes.setAttribute("aria-label", "Preview navigation");
    for (const link of links)
      routes.append(btn(link.label, link.label, () => go(link.target)));
    caption.append(routes);
    if (current.transcript) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = "Page details";
      const body = document.createElement("p");
      body.textContent = current.transcript;
      details.append(summary, body);
      caption.append(details);
    }
    const original = document.createElement("a");
    original.href = current.src;
    original.target = "_blank";
    original.rel = "noopener";
    original.textContent = "View full-resolution image ↗";
    caption.append(original);
    root.append(caption);
    root.classList.toggle("show-zones", zones);
    setZoom(zoom);
  }
  function setZoom(v) {
    zoom = Math.max(1, Math.min(3, v));
    const stage = root.querySelector(".source-stage");
    stage.style.width = zoom * 100 + "%";
    const buttons = root.querySelectorAll(".replay-tools button");
    buttons[0].disabled = zoom === 1;
    buttons[1].disabled = zoom === 3;
  }
  render();
  return { go };
}
export function showSourceDialog(
  title,
  content,
  opener = document.activeElement,
) {
  const dialog = document.createElement("dialog");
  dialog.className = "replay-dialog";
  const close = document.createElement("button");
  close.textContent = "Close ✕";
  close.setAttribute("aria-label", "Close source detail");
  const heading = document.createElement("h2");
  heading.textContent = title;
  heading.style.clear = "both";
  dialog.append(close, heading);
  if (typeof content === "string") {
    const p = document.createElement("p");
    p.textContent = content;
    dialog.append(p);
  } else dialog.append(content);
  document.body.append(dialog);
  let finished = false;
  function done() {
    if (finished) return;
    finished = true;
    dialog.close();
    dialog.remove();
    opener?.focus?.();
  }
  close.onclick = done;
  dialog.addEventListener("cancel", (e) => {
    e.preventDefault();
    done();
  });
  dialog.onclick = (e) => {
    const r = dialog.getBoundingClientRect();
    if (
      e.target === dialog &&
      (e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom)
    )
      done();
  };
  dialog.showModal();
  close.focus();
  return dialog;
}
