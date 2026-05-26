"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import { TOOLS } from "@/lib/tools";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return TOOLS;
    const q = query.toLowerCase();
    return TOOLS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.includes(q))
    );
  }, [query]);

  // Close on route change (mobile)
  useEffect(() => { onClose(); }, [pathname, onClose]);

  // Close on ESC key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose]);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? "visible" : ""}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`} aria-label="Navigation">
        {/* Header */}
        <div className="sidebar-header">
          <Link href="/" className="logo" onClick={onClose}>
            <span className="logo-icon" aria-hidden="true">🛠️</span>
            <span className="logo-text">
              <span className="logo-name">DevKit Pro</span>
              <span className="logo-tag">Developer Toolkit</span>
            </span>
          </Link>
          <button
            className="sidebar-close"
            onClick={onClose}
            aria-label="Close navigation"
          >
            ✕
          </button>
        </div>

        {/* Search */}
        <div className="sidebar-search">
          <div className="search-wrap">
            <span className="search-icon" aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search tools…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search tools"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav" aria-label="Tool list">
          <div className="nav-section" aria-hidden="true">Navigation</div>

          <Link
            href="/"
            className={`nav-item ${pathname === "/" ? "active" : ""}`}
            aria-current={pathname === "/" ? "page" : undefined}
          >
            <span className="nav-icon" aria-hidden="true">🏠</span>
            <span className="nav-label">Home</span>
          </Link>

          {filtered.length > 0 && (
            <div className="nav-section" aria-hidden="true">Tools</div>
          )}

          {filtered.map((tool) => {
            const isActive = pathname === `/tools/${tool.id}`;
            return (
              <Link
                key={tool.id}
                href={`/tools/${tool.id}`}
                className={`nav-item ${isActive ? "active" : ""}`}
                aria-current={isActive ? "page" : undefined}
                title={tool.name}
              >
                <span className="nav-icon" aria-hidden="true">{tool.icon}</span>
                <span className="nav-label">{tool.name}</span>
              </Link>
            );
          })}

          {filtered.length === 0 && (
            <div style={{ padding: "var(--space-5) var(--space-3)", textAlign: "center", color: "var(--text-4)", fontSize: 13 }}>
              No tools found
            </div>
          )}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <a
            href="https://github.com/devkit-pro/devkit-pro"
            target="_blank"
            rel="noopener noreferrer"
            title="Star on GitHub"
          >
            <span aria-hidden="true">⭐</span>
            <span>Star on GitHub</span>
          </a>
        </div>
      </aside>
    </>
  );
}
