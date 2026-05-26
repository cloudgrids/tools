import { CodeOutput, ToolPanel } from '@/components/ToolUi';
import { CopyButton } from '@/components/ui/CopyButton';
import { useMemo } from 'react';
import type { RegexResult, RegexState } from './Regex';

function escapeHtml(value: string) {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

interface RegexResultPanelsProps {
	state: RegexState;
	result: RegexResult | { error: string } | null;
}

export const RegexResultPanels: React.FC<RegexResultPanelsProps> = ({ state, result }) => {
	const highlighted = useMemo(() => {
		if (!result || 'error' in result || !result.matches.length) return escapeHtml(state.text);
		const expression = new RegExp(result.expression.source, result.expression.flags);
		let last = 0;
		let html = '';
		for (const match of state.text.matchAll(expression)) {
			html += escapeHtml(state.text.slice(last, match.index));
			html += `<mark class="rounded bg-violet-100/60 px-0.5 ring-1 ring-violet-300">${escapeHtml(match[0])}</mark>`;
			last = (match.index ?? 0) + match[0].length;
		}
		return html + escapeHtml(state.text.slice(last));
	}, [state.text, result]);

	const groupsText = useMemo(() => {
		if (!result || 'error' in result) return '';
		return (
			result.matches
				.map((match, index) => {
					const groups = match.groups
						.map((group, groupIndex) => `  Group ${groupIndex + 1}: ${group ?? '(undefined)'}`)
						.join('\n');
					return `Match ${index + 1}: "${match.match}"${groups ? `\n${groups}` : ''}`;
				})
				.join('\n\n') || 'No matches found.'
		);
	}, [result]);

	const replacedText = useMemo(() => {
		if (!result || 'error' in result || !state.replacement) return '';
		const globalFlags = state.flags.includes('g') ? state.flags : `${state.flags}g`;
		return state.text.replace(new RegExp(state.pattern, globalFlags), state.replacement);
	}, [state.pattern, state.flags, state.text, state.replacement, result]);

	return (
		<>
			<div className="grid gap-4 md:grid-cols-2">
				<ToolPanel title="Highlighted Matches">
					<div
						className="min-h-40 whitespace-pre-wrap rounded-lg border border-input bg-muted p-3 font-mono text-sm"
						dangerouslySetInnerHTML={{ __html: highlighted }}
					/>
				</ToolPanel>
				<ToolPanel title="Match Groups" action={<CopyButton text={groupsText} label="Copy" />}>
					<CodeOutput className="min-h-40">{groupsText}</CodeOutput>
				</ToolPanel>
			</div>

			{replacedText && (
				<ToolPanel title="Replaced Output" action={<CopyButton text={replacedText} label="Copy" />}>
					<CodeOutput className="min-h-16">{replacedText}</CodeOutput>
				</ToolPanel>
			)}
		</>
	);
};
