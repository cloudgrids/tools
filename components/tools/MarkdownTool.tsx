'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import type { MarkdownViewMode } from '@/lib/enumerations';
import { parseMarkdown, wordCount } from '@/lib/markdown';
import { MARKDOWN_SAMPLE } from '@/lib/tool-samples';
import { useMemo, useState } from 'react';

export function MarkdownTool() {
	const [text, setText] = useState(MARKDOWN_SAMPLE);
	const [mode, setMode] = useState<MarkdownViewMode>('split');

	const html = useMemo(() => parseMarkdown(text), [text]);
	const stats = useMemo(() => wordCount(text), [text]);

	return (
		<div className="flex flex-col gap-4 lg:h-[calc(100svh-7rem)]">
			<div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex flex-wrap gap-2">
					{(['split', 'edit', 'preview'] as MarkdownViewMode[]).map((m) => (
						<Button key={m} variant={mode === m ? 'default' : 'outline'} onClick={() => setMode(m)}>
							{m.charAt(0).toUpperCase() + m.slice(1)}
						</Button>
					))}
				</div>
				<div className="flex flex-wrap gap-2">
					<CopyButton text={html} label="Copy HTML" />
					<CopyButton text={text} label="Copy MD" />
					<Button variant="ghost" size="sm" onClick={() => setText('')}>
						Clear
					</Button>
				</div>
			</div>

			<div className="flex min-h-0 flex-col gap-4 lg:flex-1 lg:flex-row">
				{/* Editor */}
				{(mode === 'split' || mode === 'edit') && (
					<Card className="flex min-h-96 min-w-0 flex-1 flex-col lg:min-h-0">
						<CardHeader>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<CardTitle>Markdown Input</CardTitle>
								<span className="text-xs text-muted-foreground">
									{stats.words} words · {stats.chars} chars · {stats.lines} lines
								</span>
							</div>
						</CardHeader>
						<CardContent className="flex-1 overflow-auto p-0">
							<Textarea
								id="md-input"
								className="h-full resize-none rounded-none border-0 bg-transparent p-4 font-mono text-sm focus-visible:ring-0"
								value={text}
								onChange={(e) => setText(e.target.value)}
								spellCheck={false}
							/>
						</CardContent>
					</Card>
				)}

				{/* Preview */}
				{(mode === 'split' || mode === 'preview') && (
					<Card className="flex min-h-96 min-w-0 flex-1 flex-col lg:min-h-0">
						<CardHeader>
							<CardTitle>Preview</CardTitle>
						</CardHeader>
						<CardContent
							id="md-preview"
							className="flex-1 overflow-auto px-4 pb-4 text-sm leading-7 text-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:bg-muted/50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_del]:text-muted-foreground [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-5 [&_li]:ml-5 [&_li]:list-item [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-input [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground [&_ul]:my-3 [&_ul]:list-disc"
							dangerouslySetInnerHTML={{ __html: html }}
						/>
					</Card>
				)}
			</div>
		</div>
	);
}
