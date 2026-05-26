'use client';

import { Button } from '@/components/ui/button';
import type { Base64TabId } from '@/lib/enumerations';
import { useState } from 'react';
import { Base64FileTab } from './Base64FileTab';
import { Base64TextTab } from './Base64TextTab';

export interface Base64State {
	tab: Base64TabId;
	input: string;
	output: string;
	stats: string;

	// File state
	fileName: string;
	fileSize: string;
	dataUrl: string;
	fileB64: string;
}

export const Base64 = () => {
	const [state, setState] = useState<Base64State>({
		tab: 'text',
		input: '',
		output: '',
		stats: '',
		fileName: '',
		fileSize: '',
		dataUrl: '',
		fileB64: ''
	});

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				{['text', 'file'].map((t) => (
					<Button
						key={t}
						variant={state.tab === t ? 'default' : 'outline'}
						onClick={() => setState((prev) => ({ ...prev, tab: t as Base64TabId }))}
					>
						{t === 'text' ? 'Text' : 'File'}
					</Button>
				))}
			</div>

			{state.tab === 'text' && <Base64TextTab onSetState={setState} state={state} />}

			{state.tab === 'file' && <Base64FileTab onSetState={setState} state={state} />}
		</div>
	);
};
