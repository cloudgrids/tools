"use client";

import { useState, useMemo } from "react";
import { generatePassword, passwordStrength } from "@/lib/crypto";
import { CopyButton } from "@/components/ui/CopyButton";

export function PasswordTool() {
  const [length,  setLength]  = useState(20);
  const [upper,   setUpper]   = useState(true);
  const [lower,   setLower]   = useState(true);
  const [digits,  setDigits]  = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [count,   setCount]   = useState(5);
  const [passwords, setPasswords] = useState<string[]>(() =>
    Array.from({ length: 5 }, () => generatePassword(20, { upper: true, lower: true, digits: true, symbols: true }))
  );

  const opts = { upper, lower, digits, symbols };

  function regenerate() {
    setPasswords(Array.from({ length: count }, () => generatePassword(length, opts)));
  }

  const previewStrength = useMemo(() => {
    const pw = passwords[0] ?? "";
    return passwordStrength(pw);
  }, [passwords]);

  const Toggle = ({ label, checked, onToggle, id }: { label: string; checked: boolean; onToggle: () => void; id: string }) => (
    <label className="toggle-wrap" htmlFor={id}>
      <span className="toggle">
        <input id={id} type="checkbox" checked={checked} onChange={onToggle} />
        <span className="toggle-track" />
      </span>
      <span className="toggle-label">{label}</span>
    </label>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-header"><span className="card-title">Configuration</span></div>
        <div className="card-body">
          <div className="form-group">
            <label className="form-label" htmlFor="pw-length">Length: {length}</label>
            <input id="pw-length" type="range" className="slider" min={8} max={128} value={length}
              onChange={(e) => setLength(Number(e.target.value))} />
          </div>
          <div className="flex gap-20 flex-wrap mt-12">
            <Toggle id="pw-upper"   label="Uppercase (A-Z)"  checked={upper}   onToggle={() => setUpper(!upper)}   />
            <Toggle id="pw-lower"   label="Lowercase (a-z)"  checked={lower}   onToggle={() => setLower(!lower)}   />
            <Toggle id="pw-digits"  label="Digits (0-9)"     checked={digits}  onToggle={() => setDigits(!digits)} />
            <Toggle id="pw-symbols" label="Symbols (!@#…)"   checked={symbols} onToggle={() => setSymbols(!symbols)} />
          </div>
          <div className="flex gap-16 mt-16 items-center flex-wrap">
            <div>
              <label className="form-label" htmlFor="pw-count">Count</label>
              <input id="pw-count" type="number" className="form-input" style={{ width: 80 }}
                min={1} max={50} value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(50, Number(e.target.value))))} />
            </div>
            <button className="btn btn-primary mt-16" onClick={regenerate}>🔄 Generate</button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">{passwords.length} Passwords</span>
          <div className="flex gap-8 items-center">
            <span className="badge" style={{ background: `${previewStrength.color}22`, color: previewStrength.color, border: `1px solid ${previewStrength.color}44` }}>
              {previewStrength.label}
            </span>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          {/* Strength bar */}
          <div style={{ padding: "12px 20px 0" }}>
            <div className="strength-bar">
              <div className="strength-fill" style={{
                width: `${(previewStrength.score / 7) * 100}%`,
                background: previewStrength.color,
              }} />
            </div>
          </div>

          <div style={{ maxHeight: 400, overflow: "auto" }}>
            {passwords.map((pw, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 20px", borderBottom: "1px solid var(--border-subtle)",
                transition: "background .1s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-glass)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                <code className="text-mono" style={{ fontSize: 13.5, color: "var(--text-code)", wordBreak: "break-all" }}>
                  {pw}
                </code>
                <CopyButton text={pw} label="Copy" className="btn btn-ghost btn-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
