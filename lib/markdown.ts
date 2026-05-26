// ── Markdown parser (zero deps) ───────────────────────────────
function escHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function parseMarkdown(md: string): string {
  // Protect code blocks
  const codeBlocks: string[] = [];
  let html = md.replace(/```[\w]*\n?([\s\S]*?)```/g, (_, code) => {
    const idx = codeBlocks.length;
    codeBlocks.push(`<pre><code>${escHtml(code.trimEnd())}</code></pre>`);
    return `%%CODE_BLOCK_${idx}%%`;
  });

  html = html
    // Inline code
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    // Headers
    .replace(/^######\s(.+)$/gm, "<h6>$1</h6>")
    .replace(/^#####\s(.+)$/gm,  "<h5>$1</h5>")
    .replace(/^####\s(.+)$/gm,   "<h4>$1</h4>")
    .replace(/^###\s(.+)$/gm,    "<h3>$1</h3>")
    .replace(/^##\s(.+)$/gm,     "<h2>$1</h2>")
    .replace(/^#\s(.+)$/gm,      "<h1>$1</h1>")
    // Bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>")
    .replace(/\*\*(.+?)\*\*/g,     "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g,         "<em>$1</em>")
    .replace(/__(.+?)__/g,         "<strong>$1</strong>")
    .replace(/_(.+?)_/g,           "<em>$1</em>")
    // Strikethrough
    .replace(/~~(.+?)~~/g, "<del>$1</del>")
    // Blockquote
    .replace(/^>\s(.+)$/gm, "<blockquote>$1</blockquote>")
    // HR
    .replace(/^---+$/gm, "<hr />")
    // Image before links
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%" />')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // Lists
    .replace(/^[\*\-]\s(.+)$/gm, "<li>$1</li>")
    .replace(/^\d+\.\s(.+)$/gm,  "<li>$1</li>")
    // Group <li>s into <ul>
    .replace(/((?:<li>[\s\S]*?<\/li>\n?)+)/g, "<ul>$1</ul>")
    // Paragraphs
    .replace(/\n\n+/g, "</p><p>")
    .replace(/\n/g, "<br />");

  html = `<p>${html}</p>`;

  // Restore code blocks
  codeBlocks.forEach((block, idx) => {
    html = html.replace(`%%CODE_BLOCK_${idx}%%`, block);
  });

  return html;
}

export function wordCount(text: string): { words: number; chars: number; lines: number } {
  return {
    words: text.trim() ? text.trim().split(/\s+/).length : 0,
    chars: text.length,
    lines: text.split("\n").length,
  };
}
