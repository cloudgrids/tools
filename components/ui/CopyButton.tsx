"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/ToastProvider";

interface CopyButtonProps {
  text: string;
  label?: string;
  className?: string;
}

export function CopyButton({ text, label = "Copy", className = "btn btn-ghost btn-sm" }: CopyButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    showToast("Copied to clipboard!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button className={className} onClick={handleCopy} aria-label={`Copy ${label}`}>
      {copied ? "✓ Copied" : label}
    </button>
  );
}
