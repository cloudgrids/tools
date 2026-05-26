import { CodeOutput, StatusBadge, ToolPanel } from '@/components/ToolUi';
import { CopyButton } from '@/components/ui/CopyButton';
import type { HashResult } from '@/lib/contracts';
import { HASH_LABELS } from '@/lib/tool-samples';

interface HashResultPanelProps {
	results: HashResult[];
	loading: boolean;
}

export const HashResultPanel: React.FC<HashResultPanelProps> = ({ results, loading }) => (
	<ToolPanel title="Hash Results" contentClassName="space-y-4">
		{results.length === 0 && !loading && <p className="text-sm text-muted-foreground">Enter text and generate hashes.</p>}
		{loading && <p className="text-sm text-muted-foreground">Computing...</p>}
		{results.map(({ algorithm, hash }) => (
			<div key={algorithm} className="space-y-2">
				<div className="flex flex-wrap items-center justify-between gap-2">
					<StatusBadge tone="info">{HASH_LABELS[algorithm] ?? algorithm}</StatusBadge>
					<CopyButton text={hash} label="Copy" />
				</div>
				<CodeOutput>{hash}</CodeOutput>
			</div>
		))}
	</ToolPanel>
);
