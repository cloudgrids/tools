"use client";

import { useState, useCallback } from "react";
import { generateUUID } from "@/lib/crypto";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/ToastProvider";

export function UuidTool() {
  const { showToast } = useToast();
  const [count, setCount]   = useState(10);
  const [uuids, setUuids]   = useState<string[]>(() => Array.from({ length: 10 }, generateUUID));
  const [upper, setUpper]   = useState(false);
  const [noDash, setNoDash] = useState(false);

  function transform(uuid: string): string {
    let s = uuid;
    if (noDash) s = s.replace(/-/g, "");
    if (upper)  s = s.toUpperCase();
    return s;
  }

  const generate = useCallback(() => {
    setUuids(Array.from({ length: count }, generateUUID));
  }, [count]);

  const displayed = uuids.slice(0, count).map(transform);
  const allText   = displayed.join("\n");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-header"><span className="card-title">Options</span></div>
        <div className="card-body">
          <div className="flex gap-20 flex-wrap items-center">
            <div>
              <label className="form-label" htmlFor="uuid-count">Count</label>
              <input
                id="uuid-count"
                type="number"
                className="form-input"
                style={{ width: 90 }}
                min={1}
                max={100}
                value={count}
                onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
              />
            </div>
            <label className="toggle-wrap" htmlFor="uuid-upper">
              <span className="toggle">
                <input id="uuid-upper" type="checkbox" checked={upper}
                  onChange={(e) => setUpper(e.target.checked)} />
                <span className="toggle-track" />
              </span>
              <span className="toggle-label">Uppercase</span>
            </label>
            <label className="toggle-wrap" htmlFor="uuid-nodash">
              <span className="toggle">
                <input id="uuid-nodash" type="checkbox" checked={noDash}
                  onChange={(e) => setNoDash(e.target.checked)} />
                <span className="toggle-track" />
              </span>
              <span className="toggle-label">No Dashes</span>
            </label>
            <button className="btn btn-primary" onClick={generate}>
              🔄 Regenerate
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">{displayed.length} UUIDs</span>
          <div className="flex gap-8">
            <CopyButton text={allText} label="Copy All" />
            <button className="btn btn-ghost btn-sm" onClick={() => {
              const blob = new Blob([allText], { type: "text/plain" });
              const a = document.createElement("a");
              a.href = URL.createObjectURL(blob);
              a.download = "uuids.txt";
              a.click();
              showToast("Downloaded uuids.txt!");
            }}>Download</button>
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <div style={{ maxHeight: 500, overflow: "auto" }}>
            {displayed.map((uuid, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "10px 20px", borderBottom: "1px solid var(--border-subtle)",
                transition: "background .1s",
              }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-glass)")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "")}>
                <code className="text-mono" style={{ fontSize: 13.5, color: "var(--text-code)", letterSpacing: "0.02em" }}>
                  {uuid}
                </code>
                <CopyButton text={uuid} label="Copy" className="btn btn-ghost btn-xs" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
