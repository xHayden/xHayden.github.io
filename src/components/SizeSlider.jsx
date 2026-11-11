import React from "react";
import s from "../style/SizeSlider.module.css";

// Brush size as a wedge you drag along, thin to thick, in the tool's color. While the thumb is
// held (or focused from the keyboard), a dot above it shows the brush at its real size.
export default function SizeSlider({ label, min, max, value, color, onChange, tabIndex }) {
  return (
    <label className={s.slider} style={{ "--c": color, "--pct": (value - min) / (max - min), "--size": `${value}px` }}>
      <span className={s.wedge} aria-hidden="true" />
      <span className={s.preview} aria-hidden="true" />
      <input
        type="range"
        min={min}
        max={max}
        step="0.1"
        value={value}
        aria-label={label}
        tabIndex={tabIndex}
        onChange={(e) => onChange(+e.target.value)}
      />
    </label>
  );
}
