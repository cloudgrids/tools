"use client";

import { useState, useEffect } from "react";
import { hashText, hashBuffer } from "@/lib/crypto";
import type { HashResult } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";
import { useToast } from "@/components/ui/ToastProvider";

const DEFAULT_TEXT = "The quick brown fox jumps over the lazy dog";

function formatBytes(b: number): string {
  if (b < 1024) return b + " B";
  if (b < 1024 * 1024) return (b / 1024).toFixed(1) + " KB";
  return (b / 1024 / 1024).toFixed(2) + " MB";
}

export function HashTool() {
  const { showToast } = useToast();
  const [input,    setInput]   = useState(DEFAULT_TEXT);
  const [results,  setResults] = useState<HashResult[]>([]);
  const [loading,  setLoading] = useState(false);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [fileResults, setFileResults] = useState<HashResult[]>([]);

  async function run() {
    if (!input.trim()) return;
    setLoading(true);
    const r = await hashText(input);
    setResults(r);
    setLoading(false);
  }

  useEffect(() => { run(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleFile(file: File) {
    setFileName(file.name);
    setFileSize(formatBytes(file.size));
    const buf = await file.arrayBuffer();
    const r   = await hashBuffer(buf);
    setFileResults(r);
  }

  const LABEL: Record<string, string> = {
    "SHA-1":   "SHA-1 (160-bit)",
    "SHA-256": "SHA-256 (256-bit)",
    "SHA-384": "SHA-384 (384-bit)",
    "SHA-512": "SHA-512 (512-bit)",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Input Text</span>
          <div className="flex gap-8">
            <button className="btn btn-ghost btn-sm" onClick={() => { setInput(DEFAULT_TEXT); run(); }}>Sample</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { setInput(""); setResults([]); }}>Clear</button>
          </div>
        </div>
        <div className="card-body">
          <textarea
            id="hash-input"
            className="editor w-full"
            style={{ minHeight: 120 }}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash…"
            spellCheck={false}
          />
          <div className="flex gap-8 mt-12">
            <button className="btn btn-primary" onClick={run} disabled={loading}>
              {loading ? "Computing…" : "🔐 Generate All Hashes"}
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header"><span className="card-title">Hash Results</span></div>
        <div className="card-body" style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {results.length === 0 && !loading && (
            <div className="text-muted text-sm">Enter text and click "Generate All Hashes"</div>
          )}
          {loading && <div className="text-muted text-sm">Computing…</div>}
          {results.map(({ algorithm, hash }) => (
            <div key={algorithm}>
              <div className="flex items-center justify-between mb-6">
                <span className="badge badge-info">{LABEL[algorithm] ?? algorithm}</span>
                <CopyButton text={hash} label="Copy" />
              </div>
              <code className="text-mono" style={{
                fontSize: 12, color: "var(--text-code)", wordBreak: "break-all",
                background: "rgba(8,8,16,.5)", padding: "10px 14px",
                borderRadius: 6, border: "1px solid var(--border-subtle)", display: "block",
              }}>{hash}</code>
            </div>
          ))}
        </div>
      </div>

      {/* File checksum */}
      <div className="card">
        <div className="card-header"><span className="card-title">File Checksum</span></div>
        <div className="card-body">
          <div
            className="drop-zone"
            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add("over"); }}
            onDragLeave={(e) => e.currentTarget.classList.remove("over")}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove("over");
              if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
            }}
            onClick={() => document.getElementById("hash-file")?.click()}
          >
            <div className="drop-zone-icon">🗃️</div>
            <div className="drop-zone-text">Drop a file to compute SHA-256 &amp; SHA-512</div>
            <input id="hash-file" type="file" style={{ display: "none" }}
              onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          </div>

          {fileResults.length > 0 && (
            <div className="mt-16">
              <div className="font-semibold mb-12">📄 {fileName} <span className="text-muted text-sm">({fileSize})</span></div>
              {fileResults.map(({ algorithm, hash }) => (
                <div key={algorithm} className="mb-12">
                  <div className="flex items-center justify-between mb-4">
                    <span className="badge badge-info">{algorithm}</span>
                    <CopyButton text={hash} label="Copy" />
                  </div>
                  <code style={{
                    fontSize: 11, fontFamily: "var(--font-mono, monospace)", color: "var(--text-code)",
                    wordBreak: "break-all", background: "rgba(8,8,16,.5)", padding: "10px",
                    borderRadius: 6, border: "1px solid var(--border-subtle)", display: "block",
                  }}>{hash}</code>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
