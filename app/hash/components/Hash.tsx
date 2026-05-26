'use client';

import type { HashResult } from '@/lib/contracts';
import { hashBuffer, hashText } from '@/lib/crypto';
import { formatBytes } from '@/lib/helpers';
import { HASH_DEFAULT_TEXT } from '@/lib/tool-samples';
import { useEffect, useState } from 'react';
import { HashFilePanel } from './HashFilePanel';
import { HashResultPanel } from './HashResultPanel';
import { HashTextPanel } from './HashTextPanel';

export interface HashState {
	input: string;
	loading: boolean;
	results: HashResult[];
	fileName: string;
	fileSize: string;
	fileResults: HashResult[];
}

export const Hash = () => {
	const [state, setState] = useState<HashState>({
		input: HASH_DEFAULT_TEXT,
		loading: true,
		results: [],
		fileName: '',
		fileSize: '',
		fileResults: []
	});

	async function run(text: string) {
		if (!text.trim()) return;
		setState((prev) => ({ ...prev, loading: true }));
		const results = await hashText(text);
		setState((prev) => ({ ...prev, results, loading: false }));
	}

	useEffect(() => {
		let mounted = true;
		void hashText(HASH_DEFAULT_TEXT).then((results) => {
			if (mounted) setState((prev) => ({ ...prev, results, loading: false }));
		});
		return () => { mounted = false; };
	}, []);

	async function handleFile(file: File) {
		setState((prev) => ({ ...prev, fileName: file.name, fileSize: formatBytes(file.size) }));
		const buffer = await file.arrayBuffer();
		const results = await hashBuffer(buffer);
		setState((prev) => ({ ...prev, fileResults: results }));
	}

	return (
		<div className="flex flex-col gap-4">
			<HashTextPanel state={state} onSetState={setState} onRun={run} />
			<HashResultPanel results={state.results} loading={state.loading} />
			<HashFilePanel state={state} onFile={handleFile} />
		</div>
	);
};
