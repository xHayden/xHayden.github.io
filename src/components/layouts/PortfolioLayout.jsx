import React from "react";
import s from "../../style/PortfolioLayout.module.css";

const INK = "oklch(0.26 0.02 265)";
const PAPER = "oklch(0.985 0.006 85)";
const LEMON = "oklch(0.9 0.13 98)";
const COLORS = [
  ["Lemon", LEMON],
  ["Bubblegum", "oklch(0.86 0.11 355)"],
  ["Mint", "oklch(0.88 0.11 165)"],
  ["Sky", "oklch(0.86 0.09 235)"],
];
const PEN_COLORS = [["Ink", INK], ...COLORS];
const SPRING = "cubic-bezier(.34,1.56,.64,1)";
// Where the figure's eyes wander while idle
const LOOK = [[0, 0], [-4, -1], [-4, 1], [3, -2], [4, 1], [0, 2], [-2, -2]];

const BubbleTail = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" className={s.bubbleTail}>
    <path
      d="M0 2 C5 6 9 9 13 13 C8 13.5 4 13 0 12"
      fill="oklch(1 0 0)"
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
  strokeWidth: "2.3",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": "true",
};

// Hand-drawn intro marks and a freehand pen/highlighter/eraser layer over the page.
// Strokes are stored relative to the page's horizontal center so they stay over the
// centered text column as the window width changes.
class PortfolioLayout extends React.Component {
  state = { tool: "pointer", color: 0, penColor: 0, n: 0, stage: -1, open: false, look: 0, scrollable: false, scrubbing: false };
  rootRef = React.createRef();
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
    this.lookTimer = setInterval(() => this.setState((st) => ({ look: (st.look + 1) % 7 })), 1500);
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
    cancelAnimationFrame(this.raf);
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

  // Seeded PRNG so each mark wobbles the same way on every load
  rng(seed) {
    let a = seed >>> 0;
    return () => {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
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
      const r = this.rng(i * 7919 + 13);
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
            const w = q.height * 0.72;
            const y = q.top + q.height * 0.56;
            const tilt = (r() - 0.5) * 3;
            const inset = w / 2 - 3;
            const x0 = q.left + inset;
            const span = Math.max(1, q.width - inset * 2);
            const pts = [];
            for (let k = 0; k <= 14; k++) {
              const t = k / 14;
              pts.push(L(x0 + t * span, y + tilt * (t - 0.5) + (r() - 0.5) * 1.2));
            }
            add({ t: "hl", c, w, pts }, 520);
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
      }
    });
    this.marks.forEach((m) => {
      const o = this.markOff[m.g];
      if (o) m.pts = m.pts.map(([a, b]) => [a + o[0], b + o[1]]);
    });
  }

  playIntro() {
    cancelAnimationFrame(this.raf);
    this.introDone = false;
    this.marks.forEach((m) => (m.p = 0));
    const start = performance.now();
    const tick = (now) => {
      let done = true;
      this.marks.forEach((m) => {
        const t = Math.max(0, Math.min(1, (now - start - m.delay) / m.dur));
        m.p = 1 - Math.pow(1 - t, 3);
        if (t < 1) done = false;
      });
      this.draw();
      if (done) this.introDone = true;
      else this.raf = requestAnimationFrame(tick);
    };
    this.raf = requestAnimationFrame(tick);
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
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    this.marks.forEach((m) => this.stroke(ctx, m, Math.ceil(m.pts.length * m.p)));
    this.strokes.forEach((st) => this.stroke(ctx, st, st.pts.length));
    ctx.globalCompositeOperation = "source-over";
  }

  stroke(ctx, st, n) {
    if (n < 1) return;
    const p = st.pts;
    ctx.globalCompositeOperation = st.t === "er" ? "destination-out" : "source-over";
    ctx.strokeStyle = st.t === "er" ? "#000" : st.c;
    ctx.lineWidth = st.w;
    ctx.beginPath();
    ctx.moveTo(p[0][0], p[0][1]);
    if (n === 1) ctx.lineTo(p[0][0] + 0.01, p[0][1]);
    for (let i = 1; i < n - 1; i++) {
      const mx = (p[i][0] + p[i + 1][0]) / 2;
      const my = (p[i][1] + p[i + 1][1]) / 2;
      ctx.quadraticCurveTo(p[i][0], p[i][1], mx, my);
    }
    if (n > 1) ctx.lineTo(p[n - 1][0], p[n - 1][1]);
    ctx.stroke();
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
    if (tool === "pen") st = { t: "pen", c: PEN_COLORS[this.state.penColor][1], w: 2.8, pts: [[x, y]] };
    else if (tool === "er") st = { t: "er", w: 40, pts: [[x, y]] };
    else st = { t: "hl", c: COLORS[this.state.color][1], w: 22, pts: [[x, y]] };
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

  // Colors pop up above a tool's button instead of widening the toolbar
  colorPicker(colors, selected, show, pick, kind, className = "") {
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
        {colors.map(([name, css], i) => (
          <button
            type="button"
            key={name}
            title={name}
            aria-label={`${name} ${kind}`}
            tabIndex={show ? 0 : -1}
            onClick={() => pick(i)}
            className={s.swatch}
          >
            <span
              className={s.swatchDot}
              style={{
                background: css,
                boxShadow: i === selected ? `0 0 0 2px oklch(1 0 0), 0 0 0 4px ${INK}` : "none",
                transform: !show ? "scale(0.3)" : i === selected ? "scale(1.08)" : "none",
                transitionDelay: show ? `${60 + i * 40}ms` : "0ms",
              }}
            />
          </button>
        ))}
      </div>
    );
  }

  render() {
    // stage: -1 idle, 0 "psst", 1 "?" offered, 2 "?" asked, 3 "take this", 4 holding out the pen, 5 tools opened
    const { tool, color, penColor, n, stage, open, look, scrollable, scrubbing } = this.state;
    const show = (v) =>
      v ? { rows: "1fr", op: 1, tf: "none" } : { rows: "0fr", op: 0, tf: "translateY(12px) scale(0.85)" };
    const pulling = stage >= 4;
    const [ex, ey] = stage === 4 ? [-4, 3] : stage >= 1 && stage < 4 ? [-4, 0] : LOOK[look];
    const surprised = stage === 0 || stage === 3;
    const fig = {
      lean: pulling ? "rotate(6deg)" : "none",
      armL: surprised ? "rotate(140deg)" : pulling ? "rotate(80deg)" : "rotate(16deg)",
      armR: pulling ? "rotate(98deg)" : "rotate(-16deg)",
      head: `rotate(${stage === 4 ? -8 : ex * 1.4}deg)`,
      eyes: `translate(${ex * 1.5}px, ${ey * 1.5}px)`,
    };
    const btn = (id) => (tool === id ? { background: INK, color: PAPER } : { background: "transparent", color: INK });
    const hlc = COLORS[color][1];
    const showColors = open && tool === "hl";
    const showPenColors = open && tool === "pen";
    const ring =
      tool === "pointer"
        ? { size: 10, background: "transparent", border: "none", opacity: 0 }
        : tool === "pen"
        ? { size: 8, background: PEN_COLORS[penColor][1], border: "none", opacity: 1 }
        : tool === "hl"
        ? { size: 24, background: hlc, border: "none", opacity: 0.9 }
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
            <a href="/blog/" className={s.headerLink}>
              blog
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
            <span className={s.signature}>– Hayden</span>
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
              open
                ? { opacity: 0, transform: "translateY(24px)", pointerEvents: "none" }
                : { opacity: 1, transform: "none", pointerEvents: "auto" }
            }
          >
            <div
              className={s.chat}
              style={{ marginBottom: (stage === 1 || stage === 2 ? -8 : stage >= 4 ? 66 : 37) + "px" }}
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
                    className={s.askButton}
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

            <div className={s.figure}>
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
                    <path d="M35 60 C34 64 36 68 34.5 74" />
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
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <g filter="url(#hgg-rough)">
                    <path
                      d="M14 6 C28 5.5 44 5.5 60 6.5 C62.5 7 62.5 17 60 17.5 C44 18.5 28 18.5 14 18 Z"
                      fill={LEMON}
                    />
                    <path d="M50 6.2 C50.8 10 50.8 14 50 17.8" />
                    <path d="M14 6.5 L4.5 11.5 L14 17.5" fill={PAPER} />
                    <path d="M8 9.8 L4.5 11.5 L8 13.4" fill={INK} />
                  </g>
                </svg>
              </button>
              <svg width="70" height="100" viewBox="0 0 70 100" {...figureStroke} className={s.figureFront}>
                <defs>
                  <filter id="hgg-rough" x="-10%" y="-10%" width="120%" height="120%">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" seed="3" />
                    <feDisplacementMap in="SourceGraphic" scale="2.2" />
                  </filter>
                </defs>
                <g filter="url(#hgg-rough)" style={lean}>
                  <path d="M35 74 C33 80 31 87 28.5 93 L24 94.5" />
                  <path d="M35.5 74 C37.5 80 40 87 42 93 L46.5 93.5" />
                  <path d="M35 55 C34 61 36 68 35 74" />
                  <g
                    style={{
                      transformOrigin: "35px 60px",
                      transition: `transform .55s ${SPRING}`,
                      transform: fig.armL,
                    }}
                  >
                    <path d="M35 60 C36 64 34 68 35.5 74" />
                  </g>
                  <g style={{ transformOrigin: "35px 55px", transition: `transform .7s ${SPRING}`, transform: fig.head }}>
                    <path
                      d="M52.6 8.9 C42.4 0.1 18.8 0.8 11.5 13.3 C4.1 25.8 8.5 45.6 23.2 51.5 C36.5 56.7 55.6 50.1 60 35.4 C63.7 22.1 57.8 11.8 46.8 5.2"
                      fill={PAPER}
                    />
                    <g style={{ transition: `transform .5s ${SPRING}`, transform: fig.eyes }}>
                      <path d="M26.2 25.8 L26.5 29.2" strokeWidth="3.4" />
                      <path d="M43.1 25.1 L43.2 28.6" strokeWidth="3.4" />
                    </g>
                    <path
                      d="M29.9 39.8 C32.8 41.2 38 41.2 40.1 39.1"
                      style={{ transition: "opacity .3s", opacity: surprised ? 0 : 1 }}
                    />
                    <path
                      d="M33.5 38.3 C32 40.5 33.5 42.7 35.7 42 C37.9 41.3 37.2 37.6 34.3 38.1"
                      style={{ transition: "opacity .3s", opacity: surprised ? 1 : 0 }}
                    />
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
                  s.swatchesStart
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
                {this.colorPicker(COLORS, color, showColors, (i) => this.setState({ color: i, tool: "hl" }), "highlighter")}
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
