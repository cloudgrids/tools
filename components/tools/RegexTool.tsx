"use client";

import { useState, useMemo } from "react";
import type { RegexMatch } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";

const SAMPLES: Record<string, { pattern: string; flags: string }> = {
  Email:    { pattern: "[\\w._%+\\-]+@[\\w.\\-]+\\.[a-zA-Z]{2,}", flags: "g" },
  URL:      { pattern: "https?:\\/\\/[^\\s]+", flags: "g" },
  IPv4:     { pattern: "\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b", flags: "g" },
  "HEX Color": { pattern: "#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b", flags: "g" },
  Date:     { pattern: "\\b\\d{4}-\\d{2}-\\d{2}\\b", flags: "g" },
};

const DEFAULT_TEXT =
  "The quick brown fox jumps over the lazy dog.\nContact: hello@example.com or admin@devkit.io\nVisit https://devkit.pro for more info.";

function escHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function RegexTool() {
  const [pattern, setPattern] = useState("[\\w._%+\\-]+@[\\w.\\-]+\\.[a-zA-Z]{2,}");
  const [flags,   setFlags]   = useState("g");
  const [text,    setText]    = useState(DEFAULT_TEXT);
  const [replace, setReplace] = useState("");

  const result = useMemo(() => {
    if (!pattern) return null;
    let rx: RegExp;
    try {
      const f = flags.includes("g") ? flags : flags + "g";
      rx = new RegExp(pattern, f);
    } catch (e) {
      return { error: (e as Error).message };
    }
    const matches: RegexMatch[] = [...text.matchAll(rx)].map((m) => ({
      match:  m[0],
      index:  m.index ?? 0,
      groups: m.slice(1),
    }));
    return { matches, rx };
  }, [pattern, flags, text]);

  const highlighted = useMemo(() => {
    if (!result || "error" in result || !result.matches.length) return escHtml(text);
    const { rx } = result;
    const safeRx = new RegExp(rx.source, rx.flags);
    let last = 0, html = "";
    for (const m of text.matchAll(safeRx)) {
      html += escHtml(text.slice(last, m.index));
      html += `<mark class="rx-match">${escHtml(m[0])}</mark>`;
      last = (m.index ?? 0) + m[0].length;
    }
    return html + escHtml(text.slice(last));
  }, [text, result]);

  const groupsText = useMemo(() => {
    if (!result || "error" in result) return "";
    return result.matches
      .map((m, i) => {
        const gs = m.groups.map((g, j) => `  Group ${j + 1}: ${g ?? "(undefined)"}`).join("\n");
        return `Match ${i + 1}: "${m.match}"${gs ? "\n" + gs : ""}`;
      })
      .join("\n\n") || "No matches found.";
  }, [result]);

  const replacedText = useMemo(() => {
    if (!result || "error" in result || !replace) return "";
    try {
      const f = flags.includes("g") ? flags : flags + "g";
      return text.replace(new RegExp(pattern, f), replace);
    } catch { return ""; }
  }, [pattern, flags, text, replace, result]);

  const matchCount = (!result || "error" in result) ? 0 : result.matches.length;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">Pattern</span>
          {matchCount > 0 && (
            <span className="badge badge-info">{matchCount} match{matchCount !== 1 ? "es" : ""}</span>
          )}
        </div>
        <div className="card-body">
          <div className="flex gap-12 mb-16 flex-wrap">
            <div style={{ flex: 1, minWidth: 260 }}>
              <label className="form-label">Regular Expression</label>
              <div className="flex gap-8 items-center">
                <span className="text-muted" style={{ fontSize: 20 }}>/</span>
                <input
                  id="regex-pattern"
                  type="text"
                  className="form-input flex-1"
                  value={pattern}
                  onChange={(e) => setPattern(e.target.value)}
                  placeholder="e.g. \b\w+@\w+\.\w+\b"
                  spellCheck={false}
                  autoComplete="off"
                />
                <span className="text-muted" style={{ fontSize: 20 }}>/</span>
                <input
                  id="regex-flags"
                  type="text"
                  className="form-input"
                  style={{ width: 72 }}
                  value={flags}
                  onChange={(e) => setFlags(e.target.value.replace(/[^gimsuy]/g, ""))}
                  placeholder="gim"
                  maxLength={6}
                />
              </div>
            </div>
            <div>
              <label className="form-label">Replace with</label>
              <input
                id="regex-replace"
                type="text"
                className="form-input"
                style={{ width: 180 }}
                value={replace}
                onChange={(e) => setReplace(e.target.value)}
                placeholder="replacement"
              />
            </div>
          </div>

          <div className="flex gap-8 mb-12 flex-wrap">
            {Object.entries(SAMPLES).map(([name, s]) => (
              <button key={name} className="btn btn-ghost btn-sm"
                onClick={() => { setPattern(s.pattern); setFlags(s.flags); }}>
                {name}
              </button>
            ))}
          </div>

          <label className="form-label">Test String</label>
          <textarea
            id="regex-input"
            className="editor w-full"
            style={{ minHeight: 100 }}
            value={text}
            onChange={(e) => setText(e.target.value)}
            spellCheck={false}
          />

          {result && "error" in result && (
            <div className="badge badge-error mt-8">✗ {result.error}</div>
          )}
        </div>
      </div>

      <div className="split">
        <div className="card">
          <div className="card-header"><span className="card-title">Highlighted Matches</span></div>
          <div className="card-body">
            <div
              id="regex-highlight"
              className="output"
              style={{ minHeight: 160, whiteSpace: "pre-wrap" }}
              dangerouslySetInnerHTML={{ __html: highlighted }}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Match Groups</span>
            <CopyButton text={groupsText} label="Copy" />
          </div>
          <div className="card-body">
            <pre id="regex-groups" className="output" style={{ minHeight: 160 }}>{groupsText}</pre>
          </div>
        </div>
      </div>

      {replacedText && (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Replaced Output</span>
            <CopyButton text={replacedText} label="Copy" />
          </div>
          <div className="card-body">
            <pre id="regex-replaced" className="output" style={{ minHeight: 60 }}>{replacedText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
