"use client";

import { useState, useCallback } from "react";
import type { ColorStop } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";

type GradType = "linear" | "radial" | "conic";

const PRESETS: { name: string; stops: ColorStop[] }[] = [
  { name: "Aurora",   stops: [{ color: "#7c3aed", pos: 0 }, { color: "#06b6d4", pos: 50 }, { color: "#ec4899", pos: 100 }] },
  { name: "Sunset",   stops: [{ color: "#ff6b6b", pos: 0 }, { color: "#feca57", pos: 100 }] },
  { name: "Ocean",    stops: [{ color: "#0f2027", pos: 0 }, { color: "#203a43", pos: 50 }, { color: "#2c5364", pos: 100 }] },
  { name: "Emerald",  stops: [{ color: "#11998e", pos: 0 }, { color: "#38ef7d", pos: 100 }] },
  { name: "Peach",    stops: [{ color: "#ed213a", pos: 0 }, { color: "#93291e", pos: 100 }] },
  { name: "Royal",    stops: [{ color: "#141e30", pos: 0 }, { color: "#243b55", pos: 100 }] },
  { name: "Neon",     stops: [{ color: "#f7971e", pos: 0 }, { color: "#ffd200", pos: 100 }] },
  { name: "Midnight", stops: [{ color: "#232526", pos: 0 }, { color: "#414345", pos: 100 }] },
];

const GALLERY = [
  [{ color: "#6a3093", pos: 0 }, { color: "#a044ff", pos: 100 }],
  [{ color: "#f093fb", pos: 0 }, { color: "#f5576c", pos: 100 }],
  [{ color: "#4facfe", pos: 0 }, { color: "#00f2fe", pos: 100 }],
  [{ color: "#43e97b", pos: 0 }, { color: "#38f9d7", pos: 100 }],
  [{ color: "#fa709a", pos: 0 }, { color: "#fee140", pos: 100 }],
  [{ color: "#30cfd0", pos: 0 }, { color: "#330867", pos: 100 }],
  [{ color: "#f6d365", pos: 0 }, { color: "#fda085", pos: 100 }],
  [{ color: "#667eea", pos: 0 }, { color: "#764ba2", pos: 100 }],
  [{ color: "#ffecd2", pos: 0 }, { color: "#fcb69f", pos: 100 }],
  [{ color: "#a18cd1", pos: 0 }, { color: "#fbc2eb", pos: 100 }],
  [{ color: "#d299c2", pos: 0 }, { color: "#fef9d7", pos: 100 }],
  [{ color: "#0fd850", pos: 0 }, { color: "#f9f047", pos: 100 }],
];

function buildCss(type: GradType, angle: number, stops: ColorStop[]): string {
  const sorted = [...stops].sort((a, b) => a.pos - b.pos);
  const stopsStr = sorted.map((s) => `${s.color} ${s.pos}%`).join(", ");
  if (type === "linear") return `linear-gradient(${angle}deg, ${stopsStr})`;
  if (type === "radial")  return `radial-gradient(ellipse at center, ${stopsStr})`;
  return `conic-gradient(from ${angle}deg, ${stopsStr})`;
}

export function GradientTool() {
  const [type,  setType]  = useState<GradType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>(PRESETS[0].stops.map((s) => ({ ...s })));

  const css    = buildCss(type, angle, stops);
  const cssProp = `background-image: ${css};`;

  const updateStop = useCallback((i: number, patch: Partial<ColorStop>) => {
    setStops((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }, []);

  const removeStop = useCallback((i: number) => {
    setStops((prev) => prev.filter((_, idx) => idx !== i));
  }, []);

  const addStop = useCallback(() => {
    setStops((prev) => [...prev, { color: "#ffffff", pos: 75 }]);
  }, []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="split">
        {/* Controls */}
        <div className="card">
          <div className="card-header"><span className="card-title">Controls</span></div>
          <div className="card-body">
            <div className="form-group">
              <label className="form-label">Type</label>
              <div className="tabs" style={{ marginBottom: 0 }}>
                {(["linear", "radial", "conic"] as GradType[]).map((t) => (
                  <button key={t} className={`tab ${type === t ? "active" : ""}`} onClick={() => setType(t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {type !== "radial" && (
              <div className="form-group mt-16">
                <label className="form-label">Angle: {angle}°</label>
                <input type="range" className="slider" min={0} max={360} value={angle}
                  onChange={(e) => setAngle(Number(e.target.value))} />
              </div>
            )}

            <div className="form-group mt-16">
              <label className="form-label">Color Stops</label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {stops.map((stop, i) => (
                  <div key={i} className="stop-row">
                    <input type="color" value={stop.color}
                      onChange={(e) => updateStop(i, { color: e.target.value })} />
                    <input type="range" className="slider flex-1" min={0} max={100} value={stop.pos}
                      onChange={(e) => updateStop(i, { pos: Number(e.target.value) })} />
                    <span className="text-sm text-muted" style={{ minWidth: 34 }}>{stop.pos}%</span>
                    {stops.length > 2 && (
                      <button className="btn btn-ghost btn-xs" onClick={() => removeStop(i)}>✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button className="btn btn-ghost btn-sm mt-8" onClick={addStop}>+ Add Stop</button>
            </div>

            <div className="form-group mt-4">
              <label className="form-label">Presets</label>
              <div className="flex flex-wrap gap-8">
                {PRESETS.map((p) => (
                  <button key={p.name} className="btn btn-ghost btn-sm"
                    onClick={() => setStops(p.stops.map((s) => ({ ...s })))}>
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <div className="card-header"><span className="card-title">Preview</span></div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="grad-preview" style={{ background: css }} />
            <div>
              <label className="form-label">CSS Output</label>
              <div className="flex gap-8">
                <pre className="output flex-1" style={{ minHeight: 60 }}>{cssProp}</pre>
                <CopyButton text={cssProp} label="⎘" className="btn btn-ghost btn-icon" />
              </div>
            </div>
            <div>
              <label className="form-label">Shorthand</label>
              <pre className="output w-full" style={{ minHeight: 60 }}>{`background: ${css};\nbackground-attachment: fixed;`}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* Gallery */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Gradient Gallery</span>
          <span className="text-sm text-muted">Click to apply</span>
        </div>
        <div className="card-body">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(90px,1fr))", gap: 10 }}>
            {GALLERY.map((g, i) => {
              const bg = `linear-gradient(135deg, ${g.map((s) => `${s.color} ${s.pos}%`).join(", ")})`;
              return (
                <div key={i} className="grad-item" style={{ background: bg }}
                  onClick={() => setStops(g.map((s) => ({ ...s })))} />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
