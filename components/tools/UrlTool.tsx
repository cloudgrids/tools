"use client";

import { useState, useMemo } from "react";
import { CopyButton } from "@/components/ui/CopyButton";

function parseUrl(raw: string): Record<string, string> | null {
  try {
    const u = new URL(raw);
    const params: Record<string, string> = {};
    u.searchParams.forEach((v, k) => { params[k] = v; });
    return {
      protocol: u.protocol,
      host:     u.host,
      hostname: u.hostname,
      port:     u.port || "(default)",
      pathname: u.pathname,
      search:   u.search,
      hash:     u.hash || "(none)",
      origin:   u.origin,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [`param:${k}`, v])),
    };
  } catch { return null; }
}

export function UrlTool() {
  const [input,   setInput]   = useState("https://devkit.pro/tools/url?query=hello+world&page=1&debug=true#section");
  const [encoded, setEncoded] = useState("");
  const [decoded, setDecoded] = useState("");

  const parsed = useMemo(() => parseUrl(input), [input]);

  function encode() {
    setEncoded(encodeURIComponent(input));
    setDecoded("");
  }
  function decode() {
    try { setDecoded(decodeURIComponent(input)); setEncoded(""); }
    catch { setDecoded("Error: Invalid encoded URI"); }
  }
  function encodeComponent() {
    setEncoded(input.split("").map((c) => /[A-Za-z0-9\-_.~]/.test(c) ? c : "%" + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, "0")).join(""));
  }

  const output = encoded || decoded;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="split">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Input</span>
            <button className="btn btn-ghost btn-sm" onClick={() => { setInput(""); setEncoded(""); setDecoded(""); }}>Clear</button>
          </div>
          <div className="card-body">
            <textarea
              id="url-input"
              className="editor w-full"
              style={{ minHeight: 160 }}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Enter a URL or encoded string…"
              spellCheck={false}
            />
            <div className="flex gap-8 mt-12 flex-wrap">
              <button className="btn btn-primary" onClick={encode}>Encode URI</button>
              <button className="btn btn-ghost"   onClick={decode}>Decode URI</button>
              <button className="btn btn-ghost"   onClick={encodeComponent}>Encode Component</button>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Output</span>
            <CopyButton text={output} label="Copy" />
          </div>
          <div className="card-body">
            <pre id="url-output" className="output w-full" style={{ minHeight: 160 }}>{output}</pre>
          </div>
        </div>
      </div>

      {parsed && (
        <div className="card">
          <div className="card-header"><span className="card-title">URL Breakdown</span></div>
          <div className="card-body" style={{ padding: 0 }}>
            {Object.entries(parsed).map(([key, val]) => (
              <div key={key} style={{
                display: "flex", alignItems: "center", gap: 16, padding: "10px 20px",
                borderBottom: "1px solid var(--border-subtle)",
              }}>
                <span className="badge badge-purple" style={{ minWidth: 110, justifyContent: "center" }}>
                  {key.replace("param:", "?")}
                </span>
                <code className="text-mono flex-1" style={{ fontSize: 13, color: "var(--text-code)", wordBreak: "break-all" }}>
                  {val}
                </code>
                <CopyButton text={val} label="Copy" className="btn btn-ghost btn-xs" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
