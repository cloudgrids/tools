import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import type { MarkdownViewMode } from '@/lib/enumerations';

interface MarkdownToolbarProps {
	mode: MarkdownViewMode;
	text: string;
	html: string;
	onModeChange: (mode: MarkdownViewMode) => void;
	onClear: () => void;
}

const MODES: MarkdownViewMode[] = ['split', 'edit', 'preview'];

export const MarkdownToolbar: React.FC<MarkdownToolbarProps> = ({ mode, text, html, onModeChange, onClear }) => (
	<div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
		<div className="flex flex-wrap gap-2">
			{MODES.map((m) => (
				<Button key={m} variant={mode === m ? 'default' : 'outline'} onClick={() => onModeChange(m)}>
					{m.charAt(0).toUpperCase() + m.slice(1)}
				</Button>
			))}
		</div>
		<div className="flex flex-wrap gap-2">
			<CopyButton text={html} label="Copy HTML" />
			<CopyButton text={text} label="Copy MD" />
			<Button variant="ghost" size="sm" onClick={onClear}>
				Clear
			</Button>
		</div>
	</div>
);
