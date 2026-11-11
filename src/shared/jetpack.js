// The stick figure's jetpack trip between the landing page and the blog.
//
// Both pages have a handwritten link in the same spot, top right, to the other page. Clicking it
// sends him up to the link (gearing up at his dock on the landing page, or jetting off from where
// he lounges on the blog), where he erases the word with the eraser end of his pencil, flips it
// around, and writes the other page's link in its place. The page then crossfades to the other one (a view
// transition, see jetpack.css) while he hovers in place, and once it's there he flies off (on the
// blog) or lands back on his dock (on the landing page).
//
// He's an SVG built from the shared figure (./figure.js). Poses are CSS variables that the
// stylesheet transitions between, and he moves along paths with the Web Animations API.
//
// The landing page imports this; Eleventy copies src/shared/ to the blog.

import { FIGURE, PENCIL, ROUGH } from "./figure.js";
import { INK, PAPER, LEMON, BUBBLEGUM, SKY, TAU } from "./sketch.js";

const KEY = "hgg-jet";
const SVG = "http://www.w3.org/2000/svg";
// The point of the figure (in his 70 x 100 box) that his paths move, and where that point sits in
// the 170 x 170 box he's drawn in (padded for the jetpack and pencil)
const ANCHOR = [35, 70];
const PIN = [85, 100];
// The pencil (./figure.js), a little bigger. He holds it by the middle, so flipping it around puts
// the other end in the same spot. In its own box the lead is at LEAD and the eraser's end at END.
const PENCIL_K = 1.15;
const LEAD = [4.5, 11.5];
const END = [61.9, 12];
const MID = [(LEAD[0] + END[0]) / 2, (LEAD[1] + END[1]) / 2];
// Turns the pencil to hang straight down from his hand, lead first
const DOWN = 90 - (Math.atan2(LEAD[1] - MID[1], LEAD[0] - MID[0]) * 180) / Math.PI;
// Where its working end is, either way around: straight down from the hand
const TIP = [FIGURE.hand[0], FIGURE.hand[1] + Math.hypot(LEAD[0] - MID[0], LEAD[1] - MID[1]) * PENCIL_K];

const lerp = (a, b, t) => a + (b - a) * t;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// How long he takes to erase the old word and to write the new one, and each slow dip of the pencil
// along the way, in ms (see rewrite)
const ERASE_MS = 520;
const WRITE_MS = 780;
const WOBBLE = 260;
const rotate = (deg, [x, y]) => {
  const a = (deg * Math.PI) / 180;
  return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
};
const bezier = (a, c, b, n = 24) =>
  Array.from({ length: n + 1 }, (_, i) => {
    const u = i / n;
    return [(1 - u) ** 2 * a[0] + 2 * (1 - u) * u * c[0] + u * u * b[0], (1 - u) ** 2 * a[1] + 2 * (1 - u) * u * c[1] + u * u * b[1]];
  });

// ---- Poses ----
// Angles in degrees, k is his scale, lean tilts his whole body around its middle and tilt around
// his feet (like the docked figure's lean). ex/ey is where he's looking, and his head turns with
// it unless `head` says otherwise. `side` is 1 when he works on a word from its right and -1 from
// its left.

const REST = {
  armL: 16, armR: -16, wrist: 0, legs: 0, ex: 0, ey: 0, head: 0, oh: 0, k: 1, lean: 0, tilt: 0,
  pencil: 0, spin: 0, pack: 0, packX: 20, packY: 7, packR: 22, straps: 0, flame: 0,
};
const GEARED = { pack: 1, packX: 0, packY: 0, packR: 0, straps: 1 };
const FLYING = { ...GEARED, armL: 30, armR: -30, flame: 1 };
// Arm out to the side and the pencil angled up to the word beside him, eraser first (spin turns
// it end for end). The link is near the top of the screen, so his head stays level with the word,
// leaning back from it, with his arm and the pencil clear of his head.
const writing = (side) => ({ ...GEARED, armL: 85 * side, wrist: 40 * side, armR: -30 * side, lean: 8 * side, k: 0.7, pencil: 1, spin: 180 * side, flame: 0.5, ex: -4 * side, ey: -2 });
// Flipped to the lead, once he's written the word
const done = (side) => ({ ...writing(side), spin: 0, lean: 0, ex: 0, ey: 0 });

const UNITS = { armL: "deg", armR: "deg", wrist: "deg", spin: "deg", legs: "deg", head: "deg", lean: "deg", tilt: "deg", packR: "deg", packX: "px", packY: "px" };
const cssName = (k) => "--jet-" + k.replace(/[A-Z]/g, (c) => "-" + c.toLowerCase());

// Where the pencil's working end ends up, relative to his anchor, in a pose
function tipOffset({ armL, wrist, k, lean }) {
  const [hx, hy] = FIGURE.hand;
  const [sx, sy] = FIGURE.shoulder;
  const [bx, by] = rotate(wrist, [TIP[0] - hx, TIP[1] - hy]);
  const [ax, ay] = rotate(armL, [hx + bx - sx, hy + by - sy]);
  return rotate(lean, [(sx + ax - ANCHOR[0]) * k, (sy + ay - ANCHOR[1]) * k]);
}

// ---- The figure ----

const flame = (x) =>
  `<g class="jet-flame" style="transform-origin:${x}px 80.5px">` +
  `<path d="M${x - 2.4} 80.5 C${x - 3} 86 ${x - 1.2} 91 ${x} 96.5 C${x + 1.2} 91 ${x + 3} 86 ${x + 2.4} 80.5 Z" fill="${LEMON}" stroke="none"/>` +
  `<path d="M${x - 1.1} 80.5 C${x - 1.3} 84 ${x - 0.6} 87.5 ${x} 90.5 C${x + 0.6} 87.5 ${x + 1.3} 84 ${x + 1.1} 80.5 Z" fill="${BUBBLEGUM}" stroke="none"/></g>`;

const tank = (x) =>
  `<rect x="${x - 4}" y="57" width="8" height="20" rx="4" fill="${SKY}"/>` +
  `<path d="M${x - 1.3} 61 V64.5" stroke-width="1.6"/>` +
  `<path d="M${x - 2.4} 77 L${x - 3} 80.5 H${x + 3} L${x + 2.4} 77" fill="${PAPER}"/>` +
  `<circle class="jet-nozzle" cx="${x}" cy="82" r="1" stroke="none"/>`;

const MARKUP = `
<div class="jet-body">
  <svg width="170" height="170" viewBox="-50 -30 170 170" fill="none" stroke="${INK}" stroke-width="${FIGURE.stroke}" stroke-linecap="round" stroke-linejoin="round">
    <defs>
      <filter id="jet-rough" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="${ROUGH.baseFrequency}" numOctaves="${ROUGH.numOctaves}" seed="${ROUGH.seed}"/>
        <feDisplacementMap in="SourceGraphic" scale="${ROUGH.scale}"/>
      </filter>
    </defs>
    <g filter="url(#jet-rough)">
      <g class="jet-pack">
        <g class="jet-flames">${flame(28)}${flame(42)}</g>
        <path d="M31 63.5 H39"/>
        ${tank(28)}${tank(42)}
      </g>
      <g class="jet-arm-r"><path d="${FIGURE.armR}"/></g>
      <g class="jet-legs">${FIGURE.legs.map((d) => `<path d="${d}"/>`).join("")}</g>
      <path d="${FIGURE.body}"/>
      <path class="jet-straps" d="M30.5 58.5 L35 64.5 L39.5 58.5" stroke-width="2"/>
      <g class="jet-arm-l">
        <g class="jet-pencil">
          <g transform="translate(${FIGURE.hand.join(" ")}) rotate(${DOWN}) scale(${PENCIL_K}) translate(${-MID[0]} ${-MID[1]})" stroke-width="${PENCIL.stroke}">
            <path d="${PENCIL.body}" fill="${LEMON}" stroke="none"/>
            <path d="${PENCIL.eraser}" fill="${BUBBLEGUM}" stroke="none"/>
            <path d="${PENCIL.body}"/>
            <path d="${PENCIL.band}"/>
            <path d="${PENCIL.wood}" fill="${PAPER}"/>
            <path d="${PENCIL.lead}" fill="${INK}"/>
          </g>
        </g>
        <path d="${FIGURE.armL}"/>
      </g>
      <g class="jet-head">
        <path d="${FIGURE.head}" fill="${PAPER}"/>
        <g class="jet-eyes">${FIGURE.eyes.map((d) => `<path d="${d}" stroke-width="3.4"/>`).join("")}</g>
        <path class="jet-smile" d="${FIGURE.smile}"/>
        <path class="jet-oh" d="${FIGURE.oh}"/>
      </g>
    </g>
  </svg>
  <div class="jet-say"></div>
</div>`;

// A little hand-drawn exhaust loop, curl, or colored dot, drifting off and fading. `size` scales it
// up for a bigger cloud.
function puff(x, y, lean, size = 1) {
  const s = document.createElementNS(SVG, "svg");
  s.setAttribute("class", "jet-puff");
  s.setAttribute("aria-hidden", "true");
  s.setAttribute("viewBox", "-12 -12 24 24");
  const roll = Math.random();
  if (roll < 0.15) {
    s.innerHTML = `<circle r="2.6" fill="${Math.random() < 0.5 ? LEMON : BUBBLEGUM}"/>`;
  } else {
    const r = 4 + Math.random() * 3;
    const a0 = Math.random() * 6.28;
    const turns = roll < 0.32 ? 1.6 : 1.1 + Math.random() * 0.2;
    let d = "";
    for (let k = 0; k <= 18; k++) {
      const f = k / 18;
      const a = a0 + f * turns * 6.28;
      const rr = roll < 0.32 ? r * (0.2 + 0.8 * f) : r * (1 + 0.08 * Math.sin(a * 3));
      d += `${k ? "L" : "M"}${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr * 0.85).toFixed(1)}`;
    }
    s.innerHTML = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`;
  }
  s.style.translate = `${x - 12}px ${y - 12}px`;
  document.body.appendChild(s);
  const a = ((90 + lean + (Math.random() - 0.5) * 70) * Math.PI) / 180;
  const dist = 22 + Math.random() * 38;
  s.animate(
    [
      { transform: `scale(${0.35 * size})`, opacity: 1 },
      { opacity: 1, offset: 0.45 },
      { transform: `translate(${Math.cos(a) * dist * size}px, ${Math.sin(a) * dist * size}px) scale(${(1 + Math.random() * 0.5) * size})`, opacity: 0 },
    ],
    { duration: 600 + Math.random() * 400, easing: "cubic-bezier(.2,.8,.4,1)" }
  ).finished.then(() => s.remove(), () => s.remove());
}

function makeBuddy() {
  const el = document.createElement("div");
  el.className = "jet-buddy";
  el.setAttribute("aria-hidden", "true");
  el.innerHTML = MARKUP;
  const body = el.querySelector(".jet-body");
  // For squash and wiggle, which pivot on his feet (see jetpack.css)
  const svg = el.querySelector("svg");
  const bubble = el.querySelector(".jet-say");
  const nozzles = [...el.querySelectorAll(".jet-nozzle")];
  let pose = {};
  let motion = null;
  let at = [0, 0];
  let exhaust = 0;

  const set = (vars, instant = false) => {
    if ("ex" in vars && !("head" in vars)) vars = { ...vars, head: vars.ex * 1.4 };
    pose = { ...pose, ...vars };
    if (instant) el.classList.add("jet-instant");
    for (const [k, v] of Object.entries(vars)) el.style.setProperty(cssName(k), v + (UNITS[k] || ""));
    if (instant) {
      el.getBoundingClientRect();
      el.classList.remove("jet-instant");
    }
  };
  const place = ([x, y]) => {
    at = [x, y];
    el.style.translate = `${x - PIN[0]}px ${y - PIN[1]}px`;
  };
  // Move his anchor through a list of points
  const along = (pts, duration, easing = "ease-in-out") => {
    motion && motion.cancel();
    motion = el.animate(
      pts.map(([x, y]) => ({ translate: `${x - PIN[0]}px ${y - PIN[1]}px` })),
      { duration, easing, fill: "forwards" }
    );
    return motion.finished.then(
      () => place(pts[pts.length - 1]),
      () => {}
    );
  };
  // Legs swinging while he's on the move (still while he hovers, so he looks the same on both
  // sides of a page change)
  const dangle = (on) => el.toggleAttribute("data-flying", on);
  // Puffs out of both nozzles while he's under thrust
  const thrust = (on) => {
    clearInterval(exhaust);
    if (!on) return;
    exhaust = setInterval(() => {
      if (Math.random() > 0.3 + 0.7 * (pose.flame || 0)) return;
      nozzles.forEach((n) => {
        const r = n.getBoundingClientRect();
        puff(r.left + r.width / 2, r.top + r.height / 2, pose.lean || 0);
      });
    }, 70);
  };
  // A cloud of exhaust all around him, to take off (or vanish) in
  const poof = (n = 14) => {
    for (let i = 0; i < n; i++) {
      const a = (i / n) * 360 + Math.random() * 20;
      const r = 8 + Math.random() * 22;
      puff(at[0] + Math.cos((a * Math.PI) / 180) * r, at[1] - 12 + Math.sin((a * Math.PI) / 180) * r * 1.3, a - 90, 1.8);
    }
  };
  const burst = (n = 4) => {
    for (let i = 0; i < n; i++) {
      nozzles.forEach((nz) => {
        const r = nz.getBoundingClientRect();
        puff(r.left + r.width / 2, r.top + r.height / 2, pose.lean || 0);
      });
    }
  };
  const say = (text) => {
    if (text) bubble.textContent = text;
    el.toggleAttribute("data-say", !!text);
  };
  const remove = () => {
    thrust(false);
    dangle(false);
    motion && motion.cancel();
    el.remove();
  };

  set(REST, true);
  return { el, svg, set, place, along, thrust, dangle, burst, poof, say, remove, at: () => at };
}

// ---- The link ----

// An element's untransformed box in viewport coordinates (the link is tilted a few degrees)
const layoutBox = (el) => {
  const r = el.getBoundingClientRect();
  const w = el.offsetWidth;
  const h = el.offsetHeight;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  return { l: cx - w / 2, r: cx + w / 2, t: cy - h / 2, w, h, cy };
};

// Erase the link's word and write its data-rewrite text in the same spot, pencil first. The new
// word is a copy of the link, so it's in the same hand, right-aligned where the old one was (which
// is where the link sits on the other page). Ends with him out of the word's way. Returns the
// pieces to undo.
async function rewrite(b, link, side, live) {
  const old = layoutBox(link);
  const word = link.cloneNode(false);
  word.textContent = link.getAttribute("data-rewrite");
  word.removeAttribute("href");
  word.removeAttribute("data-rewrite");
  word.setAttribute("aria-hidden", "true");
  Object.assign(word.style, { position: "fixed", left: "0", top: "0", margin: "0", pointerEvents: "none", transition: "none", clipPath: "inset(0 100% 0 0)" });
  link.parentNode.appendChild(word);
  const nl = old.r - word.offsetWidth;
  word.style.left = nl + "px";
  word.style.top = old.cy - word.offsetHeight / 2 + "px";
  const undo = [() => word.remove()];

  const off = tipOffset({ ...REST, ...writing(side) });
  const anchor = (x, y) => [x - off[0], y - off[1]];
  const from = side > 0 ? old.r + 3 : old.l - 3;
  const to = side > 0 ? old.l - 2 : old.r + 2;
  const cy = old.cy;
  // A pass of the pencil from x0 to x1 over `ms`, with his little up and down: a slow, smooth dip
  // `depth` px below the line every WOBBLE ms. Only below, since his head is already near the top
  // of the screen.
  const pass = (x0, x1, depth, ms) => {
    const dips = Math.max(1, Math.round(ms / WOBBLE));
    const n = dips * 12;
    return Array.from({ length: n + 1 }, (_, i) => anchor(lerp(x0, x1, i / n), cy + (depth / 2) * (1 - Math.cos((TAU * dips * i) / n))));
  };

  // Scrub back and forth across the old word with the eraser while it disappears behind it
  const scrub = pass(from, to, 6, ERASE_MS);
  const erase = link.animate(
    side > 0
      ? [{ clipPath: "inset(-40% -10px -40% -10px)" }, { clipPath: "inset(-40% 100% -40% -10px)" }]
      : [{ clipPath: "inset(-40% -10px -40% -10px)" }, { clipPath: "inset(-40% -10px -40% 100%)" }],
    { duration: ERASE_MS, fill: "forwards" }
  );
  undo.push(() => erase.cancel());
  await b.along(scrub, ERASE_MS, "linear");
  if (!live()) return undo;
  // Flip the pencil around to the lead while he glides over to where the new word starts (no room
  // to lift it), then write it out with a little up and down
  b.set({ spin: 0 });
  await b.along([anchor(to, cy), anchor(nl - 2, cy)], 420);
  if (!live()) return undo;
  const pen = pass(nl - 2, old.r + 2, 3, WRITE_MS);
  word.animate([{ clipPath: "inset(-40% 100% -40% -10px)" }, { clipPath: "inset(-40% -10px -40% -10px)" }], { duration: WRITE_MS, fill: "forwards" });
  await b.along(pen, WRITE_MS, "linear");
  if (!live()) return undo;
  // Out of the way of the word. On the left he has to dodge past all of it, since he wrote it
  // toward himself.
  const [ex, ey] = anchor(old.r + 2, cy);
  b.set(done(side));
  const x = side > 0 ? Math.max(ex + 16, old.r + 30) : Math.min(ex - 16, nl - 30);
  await b.along([[ex, ey], [x, ey + 4]], 260, "ease-out");
  return undo;
}

// ---- Page to page ----

const prefetched = new Set();

function prefetch(href) {
  if (prefetched.has(href)) return;
  prefetched.add(href);
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = href;
  document.head.appendChild(link);
}

// While the jetpack copy of him is out, any other drawing of him on the page (the blog's lounger)
// is hidden by jetpack.css, so there's only ever one of him
const out = (on) => document.documentElement.toggleAttribute("data-jet", on);

// Only our hand-off gets the crossfade between pages; every other navigation skips it
let leaving = false;
addEventListener("pageswap", (e) => {
  if (e.viewTransition && !leaving) e.viewTransition.skipTransition();
});

// Resolves once the crossfade into this page is over. Until then the old page's picture of him is
// still showing, so moving the real him would leave an afterimage. (A transition into the page is
// already running by the first animation frame.)
const crossfadeDone = () =>
  new Promise((resolve) => {
    const start = performance.now();
    const check = () => {
      let active = false;
      try {
        active = document.documentElement.matches(":active-view-transition");
      } catch (_) {}
      if (!active || performance.now() - start > 2000) resolve();
      else requestAnimationFrame(check);
    };
    requestAnimationFrame(check);
  });

// Arriving mid-trip: put him back exactly where he was on the last page. He stays hidden until the
// crossfade into this page is over, while the last page's picture of him holds the spot
// (jetpack.css).
let arrival = null;
try {
  const jet = JSON.parse(sessionStorage.getItem(KEY));
  sessionStorage.removeItem(KEY);
  if (jet && jet.to === location.pathname && Date.now() - jet.t < 10000 && !reducedMotion() && document.body) {
    const b = makeBuddy();
    b.set({ ...REST, ...done(jet.side), flame: 0.5 }, true);
    b.place([jet.x, jet.y]);
    b.el.setAttribute("data-arrived", "");
    out(true);
    document.body.appendChild(b.el);
    b.thrust(true);
    arrival = { b, ...jet };
  }
} catch (_) {}

// True while he's still flying in to land on this page
export const arriving = () => !!arrival;

// Finish the trip on this page: land on the dock if the page has one (the landing page), or fly
// off. `dock` returns the docked figure's { el, pose } (see hookLink). `onLanded` runs once he's
// down (or gone), when the docked figure should take over.
export function arrive({ dock, onLanded } = {}) {
  if (!arrival) return;
  const { b, side } = arrival;
  arrival = null;
  let over = false;
  const live = () => !over;
  const finish = () => {
    if (over) return;
    over = true;
    ["pointerdown", "keydown", "wheel"].forEach((n) => removeEventListener(n, finish, true));
    b.remove();
    out(false);
    onLanded && onLanded();
  };
  ["pointerdown", "keydown", "wheel"].forEach((n) => addEventListener(n, finish, { capture: true, passive: true }));

  (async () => {
    await crossfadeDone();
    await wait(150);
    if (!live()) return;
    const [x, y] = b.at();
    const W = document.documentElement.clientWidth;
    const H = window.innerHeight;
    b.set({ ...FLYING, pencil: 0, k: 0.88, ex: 0, ey: 2 });
    b.dangle(true);
    b.burst(3);
    if (dock) {
      // Down to his spot in the corner
      const d = dock();
      const r = d && d.el && d.el.getBoundingClientRect();
      const onScreen = r && r.top < H;
      const home = onScreen ? [r.left + ANCHOR[0], r.top + ANCHOR[1]] : [W - 50, H + 120];
      b.set({ k: 1, lean: 4 * side, ey: 3 });
      await b.along(bezier([x, y], [Math.max(x, home[0]) + 50, lerp(y, home[1], 0.35)], home), 1000);
      if (!live()) return;
      if (onScreen) {
        // Touch down, unstrap, and toss the jetpack back off the edge of the screen
        b.thrust(false);
        b.dangle(false);
        b.set({ ...REST, pack: 1, packX: 0, packY: 0, packR: 0, straps: 1 });
        b.svg.animate([{ transform: "none" }, { transform: "scale(1.07, .9)", offset: 0.4 }, { transform: "none" }], { duration: 300 });
        await wait(280);
        b.set({ straps: 0, armR: -60, packX: 21, packY: 3, packR: 18, ex: 3, ey: 2 });
        await wait(300);
        b.set({ armR: -100, tilt: 7, ex: 4, ey: -1, packX: W - home[0] + 60, packY: -30, packR: 70 });
        await wait(420);
        // Settle into exactly how the docked figure is standing right now, then hand over to it
        b.set({ ...REST, ...(d.pose || {}), pack: 0 });
        await wait(480);
      }
    } else {
      // Dip, then off the right side of the screen
      b.set({ lean: 14 });
      await b.along(bezier([x, y], [x + 60, y + 150], [W + 160, y + 60]), 900, "cubic-bezier(.45,0,.8,.4)");
    }
    finish();
  })();
}

// Wires up a [data-rewrite] link: prefetch on hover or focus, the trip on click, and cleanup when
// the page comes back from the back/forward cache. New-tab clicks and reduced motion just follow
// the link. `figure` (the landing page) returns the docked figure as { el, pose }, where pose is
// how he's standing right now in this file's terms, so the jetpack copy of him can take over
// without a jump; without it he swoops in from the side. Returns a function that unhooks everything.
export function hookLink(link, { figure, onStart, onRestore } = {}) {
  let trip = null;
  const pre = () => prefetch(link.href);
  const click = (e) => {
    if (e.defaultPrevented || e.button > 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    if (reducedMotion()) return;
    e.preventDefault();
    if (trip) return trip.go();
    const box = layoutBox(link);
    if (box.t < 2 || box.t + box.h > window.innerHeight - 2) return (location.href = link.href);
    trip = depart(link, figure && figure());
    onStart && onStart();
  };
  const show = (e) => {
    if (!e.persisted || !trip) return;
    trip.undo();
    trip = null;
    onRestore && onRestore();
  };
  link.addEventListener("click", click);
  link.addEventListener("pointerenter", pre);
  link.addEventListener("focus", pre);
  window.addEventListener("pageshow", show);
  return () => {
    link.removeEventListener("click", click);
    link.removeEventListener("pointerenter", pre);
    link.removeEventListener("focus", pre);
    window.removeEventListener("pageshow", show);
    trip && trip.undo();
  };
}

function depart(link, dockFigure) {
  const dockEl = dockFigure && dockFigure.el;
  const href = link.href;
  const b = makeBuddy();
  const W = document.documentElement.clientWidth;
  const H = window.innerHeight;
  const old = layoutBox(link);
  // He works on the word from whichever side has room
  const side = W - old.r >= 80 ? 1 : -1;
  const write = writing(side);
  const off = tipOffset({ ...REST, ...write });
  const hover = [(side > 0 ? old.r + 3 : old.l - 3) - off[0], old.cy - off[1]];
  let over = false;
  let undoWord = [];
  const live = () => !over;

  const go = (handOff = false) => {
    if (over && !handOff) return;
    over = true;
    try {
      if (handOff) {
        const [x, y] = b.at();
        sessionStorage.setItem(KEY, JSON.stringify({ t: Date.now(), to: new URL(href).pathname, x, y, side }));
      } else sessionStorage.removeItem(KEY);
    } catch (_) {}
    leaving = true;
    location.href = href;
  };
  // Clicking or pressing a key in the meantime just goes there now, without also following
  // whatever link was under the click
  const skip = (e) => {
    if (e.type === "keydown" && ["Shift", "Control", "Alt", "Meta"].includes(e.key)) return;
    go();
  };
  const swallow = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  addEventListener("pointerdown", skip, true);
  addEventListener("keydown", skip, true);
  addEventListener("click", swallow, true);

  (async () => {
    const dock = dockEl && dockEl.getBoundingClientRect();
    const docked = dock && dock.bottom > 0 && dock.top < H - 30;
    if (dockEl) {
      // From his dock: "on it!", haul a jetpack in from off the edge of the screen, strap in, and
      // lift off. He starts out standing exactly as the docked figure was.
      const start = docked ? [dock.left + ANCHOR[0], dock.top + ANCHOR[1]] : [W - 40, H + 90];
      b.place(start);
      if (docked) {
        b.set({ ...dockFigure.pose, pack: 1, packX: W - start[0] + 40, packY: -8, packR: 0 }, true);
        document.body.appendChild(b.el);
        await wait(100);
        b.say("on it!");
        b.set({ ex: 4, ey: 0, oh: 0, armL: 16, tilt: 0 });
        await wait(200);
        // Lean over and reach off the edge...
        b.set({ armR: -95, tilt: 8 });
        await wait(260);
        // ...and pull it in
        b.set({ packX: 21, packY: 3, packR: 18 });
        await wait(380);
        b.set({ tilt: 0, armR: -60, ex: 3, ey: 2 });
        await wait(200);
        // Swing it onto his back
        b.set({ packX: 0, packY: 0, packR: 0, armR: -16 });
        await wait(180);
        b.set({ straps: 1, ex: 0, ey: 0 });
        b.svg.animate([{ transform: "none" }, { transform: "rotate(6deg)" }, { transform: "rotate(-5deg)" }, { transform: "rotate(3deg)" }, { transform: "none" }], { duration: 320 });
        await wait(300);
        b.say(false);
      } else {
        b.set(GEARED, true);
        document.body.appendChild(b.el);
      }
      if (!live()) return;
      b.set({ flame: 1, oh: 1, ey: 3 });
      b.thrust(true);
      b.burst(3);
      b.svg.animate([{ transform: "none" }, { transform: "scale(1.07, .9)", offset: 0.5 }, { transform: "scale(.95, 1.12)", offset: 0.8 }, { transform: "none" }], { duration: 380 });
      await wait(260);
      b.set({ ...FLYING, oh: 0, ey: -3, k: write.k });
      b.dangle(true);
      await b.along(bezier(start, [start[0], hover[1]], hover), 600);
      b.dangle(false);
    } else {
      // From the side. If he's lounging in the margin (the blog's lounger, blog/assets/js/lounger.js),
      // he jets off from there in a puff of exhaust; otherwise he swoops in from the right edge,
      // a couple hundred pixels down. Either way he curves up and settles beside the link, without
      // rising above it (it's near the top of the screen, and his head would go off the top).
      const lounger = document.querySelector(".lounger");
      const lr = lounger && lounger.getBoundingClientRect();
      const lounging = lr && lr.width > 0 && lr.top > 0 && lr.bottom < H && +getComputedStyle(lounger).opacity > 0.5;
      // The lounger draws him in a 118-unit-wide box with his 70 x 100 figure box at x = 30
      const scale = lounging ? lr.width / 118 : write.k;
      const start = lounging ? [lr.left + (ANCHOR[0] + 30) * scale, lr.top + ANCHOR[1] * scale] : [W + 70, 200];
      const heading = Math.sign(hover[0] - start[0]) || -1;
      b.set({ ...FLYING, k: scale, lean: 12 * heading, ex: 3 * heading }, true);
      b.place(start);
      document.body.appendChild(b.el);
      out(true);
      b.thrust(true);
      b.dangle(true);
      if (lounging) b.poof();
      b.set({ k: write.k });
      setTimeout(() => b.set({ lean: write.lean }), 500);
      await b.along(bezier(start, [lerp(start[0], hover[0], lounging ? 0.3 : 0.5), Math.min(start[1], hover[1])], hover), lounging ? 950 : 750);
      b.dangle(false);
      if (!live()) return;
      // A beat to look at the camera
      b.set({ ex: 0, ey: 0, flame: 0.5 });
      await wait(250);
    }
    if (!live()) return;
    // Out comes the pencil, eraser end toward the word
    b.set({ pencil: 1, spin: write.spin });
    await wait(120);
    b.set(write);
    await wait(320);
    if (!live()) return;
    undoWord = await rewrite(b, link, side, live);
    if (!live()) return;
    // Let his last pose change finish springing into place, so the picture of him the next page
    // starts from matches where it puts him
    await wait(320);
    if (live()) go(true);
  })();

  return {
    go: () => go(),
    // For a page restored from the back/forward cache
    undo() {
      out(false);
      over = true;
      leaving = false;
      removeEventListener("pointerdown", skip, true);
      removeEventListener("keydown", skip, true);
      removeEventListener("click", swallow, true);
      undoWord.forEach((u) => u());
      b.remove();
    },
  };
}
