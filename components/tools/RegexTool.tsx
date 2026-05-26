'use client';

import { CodeOutput, StatusBadge, ToolPanel } from '@/components/tools/shared/ToolUi';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { RegexMatch } from '@/lib/contracts';
import { REGEX_DEFAULT_TEXT, REGEX_SAMPLES } from '@/lib/tool-samples';
import { useMemo, useState } from 'react';

function escapeHtml(value: string) {
	return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function RegexTool() {
	const [pattern, setPattern] = useState(REGEX_SAMPLES.Email.pattern);
	const [flags, setFlags] = useState('g');
	const [text, setText] = useState(REGEX_DEFAULT_TEXT);
	const [replacement, setReplacement] = useState('');

	const result = useMemo(() => {
		if (!pattern) return null;
		try {
			const globalFlags = flags.includes('g') ? flags : `${flags}g`;
			const expression = new RegExp(pattern, globalFlags);
			const matches: RegexMatch[] = [...text.matchAll(expression)].map((match) => ({
				match: match[0],
				index: match.index ?? 0,
				groups: match.slice(1)
			}));
			return { matches, expression };
		} catch (error) {
			return { error: (error as Error).message };
		}
	}, [pattern, flags, text]);

	const highlighted = useMemo(() => {
		if (!result || 'error' in result || !result.matches.length) return escapeHtml(text);
		const expression = new RegExp(result.expression.source, result.expression.flags);
		let last = 0;
		let html = '';
		for (const match of text.matchAll(expression)) {
			html += escapeHtml(text.slice(last, match.index));
			html += `<mark class="rounded bg-violet-100/60 px-0.5 ring-1 ring-violet-300">${escapeHtml(match[0])}</mark>`;
			last = (match.index ?? 0) + match[0].length;
		}
		return html + escapeHtml(text.slice(last));
	}, [text, result]);

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
		if (!result || 'error' in result || !replacement) return '';
		const globalFlags = flags.includes('g') ? flags : `${flags}g`;
		return text.replace(new RegExp(pattern, globalFlags), replacement);
	}, [pattern, flags, text, replacement, result]);

	const matchCount = !result || 'error' in result ? 0 : result.matches.length;

	return (
		<div className="flex flex-col gap-4">
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
								value={pattern}
								onChange={(event) => setPattern(event.target.value)}
								spellCheck={false}
								autoComplete="off"
							/>
							<span className="text-xl text-muted-foreground">/</span>
							<Input
								id="regex-flags"
								className="w-16 font-mono"
								value={flags}
								onChange={(event) => setFlags(event.target.value.replace(/[^gimsuy]/g, ''))}
								maxLength={6}
							/>
						</div>
					</div>
					<div className="w-full space-y-2 sm:w-auto">
						<Label htmlFor="regex-replace">Replace with</Label>
						<Input
							id="regex-replace"
							value={replacement}
							onChange={(event) => setReplacement(event.target.value)}
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
							onClick={() => {
								setPattern(sample.pattern);
								setFlags(sample.flags);
							}}
						>
							{name}
						</Button>
					))}
				</div>
				<Label htmlFor="regex-input">Test String</Label>
				<Textarea
					id="regex-input"
					className="min-h-28 font-mono text-sm"
					value={text}
					onChange={(event) => setText(event.target.value)}
					spellCheck={false}
				/>
				{result && 'error' in result && <StatusBadge tone="error">{result.error}</StatusBadge>}
			</ToolPanel>

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
		</div>
	);
}
