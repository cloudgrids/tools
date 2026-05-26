import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';

interface WordCount {
	words: number;
	chars: number;
	lines: number;
}

interface MarkdownEditorProps {
	text: string;
	stats: WordCount;
	onChange: (text: string) => void;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ text, stats, onChange }) => (
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
				onChange={(e) => onChange(e.target.value)}
				spellCheck={false}
			/>
		</CardContent>
	</Card>
);
