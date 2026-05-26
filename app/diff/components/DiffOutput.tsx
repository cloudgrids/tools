import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import type { DiffLine } from '@/lib/contracts';
import { diffStats } from '@/lib/diff';
import { DIFF_SAMPLE_A, DIFF_SAMPLE_B } from '@/lib/tool-samples';
import { Equal, Minus, Plus } from 'lucide-react';
import type { DiffState } from './Diff';

type Stats = ReturnType<typeof diffStats>;

interface DiffOutputProps {
	lines: DiffLine[];
	stats: Stats;
	unifiedText: string;
	onSetState: React.Dispatch<React.SetStateAction<DiffState>>;
}

export const DiffOutput: React.FC<DiffOutputProps> = ({ lines, stats, unifiedText, onSetState }) => (
	<Card className="min-w-0">
		<CardHeader>
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div className="flex flex-wrap items-center gap-2">
					<CardTitle>Diff</CardTitle>
					<span className="inline-flex items-center gap-1 rounded bg-green-100 px-2 py-1 text-xs font-medium text-green-900">
						<Plus className="size-3" aria-hidden="true" />
						{stats.added}
					</span>
					<span className="inline-flex items-center gap-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-900">
						<Minus className="size-3" aria-hidden="true" />
						{stats.removed}
					</span>
					<span className="inline-flex items-center gap-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-900">
						<Equal className="size-3" aria-hidden="true" />
						{stats.unchanged}
					</span>
				</div>
				<div className="flex flex-wrap gap-2">
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onSetState({ textA: DIFF_SAMPLE_A, textB: DIFF_SAMPLE_B })}
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
				className="w-full min-h-48 max-h-96 overflow-auto border-t border-input bg-muted p-4 font-mono text-sm"
			>
				{lines.map((line: DiffLine, i: number) => (
					<div
						key={i}
						className={
							line.type === 'add'
								? 'text-green-600'
								: line.type === 'remove'
									? 'text-red-600'
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
);
