import React from "react";
import s from "../../style/PortfolioLayout.module.css";
import SizeSlider from "../SizeSlider";
import { arrive, arriving, hookLink } from "../../shared/jetpack";
import { INK, PAPER, LEMON, BUBBLEGUM, HIGHLIGHTERS as COLORS, SPRING, clamp, rng, highlightSwipe, drawStroke, playMarks } from "../../shared/sketch";
import { FIGURE, PENCIL, ROUGH } from "../../shared/figure";

const PEN_COLORS = [["Ink", INK], ...COLORS];
// Brush widths in px; each tool starts at its original width
const PEN_SIZE = { min: 1.5, max: 8, start: 2.8 };
const HL_SIZE = { min: 10, max: 40, start: 22 };
// "– Hayden" as cursive pen strokes, in a 162-wide box starting at (-22, 4). The intro writes it in
// on the canvas like the other marks, so the eraser can rub it out.
const SIGNATURE = {
  x: -22,
  y: 4,
  w: 162,
  paths: [
    "M-20,34 C-16,33.5 -11,33 -6,33",
    "M14,8 C12,20 10,32 8,44",
    "M4,28 C14,26 26,24 34,23",
    "M37,7 C35,20 33,32 30,44 C34,40 40,32 47,31 C50,30 52,31 53,32 C48,28 41,33 42,39 C43,45 50,43 53,36 L52,44 C54,45 57,42 59,38 C60,35 60,33 60,31 C59,38 60,43 64,43 C68,43 71,37 72,31 L70,48 C68,58 64,64 60,62 C56,60 60,52 68,48 C72,46 76,42 80,38 C84,33 89,30 93,32 C87,28 80,33 81,39 C82,45 89,43 93,36 C95,26 97,14 99,6 C97,18 95,32 93,44 C95,45 98,42 101,38 C106,37 110,34 109,31 C108,28 102,29 101,35 C100,41 104,45 110,43 C112,42 114,40 116,38 C117,35 118,32 119,31 L117,44 C119,36 123,31 127,31 C130,31 130,34 129,38 L128,43 C130,45 134,42 137,38",
  ],
};
let signaturePts = null;

// Sample each signature path into points once (getTotalLength needs the path in a live SVG)
const signaturePoints = () => {
  if (signaturePts) return signaturePts;
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("style", "position:absolute;width:0;height:0;visibility:hidden");
  document.body.appendChild(svg);
  signaturePts = SIGNATURE.paths.map((d) => {
    const path = document.createElementNS(NS, "path");
    path.setAttribute("d", d);
    svg.appendChild(path);
    const len = path.getTotalLength();
    const pts = [];
    for (let l = 0; l < len; l += 1.5) {
      const q = path.getPointAtLength(l);
      pts.push([q.x, q.y]);
    }
    const end = path.getPointAtLength(len);
    pts.push([end.x, end.y]);
    return pts;
  });
  svg.remove();
  return signaturePts;
};

// Where the figure's eyes wander while idle
const LOOK = [[0, 0], [-4, -1], [-4, 1], [3, -2], [4, 1], [0, 2], [-2, -2]];

// flip puts the tail on the left, for the reader's side of the chat.
// In the SVG's coordinates the bubble's side border runs down x = 1..3 and its bottom border
// along y = 12..14. The fill paints over the side border to open the bubble into the tail, and
// the outline starts and ends on those border centerlines so its round caps stay inside them.
const BubbleTail = ({ fill = "oklch(1 0 0)", flip = false }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={flip ? s.bubbleTailFlip : s.bubbleTail}>
    <path d="M-1 1.5 L2 1.5 C6 5.5 9.5 9 12.5 12.5 L-1 12 Z" fill={fill} style={{ transition: "fill 0.3s" }} />
    <path
      d="M2 1.5 C6 5.5 9.5 9 13 13 L2 13"
      fill="none"
      stroke={INK}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ToolIcon = ({ children, className = s.toolIcon }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

const figureStroke = {
  fill: "none",
  stroke: INK,
  strokeWidth: FIGURE.stroke,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

// Hand-drawn intro marks and a freehand pen/highlighter/eraser layer over the page.
// Strokes are stored relative to the page's horizontal center so they stay over the
// centered text column as the window width changes.
class PortfolioLayout extends React.Component {
  state = { tool: "pointer", color: 0, penColor: 0, penSize: PEN_SIZE.start, hlSize: HL_SIZE.start, n: 0, stage: -1, open: false, look: 0, scrollable: false, scrubbing: false, away: arriving(), snap: false };
  rootRef = React.createRef();
  figureRef = React.createRef();
  linkRef = React.createRef();
  canvasRef = React.createRef();
  ringRef = React.createRef();
  dockRef = React.createRef();
  barRef = React.createRef();
  thumbRef = React.createRef();
  strokes = [];
  marks = [];
  markOff = {};
  cur = null;
  introDone = false;

  componentDidMount() {
    this.ctx = this.canvasRef.current.getContext("2d");
    this.ro = new ResizeObserver(() => this.resize());
    this.ro.observe(this.rootRef.current);
    this.canvasRef.current.addEventListener("pointerdown", this.down);
    window.addEventListener("pointerdown", this.grab, true);
    window.addEventListener("pointermove", this.move);
    window.addEventListener("pointerup", this.up);
    window.addEventListener("pointercancel", this.up);
    window.addEventListener("keydown", this.key);
    window.addEventListener("scroll", this.syncBar, { passive: true });
    window.addEventListener("resize", this.syncBar);
    // Clicking the blog link sends him off by jetpack to rewrite it (src/shared/jetpack.js), and
    // coming back from the blog he lands here again. A copy of him does the flying, so this one
    // steps away until he's back.
    this.unhook = hookLink(this.linkRef.current, {
      figure: this.docked,
      onStart: this.goAway,
      onRestore: () => this.setState({ away: false }),
    });
    arrive({ dock: this.docked, onLanded: this.comeBack });
    const ready = document.fonts ? document.fonts.ready : Promise.resolve();
    ready.then(() =>
      setTimeout(() => {
        this.resize();
        this.playIntro();
      }, 350)
    );
    this.timers = [
      setTimeout(() => this.setState((st) => (st.stage < 0 ? { stage: 0 } : null)), 5000),
      setTimeout(() => this.setState((st) => (st.stage === 0 ? { stage: 1 } : null)), 7200),
    ];
    // His eyes wander, except while the jetpack copy of him is away (it lands in his current pose)
    this.lookTimer = setInterval(() => this.setState((st) => (st.away ? null : { look: (st.look + 1) % 7 })), 1500);
  }

  componentDidUpdate() {
    // The touch scrollbar stands in for the browser's own while it's showing (see the CSS)
    document.documentElement.toggleAttribute("data-touch-scrollbar", this.state.open && this.state.scrollable);
  }

  componentWillUnmount() {
    document.documentElement.removeAttribute("data-touch-scrollbar");
    this.ro && this.ro.disconnect();
    this.canvasRef.current?.removeEventListener("pointerdown", this.down);
    window.removeEventListener("pointermove", this.move);
    window.removeEventListener("pointerdown", this.grab, true);
    window.removeEventListener("pointerup", this.up);
    window.removeEventListener("pointercancel", this.up);
    window.removeEventListener("keydown", this.key);
    window.removeEventListener("scroll", this.syncBar);
    window.removeEventListener("resize", this.syncBar);
    this.unhook && this.unhook();
    this.stopIntro && this.stopIntro();
    (this.timers || []).forEach(clearTimeout);
    clearInterval(this.lookTimer);
  }

  resize() {
    const root = this.rootRef.current;
    const cv = this.canvasRef.current;
    if (!root || !cv) return;
    const w = root.clientWidth;
    const h = root.offsetHeight;
    const d = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) {
      cv.width = Math.round(w * d);
      cv.height = Math.round(h * d);
      cv.style.width = w + "px";
      cv.style.height = h + "px";
    }
    this.d = d;
    this.w = w;
    root.querySelectorAll("[data-mark]").forEach((el) => this.ro.observe(el));
    this.buildMarks();
    this.draw();
    this.layoutBar();
  }

  // Turn each [data-mark] element into animated strokes positioned over it
  buildMarks() {
    const root = this.rootRef.current;
    this.marks = [];
    if (!root) return;
    const R = root.getBoundingClientRect();
    const cx = R.width / 2;
    const L = (x, y) => [x - R.left - cx, y - R.top];
    let delay = 0;
    root.querySelectorAll("[data-mark]").forEach((el, i) => {
      const type = el.getAttribute("data-mark");
      const r = rng(i * 7919 + 13);
      const add = (m, dur) => {
        m.g = i;
        m.delay = delay;
        m.dur = dur;
        m.p = this.introDone ? 1 : 0;
        this.marks.push(m);
        delay += dur * 0.8;
      };
      if (type === "highlight") {
        const range = document.createRange();
        range.selectNodeContents(el);
        const c = COLORS[+(el.getAttribute("data-color") || 0)][1];
        Array.from(range.getClientRects())
          .filter((q) => q.width > 2)
          .forEach((q) => {
            const { w, pts } = highlightSwipe(q, r);
            add({ t: "hl", c, w, pts: pts.map(([x, y]) => L(x, y)) }, 520);
          });
      } else if (type === "bangs") {
        const q = el.getBoundingClientRect();
        const h = q.height;
        [0.18, 0.5, 0.82].forEach((fx, j) => {
          const x = q.left + q.width * fx;
          const lean = (j - 1) * 1.6 + (r() - 0.5) * 1.2;
          const top = q.top + h * (0.05 + r() * 0.08);
          add(
            {
              t: "pen",
              c: INK,
              w: 2.6,
              pts: [L(x + lean, top), L(x + lean * 0.4, q.top + h * 0.45), L(x, q.top + h * 0.64)],
            },
            140
          );
          add({ t: "pen", c: INK, w: 3.2, pts: [L(x - lean * 0.2, q.top + h * 0.86)] }, 40);
        });
      } else if (type === "signature") {
        // Scale the signature into its box, tilted up 3° around the box's left middle
        const q = el.getBoundingClientRect();
        const k = q.width / SIGNATURE.w;
        const a = (-3 * Math.PI) / 180;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const cy = q.top + q.height / 2;
        signaturePoints().forEach((pts) => {
          const out = pts.map(([px, py]) => {
            const x = (px - SIGNATURE.x) * k;
            const y = (py - SIGNATURE.y) * k - q.height / 2;
            return L(q.left + x * cos - y * sin, cy + x * sin + y * cos);
          });
          add({ t: "pen", c: INK, w: 2.4, pts: out }, Math.max(120, pts.length * 1.5 * k * 3.5));
        });
      }
    });
    this.marks.forEach((m) => {
      const o = this.markOff[m.g];
      if (o) m.pts = m.pts.map(([a, b]) => [a + o[0], b + o[1]]);
    });
  }

  playIntro() {
    this.stopIntro && this.stopIntro();
    this.introDone = false;
    this.marks.forEach((m) => (m.p = 0));
    this.stopIntro = playMarks(
      () => this.marks,
      () => this.draw(),
      () => (this.introDone = true)
    );
  }

  req() {
    if (this.pending) return;
    this.pending = true;
    requestAnimationFrame(() => {
      this.pending = false;
      this.draw();
    });
  }

  draw() {
    const ctx = this.ctx;
    if (!ctx || !this.w) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.setTransform(this.d, 0, 0, this.d, (this.d * this.w) / 2, 0);
    this.marks.forEach((m) => drawStroke(ctx, m, Math.ceil(m.pts.length * m.p)));
    this.strokes.forEach((st) => drawStroke(ctx, st));
    ctx.globalCompositeOperation = "source-over";
  }

  local(x, y) {
    const R = this.rootRef.current.getBoundingClientRect();
    return [Math.round((x - R.left - R.width / 2) * 10) / 10, Math.round((y - R.top) * 10) / 10];
  }

  down = (e) => {
    const tool = this.state.tool;
    if (tool === "pointer" || e.button > 0) return;
    e.preventDefault();
    try {
      this.canvasRef.current.setPointerCapture(e.pointerId);
    } catch (_) {}
    const [x, y] = this.local(e.clientX, e.clientY);
    let st;
    if (tool === "pen") st = { t: "pen", c: PEN_COLORS[this.state.penColor][1], w: this.state.penSize, pts: [[x, y]] };
    else if (tool === "er") st = { t: "er", w: 40, pts: [[x, y]] };
    else st = { t: "hl", c: COLORS[this.state.color][1], w: this.state.hlSize, pts: [[x, y]] };
    this.cur = st;
    this.strokes.push(st);
    this.req();
  };

  move = (e) => {
    const ring = this.ringRef.current;
    if (ring) {
      ring.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      ring.style.visibility = e.pointerType === "touch" ? "hidden" : "visible";
    }
    if (this.drag) {
      this.dragMove(e);
      return;
    }
    if (this.canMove() && e.pointerType === "mouse") this.hover(e);
    if (!this.cur) return;
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    const st = this.cur;
    (evs.length ? evs : [e]).forEach((ev) => {
      const [x, y] = this.local(ev.clientX, ev.clientY);
      const l = st.pts[st.pts.length - 1];
      if (Math.hypot(x - l[0], y - l[1]) >= 1.5) st.pts.push([x, y]);
    });
    this.req();
  };

  up = () => {
    if (this.drag) {
      this.dragEnd();
      return;
    }
    if (!this.cur) return;
    this.cur = null;
    this.setState({ n: this.strokes.length });
  };

  key = (e) => {
    const t = e.target;
    if (t && t.closest && t.closest('input,textarea,[contenteditable="true"]')) return;
    const k = (e.key || "").toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === "z") {
      e.preventDefault();
      this.undo();
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const m = { v: "pointer", escape: "pointer", p: "pen", h: "hl", e: "er" };
    if (m[k]) this.setTool(m[k]);
    else if (["1", "2", "3", "4"].includes(k)) this.setState({ color: +k - 1, tool: "hl", open: true, stage: 5 });
    else if (k === "[" || k === "]") {
      // [ and ] step the current tool's size by a tenth of its range, like most drawing apps.
      // Updater form, so quick presses (or "h" then "[") each see the latest tool and size.
      this.setState((st) => {
        if (st.tool !== "pen" && st.tool !== "hl") return null;
        const [key, range] = st.tool === "pen" ? ["penSize", PEN_SIZE] : ["hlSize", HL_SIZE];
        const step = ((range.max - range.min) / 10) * (k === "]" ? 1 : -1);
        return { [key]: clamp(st[key] + step, range.min, range.max) };
      });
    }
  };

  // Topmost user stroke or intro mark under (x, y), in canvas-local coordinates
  hitTest(x, y) {
    const near = (st) => {
      if (st.t === "er") return false;
      const p = st.pts;
      const r = st.w / 2 + 6;
      for (let i = 0; i < p.length; i++) {
        const a = p[i];
        const b = p[Math.min(i + 1, p.length - 1)];
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        const l = dx * dx + dy * dy;
        const t = l ? Math.max(0, Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / l)) : 0;
        if (Math.hypot(x - a[0] - t * dx, y - a[1] - t * dy) <= r) return true;
      }
      return false;
    };
    for (let i = this.strokes.length - 1; i >= 0; i--) if (near(this.strokes[i])) return { s: this.strokes[i] };
    for (let i = this.marks.length - 1; i >= 0; i--) {
      if (this.marks[i].p > 0.5 && near(this.marks[i])) return { g: this.marks[i].g };
    }
    return null;
  }

  // Marks can only be moved with the Select tool once the drawing tools are out
  canMove() {
    return this.state.open && this.state.tool === "pointer";
  }

  grab = (e) => {
    if (!this.canMove() || e.button > 0 || !this.rootRef.current) return;
    if (this.dockRef.current && this.dockRef.current.contains(e.target)) return;
    if (this.barRef.current && this.barRef.current.contains(e.target)) return;
    const [x, y] = this.local(e.clientX, e.clientY);
    const h = this.hitTest(x, y);
    if (!h) return;
    e.preventDefault();
    e.stopPropagation();
    this.drag = { h, last: [x, y], moved: false };
    this.rootRef.current.style.cursor = "grabbing";
  };

  dragMove(e) {
    const [x, y] = this.local(e.clientX, e.clientY);
    const d = this.drag;
    const dx = x - d.last[0];
    const dy = y - d.last[1];
    if (!dx && !dy) return;
    d.last = [x, y];
    d.moved = true;
    const shift = (st) => {
      st.pts = st.pts.map(([a, b]) => [Math.round((a + dx) * 10) / 10, Math.round((b + dy) * 10) / 10]);
    };
    if (d.h.s) shift(d.h.s);
    else {
      this.marks.forEach((m) => {
        if (m.g === d.h.g) shift(m);
      });
      const o = this.markOff[d.h.g] || [0, 0];
      this.markOff[d.h.g] = [o[0] + dx, o[1] + dy];
    }
    this.req();
  }

  dragEnd() {
    const moved = this.drag.moved;
    this.drag = null;
    this.rootRef.current.style.cursor = "grab";
    if (moved) {
      // Swallow the click that follows a drag so dropping a mark on a link doesn't follow it
      const stop = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
      };
      window.addEventListener("click", stop, { capture: true, once: true });
      setTimeout(() => window.removeEventListener("click", stop, true), 50);
    }
  }

  hover(e) {
    if (this.hoverPending) return;
    this.hoverPending = true;
    requestAnimationFrame(() => {
      this.hoverPending = false;
      const root = this.rootRef.current;
      if (!root || !this.canMove()) return;
      const [x, y] = this.local(e.clientX, e.clientY);
      root.style.cursor = this.hitTest(x, y) ? "grab" : "";
    });
  }

  // Touch scrollbar for phones, where the drawing tools take over one-finger drags
  syncBar = () => {
    if (this.barPending) return;
    this.barPending = true;
    requestAnimationFrame(() => {
      this.barPending = false;
      this.layoutBar();
    });
  };

  layoutBar() {
    const rail = this.barRef.current && this.barRef.current.firstChild;
    const thumb = this.thumbRef.current;
    if (!rail || !thumb) return;
    const page = document.documentElement.scrollHeight;
    const range = page - window.innerHeight;
    const scrollable = range > 1;
    if (scrollable !== this.state.scrollable) this.setState({ scrollable });
    const inner = rail.clientHeight - 4;
    if (inner <= 0) return;
    const h = Math.min(inner, Math.max(44, Math.round((inner * window.innerHeight) / page)));
    const travel = inner - h;
    const y = scrollable ? travel * Math.min(1, Math.max(0, window.scrollY / range)) : 0;
    thumb.style.height = h + "px";
    thumb.style.transform = `translateY(${y}px)`;
    this.barGeo = { h, travel, range };
  }

  barDown = (e) => {
    if (e.button > 0) return;
    e.preventDefault();
    const bar = this.barRef.current;
    try {
      bar.setPointerCapture(e.pointerId);
    } catch (_) {}
    this.layoutBar();
    const { h, travel, range } = this.barGeo || { h: 0, travel: 0, range: 0 };
    // Pressing above or below the thumb jumps it under the finger, then keeps dragging from there
    const t = this.thumbRef.current.getBoundingClientRect();
    if (travel > 0 && (e.clientY < t.top || e.clientY > t.bottom)) {
      const top = bar.firstChild.getBoundingClientRect().top + 2;
      const y = Math.max(0, Math.min(travel, e.clientY - top - h / 2));
      window.scrollTo(0, (y / travel) * range);
    }
    this.barDrag = { y0: e.clientY, s0: window.scrollY, k: travel > 0 ? range / travel : 0 };
    this.setState({ scrubbing: true });
  };

  barMove = (e) => {
    const d = this.barDrag;
    if (d) window.scrollTo(0, d.s0 + (e.clientY - d.y0) * d.k);
  };

  barUp = () => {
    if (!this.barDrag) return;
    this.barDrag = null;
    this.setState({ scrubbing: false });
  };

  setTool(tool) {
    this.cur = null;
    if (this.rootRef.current) this.rootRef.current.style.cursor = "";
    this.setState({ tool, open: true, stage: 5 });
  }

  ask = () => {
    if (this.state.stage !== 1) return;
    this.setState({ stage: 2 });
    this.timers.push(
      setTimeout(() => this.setState((st) => (st.stage === 2 ? { stage: 3 } : null)), 1200),
      setTimeout(() => this.setState((st) => (st.stage === 3 ? { stage: 4 } : null)), 2300)
    );
  };

  // Where he is and how he's standing, for the jetpack copy of him to take over from or hand
  // back to without a jump
  docked = () => ({ el: this.figureRef.current, pose: this.figurePose() });

  // His pose for the current stage, in the terms src/shared/jetpack.js uses (degrees, and where
  // he's looking). The render below draws him from this too.
  figurePose() {
    const { stage, look } = this.state;
    const pulling = stage >= 4;
    const surprised = stage === 0 || stage === 3;
    const [ex, ey] = stage === 4 ? [-4, 3] : stage >= 1 && stage < 4 ? [-4, 0] : LOOK[look];
    return {
      ex,
      ey,
      head: stage === 4 ? -8 : ex * 1.4,
      armL: surprised ? 140 : pulling ? 80 : 16,
      armR: pulling ? 98 : -16,
      oh: surprised ? 1 : 0,
      tilt: pulling ? 6 : 0,
    };
  }

  // Back from the blog: he's landed in exactly this pose, so show this copy of him instantly
  comeBack = () => {
    this.setState({ away: false, snap: true });
    setTimeout(() => this.setState({ snap: false }), 60);
  };

  goAway = () => {
    this.tuck();
    this.setState({ away: true });
  };

  openTools = () => this.setState({ open: true, stage: 5, tool: this.state.tool === "pointer" ? "hl" : this.state.tool });

  tuck = () => {
    this.cur = null;
    if (this.rootRef.current) this.rootRef.current.style.cursor = "";
    this.setState({ open: false, tool: "pointer" });
  };

  undo = () => {
    if (!this.strokes.length) return;
    this.strokes.pop();
    this.draw();
    this.setState({ n: this.strokes.length });
  };

  clear = () => {
    this.strokes = [];
    this.markOff = {};
    this.setState({ n: 0 });
    this.buildMarks();
    this.playIntro();
  };

  // A tool's colors, with its size slider underneath, pop up above its button instead of
  // widening the toolbar. size: { min, max, value, color, onChange } for the SizeSlider.
  colorPicker(colors, selected, show, pick, kind, className = "", size) {
    const swatch = (key, label, i, active, onClick, dot) => (
      <button
        type="button"
        key={key}
        title={label}
        aria-label={`${label} ${kind}`}
        aria-pressed={active}
        tabIndex={show ? 0 : -1}
        onClick={onClick}
        className={s.swatch}
      >
        <span
          className={s.swatchDot}
          style={{
            ...dot,
            boxShadow: active ? `0 0 0 2px oklch(1 0 0), 0 0 0 4px ${INK}` : "none",
            transform: !show ? "scale(0.3)" : active ? "scale(1.08)" : "none",
            transitionDelay: show ? `${60 + i * 40}ms` : "0ms",
          }}
        />
      </button>
    );
    return (
      <div
        className={`${s.swatches} ${className}`}
        aria-hidden={!show}
        style={
          show
            ? { opacity: 1, transform: "none", pointerEvents: "auto" }
            : { opacity: 0, transform: "translateY(10px) scale(0.8)", pointerEvents: "none" }
        }
      >
        <div className={s.swatchRow}>
          {colors.map(([name, css], i) => swatch(name, name, i, i === selected, () => pick(i), { background: css }))}
        </div>
        {size && (
          <div className={s.sizeRow}>
            <SizeSlider label={`${kind} size`} tabIndex={show ? 0 : -1} {...size} />
          </div>
        )}
      </div>
    );
  }

  render() {
    // stage: -1 idle, 0 "psst", 1 "?" offered, 2 "?" asked, 3 "take this", 4 holding out the pen, 5 tools opened
    const { tool, color, penColor, penSize, hlSize, n, stage, open, scrollable, scrubbing, away, snap } = this.state;
    const show = (v) =>
      v ? { rows: "1fr", op: 1, tf: "none" } : { rows: "0fr", op: 0, tf: "translateY(12px) scale(0.85)" };
    const pulling = stage >= 4;
    const pose = this.figurePose();
    const surprised = pose.oh === 1;
    const fig = {
      lean: pose.tilt ? `rotate(${pose.tilt}deg)` : "none",
      armL: `rotate(${pose.armL}deg)`,
      armR: `rotate(${pose.armR}deg)`,
      head: `rotate(${pose.head}deg)`,
      eyes: `translate(${pose.ex * 1.5}px, ${pose.ey * 1.5}px)`,
    };
    const btn = (id) => (tool === id ? { background: INK, color: PAPER } : { background: "transparent", color: INK });
    const hlc = COLORS[color][1];
    const showColors = open && tool === "hl";
    const showPenColors = open && tool === "pen";
    const ring =
      tool === "pointer"
        ? { size: 10, background: "transparent", border: "none", opacity: 0 }
        : tool === "pen"
        ? { size: 5 + penSize, background: PEN_COLORS[penColor][1], border: "none", opacity: 1 }
        : tool === "hl"
        ? { size: 2 + hlSize, background: hlc, border: "none", opacity: 0.9 }
        : { size: 40, background: "oklch(1 0 0 / 0.5)", border: "1.5px solid " + INK, opacity: 1 };
    const m0 = show(stage >= 0 && stage < 3);
    const m1 = show(stage >= 1 && stage < 3);
    const m2 = show(stage >= 3 && stage < 5);
    const asked = stage >= 2;
    const pen = pulling
      ? { opacity: 1, transform: "rotate(-6deg)", pointerEvents: "auto" }
      : { opacity: 0, transform: "translateX(34px) scale(0.4)", pointerEvents: "none" };
    const lean = { transformOrigin: "35px 94px", transition: `transform .6s ${SPRING}`, transform: fig.lean };

    return (
      <div ref={this.rootRef} className={s.root}>
        <div className={s.column}>
          <header className={s.header}>
            {/* Handwritten, like "Go to my homepage" in the same spot on the blog (src/shared/jetpack.css) */}
            <a ref={this.linkRef} href="/blog/" className="hand-link" data-rewrite="Go to my homepage">
              Go to my blog
            </a>
          </header>
          <main className={s.main}>
            <h1 className={s.title}>
              Hi, I'm{" "}
              <span className={s.name}>
                Hayden.
                <img src="/hayden.webp" alt="" aria-hidden="true" className={s.face} />
              </span>
            </h1>
            <p className={s.para}>
              I'm a Software Engineer in NYC. Right now I'm at{" "}
              <span className={s.nowrap}>
                <a
                  href="https://goodlabs.com"
                  target="_blank"
                  rel="noopener"
                  aria-label="Goodlabs"
                  className={s.logoLink}
                >
                  <img src="/goodlabs-logo.svg" alt="" aria-hidden="true" className={s.logo} />
                </a>
                ,
              </span>{" "}
              helping improve access to preventative healthcare through blood donation.
            </p>
            <p className={s.para}>
              Goodlabs partners with non-profit blood centers to offer{" "}
              <span data-mark="highlight" data-color="0">
                free blood tests
              </span>{" "}
              when people donate. You should check us out!{" "}
              <span className={s.nowrap}>
                <a
                  href="https://goodlabs.notion.site/Careers-at-Goodlabs-25cb6683f7aa80b0b4d3e064663e7e47"
                  target="_blank"
                  rel="noopener"
                  className={s.link}
                >
                  We're hiring
                </a>
                <span data-mark="bangs" aria-hidden="true" className={s.bangsMark} />
              </span>
            </p>
            <p className={s.para}>
              If you've been meaning to donate,{" "}
              <a href="https://goodlabs.com/goodlabs-map" target="_blank" rel="noopener" className={s.link}>
                see if we're live near you
              </a>
              .
            </p>
            <p className={`${s.para} ${s.muted}`}>
              Before Goodlabs, I studied Computer Science at Georgia Tech focusing on Systems &amp; Architecture and
              Cybersecurity &amp; Privacy, with a minor in Psychology.
            </p>
            <p className={`${s.para} ${s.muted}`}>
              Say hi at{" "}
              <a href="mailto:me@hayden.gg" className={s.link}>
                me@hayden.gg
              </a>
              , or find me on{" "}
              <a href="https://github.com/xHayden" target="_blank" rel="noopener" className={s.link}>
                GitHub
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/haydencarpenter/"
                target="_blank"
                rel="noopener"
                className={s.link}
              >
                LinkedIn
              </a>
              .
            </p>
            <span data-mark="signature" role="img" aria-label="– Hayden" className={s.signature} />
          </main>
          <div className={s.spacer} />
        </div>

        <canvas
          ref={this.canvasRef}
          className={s.canvas}
          style={{
            touchAction: tool === "pointer" ? "auto" : "none",
            pointerEvents: tool === "pointer" ? "none" : "auto",
            cursor: tool === "pointer" ? "default" : "none",
          }}
        />
        <div
          ref={this.ringRef}
          className={s.ring}
          style={{
            width: ring.size,
            height: ring.size,
            margin: `-${ring.size / 2}px 0 0 -${ring.size / 2}px`,
            background: ring.background,
            border: ring.border,
            opacity: ring.opacity,
          }}
        />

        <div
          ref={this.barRef}
          aria-hidden="true"
          className={s.scrollbar}
          data-scrubbing={scrubbing || undefined}
          onPointerDown={this.barDown}
          onPointerMove={this.barMove}
          onPointerUp={this.barUp}
          onPointerCancel={this.barUp}
          style={
            open && scrollable
              ? { opacity: 1, transform: "none", pointerEvents: "auto", transitionDelay: "80ms" }
              : { opacity: 0, transform: "translateX(28px) scaleY(0.6)", pointerEvents: "none" }
          }
        >
          <div className={s.scrollRail}>
            <div ref={this.thumbRef} className={s.scrollThumb} />
          </div>
        </div>

        <div ref={this.dockRef} className={s.dock}>
          <div
            className={s.buddy}
            style={
              away
                ? { opacity: 0, transition: "none", pointerEvents: "none" }
                : open
                ? { opacity: 0, transform: "translateY(24px)", pointerEvents: "none" }
                : { opacity: 1, transform: "none", pointerEvents: "auto", transition: snap ? "none" : undefined }
            }
          >
            <div
              className={s.chat}
            >
              <div className={s.chatRow} style={{ gridTemplateRows: m0.rows }}>
                <div className={s.chatRowInner}>
                  <div className={s.bubble} style={{ opacity: m0.op, transform: m0.tf }}>
                    psst
                    <BubbleTail />
                  </div>
                </div>
              </div>
              <div className={s.chatRow} style={{ gridTemplateRows: m1.rows }}>
                <div className={s.chatRowInner}>
                  <button
                    type="button"
                    aria-label="Reply with a question mark"
                    onClick={this.ask}
                    className={`${s.bubble} ${s.askButton}`}
                    style={{
                      opacity: m1.op,
                      transform: m1.tf,
                      background: asked ? INK : LEMON,
                      color: asked ? PAPER : INK,
                      cursor: asked ? "default" : "pointer",
                      pointerEvents: asked ? "none" : "auto",
                    }}
                  >
                    ?
                    <BubbleTail flip fill={asked ? INK : LEMON} />
                  </button>
                </div>
              </div>
              <div className={s.chatRow} style={{ gridTemplateRows: m2.rows }}>
                <div className={s.chatRowInner}>
                  <div className={s.bubble} style={{ opacity: m2.op, transform: m2.tf }}>
                    take this
                    <BubbleTail />
                  </div>
                </div>
              </div>
            </div>

            <div ref={this.figureRef} className={s.figure}>
              {/* Right arm sits behind the pen so the hand appears to hold it */}
              <svg width="70" height="100" viewBox="0 0 70 100" {...figureStroke} className={s.figureBack}>
                <g filter="url(#hgg-rough)" style={lean}>
                  <g
                    style={{
                      transformOrigin: "35px 60px",
                      transition: `transform .65s ${SPRING}`,
                      transform: fig.armR,
                    }}
                  >
                    <path d={FIGURE.armR} />
                  </g>
                </g>
              </svg>
              <button
                type="button"
                aria-label="Open drawing tools"
                title="Draw on this page"
                onClick={this.openTools}
                className={s.penButton}
                style={pen}
              >
                <svg
                  width="66"
                  height="24"
                  viewBox="0 0 66 24"
                  fill="none"
                  stroke={INK}
                  strokeWidth={PENCIL.stroke}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <g filter="url(#hgg-rough)">
                    <path d={PENCIL.body} fill={LEMON} stroke="none" />
                    <path d={PENCIL.eraser} fill={BUBBLEGUM} stroke="none" />
                    <path d={PENCIL.body} />
                    <path d={PENCIL.band} />
                    <path d={PENCIL.wood} fill={PAPER} />
                    <path d={PENCIL.lead} fill={INK} />
                  </g>
                </svg>
              </button>
              <svg width="70" height="100" viewBox="0 0 70 100" {...figureStroke} className={s.figureFront}>
                <defs>
                  <filter id="hgg-rough" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence
                      type="fractalNoise"
                      baseFrequency={ROUGH.baseFrequency}
                      numOctaves={ROUGH.numOctaves}
                      seed={ROUGH.seed}
                    />
                    <feDisplacementMap in="SourceGraphic" scale={ROUGH.scale} />
                  </filter>
                </defs>
                <g filter="url(#hgg-rough)" style={lean}>
                  {FIGURE.legs.map((d) => (
                    <path key={d} d={d} />
                  ))}
                  <path d={FIGURE.body} />
                  <g
                    style={{
                      transformOrigin: "35px 60px",
                      transition: `transform .55s ${SPRING}`,
                      transform: fig.armL,
                    }}
                  >
                    <path d={FIGURE.armL} />
                  </g>
                  <g style={{ transformOrigin: "35px 55px", transition: `transform .7s ${SPRING}`, transform: fig.head }}>
                    <path d={FIGURE.head} fill={PAPER} />
                    <g style={{ transition: `transform .5s ${SPRING}`, transform: fig.eyes }}>
                      {FIGURE.eyes.map((d) => (
                        <path key={d} d={d} strokeWidth="3.4" />
                      ))}
                    </g>
                    <path d={FIGURE.smile} style={{ transition: "opacity .3s", opacity: surprised ? 0 : 1 }} />
                    <path d={FIGURE.oh} style={{ transition: "opacity .3s", opacity: surprised ? 1 : 0 }} />
                  </g>
                </g>
              </svg>
            </div>
          </div>

          <div
            className={s.toolbarWrap}
            style={
              open
                ? { opacity: 1, transform: "none", pointerEvents: "auto" }
                : { opacity: 0, transform: "translateY(8px) scale(0.6)", pointerEvents: "none" }
            }
          >
            <div className={s.toolbar}>
              <button
                type="button"
                title="Select (V)"
                onClick={() => this.setTool("pointer")}
                className={s.toolButton}
                style={btn("pointer")}
              >
                <ToolIcon>
                  <path d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z" />
                </ToolIcon>
                <span className={s.label}>Select</span>
              </button>
              <div className={s.toolGroup}>
                <button
                  type="button"
                  title="Pen (P)"
                  onClick={() => this.setTool("pen")}
                  className={s.toolButton}
                  style={btn("pen")}
                >
                  <ToolIcon>
                    <path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z" />
                    <path d="m15 5 4 4" />
                  </ToolIcon>
                  <span className={s.label}>Pen</span>
                </button>
                {this.colorPicker(
                  PEN_COLORS,
                  penColor,
                  showPenColors,
                  (i) => this.setState({ penColor: i, tool: "pen" }),
                  "pen",
                  s.swatchesStart,
                  {
                    ...PEN_SIZE,
                    value: penSize,
                    color: PEN_COLORS[penColor][1],
                    onChange: (v) => this.setState({ penSize: v, tool: "pen" }),
                  }
                )}
              </div>
              <div className={s.toolGroup}>
                <button
                  type="button"
                  title="Highlighter (H)"
                  onClick={() => this.setTool("hl")}
                  className={s.toolButton}
                  style={btn("hl")}
                >
                  <ToolIcon>
                    <path d="m9 11-6 6v3h9l3-3" />
                    <path d="m22 12-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4" />
                  </ToolIcon>
                  <span className={s.label}>Highlight</span>
                </button>
                {this.colorPicker(COLORS, color, showColors, (i) => this.setState({ color: i, tool: "hl" }), "highlighter", "", {
                  ...HL_SIZE,
                  value: hlSize,
                  color: hlc,
                  onChange: (v) => this.setState({ hlSize: v, tool: "hl" }),
                })}
              </div>
              <button
                type="button"
                title="Eraser (E)"
                onClick={() => this.setTool("er")}
                className={s.toolButton}
                style={btn("er")}
              >
                <ToolIcon>
                  <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                  <path d="M22 21H7" />
                  <path d="m5 11 9 9" />
                </ToolIcon>
                <span className={s.label}>Erase</span>
              </button>
              <span className={s.divider} />
              <button
                type="button"
                title="Undo (⌘Z)"
                onClick={this.undo}
                className={s.plainButton}
                style={{ opacity: n ? 1 : 0.35 }}
              >
                <ToolIcon className={s.compactIcon}>
                  <path d="M9 14 4 9l5-5" />
                  <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11" />
                </ToolIcon>
                <span className={s.label}>Undo</span>
              </button>
              <button type="button" title="Clear and replay" onClick={this.clear} className={s.plainButton}>
                <ToolIcon className={s.compactIcon}>
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </ToolIcon>
                <span className={s.label}>Clear</span>
              </button>
              <button
                type="button"
                title="Tuck away"
                aria-label="Close drawing tools"
                onClick={this.tuck}
                className={`${s.plainButton} ${s.closeButton}`}
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PortfolioLayout;
