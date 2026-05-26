"use client";

import { useState, useMemo } from "react";
import { parseMarkdown, wordCount } from "@/lib/markdown";
import { CopyButton } from "@/components/ui/CopyButton";

const SAMPLE = `# Welcome to Markdown Preview

A **live** side-by-side editor with *instant* rendering — no dependencies.

## Features

- 🚀 Real-time rendering
- **Bold** and *italic* text support
- \`inline code\` highlighting
- [Links](https://github.com) work too
- ~~Strikethrough~~ support

## Code Block

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
console.log(greet("DevKit Pro"));
\`\`\`

## Blockquote

> "Code is like humor. When you have to explain it, it's bad." — Cory House

---

### Ordered List

1. First item
2. Second item  
3. Third item
`;

type ViewMode = "split" | "edit" | "preview";

export function MarkdownTool() {
  const [text, setText]     = useState(SAMPLE);
  const [mode, setMode]     = useState<ViewMode>("split");

  const html  = useMemo(() => parseMarkdown(text), [text]);
  const stats = useMemo(() => wordCount(text), [text]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, height: "calc(100vh - 120px)" }}>
      <div className="flex items-center justify-between">
        <div className="tabs" style={{ marginBottom: 0, flexShrink: 0 }}>
          {(["split", "edit", "preview"] as ViewMode[]).map((m) => (
            <button key={m} className={`tab ${mode === m ? "active" : ""}`}
              onClick={() => setMode(m)}>
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-8">
          <CopyButton text={html} label="Copy HTML" />
          <CopyButton text={text} label="Copy MD" />
          <button className="btn btn-ghost btn-sm" onClick={() => setText("")}>Clear</button>
        </div>
      </div>

      <div className="flex gap-16" style={{ flex: 1, minHeight: 0 }}>
        {/* Editor */}
        {(mode === "split" || mode === "edit") && (
          <div className="card flex-1" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div className="card-header">
              <span className="card-title">Markdown Input</span>
              <span className="text-sm text-muted">
                {stats.words} words · {stats.chars} chars · {stats.lines} lines
              </span>
            </div>
            <div style={{ flex: 1, padding: 16, overflow: "auto" }}>
              <textarea
                id="md-input"
                className="editor w-full"
                style={{ height: "100%", minHeight: 400, resize: "none" }}
                value={text}
                onChange={(e) => setText(e.target.value)}
                spellCheck={false}
              />
            </div>
          </div>
        )}

        {/* Preview */}
        {(mode === "split" || mode === "preview") && (
          <div className="card flex-1" style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
            <div className="card-header"><span className="card-title">Preview</span></div>
            <div
              id="md-preview"
              className="md-preview flex-1"
              style={{ padding: "20px 24px", overflowY: "auto", fontSize: 15, lineHeight: 1.7 }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
