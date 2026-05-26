"use client";

import { usePathname } from "next/navigation";
import { TOOL_MAP } from "@/lib/tools";

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const pathname = usePathname();
  const toolId = pathname.startsWith("/tools/") ? pathname.split("/tools/")[1] : null;
  const tool = toolId ? TOOL_MAP.get(toolId) : null;

  return (
    <header className="topbar">
      <div className="topbar-left">
        {/* Hamburger — mobile only */}
        <button
          className="topbar-menu-btn"
          onClick={onMenuClick}
          aria-label="Open navigation menu"
        >
          ☰
        </button>

        <span className="topbar-divider" aria-hidden="true" />

        <span className="topbar-icon" aria-hidden="true">
          {tool ? tool.icon : "🛠️"}
        </span>

        <div className="topbar-info">
          <div className="topbar-name">{tool ? tool.name : "DevKit Pro"}</div>
          {tool && <div className="topbar-desc">{tool.desc}</div>}
        </div>
      </div>

      <div className="topbar-actions">
        <a
          href="https://github.com/devkit-pro/devkit-pro"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost btn-sm"
          aria-label="Star DevKit Pro on GitHub"
        >
          <span aria-hidden="true">⭐</span>
          <span>GitHub</span>
        </a>
      </div>
    </header>
  );
}
