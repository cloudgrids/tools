"use client";

import { useState, useMemo } from "react";
import { computeDiff, diffStats } from "@/lib/diff";
import { CopyButton } from "@/components/ui/CopyButton";

const SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const result = greet("World");`;

const SAMPLE_B = `function greet(name: string): string {
  console.log(\`Hello, \${name}!\`);
  return \`Hello, \${name}!\`;
}

const result = greet("DevKit Pro");
console.log(result);`;

export function DiffTool() {
  const [textA, setTextA] = useState(SAMPLE_A);
  const [textB, setTextB] = useState(SAMPLE_B);

  const lines  = useMemo(() => computeDiff(textA, textB), [textA, textB]);
  const stats  = useMemo(() => diffStats(lines), [lines]);

  const unifiedText = useMemo(() =>
    lines.map((l) => (l.type === "add" ? `+ ${l.content}` : l.type === "remove" ? `- ${l.content}` : `  ${l.content}`)).join("\n"),
    [lines]
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="split">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Original</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setTextA("")}>Clear</button>
          </div>
          <div className="card-body">
            <textarea
              id="diff-a"
              className="editor w-full"
              style={{ minHeight: 280 }}
              value={textA}
              onChange={(e) => setTextA(e.target.value)}
              placeholder="Paste original text here…"
              spellCheck={false}
            />
          </div>
        </div>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Modified</span>
            <button className="btn btn-ghost btn-sm" onClick={() => setTextB("")}>Clear</button>
          </div>
          <div className="card-body">
            <textarea
              id="diff-b"
              className="editor w-full"
              style={{ minHeight: 280 }}
              value={textB}
              onChange={(e) => setTextB(e.target.value)}
              placeholder="Paste modified text here…"
              spellCheck={false}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <div className="flex gap-8 items-center">
            <span className="card-title">Diff</span>
            <span className="badge badge-success">+{stats.added}</span>
            <span className="badge badge-error">−{stats.removed}</span>
            <span className="badge badge-info">={stats.unchanged}</span>
          </div>
          <div className="flex gap-8">
            <button className="btn btn-ghost btn-sm"
              onClick={() => { setTextA(SAMPLE_A); setTextB(SAMPLE_B); }}>
              Sample
            </button>
            <CopyButton text={unifiedText} label="Copy Diff" />
          </div>
        </div>
        <div className="card-body" style={{ padding: 0 }}>
          <pre id="diff-output" className="output" style={{
            borderRadius: 0, border: "none", minHeight: 200, maxHeight: 500, overflow: "auto",
            padding: "16px 20px",
          }}>
            {lines.map((line, i) => (
              <span
                key={i}
                className={line.type === "add" ? "diff-add" : line.type === "remove" ? "diff-del" : "diff-eq"}
              >
                {line.type === "add" ? "+ " : line.type === "remove" ? "- " : "  "}
                {line.content}
              </span>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}
