"use client";

import { useState, useMemo } from "react";
import {
  hexToRgb, rgbToHsl, hslToHex, isValidHex,
  generatePalette, generateShades, contrastRatio,
} from "@/lib/color";
import { CopyButton } from "@/components/ui/CopyButton";

const DEFAULT = "#7c3aed";

export function ColorTool() {
  const [hex, setHex]           = useState(DEFAULT);
  const [hexInput, setHexInput] = useState(DEFAULT);
  const [contrastText, setContrastText] = useState("#ffffff");
  const [contrastBg,   setContrastBg]   = useState("#7c3aed");

  const colorInfo = useMemo(() => {
    if (!isValidHex(hex)) return null;
    const [r, g, b] = hexToRgb(hex);
    const [h, s, l] = rgbToHsl(r, g, b);
    return {
      rgb:     `rgb(${r}, ${g}, ${b})`,
      hsl:     `hsl(${h}, ${s}%, ${l}%)`,
      cssVar:  `--color-primary: hsl(${h}, ${s}%, ${l}%)`,
      shades:  generateShades(hex),
      palette: generatePalette(hex),
    };
  }, [hex]);

  const contrast = useMemo(() => {
    if (!isValidHex(contrastText) || !isValidHex(contrastBg)) return null;
    return contrastRatio(contrastText, contrastBg);
  }, [contrastText, contrastBg]);

  function handleHexInput(val: string) {
    setHexInput(val);
    if (isValidHex(val)) setHex(val);
  }

  function handlePickerChange(val: string) {
    setHex(val);
    setHexInput(val);
  }

  if (!colorInfo) return <div className="text-muted">Enter a valid hex color.</div>;

  const palette = colorInfo.palette;
  const paletteEntries = [
    { label: "Base",         hex: palette.base },
    { label: "Complement",   hex: palette.complement },
    { label: "Triadic 1",    hex: palette.triadic1 },
    { label: "Triadic 2",    hex: palette.triadic2 },
    { label: "Analogous 1",  hex: palette.analogous1 },
    { label: "Analogous 2",  hex: palette.analogous2 },
    { label: "Split-C 1",    hex: palette.splitComp1 },
    { label: "Split-C 2",    hex: palette.splitComp2 },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="split">
        {/* Picker */}
        <div className="card">
          <div className="card-header"><span className="card-title">Color Picker</span></div>
          <div className="card-body">
            <div className="flex gap-20 flex-wrap items-start">
              <input
                type="color"
                id="color-picker"
                value={hex}
                onChange={(e) => handlePickerChange(e.target.value)}
                style={{ width: 100, height: 100, borderRadius: 12, border: "none", cursor: "pointer" }}
              />
              <div style={{ flex: 1, minWidth: 200 }}>
                {[
                  { label: "HEX", value: hexInput, id: "color-hex", onChange: handleHexInput, readOnly: false, copy: hex },
                  { label: "RGB", value: colorInfo.rgb, id: "color-rgb", onChange: null, readOnly: true, copy: colorInfo.rgb },
                  { label: "HSL", value: colorInfo.hsl, id: "color-hsl", onChange: null, readOnly: true, copy: colorInfo.hsl },
                  { label: "CSS Variable", value: colorInfo.cssVar, id: "color-css", onChange: null, readOnly: true, copy: colorInfo.cssVar },
                ].map(({ label, value, id, onChange, readOnly, copy }) => (
                  <div className="form-group" key={id}>
                    <label className="form-label" htmlFor={id}>{label}</label>
                    <div className="flex gap-8">
                      <input
                        id={id}
                        type="text"
                        className="form-input w-full text-mono"
                        value={value}
                        readOnly={readOnly}
                        onChange={onChange ? (e) => onChange(e.target.value) : undefined}
                        spellCheck={false}
                      />
                      <CopyButton text={copy} label="Copy" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Shades */}
        <div className="card">
          <div className="card-header"><span className="card-title">Shades &amp; Tints</span></div>
          <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {colorInfo.shades.map(({ hex: sh, l }) => (
              <div key={l} className="flex items-center gap-12" style={{ cursor: "pointer" }}
                onClick={() => { handlePickerChange(sh); }}>
                <div style={{ width: 40, height: 28, background: sh, borderRadius: 6, border: "1px solid rgba(255,255,255,.1)", flexShrink: 0 }} />
                <code className="text-secondary text-mono" style={{ fontSize: 12 }}>{sh}</code>
                <span className="text-muted text-xs">L{l}</span>
                <CopyButton text={sh} label="Copy" className="btn btn-ghost btn-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Palette */}
      <div className="card">
        <div className="card-header"><span className="card-title">Complementary Palette</span></div>
        <div className="card-body">
          <div className="flex gap-12 flex-wrap">
            {paletteEntries.map(({ label, hex: ph }) => (
              <div key={label} style={{ textAlign: "center", cursor: "pointer" }}
                onClick={() => handlePickerChange(ph)}>
                <div style={{
                  width: 64, height: 64, background: ph,
                  borderRadius: 10, border: "1px solid rgba(255,255,255,.1)",
                  marginBottom: 6, transition: "transform .15s",
                }} onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.1)")}
                   onMouseLeave={(e) => (e.currentTarget.style.transform = "")} />
                <code style={{ fontSize: 10, color: "var(--text-muted)", display: "block" }}>{ph}</code>
                <div style={{ fontSize: 10, color: "var(--text-muted)", marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contrast Checker */}
      <div className="card">
        <div className="card-header"><span className="card-title">WCAG Contrast Checker</span></div>
        <div className="card-body">
          <div className="split">
            <div style={{ borderRadius: 10, padding: 20, background: contrastBg, border: "1px solid var(--border-subtle)" }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: contrastText, marginBottom: 8 }}>
                Large Text Sample (18px+)
              </div>
              <div style={{ fontSize: 14, color: contrastText }}>
                Normal text for readability check — The quick brown fox.
              </div>
            </div>
            <div>
              <div className="form-group">
                <label className="form-label">Text Color</label>
                <div className="flex gap-8 items-center">
                  <input type="color" value={contrastText} onChange={(e) => setContrastText(e.target.value)} />
                  <span className="text-mono text-secondary" style={{ fontSize: 13 }}>{contrastText}</span>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Background Color</label>
                <div className="flex gap-8 items-center">
                  <input type="color" value={contrastBg} onChange={(e) => setContrastBg(e.target.value)} />
                  <span className="text-mono text-secondary" style={{ fontSize: 13 }}>{contrastBg}</span>
                </div>
              </div>
              {contrast && (
                <div className="mt-12">
                  <div style={{ fontSize: 32, fontWeight: 700, marginBottom: 12 }}>{contrast.ratio}:1</div>
                  <div className="flex gap-8 flex-wrap">
                    <span className={`badge ${contrast.aaSmall  ? "badge-success" : "badge-error"}`}>AA Normal {contrast.aaSmall  ? "✓" : "✗"}</span>
                    <span className={`badge ${contrast.aaLarge  ? "badge-success" : "badge-error"}`}>AA Large {contrast.aaLarge  ? "✓" : "✗"}</span>
                    <span className={`badge ${contrast.aaaSmall ? "badge-success" : "badge-error"}`}>AAA Normal {contrast.aaaSmall ? "✓" : "✗"}</span>
                    <span className={`badge ${contrast.aaaLarge ? "badge-success" : "badge-error"}`}>AAA Large {contrast.aaaLarge ? "✓" : "✗"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
