"use client";

import { CopyButton } from "@/components/ui/CopyButton";
import { useCallback, useState } from "react";

const SAMPLE = JSON.stringify(
  {
    name: "DevKit Pro",
    version: "1.0.0",
    tools: ["json", "regex", "color", "markdown"],
    author: { name: "Open Source Community", github: "devkit-pro" },
    active: true,
    stars: 9999,
    config: { theme: "aurora-dark", offline: true },
  },
  null,
  2,
);

export function JsonTool() {
  const [input, setInput] = useState(SAMPLE);
  const [output, setOutput] = useState("");
  const [status, setStatus] = useState<"valid" | "invalid" | null>(null);
  const [stats, setStats] = useState("");

  const format = useCallback(
    (indent: number) => {
      try {
        const parsed = JSON.parse(input.trim());
        const formatted = JSON.stringify(parsed, null, indent);
        setOutput(formatted);
        setStatus("valid");
        const keyMatches = JSON.stringify(parsed).match(/"[^"]+"\s*:/g);
        const keys = keyMatches ? keyMatches.length : 0;
        const bytes = new TextEncoder().encode(formatted).length;
        setStats(`${keys} keys · ${bytes.toLocaleString()} bytes`);
      } catch (e) {
        setOutput(`Error: ${(e as Error).message}`);
        setStatus("invalid");
        setStats("");
      }
    },
    [input],
  );

  const validate = useCallback(() => {
    try {
      JSON.parse(input.trim());
      setOutput("✓ Valid JSON");
      setStatus("valid");
    } catch (e) {
      setOutput(`✗ ${(e as Error).message}`);
      setStatus("invalid");
    }
  }, [input]);

  const handleInput = (val: string) => {
    setInput(val);
    if (!val.trim()) {
      setStatus(null);
      return;
    }
    try {
      JSON.parse(val.trim());
      setStatus("valid");
    } catch {
      setStatus("invalid");
    }
  };

  return (
    <div className="split">
      <div className="card">
        <div className="card-header">
          <span className="card-title">Input JSON</span>
          <div className="flex gap-8">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setInput(SAMPLE);
              }}
            >
              Sample
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => {
                setInput("");
                setOutput("");
                setStatus(null);
                setStats("");
              }}
            >
              Clear
            </button>
          </div>
        </div>
        <div className="card-body">
          <textarea
            id="json-input"
            className="editor w-full"
            style={{ minHeight: 360 }}
            value={input}
            onChange={(e) => handleInput(e.target.value)}
            placeholder="Paste your JSON here…"
            spellCheck={false}
          />
          <div className="flex gap-8 mt-12">
            <button className="btn btn-primary" onClick={() => format(2)}>
              ✨ Format
            </button>
            <button className="btn btn-ghost" onClick={() => format(0)}>
              Minify
            </button>
            <button className="btn btn-ghost" onClick={validate}>
              Validate
            </button>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Output</span>
          <div className="flex gap-8 items-center">
            {status === "valid" && (
              <span className="badge badge-success">✓ Valid</span>
            )}
            {status === "invalid" && (
              <span className="badge badge-error">✗ Invalid</span>
            )}
            <CopyButton text={output} label="Copy" />
          </div>
        </div>
        <div className="card-body">
          <pre
            id="json-output"
            className="output w-full"
            style={{ minHeight: 360 }}
          >
            {output}
          </pre>
          {stats && <div className="text-sm text-muted mt-8">{stats}</div>}
        </div>
      </div>
    </div>
  );
}
