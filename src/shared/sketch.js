// The hand-drawn toolkit both pages share: the palette, seeded wobble, highlighter swipes,
// stroke rendering, and the draw-in animation.
//
// Used by the landing page (src/components/layouts/PortfolioLayout.jsx), the blog's doodles
// (blog/assets/js/doodles.js), and the jetpack hand-off (./jetpack.js). Plain browser JS with no
// dependencies: Vite bundles it for the landing page, and Eleventy copies src/shared/ to
// /blog/assets/js/shared/ for the blog.

export const INK = "oklch(0.26 0.02 265)";
export const PAPER = "oklch(0.985 0.006 85)";

// Highlighter colors, as sRGB hex rather than oklch: bubblegum and sky sit just outside sRGB as
// oklch, and a canvas drawing an out-of-gamut color at partial opacity wraps the overflowing
// channel (pink turns cyan).
export const LEMON = "#f5df74";
export const BUBBLEGUM = "#ffb3d5";
export const MINT = "#8defc6";
export const SKY = "#95dbff";
export const HIGHLIGHTERS = [
  ["Lemon", LEMON],
  ["Bubblegum", BUBBLEGUM],
  ["Mint", MINT],
  ["Sky", SKY],
];

export const SPRING = "cubic-bezier(.34,1.56,.64,1)";
export const TAU = Math.PI * 2;
export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const outCubic = (u) => 1 - (1 - u) ** 3;

// Seeded PRNG (mulberry32), so a mark wobbles the same way on every load
export function rng(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Resample a polyline every `step` px and give it a slow wobble of up to `amp` px, since nobody
// draws a perfectly straight line
export function wobble(pts, r, step, amp) {
  if (pts.length < 2) return pts;
  const out = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const [x0, y0] = pts[i - 1];
    const [x1, y1] = pts[i];
    const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
    for (let k = 1; k <= n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
  }
  const f1 = 0.15 + r() * 0.1;
  const f2 = 0.12 + r() * 0.1;
  const p1 = r() * TAU;
  const p2 = r() * TAU;
  return out.map(([x, y], i) => [x + amp * Math.sin(i * f1 + p1), y + amp * Math.sin(i * f2 + p2)]);
}

// A highlighter swipe behind one line box of text, slightly tilted and uneven. q is
// { left, top, width, height }, and the points come back in the same coordinate space.
export function highlightSwipe(q, r) {
  const w = q.height * 0.72;
  const y = q.top + q.height * 0.56;
  const tilt = (r() - 0.5) * 3;
  // Round caps reach w/2 past each end, so start and stop inside the text
  const inset = w / 2 - 3;
  const x0 = q.left + inset;
  const span = Math.max(1, q.width - inset * 2);
  const pts = [];
  for (let k = 0; k <= 14; k++) {
    const t = k / 14;
    pts.push([x0 + t * span, y + tilt * (t - 0.5) + (r() - 0.5) * 1.2]);
  }
  return { w, pts };
}

// Draw the first n points of a stroke ({ t: "pen" | "hl" | "er", c, w, pts }), smoothed through
// midpoints. Highlighter multiplies, so overlapping swipes layer like real ink and pen lines show
// through it; the eraser cuts through everything drawn before it.
export function drawStroke(ctx, st, n = st.pts.length) {
  if (n < 1) return;
  const p = st.pts;
  ctx.globalCompositeOperation = st.t === "er" ? "destination-out" : st.t === "hl" ? "multiply" : "source-over";
  ctx.strokeStyle = st.t === "er" ? "#000" : st.c;
  ctx.lineWidth = st.w;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(p[0][0], p[0][1]);
  if (n === 1) ctx.lineTo(p[0][0] + 0.01, p[0][1]);
  for (let i = 1; i < n - 1; i++) {
    ctx.quadraticCurveTo(p[i][0], p[i][1], (p[i][0] + p[i + 1][0]) / 2, (p[i][1] + p[i + 1][1]) / 2);
  }
  if (n > 1) ctx.lineTo(p[n - 1][0], p[n - 1][1]);
  ctx.stroke();
}

// Draw marks in over time: each mark's p eases from 0 to 1 across its own delay and dur (ms).
// getMarks is read every frame so the marks can be rebuilt mid-animation (say, on resize).
// Returns a function that stops the animation.
export function playMarks(getMarks, draw, onDone) {
  const start = performance.now();
  let raf = requestAnimationFrame(function tick(now) {
    let finished = true;
    getMarks().forEach((m) => {
      const t = clamp((now - start - m.delay) / m.dur);
      m.p = outCubic(t);
      if (t < 1) finished = false;
    });
    draw();
    if (finished) onDone && onDone();
    else raf = requestAnimationFrame(tick);
  });
  return () => cancelAnimationFrame(raf);
}
