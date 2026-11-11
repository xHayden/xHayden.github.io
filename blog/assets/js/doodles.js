// Hand-drawn doodles over the blog index, drawn with the landing page's toolkit
// (src/shared/sketch.js, which Eleventy copies to ./shared/). Strokes are rebuilt from the
// layout on resize, so they stay attached to the text they decorate.
import { INK, LEMON, BUBBLEGUM, MINT, SKY, TAU, rng, wobble, highlightSwipe, drawStroke, playMarks } from "./shared/sketch.js";
import { addLounge, LOUNGE_SIZE } from "./lounger.js";

const COLORS = { lemon: LEMON, bubblegum: BUBBLEGUM, mint: MINT, sky: SKY };
const PEN = 2.4;

const cv = document.createElement("canvas");
cv.setAttribute("aria-hidden", "true");
cv.style.cssText = "position:absolute;top:0;left:0;pointer-events:none;z-index:10;mix-blend-mode:multiply";
document.body.appendChild(cv);
const ctx = cv.getContext("2d");

let marks = [];
let dpr = 1;
let done = matchMedia("(prefers-reduced-motion: reduce)").matches;

// Page-space boxes for elements and for the text inside them
const box = (q) => ({ l: q.left + scrollX, t: q.top + scrollY, r: q.right + scrollX, b: q.bottom + scrollY, w: q.width, h: q.height });
const textRects = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  return Array.from(range.getClientRects()).filter((q) => q.width > 2).map(box);
};

// ---- Shapes, in a local box around (0, 0) ----

const ellipse = (cx, cy, rx, ry, from = 0, turns = 1, n = 32) => {
  const pts = [];
  for (let k = 0; k <= n; k++) {
    const a = from + (k / n) * turns * TAU;
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
};

// Unit-radius star, outlined then colored in with overlapping highlighter streaks
const star = () => {
  const pts = [];
  for (let k = 0; k <= 10; k++) {
    const a = -Math.PI / 2 + (k * Math.PI) / 5;
    const rad = k % 2 ? 0.44 : 1;
    pts.push([Math.cos(a) * rad, Math.sin(a) * rad]);
  }
  pts.push([pts[0][0] * 0.7 + pts[1][0] * 0.3, pts[0][1] * 0.7 + pts[1][1] * 0.3]);
  const clip = pts.slice(0, 10).map(([x, y]) => [x * 1.08, y * 1.08]);
  return [
    { t: "pen", c: INK, w: PEN, pts },
    { t: "hl", c: COLORS.lemon, w: 0.5, clip, pts: [[-1, -0.35], [1, -0.45]] },
    { t: "hl", c: COLORS.lemon, w: 0.5, clip, pts: [[-1, 0.05], [1, -0.05]] },
    { t: "hl", c: COLORS.lemon, w: 0.5, clip, pts: [[-0.9, 0.5], [0.9, 0.4]] },
  ];
};

// Rocket pointing up, about 52 x 112 at scale 1. Lemon and bubblegum flames overlap to show layering.
const rocket = () => {
  const body = [[-14, 26], [-14, -12], [-12, -28], [-7, -42], [0, -52], [7, -42], [12, -28], [14, -12], [14, 26], [-14, 26], [-14, 20]];
  const clip = body.slice(0, 9);
  const win = ellipse(0, -14, 7, 7, -Math.PI / 2, 1.06, 20);
  return [
    { t: "pen", c: INK, w: PEN, pts: body },
    { t: "pen", c: INK, w: PEN, pts: [[-14, 6], [-26, 30], [-24, 33], [-14, 26]] },
    { t: "pen", c: INK, w: PEN, pts: [[14, 6], [26, 30], [24, 33], [14, 26]] },
    { t: "pen", c: INK, w: PEN, pts: win },
    { t: "hl", c: COLORS.sky, w: 6, clip: ellipse(0, -14, 7.5, 7.5, 0, 1, 16), pts: [[-8, -17], [8, -18]] },
    { t: "hl", c: COLORS.sky, w: 6, clip: ellipse(0, -14, 7.5, 7.5, 0, 1, 16), pts: [[-8, -11], [8, -12]] },
    { t: "hl", c: COLORS.bubblegum, w: 7, clip, pts: [[-16, 10], [16, 8]] },
    { t: "hl", c: COLORS.lemon, w: 9, pts: [[-7, 31], [0, 52], [7, 31]] },
    { t: "hl", c: COLORS.bubblegum, w: 7, pts: [[0, 31], [0, 60]] },
    { t: "pen", c: INK, w: 2, pts: [[-19, 42], [-23, 54]] },
    { t: "pen", c: INK, w: 2, pts: [[19, 42], [23, 54]] },
  ];
};

// Ringed planet, radius 15
const planet = () => {
  const clip = ellipse(0, 0, 16, 16, 0, 1, 20);
  const ring = ellipse(0, 0, 28, 7, -0.1 * Math.PI, 0.62, 24).map(([x, y]) => {
    const a = -0.35;
    return [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
  });
  return [
    { t: "pen", c: INK, w: PEN, pts: ellipse(0, 0, 15, 15, -2.2, 1.05, 30) },
    { t: "hl", c: COLORS.mint, w: 13, clip, pts: [[-18, -7], [18, -11]] },
    { t: "hl", c: COLORS.mint, w: 13, clip, pts: [[-18, 6], [18, 2]] },
    { t: "pen", c: INK, w: PEN, pts: ring },
  ];
};

const spiral = () => {
  const pts = [];
  for (let a = 0; a <= 3.2 * Math.PI; a += 0.25) pts.push([Math.cos(a) * (1.5 + a * 1.6), Math.sin(a) * (1.5 + a * 1.6)]);
  return [{ t: "pen", c: INK, w: PEN, pts }];
};

// ---- Placement ----

const place = (strokes, x, y, s = 1, rot = 0) => {
  const c = Math.cos(rot);
  const n = Math.sin(rot);
  const T = ([px, py]) => [x + s * (px * c - py * n), y + s * (px * n + py * c)];
  return strokes.map((st) => ({ ...st, pts: st.pts.map(T), clip: st.clip && st.clip.map(T), w: st.t === "hl" ? st.w * s : st.w }));
};

const bounds = (strokes) => {
  let l = Infinity, t = Infinity, r = -Infinity, b = -Infinity;
  strokes.forEach((st) => st.pts.forEach(([x, y]) => {
    l = Math.min(l, x - st.w / 2); r = Math.max(r, x + st.w / 2);
    t = Math.min(t, y - st.w / 2); b = Math.max(b, y + st.w / 2);
  }));
  return { l, t, r, b, w: r - l, h: b - t };
};

const length = (pts) => pts.reduce((sum, p, i) => (i ? sum + Math.hypot(p[0] - pts[i - 1][0], p[1] - pts[i - 1][1]) : 0), 0);

// Each doodle draws on its own track, starting at t0 ms, one stroke after another.
// Every line gets a slow wobble, since nobody draws a perfectly straight line.
const track = (t0, seed) => {
  let t = t0;
  const r = rng(seed);
  return (strokes) => strokes.forEach((m) => {
    if (m.t !== "text") m.pts = wobble(m.pts, r, m.t === "hl" ? 6 : 3, m.t === "hl" ? 1.1 : 0.8);
    m.dur = m.t === "text" ? 380 : Math.max(80, Math.min(520, length(m.pts) * 1.5));
    m.delay = t;
    m.p = done ? 1 : 0;
    t += m.dur * 0.75;
    marks.push(m);
  });
};

// Highlighter swipe behind each line of an element's text, the same swipe the landing page uses
const highlight = (el, c, seed) => {
  const r = rng(seed);
  return textRects(el).map((q) => ({ t: "hl", c, ...highlightSwipe({ left: q.l, top: q.t, width: q.w, height: q.h }, r) }));
};

const build = () => {
  marks = [];
  const main = document.querySelector("main");
  const intro = document.querySelector(".page-intro");
  const h1 = intro && intro.querySelector("h1");
  const items = Array.from(document.querySelectorAll(".post-list li"));
  if (!main || !h1) return;
  const M = box(main.getBoundingClientRect());
  const I = box(intro.getBoundingClientRect());
  const W = document.documentElement.clientWidth;
  const leftRoom = M.l;
  const rightRoom = W - M.r;
  const mid = (el) => { const q = box(el.getBoundingClientRect()); return q.t + q.h / 2; };

  // Highlighted words in the subtitle
  intro.querySelectorAll("[data-mark]").forEach((el, i) => track(0, 11 + i)(highlight(el, COLORS[el.dataset.mark] || COLORS.lemon, 11 + i)));

  // Star just after the heading
  const hRects = textRects(h1);
  const hb = hRects[hRects.length - 1];
  const s = Math.min(23, hb.h * 0.4);
  const sx = hb.r + s * 1.6 + 4;
  const sy = hb.t + hb.h * 0.48;
  track(350, 21)(place(star(), sx, sy, s, -0.15));

  // Rocket in the free space to the right of the intro, flying up and to the right
  const sub = intro.querySelector("p");
  const subRects = sub ? textRects(sub) : [];
  const freeStart = Math.max(sx + s * 2.2, ...subRects.map((q) => q.r)) + 12;
  const rightEdge = Math.min(W - 6, M.r + Math.min(rightRoom * 0.7, 110));
  const unit = bounds(place(rocket(), 0, 0, 1, Math.PI / 4));
  const k = Math.min(1, (rightEdge - freeStart) / unit.w, (I.h + 40) / unit.h);
  let rb = null;
  if (k >= 0.45) {
    const cx = rightEdge - (unit.r * k);
    const cy = I.t + I.h * 0.42 - ((unit.t + unit.b) / 2) * k;
    const placed = place(rocket(), cx, cy, k, Math.PI / 4);
    rb = bounds(placed);
    track(750, 31)(placed);
  }

  // Planet up ahead of the rocket when the right margin has room, and a spiral mirroring it in
  // the left margin so each top corner has one
  if (rb && rightRoom >= 240) {
    const px = Math.min(W - 44, rb.r + 70);
    const py = rb.t + 6;
    track(1350, 41)(place(planet(), px, py, 1, 0));
    const mx = M.l - (px - M.r);
    if (mx >= 28) track(1500, 81)(place(spiral(), mx, py, 1, 0.4));
  }

  if (items.length) {
    // Newest post: highlighted title, plus a "new!" note and arrow in the left margin
    const title = items[0].querySelector(".post-title");
    if (title) {
      track(1000, 51)(highlight(title, COLORS.lemon, 51));
      const first = textRects(title)[0];
      if (first && leftRoom >= 130) {
        const ey = first.t + first.h * 0.55;
        const ex = M.l - 14;
        const sx2 = M.l - 84;
        const sy2 = first.t + 2;
        const pts = [];
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const cx = M.l - 80, cy = ey + 10;
          pts.push([(1 - t) ** 2 * sx2 + 2 * (1 - t) * t * cx + t * t * ex, (1 - t) ** 2 * sy2 + 2 * (1 - t) * t * cy + t * t * ey]);
        }
        const dir = Math.atan2(ey - (ey + 10), ex - (M.l - 80));
        const head = (a) => [ex - 10 * Math.cos(dir + a), ey - 10 * Math.sin(dir + a)];
        track(1250, 61)([
          { t: "text", c: INK, text: "new!", x: M.l - 116, y: first.t - 6, rot: -0.14, size: 22 },
          { t: "pen", c: INK, w: PEN, pts },
          { t: "pen", c: INK, w: PEN, pts: [head(0.5), [ex, ey], head(-0.5)] },
        ]);
      }
    }

    // With room in both margins, the lounging figure goes under the "new!" note and the laptop
    // mirrors him on the right: same height, same distance from the list. Otherwise they sit
    // side by side under it.
    const below = textRects(title || items[0])[0];
    const [[fw, fh], [lw, lh]] = [LOUNGE_SIZE.figure, LOUNGE_SIZE.laptop];
    const gap = 76;
    const wide = below && leftRoom >= gap + fw + 8 && rightRoom >= gap + fw + 8;
    const cy = below && below.b + 32 + fh / 2;
    lounge.place(
      wide
        ? { figure: [M.l - gap - fw, cy - fh / 2], laptop: [M.r + gap + fw / 2 - lw / 2, cy - lh / 2] }
        : null
    );
  }
};

// ---- Drawing ----

const path = (pts) => {
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
};

const draw = () => {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  marks.forEach((m) => {
    if (m.p <= 0) return;
    ctx.save();
    if (m.clip) {
      path(m.clip);
      ctx.clip();
    }
    if (m.t === "text") {
      ctx.translate(m.x, m.y);
      ctx.rotate(m.rot);
      ctx.font = `500 ${m.size}px "Shantell Sans", cursive`;
      const w = ctx.measureText(m.text).width;
      ctx.beginPath();
      ctx.rect(-4, -m.size, (w + 8) * m.p, m.size * 1.6);
      ctx.clip();
      ctx.fillStyle = m.c;
      ctx.fillText(m.text, 0, 0);
    } else {
      drawStroke(ctx, m, Math.ceil(m.pts.length * m.p));
    }
    ctx.restore();
  });
};

// The lounging figure and the laptop (./lounger.js), placed by build() and popped in partway through
const list = document.querySelector(".post-list");
const lounge = list ? addLounge(list) : { show() {}, place() {} };

const play = () => {
  lounge.show();
  playMarks(() => marks, draw, () => (done = true));
};

const resize = () => {
  cv.style.height = "0px";
  const w = document.documentElement.clientWidth;
  const h = document.documentElement.scrollHeight;
  dpr = Math.min(2, devicePixelRatio || 1);
  cv.width = Math.round(w * dpr);
  cv.height = Math.round(h * dpr);
  cv.style.width = w + "px";
  cv.style.height = h + "px";
  build();
  draw();
};

const fonts = document.fonts
  ? Promise.all([document.fonts.ready, document.fonts.load('500 22px "Shantell Sans"')]).catch(() => {})
  : Promise.resolve();
fonts.then(() =>
  setTimeout(() => {
    resize();
    if (!done) play();
    else lounge.show();
    new ResizeObserver(resize).observe(document.body);
  }, 250)
);
