function escapeHtml(value: string): string {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function safeHref(value: string): string {
	const href = value.trim();
	if (/^(https?:|mailto:|\/|#)/i.test(href)) return escapeHtml(href);
	return '#';
}

function parseInline(value: string): string {
	const snippets: string[] = [];
	const protect = (snippet: string) => {
		const index = snippets.length;
		snippets.push(snippet);
		return `\u0000${index}\u0000`;
	};

	let html = value
		.replace(/`([^`\n]+)`/g, (_, code: string) => protect(`<code>${escapeHtml(code)}</code>`))
		.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt: string, src: string) => {
			return protect(`<img src="${safeHref(src)}" alt="${escapeHtml(alt)}" />`);
		})
		.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text: string, href: string) => {
			return protect(`<a href="${safeHref(href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(text)}</a>`);
		})
		.replace(/[&<>"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[character] ?? character)
		.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
		.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
		.replace(/\*(.+?)\*/g, '<em>$1</em>')
		.replace(/__(.+?)__/g, '<strong>$1</strong>')
		.replace(/_(.+?)_/g, '<em>$1</em>')
		.replace(/~~(.+?)~~/g, '<del>$1</del>');

	snippets.forEach((snippet, index) => {
		html = html.replace(`\u0000${index}\u0000`, snippet);
	});

	return html;
}

function isBlockStart(line: string): boolean {
	return (
		/^```/.test(line) ||
		/^#{1,6}\s/.test(line) ||
		/^>\s?/.test(line) ||
		/^([-*_])\1{2,}\s*$/.test(line) ||
		/^[-*]\s/.test(line) ||
		/^\d+\.\s/.test(line)
	);
}

export function parseMarkdown(markdown: string): string {
	const lines = markdown.replace(/\r\n?/g, '\n').split('\n');
	const blocks: string[] = [];
	let index = 0;

	while (index < lines.length) {
		const line = lines[index];

		if (!line.trim()) {
			index++;
			continue;
		}

		const fence = line.match(/^```([\w-]*)\s*$/);
		if (fence) {
			const language = fence[1];
			const code: string[] = [];
			index++;
			while (index < lines.length && !/^```\s*$/.test(lines[index])) {
				code.push(lines[index]);
				index++;
			}
			if (index < lines.length) index++;
			const className = language ? ` class="language-${escapeHtml(language)}"` : '';
			blocks.push(`<pre><code${className}>${escapeHtml(code.join('\n'))}</code></pre>`);
			continue;
		}

		const heading = line.match(/^(#{1,6})\s(.+)$/);
		if (heading) {
			const level = heading[1].length;
			blocks.push(`<h${level}>${parseInline(heading[2])}</h${level}>`);
			index++;
			continue;
		}

		if (/^([-*_])\1{2,}\s*$/.test(line)) {
			blocks.push('<hr />');
			index++;
			continue;
		}

		if (/^>\s?/.test(line)) {
			const quote: string[] = [];
			while (index < lines.length && /^>\s?/.test(lines[index])) {
				quote.push(parseInline(lines[index].replace(/^>\s?/, '')));
				index++;
			}
			blocks.push(`<blockquote>${quote.join('<br />')}</blockquote>`);
			continue;
		}

		const listType = /^[-*]\s/.test(line) ? 'ul' : /^\d+\.\s/.test(line) ? 'ol' : null;
		if (listType) {
			const items: string[] = [];
			const pattern = listType === 'ul' ? /^[-*]\s(.+)$/ : /^\d+\.\s(.+)$/;
			while (index < lines.length) {
				const item = lines[index].match(pattern);
				if (!item) break;
				items.push(`<li>${parseInline(item[1])}</li>`);
				index++;
			}
			blocks.push(`<${listType}>${items.join('')}</${listType}>`);
			continue;
		}

		const paragraph: string[] = [];
		while (index < lines.length && lines[index].trim() && !isBlockStart(lines[index])) {
			paragraph.push(parseInline(lines[index]));
			index++;
		}
		blocks.push(`<p>${paragraph.join('<br />')}</p>`);
	}

	return blocks.join('');
}

export function wordCount(text: string): { words: number; chars: number; lines: number } {
	return {
		words: text.trim() ? text.trim().split(/\s+/).length : 0,
		chars: text.length,
		lines: text.split('\n').length
	};
}
