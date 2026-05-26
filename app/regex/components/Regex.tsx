'use client';

import type { RegexMatch } from '@/lib/contracts';
import { REGEX_DEFAULT_TEXT, REGEX_SAMPLES } from '@/lib/tool-samples';
import { useMemo, useState } from 'react';
import { RegexPatternPanel } from './RegexPatternPanel';
import { RegexResultPanels } from './RegexResultPanels';

export interface RegexState {
	pattern: string;
	flags: string;
	text: string;
	replacement: string;
}

export interface RegexResult {
	matches: RegexMatch[];
	expression: RegExp;
}

export const Regex = () => {
	const [state, setState] = useState<RegexState>({
		pattern: REGEX_SAMPLES.Email.pattern,
		flags: 'g',
		text: REGEX_DEFAULT_TEXT,
		replacement: ''
	});

	const result = useMemo(() => {
		if (!state.pattern) return null;
		try {
			const globalFlags = state.flags.includes('g') ? state.flags : `${state.flags}g`;
			const expression = new RegExp(state.pattern, globalFlags);
			const matches: RegexMatch[] = [...state.text.matchAll(expression)].map((match) => ({
				match: match[0],
				index: match.index ?? 0,
				groups: match.slice(1)
			}));
			return { matches, expression };
		} catch (error) {
			return { error: (error as Error).message };
		}
	}, [state.pattern, state.flags, state.text]);

	return (
		<div className="flex flex-col gap-4">
			<RegexPatternPanel state={state} onSetState={setState} result={result} />
			<RegexResultPanels state={state} result={result} />
		</div>
	);
};
