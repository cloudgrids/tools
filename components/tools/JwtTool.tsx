"use client";

import { useState, useMemo } from "react";
import type { JwtPayload } from "@/types";
import { CopyButton } from "@/components/ui/CopyButton";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldktpdCBQcm8iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

function decodeJwt(token: string): JwtPayload | { error: string } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) return { error: "Invalid JWT: must have exactly 3 parts (header.payload.signature)" };
  try {
    const decode = (s: string) => JSON.parse(atob(s.replace(/-/g, "+").replace(/_/g, "/")));
    return {
      header:    decode(parts[0]),
      payload:   decode(parts[1]),
      signature: parts[2],
      valid:     true,
    };
  } catch (e) {
    return { error: `Decode failed: ${(e as Error).message}` };
  }
}

function formatTime(ts: number): string {
  return new Date(ts * 1000).toLocaleString(undefined, {
    dateStyle: "medium", timeStyle: "short",
  });
}

export function JwtTool() {
  const [token, setToken] = useState(SAMPLE_JWT);

  const result = useMemo(() => decodeJwt(token), [token]);

  const isError = "error" in result;
  const payload = isError ? null : (result as JwtPayload).payload;
  const now = Math.floor(Date.now() / 1000);
  const exp = payload?.exp as number | undefined;
  const iat = payload?.iat as number | undefined;
  const isExpired = exp !== undefined && exp < now;

  function Section({ title, data }: { title: string; data: Record<string, unknown> }) {
    return (
      <div className="card">
        <div className="card-header">
          <span className="card-title">{title}</span>
          <CopyButton text={JSON.stringify(data, null, 2)} label="Copy JSON" />
        </div>
        <div className="card-body">
          <pre className="output w-full" style={{ minHeight: 80 }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div className="card">
        <div className="card-header">
          <span className="card-title">JWT Token</span>
          <div className="flex gap-8">
            <button className="btn btn-ghost btn-sm" onClick={() => setToken(SAMPLE_JWT)}>Sample</button>
            <button className="btn btn-ghost btn-sm" onClick={() => setToken("")}>Clear</button>
          </div>
        </div>
        <div className="card-body">
          <textarea
            id="jwt-input"
            className="editor w-full"
            style={{ minHeight: 120, wordBreak: "break-all" }}
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste JWT token here…"
            spellCheck={false}
          />
        </div>
      </div>

      {isError ? (
        <div className="card">
          <div className="card-body">
            <span className="badge badge-error">✗ {(result as { error: string }).error}</span>
          </div>
        </div>
      ) : (
        <>
          {/* Status bar */}
          <div className="card">
            <div className="card-body">
              <div className="flex gap-12 flex-wrap items-center">
                <span className={`badge ${isExpired ? "badge-error" : "badge-success"}`}>
                  {isExpired ? "✗ Expired" : "✓ Not Expired"}
                </span>
                {exp && <span className="text-sm text-secondary">Expires: {formatTime(exp)}</span>}
                {iat && <span className="text-sm text-secondary">Issued: {formatTime(iat)}</span>}
                {(result as JwtPayload).header.alg !== undefined && (
                  <span className="badge badge-info">alg: {String((result as JwtPayload).header.alg)}</span>
                )}
                {(result as JwtPayload).header.typ !== undefined && (
                  <span className="badge badge-purple">typ: {String((result as JwtPayload).header.typ)}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Section title="Header"    data={(result as JwtPayload).header}  />
            <Section title="Payload"   data={(result as JwtPayload).payload} />
            <div className="card">
              <div className="card-header">
                <span className="card-title">Signature</span>
                <CopyButton text={(result as JwtPayload).signature} label="Copy" />
              </div>
              <div className="card-body">
                <code className="text-mono" style={{
                  fontSize: 12, color: "var(--aurora-pink)", wordBreak: "break-all",
                  background: "rgba(8,8,16,.5)", padding: "10px 14px",
                  borderRadius: 6, border: "1px solid var(--border-subtle)", display: "block",
                }}>
                  {(result as JwtPayload).signature}
                </code>
                <div className="text-sm text-muted mt-8">
                  ⚠️ Signature verification requires the secret key — this tool only decodes, it does not verify.
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
