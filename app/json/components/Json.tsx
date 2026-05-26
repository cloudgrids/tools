'use client';

import { JSON_SAMPLE } from '@/lib/tool-samples';
import { useCallback, useState } from 'react';
import { JsonInput } from './JsonInput';
import { JsonOutput } from './JsonOutput';

export interface JsonState {
	input: string;
	output: string;
	status: 'valid' | 'invalid' | null;
	stats: string;
}

export const Json = () => {
	const [state, setState] = useState<JsonState>({
		input: JSON_SAMPLE,
		output: '',
		status: null,
		stats: ''
	});

	const format = useCallback(
		(indent: number) => {
			try {
				const parsed = JSON.parse(state.input.trim());
				const formatted = JSON.stringify(parsed, null, indent);
				const keyMatches = JSON.stringify(parsed).match(/"[^"]+":\s*/g);
				const keys = keyMatches ? keyMatches.length : 0;
				const bytes = new TextEncoder().encode(formatted).length;
				setState((prev) => ({
					...prev,
					output: formatted,
					status: 'valid',
					stats: `${keys} keys · ${bytes.toLocaleString()} bytes`
				}));
			} catch (e) {
				setState((prev) => ({ ...prev, output: `Error: ${(e as Error).message}`, status: 'invalid', stats: '' }));
			}
		},
		[state.input]
	);

	const validate = useCallback(() => {
		try {
			JSON.parse(state.input.trim());
			setState((prev) => ({ ...prev, output: 'Valid JSON ✓', status: 'valid' }));
		} catch (e) {
			setState((prev) => ({ ...prev, output: (e as Error).message, status: 'invalid' }));
		}
	}, [state.input]);

	const handleInput = useCallback((val: string) => {
		setState((prev) => {
			let status: 'valid' | 'invalid' | null = null;
			if (val.trim()) {
				try {
					JSON.parse(val.trim());
					status = 'valid';
				} catch {
					status = 'invalid';
				}
			}
			return { ...prev, input: val, status };
		});
	}, []);

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<JsonInput state={state} onSetState={setState} onFormat={format} onValidate={validate} onInput={handleInput} />
			<JsonOutput state={state} />
		</div>
	);
};
