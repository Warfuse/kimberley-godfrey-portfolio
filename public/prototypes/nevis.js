import * as THREE from "./vendor/three.module.min.js";
const container = document.getElementById("map-view"),
  status = document.getElementById("map-status"),
  flyButton = document.getElementById("fly");
let scene, camera, renderer, terrain, grid, marker;
let yaw = 0.16,
  pitch = 0.85,
  distance = 13,
  target = new THREE.Vector3(0, 0.6, 0),
  flying = false,
  frame = 0,
  startTime = 0,
  pausedAt = 0,
  selected = "world",
  viewpoint = 0;
let width = 0,
  height = 0,
  drag = false,
  last = {},
  pinches = new Map();
const reduced = () => {
  let saved;
  try {
    saved = localStorage.getItem("kim-reduce");
  } catch {}
  return saved === null
    ? matchMedia("(prefers-reduced-motion: reduce)").matches
    : saved === "true";
};
function elevation(x, z) {
  return (
    0.15 +
    3.3 * Math.exp(-((x + 3.5) ** 2 / 8 + (z + 2.5) ** 2 / 5)) +
    1.3 * Math.exp(-((x - 1.8) ** 2 / 7 + (z + 2.8) ** 2 / 6)) +
    0.22 * Math.sin(x * 1.3) * Math.cos(z * 1.1)
  );
}
const routes = {
  world: {
    name: "World Cup Downhill",
    note: "Orange / Extreme · Illustrative overlay",
    colour: 0xffa94d,
    points: [
      [-4.9, -3.5],
      [-5, -2.6],
      [-4.2, -1.6],
      [-3.8, -0.8],
      [-2.8, 0.1],
      [-2.4, 1],
      [-1.5, 1.4],
      [-0.4, 2.2],
    ],
  },
  blue: {
    name: "Blue Doon",
    note: "Blue / Moderate · Illustrative overlay",
    colour: 0x5ac8ff,
    points: [
      [-4.6, -3.4],
      [-3.9, -3.1],
      [-3.1, -3.4],
      [-2.1, -2.8],
      [-2.2, -1.8],
      [-1.3, -1.1],
      [-1.7, -0.2],
      [-1, 0.7],
      [-0.4, 2.2],
    ],
  },
  forest: {
    name: "Lower Forest",
    note: "Dark green highlight · Illustrative forest tour",
    colour: 0x005332,
    points: [
      [-0.4, 2.2],
      [0.8, 1.7],
      [1.4, 0.9],
      [2.1, 1.2],
      [2.6, 0.4],
      [3.9, 0.1],
      [4.3, -1],
      [3.3, -1.5],
      [2, -0.7],
      [1.2, 0.7],
      [-0.4, 2.2],
    ],
  },
};
let routeMeshes = {},
  curves = {};
function orbit() {
  camera.position.set(
    target.x + distance * Math.sin(yaw) * Math.cos(pitch),
    target.y + distance * Math.sin(pitch),
    target.z + distance * Math.cos(yaw) * Math.cos(pitch),
  );
  camera.lookAt(target);
  render();
}
function render() {
  if (renderer) renderer.render(scene, camera);
}
function stop() {
  if (!flying) return;
  flying = false;
  cancelAnimationFrame(frame);
  flyButton.textContent = "▶ Resume flight";
  flyButton.setAttribute("aria-pressed", "false");
  document.getElementById("flight-status").textContent =
    "Flight paused. Resume or reset the view.";
}
function reset() {
  stop();
  pausedAt = 0;
  yaw = 0.16;
  pitch = 0.85;
  distance = width < 600 ? 29 : 13;
  target.set(0, 0.6, 0);
  orbit();
  flyButton.textContent = reduced() ? "Next viewpoint →" : "▶ Fly through";
  document.getElementById("flight-progress").style.width = "0";
  document.getElementById("flight-status").textContent = "Ready when you are.";
  if (marker) marker.position.copy(curves[selected].getPoint(0));
  render();
}
function goPoint(t) {
  const curve = curves[selected],
    p = curve.getPoint(Math.min(0.999, t)),
    ahead = curve.getPoint(Math.min(1, t + 0.07));
  marker.position.copy(p);
  camera.position.copy(p).add(new THREE.Vector3(1.5, 3.8, 4.5));
  camera.lookAt(ahead.clone().add(new THREE.Vector3(0, 0.1, 0)));
  document.getElementById("flight-progress").style.width = `${t * 100}%`;
  render();
}
function tick(now) {
  if (!flying) return;
  const t = Math.min(1, (now - startTime) / 22000);
  pausedAt = t;
  goPoint(t);
  if (t < 1) frame = requestAnimationFrame(tick);
  else {
    flying = false;
    pausedAt = 0;
    flyButton.textContent = "↺ Replay flight";
    flyButton.setAttribute("aria-pressed", "false");
    document.getElementById("flight-status").textContent =
      "Journey complete. Explore another route or reset the view.";
  }
}
function start() {
  if (!renderer) return;
  if (reduced()) {
    viewpoint = (viewpoint + 1) % 5;
    goPoint(viewpoint / 4);
    document.getElementById("flight-status").textContent =
      `Viewpoint ${viewpoint + 1} of 5. Motion is reduced; advance at your own pace.`;
    return;
  }
  if (flying) {
    stop();
    return;
  }
  flying = true;
  flyButton.textContent = "Ⅱ Pause flight";
  flyButton.setAttribute("aria-pressed", "true");
  document.getElementById("flight-status").textContent =
    "Flying through an illustrative route. Pause at any time.";
  startTime = performance.now() - pausedAt * 22000;
  frame = requestAnimationFrame(tick);
}
function routeChange() {
  selected = document.getElementById("route").value;
  viewpoint = 0;
  const r = routes[selected];
  document.getElementById("route-name").textContent = r.name;
  document.getElementById("route-note").textContent = r.note;
  document
    .querySelector(".map-route")
    .style.setProperty(
      "--route-colour",
      "#" + r.colour.toString(16).padStart(6, "0"),
    );
  Object.entries(routeMeshes).forEach(([k, m]) => {
    m.visible = k === selected;
  });
  marker.material.color.set(r.colour);
  reset();
}
try {
  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x173a2c, 0.018);
  camera = new THREE.PerspectiveCamera(42, 1, 0.1, 150);
  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2.5));
  renderer.setClearColor(0x172a25, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.domElement.tabIndex = 0;
  renderer.domElement.setAttribute(
    "aria-label",
    "3D map. Arrow keys rotate, plus and minus zoom. Use the buttons for guided views.",
  );
  container.insertBefore(renderer.domElement, container.firstChild);
  scene.add(new THREE.HemisphereLight(0xffffff, 0xffffff, 2.0));
  const sun = new THREE.DirectionalLight(0xffffff, 1.0);
  sun.position.set(-5, 10, 8);
  scene.add(sun);
  const geo = new THREE.PlaneGeometry(12, 8, 100, 70);
  geo.rotateX(-Math.PI / 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++)
    pos.setY(i, elevation(pos.getX(i), pos.getZ(i)));
  geo.computeVertexNormals();
  terrain = new THREE.Mesh(
    geo,
    new THREE.MeshStandardMaterial({
      color: 0xa8c68b,
      roughness: 0.95,
      metalness: 0,
      side: THREE.DoubleSide,
    }),
  );
  scene.add(terrain);
  new THREE.TextureLoader().load(
    "../assets/nevis-hi.jpg",
    (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      texture.repeat.set(1, 0.69);
      texture.offset.set(0, 0.31);
      terrain.material.map = texture;
      terrain.material.color.set(0xffffff);
      terrain.material.needsUpdate = true;
      status.textContent = "Drag to explore · original map texture loaded";
      render();
    },
    undefined,
    () => {
      status.textContent =
        "Map texture unavailable; relief and original artwork remain available.";
    },
  );
  // Earth-coloured sides close the raised relief to the floating plinth.
  const sides = [];
  const edges = [
    Array.from({ length: 101 }, (_, i) => [-6 + i * 0.12, -4]),
    Array.from({ length: 71 }, (_, i) => [6, -4 + (i * 8) / 70]),
    Array.from({ length: 101 }, (_, i) => [6 - i * 0.12, 4]),
    Array.from({ length: 71 }, (_, i) => [-6, 4 - (i * 8) / 70]),
  ];
  for (const edge of edges)
    for (let i = 0; i < edge.length - 1; i++) {
      let [x, z] = edge[i],
        [a, b] = edge[i + 1],
        y = elevation(x, z),
        v = elevation(a, b);
      sides.push(x, y, z, a, v, b, x, -0.5, z, a, v, b, a, -0.5, b, x, -0.5, z);
    }
  const sideGeo = new THREE.BufferGeometry();
  sideGeo.setAttribute("position", new THREE.Float32BufferAttribute(sides, 3));
  sideGeo.computeVertexNormals();
  scene.add(
    new THREE.Mesh(
      sideGeo,
      new THREE.MeshStandardMaterial({
        color: 0x6c6349,
        roughness: 1,
        side: THREE.DoubleSide,
      }),
    ),
  );
  const base = new THREE.Mesh(
    new THREE.BoxGeometry(12.12, 0.18, 8.12),
    new THREE.MeshStandardMaterial({ color: 0x303e2d, roughness: 0.8 }),
  );
  base.position.y = -0.58;
  scene.add(base);
  grid = new THREE.Mesh(
    geo.clone(),
    new THREE.MeshBasicMaterial({
      color: 0xe5f8be,
      wireframe: true,
      transparent: true,
      opacity: 0.16,
    }),
  );
  grid.position.y = 0.015;
  grid.visible = false;
  scene.add(grid);
  for (const [key, r] of Object.entries(routes)) {
    const plan = new THREE.CatmullRomCurve3(
      r.points.map(([x, z]) => new THREE.Vector3(x, 0, z)),
    );
    const draped = Array.from({ length: 301 }, (_, i) => {
      const p = plan.getPoint(i / 300);
      return new THREE.Vector3(p.x, elevation(p.x, p.z) + 0.14, p.z);
    });
    const curve = new THREE.CatmullRomCurve3(draped);
    curves[key] = curve;
    const group = new THREE.Group();
    // Dual casing keeps every route identifiable across the varying map colours.
    for (const [radius, colour, order] of [
      [0.105, 0x14291e, 5],
      [0.075, 0xfff9e9, 6],
      [0.042, r.colour, 7],
    ]) {
      const tube = new THREE.Mesh(
        new THREE.TubeGeometry(curve, 360, radius, 8, false),
        new THREE.MeshBasicMaterial({
          color: colour,
          depthTest: false,
          depthWrite: false,
          toneMapped: false,
          fog: false,
        }),
      );
      tube.renderOrder = order;
      group.add(tube);
    }
    group.visible = key === selected;
    scene.add(group);
    routeMeshes[key] = group;
  }
  marker = new THREE.Mesh(
    new THREE.SphereGeometry(0.09, 16, 16),
    new THREE.MeshBasicMaterial({ color: routes.world.colour }),
  );
  marker.position.copy(curves.world.getPoint(0));
  scene.add(marker);
  const treeGeo = new THREE.ConeGeometry(0.06, 0.3, 5),
    treeMat = new THREE.MeshStandardMaterial({ color: 0x174e30, roughness: 1 }),
    trees = new THREE.InstancedMesh(treeGeo, treeMat, 90);
  const dummy = new THREE.Object3D();
  for (let i = 0; i < 90; i++) {
    const x = -0.5 + (((i * 47) % 85) / 85) * 6,
      z = -1.3 + (((i * 31) % 79) / 79) * 4.6;
    dummy.position.set(x, elevation(x, z) + 0.13, z);
    dummy.scale.setScalar(0.6 + (i % 5) * 0.13);
    dummy.updateMatrix();
    trees.setMatrixAt(i, dummy.matrix);
  }
  scene.add(trees);
  function resize() {
    const oldWidth = width;
    width = container.clientWidth;
    height = container.clientHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    if (!oldWidth || oldWidth < 600 !== width < 600) {
      distance = width < 600 ? 29 : 13;
      orbit();
    } else render();
  }
  new ResizeObserver(resize).observe(container);
  reset();
  resize();
  const motionButton = document.getElementById("map-motion");
  function syncMotion() {
    motionButton.textContent = `Motion: ${reduced() ? "off" : "on"}`;
    motionButton.setAttribute("aria-pressed", String(!reduced()));
    flyButton.textContent = reduced() ? "Next viewpoint →" : "▶ Fly through";
  }
  syncMotion();
  motionButton.onclick = () => {
    stop();
    try {
      localStorage.setItem("kim-reduce", String(!reduced()));
    } catch {}
    pausedAt = 0;
    syncMotion();
  };
  const canvas = renderer.domElement;
  canvas.addEventListener("pointerdown", (e) => {
    stop();
    canvas.setPointerCapture(e.pointerId);
    pinches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    drag = true;
    last = { x: e.clientX, y: e.clientY };
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!drag) return;
    const prev = [...pinches.values()];
    pinches.set(e.pointerId, { x: e.clientX, y: e.clientY });
    const pts = [...pinches.values()];
    if (pts.length === 2 && prev.length === 2) {
      const old = Math.hypot(prev[0].x - prev[1].x, prev[0].y - prev[1].y),
        now = Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
      distance = THREE.MathUtils.clamp(distance - (now - old) * 0.025, 4, 40);
    } else {
      yaw -= (e.clientX - last.x) * 0.006;
      pitch = THREE.MathUtils.clamp(
        pitch + (e.clientY - last.y) * 0.005,
        0.2,
        1.5,
      );
    }
    last = { x: e.clientX, y: e.clientY };
    target.set(0, 0.6, 0);
    orbit();
  });
  function end(e) {
    pinches.delete(e.pointerId);
    drag = pinches.size > 0;
  }
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  canvas.addEventListener(
    "wheel",
    (e) => {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      stop();
      distance = THREE.MathUtils.clamp(distance + e.deltaY * 0.02, 4, 40);
      orbit();
    },
    { passive: false },
  );
  canvas.addEventListener("keydown", (e) => {
    if (
      ![
        "ArrowLeft",
        "ArrowRight",
        "ArrowUp",
        "ArrowDown",
        "+",
        "=",
        "-",
      ].includes(e.key)
    )
      return;
    e.preventDefault();
    stop();
    if (e.key === "ArrowLeft") yaw -= 0.15;
    if (e.key === "ArrowRight") yaw += 0.15;
    if (e.key === "ArrowUp") pitch = Math.min(1.5, pitch + 0.1);
    if (e.key === "ArrowDown") pitch = Math.max(0.2, pitch - 0.1);
    if (["+", "="].includes(e.key)) distance = Math.max(4, distance - 1);
    if (e.key === "-") distance = Math.min(40, distance + 1);
    orbit();
  });
  document.getElementById("fly").onclick = start;
  document.getElementById("reset-view").onclick = reset;
  document.getElementById("zoom-in").onclick = () => {
    stop();
    distance = Math.max(4, distance - 1.5);
    orbit();
  };
  document.getElementById("zoom-out").onclick = () => {
    stop();
    distance = Math.min(40, distance + 1.5);
    orbit();
  };
  document.getElementById("top-view").onclick = () => {
    stop();
    pitch = 1.5;
    distance = 15;
    target.set(0, 0.6, 0);
    orbit();
  };
  document.getElementById("wire").onclick = (e) => {
    grid.visible = !grid.visible;
    e.currentTarget.setAttribute("aria-pressed", String(grid.visible));
    render();
  };
  document.getElementById("route").onchange = routeChange;
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) stop();
  });
  window.addEventListener("message", (e) => {
    if (e.origin !== location.origin) return;
    if (e.data?.type === "portfolio-pause") stop();
  });
  window.addEventListener("storage", (e) => {
    if (e.key === "kim-reduce") {
      stop();
      flyButton.textContent = reduced() ? "Next viewpoint →" : "▶ Fly through";
    }
  });
} catch (error) {
  status.textContent = "Static map mode";
  document.getElementById("map-fallback").hidden = false;
  document
    .querySelectorAll(".map-tools button,.map-tools select")
    .forEach((b) => (b.disabled = true));
  console.warn("3D fallback:", error.message);
}
