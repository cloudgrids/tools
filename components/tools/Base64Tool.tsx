"use client";

import { useState, useCallback } from "react";
import { useToast } from "@/components/ui/ToastProvider";
import { CopyButton } from "@/components/ui/CopyButton";

type TabId = "text" | "file";

function formatBytes(b: number): string {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(2) + " MB";
}

export function Base64Tool() {
  const { showToast } = useToast();
  const [tab, setTab]     = useState<TabId>("text");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [stats, setStats]   = useState("");

  // File state
  const [fileName,   setFileName]   = useState("");
  const [fileSize,   setFileSize]   = useState("");
  const [dataUrl,    setDataUrl]    = useState("");
  const [fileB64,    setFileB64]    = useState("");

  const encode = useCallback(() => {
    try {
      const enc = btoa(unescape(encodeURIComponent(input)));
      setOutput(enc);
      setStats(`Input: ${input.length} chars · Output: ${enc.length} chars · +${((enc.length / Math.max(input.length,1) - 1) * 100).toFixed(1)}%`);
    } catch (e) { setOutput(`Error: ${(e as Error).message}`); }
  }, [input]);

  const decode = useCallback(() => {
    try {
      const dec = decodeURIComponent(escape(atob(input.trim())));
      setOutput(dec);
      setStats(`Input: ${input.trim().length} chars · Output: ${dec.length} chars`);
    } catch { setOutput("Error: Invalid Base64 input"); setStats(""); }
  }, [input]);

  const encodeUrl = useCallback(() => {
    try {
      const enc = btoa(unescape(encodeURIComponent(input))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
      setOutput(enc);
      setStats(`URL-safe Base64 · ${enc.length} chars`);
    } catch (e) { setOutput(`Error: ${(e as Error).message}`); }
  }, [input]);

  function handleFile(file: File) {
    if (file.size > 5 * 1024 * 1024) { showToast("File exceeds 5MB limit", "error"); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const du = e.target?.result as string;
      const b64 = du.split(",")[1];
      setDataUrl(du);
      setFileB64(b64);
      setFileName(file.name);
      setFileSize(formatBytes(file.size));
    };
    reader.readAsDataURL(file);
  }

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === "text" ? "active" : ""}`} onClick={() => setTab("text")}>Text</button>
        <button className={`tab ${tab === "file" ? "active" : ""}`} onClick={() => setTab("file")}>File</button>
      </div>

      {tab === "text" && (
        <div className="split">
          <div className="card">
            <div className="card-header">
              <span className="card-title">Input</span>
              <button className="btn btn-ghost btn-sm" onClick={() => { setInput(""); setOutput(""); setStats(""); }}>Clear</button>
            </div>
            <div className="card-body">
              <textarea
                id="b64-input"
                className="editor w-full"
                style={{ minHeight: 300 }}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Enter text to encode or Base64 to decode…"
                spellCheck={false}
              />
              <div className="flex gap-8 mt-12">
                <button className="btn btn-primary" onClick={encode}>⬆ Encode</button>
                <button className="btn btn-ghost"   onClick={decode}>⬇ Decode</button>
                <button className="btn btn-ghost"   onClick={encodeUrl}>URL-safe</button>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <span className="card-title">Output</span>
              <CopyButton text={output} label="Copy" />
            </div>
            <div className="card-body">
              <pre id="b64-output" className="output w-full" style={{ minHeight: 300 }}>{output}</pre>
              {stats && <div className="text-sm text-muted mt-8">{stats}</div>}
            </div>
          </div>
        </div>
      )}

      {tab === "file" && (
        <div className="card">
          <div className="card-header"><span className="card-title">File to Base64</span></div>
          <div className="card-body">
            <div
              id="b64-drop"
              className="drop-zone"
              onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("over"); }}
              onDragLeave={(e) => e.currentTarget.classList.remove("over")}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove("over");
                if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
              }}
              onClick={() => document.getElementById("b64-file")?.click()}
            >
              <div className="drop-zone-icon">📂</div>
              <div className="drop-zone-text">Drop a file here or click to browse</div>
              <div className="drop-zone-sub">Supports any file type · Max 5MB</div>
              <input id="b64-file" type="file" style={{ display: "none" }}
                onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
            </div>

            {fileB64 && (
              <div className="mt-16">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <span className="font-semibold">{fileName}</span>
                    <span className="text-sm text-muted" style={{ marginLeft: 8 }}>{fileSize}</span>
                  </div>
                  <div className="flex gap-8">
                    <CopyButton text={dataUrl} label="Copy Data URL" />
                    <CopyButton text={fileB64} label="Copy Base64"   />
                  </div>
                </div>
                <pre className="output w-full" style={{ maxHeight: 300 }}>{fileB64}</pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
