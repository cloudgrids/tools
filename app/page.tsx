import { TOOLS } from "@/lib/tools";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "DevKit Pro — All-in-One Developer Toolkit",
  description:
    "12 beautiful developer utilities. JSON formatter, regex tester, color converter, CSS gradients, hash generator, and more. Zero installs, 100% offline.",
};

export default function HomePage() {
  return (
    <main className="page">
      <div className="hero">
        <div className="hero-eyebrow">✦ Open Source · MIT License</div>

        <h1 className="hero-title">Developer Toolkit</h1>

        <p className="hero-sub">
          12 powerful utilities in one beautiful app.
          Zero installs, zero backend, works completely offline.
        </p>

        <div className="hero-badges">
          <span className="hero-badge">⚡ 100% Offline</span>
          <span className="hero-badge">🔒 Privacy First</span>
          <span className="hero-badge">🚀 Zero Dependencies</span>
          <span className="hero-badge">⭐ Open Source</span>
        </div>

        <div className="tool-grid">
          {TOOLS.map((tool) => (
            <Link
              key={tool.id}
              href={`/tools/${tool.id}`}
              className="tool-card"
            >
              <span className="tool-card-icon">{tool.icon}</span>
              <div className="tool-card-name">{tool.name}</div>
              <div className="tool-card-desc">{tool.desc}</div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
