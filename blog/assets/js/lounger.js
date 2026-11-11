// Doodles for the blog index: the landing page's stick figure (./shared/figure.js), floating and
// leaning back with swirls for eyes, swinging the pencil he hands you on the landing page back and
// forth so each pass lays down a highlighter stroke over the last, and a little laptop. SVG, with
// the figure animated from JS so the strokes can follow the pencil tip. doodles.js places them.
import { INK, PAPER, LEMON, BUBBLEGUM, MINT, SKY, SPRING, TAU } from "./shared/sketch.js";
import { FIGURE, PENCIL, ROUGH } from "./shared/figure.js";

// A spiral around its own origin, so each eye can spin in place
const SWIRL =
  "M0.3 0.0 L0.4 0.2 L0.5 0.4 L0.4 0.7 L0.2 0.9 L-0.2 1.1 L-0.6 1.1 L-1.1 0.9 L-1.5 0.6 L-1.8 0.0 L-1.8 -0.7 L-1.6 -1.4 " +
  "L-1.1 -2.0 L-0.4 -2.4 L0.5 -2.6 L1.4 -2.4 L2.2 -1.9 L2.9 -1.1 L3.3 -0.0 L3.2 1.2 L2.7 2.3 L1.9 3.2 L0.7 3.8 L-0.7 4.0 " +
  "L-2.1 3.7 L-3.4 2.8 L-4.3 1.6 L-4.7 0.0 L-4.6 -1.7 L-3.9 -3.2 L-2.6 -4.5 L-0.9 -5.3 L1.0 -5.5 L2.9 -4.9 L4.5 -3.8 L5.7 -2.1 L6.2 -0.0";
const WOOZY = "M28.5 40 C30.5 42.5 32.5 37.8 35 40.2 C37.5 42.6 39.5 38 41.5 40";

// His pose, in degrees: leaned back at the hip, the pencil arm reaching forward, the pencil tilted
// down to write, and how far the arm swings either way. Swinging from the shoulder alone moves the
// tip mostly up and down, so he also sways side to side (SWAY, in his units) to sweep it across.
const LEAN = 28;
const REACH = 47;
const TILT = -105;
const SWING = 4;
const SWAY = 6;
// Seconds for a full back-and-forth, and for one bob up and down
const SWING_PERIOD = 2.8;
const BOB_PERIOD = 4.2;
// The pencil's lead, in the pencil's own coordinates (see PENCIL.lead)
const LEAD = [4.5, 11.5];
// Highlighter passes alternate colors, and the oldest fades once there are more than this many
const INKS = [LEMON, BUBBLEGUM];
const MAX_PASSES = 4;

// Rendered sizes in px: the CSS width, and the height that follows from each viewBox below
export const LOUNGE_SIZE = { figure: [136, (136 * 108) / 118], laptop: [92, (92 * 68) / 104] };

const at = ([x, y]) => `${x} ${y}`;
const rough = (id) => `
  <filter id="${id}" x="-10%" y="-10%" width="120%" height="120%">
    <feTurbulence type="fractalNoise" baseFrequency="${ROUGH.baseFrequency}" numOctaves="${ROUGH.numOctaves}" seed="${ROUGH.seed}" />
    <feDisplacementMap in="SourceGraphic" scale="${ROUGH.scale}" />
  </filter>`;
const svgAttrs = `fill="none" stroke="${INK}" stroke-width="${FIGURE.stroke}" stroke-linecap="round" stroke-linejoin="round"`;

// Posed in his own 70 x 100 box: leaned back at the hip, legs dangling, one arm propped behind
// him, the other reaching forward with the pencil. The ink group sits under him.
const LOUNGER = `
<svg class="lounger" viewBox="-30 0 118 108" ${svgAttrs}>
  <defs>${rough("lounger-rough")}</defs>
  <g filter="url(#lounger-rough)">
    <g data-part="ink" stroke-width="6" opacity="0.8"></g>
    <g data-part="float">
      <g transform="rotate(${LEAN} ${at(FIGURE.hip)})">
        <g transform="rotate(-60 ${at(FIGURE.shoulder)})"><path d="${FIGURE.armR}" /></g>
        <g transform="rotate(-16 ${at(FIGURE.hip)})">${FIGURE.legs.map((d) => `<path d="${d}" />`).join("")}</g>
        <path d="${FIGURE.body}" />
        <g data-part="arm">
          <g transform="rotate(${REACH} ${at(FIGURE.shoulder)})">
            <g transform="translate(${at(FIGURE.hand)}) rotate(${TILT}) translate(${-PENCIL.grip[0]} ${-PENCIL.grip[1]})" stroke-width="${PENCIL.stroke}">
              <path d="${PENCIL.body}" fill="${LEMON}" stroke="none" />
              <path d="${PENCIL.eraser}" fill="${BUBBLEGUM}" stroke="none" />
              <path d="${PENCIL.body}" />
              <path d="${PENCIL.band}" />
              <path d="${PENCIL.wood}" fill="${PAPER}" />
              <path d="${PENCIL.lead}" fill="${INK}" />
            </g>
            <path d="${FIGURE.armL}" />
          </g>
        </g>
        <g transform="rotate(-8 ${at(FIGURE.neck)})">
          <path d="${FIGURE.head}" fill="${PAPER}" />
          ${FIGURE.eyeCenters.map((c) => `<g transform="translate(${at(c)})"><path class="eye" stroke-width="2" d="${SWIRL}" /></g>`).join("")}
          <path d="${WOOZY}" />
        </g>
      </g>
    </g>
  </g>
</svg>`;

// A laptop at real proportions (16:10 screen, thin base a little wider than it), set down at an angle
const LAPTOP = `
<svg class="laptop" viewBox="-12 -4 104 68" ${svgAttrs}>
  <defs>${rough("laptop-rough")}</defs>
  <g transform="rotate(-12 40 26)">
    <g filter="url(#laptop-rough)">
      <rect x="4" y="0" width="72" height="46" rx="4" fill="#fff" />
      <rect x="9" y="5" width="62" height="36" rx="1.5" stroke-width="1.6" />
      <path d="M15 13 H35" stroke="${SKY}" stroke-width="3.5" />
      <path d="M19 20 H47" stroke="${BUBBLEGUM}" stroke-width="3.5" />
      <path d="M19 27 H33" stroke="${MINT}" stroke-width="3.5" />
      <path d="M15 34 H41" stroke="${LEMON}" stroke-width="3.5" />
      <path d="M-6 46 H86 L84 51 C83.6 52.2 82.6 53 81.3 53 H-1.3 C-2.6 53 -3.6 52.2 -4 51 Z" fill="#fff" />
      <path d="M32 46.2 V47.8 H48 V46.2" stroke-width="1.6" />
    </g>
  </g>
</svg>`;

const STYLE = `
.lounge { position: relative; display: flex; justify-content: space-between; align-items: center; margin-top: 24px; }
.lounge.in-margins { height: 0; margin: 0; }
.lounge.in-margins > svg { position: absolute; }
.lounge svg { display: block; height: auto; overflow: visible; opacity: 0; transform: translateY(12px) scale(0.92);
  transition: opacity 0.4s, transform 0.7s ${SPRING}; }
.lounge.in svg { opacity: 1; transform: none; transition-delay: 1.5s; }
.lounge.in .laptop { transition-delay: 1.8s; }
.lounger { width: ${LOUNGE_SIZE.figure[0]}px; }
.laptop { width: ${LOUNGE_SIZE.laptop[0]}px; }
.lounger [data-part="ink"] path { mix-blend-mode: multiply; transition: opacity 1s; }
.lounger .eye { transform-box: fill-box; transform-origin: center; animation: lounger-spin 1.4s linear infinite; }
@keyframes lounger-spin { to { transform: rotate(360deg); } }
@media (prefers-reduced-motion: reduce) {
  .lounge svg, .lounge.in svg { transition: none; }
  .lounge * { animation: none !important; }
}`;

// 2D affine matrices as [a, b, c, d, e, f], like SVG's matrix()
const mul = (m, n) => [
  m[0] * n[0] + m[2] * n[1],
  m[1] * n[0] + m[3] * n[1],
  m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3],
  m[0] * n[4] + m[2] * n[5] + m[4],
  m[1] * n[4] + m[3] * n[5] + m[5],
];
const move = (x, y) => [1, 0, 0, 1, x, y];
const turn = (deg, [cx, cy] = [0, 0]) => {
  const a = (deg * Math.PI) / 180;
  return mul(mul(move(cx, cy), [Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]), move(-cx, -cy));
};
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

// Swings his arm and bobs him, and lays a highlighter stroke along wherever the pencil tip goes:
// a new stroke each time the swing turns around, multiplied over the ones before it
function animate(svg) {
  const NS = "http://www.w3.org/2000/svg";
  const float = svg.querySelector('[data-part="float"]');
  const arm = svg.querySelector('[data-part="arm"]');
  const ink = svg.querySelector('[data-part="ink"]');
  const lean = turn(LEAN, FIGURE.hip);
  const pencil = mul(
    mul(turn(REACH, FIGURE.shoulder), move(...FIGURE.hand)),
    mul(turn(TILT), move(-PENCIL.grip[0], -PENCIL.grip[1]))
  );
  const passes = [];
  let dir = 0;
  let count = 0;

  const step = (t) => {
    const phase = Math.sin((TAU * t) / SWING_PERIOD);
    // Opposite signs, so the arm swings the tip the same way he sways instead of cancelling it out
    const swing = -SWING * phase;
    const sway = SWAY * phase;
    const bob = 1.8 * Math.sin((TAU * t) / BOB_PERIOD);
    const tilt = -1 * Math.sin((TAU * t) / BOB_PERIOD);
    float.setAttribute(
      "transform",
      `translate(${sway.toFixed(2)} ${bob.toFixed(2)}) rotate(${tilt.toFixed(2)} ${at(FIGURE.hip)})`
    );
    arm.setAttribute("transform", `rotate(${swing.toFixed(2)} ${at(FIGURE.shoulder)})`);

    const m = mul(mul(mul(move(sway, bob), turn(tilt, FIGURE.hip)), lean), mul(turn(swing, FIGURE.shoulder), pencil));
    const tip = apply(m, LEAD).map((v) => +v.toFixed(1));
    const d = Math.sign(Math.cos((TAU * t) / SWING_PERIOD)) || dir;
    if (d !== dir) {
      dir = d;
      const el = document.createElementNS(NS, "path");
      el.setAttribute("stroke", INKS[count++ % INKS.length]);
      ink.append(el);
      passes.push({ el, pts: [] });
      if (passes.length > MAX_PASSES) {
        const old = passes.shift().el;
        old.style.opacity = "0";
        setTimeout(() => old.remove(), 1000);
      }
    }
    const pass = passes[passes.length - 1];
    pass.pts.push(tip);
    pass.el.setAttribute("d", "M" + pass.pts.map(at).join(" L"));
  };

  // Reduced motion: hold still with a few passes already drawn
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
    for (let t = 0; t < SWING_PERIOD * 1.6; t += 1 / 60) step(t);
    return () => {};
  }

  // Run only while he's on screen
  let raf = 0;
  let visible = false;
  const start = performance.now();
  const tick = (now) => {
    step((now - start) / 1000);
    raf = visible ? requestAnimationFrame(tick) : 0;
  };
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  }).observe(svg);
  step(0);
  return () => {};
}

// Adds the figure and the laptop after `el`, side by side, hidden until show() pops them in
export function addLounge(el) {
  const box = document.createElement("div");
  box.className = "lounge";
  box.setAttribute("aria-hidden", "true");
  box.innerHTML = `<style>${STYLE}</style>${LOUNGER}${LAPTOP}`;
  el.after(box);
  const [figure, laptop] = box.querySelectorAll("svg");
  let started = false;
  return {
    show() {
      box.classList.add("in");
      if (!started) started = !!animate(figure);
    },
    // spots: { figure: [x, y], laptop: [x, y] } top-left corners in page coordinates to lift them
    // out into the page margins, or null to leave them side by side under `el`
    place(spots) {
      box.classList.toggle("in-margins", !!spots);
      [figure, laptop].forEach((svg) => (svg.style.left = svg.style.top = ""));
      if (!spots) return;
      const r = box.getBoundingClientRect();
      [
        [figure, spots.figure],
        [laptop, spots.laptop],
      ].forEach(([svg, [x, y]]) => {
        svg.style.left = `${x - r.left - scrollX}px`;
        svg.style.top = `${y - r.top - scrollY}px`;
      });
    },
  };
}
