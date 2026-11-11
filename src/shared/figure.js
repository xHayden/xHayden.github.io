// The stick figure and the pencil he hands you, as SVG path data, so every page draws the same
// guy. The landing page docks him in the corner (src/components/layouts/PortfolioLayout.jsx) and
// the blog poses him lounging over its post list (blog/assets/js/lounger.js).
//
// The figure lives in a 70 x 100 box, standing, with his feet at the bottom. Drawn in INK at
// stroke width 2.3 unless noted, through the ROUGH filter for a hand-drawn edge.
export const FIGURE = {
  head: "M52.6 8.9 C42.4 0.1 18.8 0.8 11.5 13.3 C4.1 25.8 8.5 45.6 23.2 51.5 C36.5 56.7 55.6 50.1 60 35.4 C63.7 22.1 57.8 11.8 46.8 5.2",
  // Short strokes at stroke width 3.4
  eyes: ["M26.2 25.8 L26.5 29.2", "M43.1 25.1 L43.2 28.6"],
  eyeCenters: [
    [26.3, 27.5],
    [43.1, 26.8],
  ],
  smile: "M29.9 39.8 C32.8 41.2 38 41.2 40.1 39.1",
  oh: "M33.5 38.3 C32 40.5 33.5 42.7 35.7 42 C37.9 41.3 37.2 37.6 34.3 38.1",
  body: "M35 55 C34 61 36 68 35 74",
  // Both arms hang from the shoulder to the hand
  armL: "M35 60 C36 64 34 68 35.5 74",
  armR: "M35 60 C34 64 36 68 34.5 74",
  legs: ["M35 74 C33 80 31 87 28.5 93 L24 94.5", "M35.5 74 C37.5 80 40 87 42 93 L46.5 93.5"],
  // Pivots for posing
  neck: [35, 55],
  shoulder: [35, 60],
  hip: [35, 74],
  hand: [35.5, 74],
  stroke: 2.3,
};

// The pencil, pointing left, in a 66 x 24 box: tip at (4.5, 11.5), held at the band near (52, 12).
// Body in LEMON, the sharpened wood in PAPER, the lead in INK, at stroke width 2.
export const PENCIL = {
  body: "M14 6 C28 5.5 44 5.5 60 6.5 C62.5 7 62.5 17 60 17.5 C44 18.5 28 18.5 14 18 Z",
  band: "M50 6.2 C50.8 10 50.8 14 50 17.8",
  wood: "M14 6.5 L4.5 11.5 L14 17.5",
  lead: "M8 9.8 L4.5 11.5 L8 13.4",
  grip: [52, 12],
  stroke: 2,
};

// feTurbulence + feDisplacementMap settings for the hand-drawn wobble on his lines
export const ROUGH = { baseFrequency: 0.05, numOctaves: 2, seed: 3, scale: 2.2 };
