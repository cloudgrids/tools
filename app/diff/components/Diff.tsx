'use client';

import { computeDiff, diffStats } from '@/lib/diff';
import type { DiffLine } from '@/lib/contracts';
import { DIFF_SAMPLE_A, DIFF_SAMPLE_B } from '@/lib/tool-samples';
import { useMemo, useState } from 'react';
import { DiffInputs } from './DiffInputs';
import { DiffOutput } from './DiffOutput';

export interface DiffState {
	textA: string;
	textB: string;
}

export const Diff = () => {
	const [state, setState] = useState<DiffState>({ textA: DIFF_SAMPLE_A, textB: DIFF_SAMPLE_B });

	const lines = useMemo(() => computeDiff(state.textA, state.textB), [state.textA, state.textB]);
	const stats = useMemo(() => diffStats(lines), [lines]);

	const unifiedText = useMemo(
		() => lines.map((l: DiffLine) => (l.type === 'add' ? `+ ${l.content}` : l.type === 'remove' ? `- ${l.content}` : `  ${l.content}`)).join('\n'),
		[lines]
	);

	return (
		<div className="flex flex-col gap-4">
			<DiffInputs state={state} onSetState={setState} />
			<DiffOutput lines={lines} stats={stats} unifiedText={unifiedText} onSetState={setState} />
		</div>
	);
};
