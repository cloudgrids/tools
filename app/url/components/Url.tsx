'use client';

import { parseUrl } from '@/lib/url';
import { useMemo, useState } from 'react';
import { UrlBreakdown } from './UrlBreakdown';
import { UrlInput } from './UrlInput';
import { UrlOutput } from './UrlOutput';

export interface UrlState {
	input: string;
	encoded: string;
	decoded: string;
}

const emptyState: UrlState = {
	input: 'https://tools.cloudgrids.tech/url?query=hello+world&page=1&debug=true#section',
	encoded: '',
	decoded: ''
};

export const Url = () => {
	const [state, setState] = useState<UrlState>(emptyState);

	const parsed = useMemo(() => parseUrl(state.input), [state.input]);

	function encode() {
		setState((prev) => ({ ...prev, encoded: encodeURIComponent(prev.input), decoded: '' }));
	}

	function decode() {
		try {
			setState((prev) => ({ ...prev, decoded: decodeURIComponent(prev.input), encoded: '' }));
		} catch {
			setState((prev) => ({ ...prev, decoded: 'Error: Invalid encoded URI', encoded: '' }));
		}
	}

	function encodeComponent() {
		setState((prev) => ({
			...prev,
			encoded: prev.input
				.split('')
				.map((c) => (/[A-Za-z0-9\-_.~]/.test(c) ? c : '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')))
				.join(''),
			decoded: ''
		}));
	}

	const output = state.encoded || state.decoded;

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-2">
				<UrlInput state={state} onSetState={setState} onEncode={encode} onDecode={decode} onEncodeComponent={encodeComponent} />
				<UrlOutput output={output} />
			</div>
			{parsed && <UrlBreakdown parsed={parsed} />}
		</div>
	);
};
