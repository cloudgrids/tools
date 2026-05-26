'use client';

import { parseMarkdown, wordCount } from '@/lib/markdown';
import { MARKDOWN_SAMPLE } from '@/lib/tool-samples';
import type { MarkdownViewMode } from '@/lib/enumerations';
import { useMemo, useState } from 'react';
import { MarkdownEditor } from './MarkdownEditor';
import { MarkdownPreview } from './MarkdownPreview';
import { MarkdownToolbar } from './MarkdownToolbar';

export const Markdown = () => {
	const [text, setText] = useState(MARKDOWN_SAMPLE);
	const [mode, setMode] = useState<MarkdownViewMode>('split');

	const html = useMemo(() => parseMarkdown(text), [text]);
	const stats = useMemo(() => wordCount(text), [text]);

	return (
		<div className="flex flex-col gap-4 lg:h-[calc(100svh-7rem)]">
			<MarkdownToolbar mode={mode} text={text} html={html} onModeChange={setMode} onClear={() => setText('')} />
			<div className="flex min-h-0 flex-col gap-4 lg:flex-1 lg:flex-row">
				{(mode === 'split' || mode === 'edit') && (
					<MarkdownEditor text={text} stats={stats} onChange={setText} />
				)}
				{(mode === 'split' || mode === 'preview') && (
					<MarkdownPreview html={html} />
				)}
			</div>
		</div>
	);
};
