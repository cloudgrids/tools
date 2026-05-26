'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { computeDiff, diffStats } from '@/lib/diff';
import { DIFF_SAMPLE_A, DIFF_SAMPLE_B } from '@/lib/tool-samples';
import { Equal, Minus, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';

export function DiffTool() {
	const [textA, setTextA] = useState(DIFF_SAMPLE_A);
	const [textB, setTextB] = useState(DIFF_SAMPLE_B);

	const lines = useMemo(() => computeDiff(textA, textB), [textA, textB]);
	const stats = useMemo(() => diffStats(lines), [lines]);

	const unifiedText = useMemo(
		() =>
			lines.map((l) => (l.type === 'add' ? `+ ${l.content}` : l.type === 'remove' ? `- ${l.content}` : `  ${l.content}`)).join('\n'),
		[lines]
	);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-2">
				<Card className="min-w-0">
					<CardHeader>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<CardTitle>Original</CardTitle>
							<Button variant="ghost" size="sm" onClick={() => setTextA('')}>
								Clear
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<Textarea
							id="diff-a"
							className="h-64 font-mono text-sm"
							value={textA}
							onChange={(e) => setTextA(e.target.value)}
							placeholder="Paste original text here…"
							spellCheck={false}
						/>
					</CardContent>
				</Card>
				<Card className="min-w-0">
					<CardHeader>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<CardTitle>Modified</CardTitle>
							<Button variant="ghost" size="sm" onClick={() => setTextB('')}>
								Clear
							</Button>
						</div>
					</CardHeader>
					<CardContent>
						<Textarea
							id="diff-b"
							className="h-64 font-mono text-sm"
							value={textB}
							onChange={(e) => setTextB(e.target.value)}
							placeholder="Paste modified text here…"
							spellCheck={false}
						/>
					</CardContent>
				</Card>
			</div>

			<Card className="min-w-0">
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div className="flex flex-wrap items-center gap-2">
							<CardTitle>Diff</CardTitle>
							<span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100">
								<Plus className="size-3" aria-hidden="true" />
								{stats.added}
							</span>
							<span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100">
								<Minus className="size-3" aria-hidden="true" />
								{stats.removed}
							</span>
							<span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-900 dark:bg-blue-900 dark:text-blue-100">
								<Equal className="size-3" aria-hidden="true" />
								{stats.unchanged}
							</span>
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setTextA(DIFF_SAMPLE_A);
									setTextB(DIFF_SAMPLE_B);
								}}
							>
								Sample
							</Button>
							<CopyButton text={unifiedText} label="Copy Diff" />
						</div>
					</div>
				</CardHeader>
				<CardContent className="p-0">
					<pre
						id="diff-output"
						className="w-full font-mono text-sm overflow-auto bg-muted border-t border-input min-h-48 max-h-96 p-4"
					>
						{lines.map((line, i) => (
							<div
								key={i}
								className={
									line.type === 'add'
										? 'text-green-600 dark:text-green-400'
										: line.type === 'remove'
											? 'text-red-600 dark:text-red-400'
											: 'text-muted-foreground'
								}
							>
								<span className="font-semibold">{line.type === 'add' ? '+ ' : line.type === 'remove' ? '- ' : '  '}</span>
								{line.content}
							</div>
						))}
					</pre>
				</CardContent>
			</Card>
		</div>
	);
}
