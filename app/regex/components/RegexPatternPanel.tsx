import { StatusBadge, ToolPanel } from '@/components/ToolUi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { REGEX_SAMPLES } from '@/lib/tool-samples';
import type { RegexResult, RegexState } from './Regex';

interface RegexPatternPanelProps {
	state: RegexState;
	onSetState: React.Dispatch<React.SetStateAction<RegexState>>;
	result: RegexResult | { error: string } | null;
}

export const RegexPatternPanel: React.FC<RegexPatternPanelProps> = ({ state, onSetState, result }) => {
	const matchCount = !result || 'error' in result ? 0 : result.matches.length;

	return (
		<ToolPanel
			title="Pattern"
			action={matchCount > 0 && <StatusBadge tone="info">{`${matchCount} match${matchCount !== 1 ? 'es' : ''}`}</StatusBadge>}
			contentClassName="space-y-4"
		>
			<div className="flex flex-wrap gap-4">
				<div className="w-full min-w-0 flex-1 space-y-2 sm:min-w-64">
					<Label htmlFor="regex-pattern">Regular Expression</Label>
					<div className="flex min-w-0 items-center gap-2">
						<span className="text-xl text-muted-foreground">/</span>
						<Input
							id="regex-pattern"
							className="min-w-0 flex-1 font-mono"
							value={state.pattern}
							onChange={(e) => onSetState((prev) => ({ ...prev, pattern: e.target.value }))}
							spellCheck={false}
							autoComplete="off"
						/>
						<span className="text-xl text-muted-foreground">/</span>
						<Input
							id="regex-flags"
							className="w-16 font-mono"
							value={state.flags}
							onChange={(e) => onSetState((prev) => ({ ...prev, flags: e.target.value.replace(/[^gimsuy]/g, '') }))}
							maxLength={6}
						/>
					</div>
				</div>
				<div className="w-full space-y-2 sm:w-auto">
					<Label htmlFor="regex-replace">Replace with</Label>
					<Input
						id="regex-replace"
						value={state.replacement}
						onChange={(e) => onSetState((prev) => ({ ...prev, replacement: e.target.value }))}
						placeholder="replacement"
					/>
				</div>
			</div>

			<div className="flex flex-wrap gap-2">
				{Object.entries(REGEX_SAMPLES).map(([name, sample]) => (
					<Button
						key={name}
						variant="outline"
						size="sm"
						onClick={() => onSetState((prev) => ({ ...prev, pattern: sample.pattern, flags: sample.flags }))}
					>
						{name}
					</Button>
				))}
			</div>

			<Label htmlFor="regex-input">Test String</Label>
			<Textarea
				id="regex-input"
				className="min-h-28 font-mono text-sm"
				value={state.text}
				onChange={(e) => onSetState((prev) => ({ ...prev, text: e.target.value }))}
				spellCheck={false}
			/>

			{result && 'error' in result && <StatusBadge tone="error">{result.error}</StatusBadge>}
		</ToolPanel>
	);
};
