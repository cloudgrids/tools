'use client';

import { generateUUID } from '@/lib/crypto';
import { useCallback, useState } from 'react';
import { UuidList } from './UuidList';
import { UuidOptions } from './UuidOptions';

export interface UuidState {
	count: number;
	upper: boolean;
	noDash: boolean;
	uuids: string[];
}

const emptyState: UuidState = {
	count: 10,
	upper: false,
	noDash: false,
	uuids: Array.from({ length: 10 }, generateUUID)
};

export const Uuid = () => {
	const [state, setState] = useState<UuidState>(emptyState);

	const generate = useCallback(() => {
		setState((prev) => ({ ...prev, uuids: Array.from({ length: prev.count }, generateUUID) }));
	}, []);

	function transform(uuid: string): string {
		let s = uuid;
		if (state.noDash) s = s.replace(/-/g, '');
		if (state.upper) s = s.toUpperCase();
		return s;
	}

	const displayed = state.uuids.slice(0, state.count).map(transform);

	return (
		<div className="flex flex-col gap-4">
			<UuidOptions state={state} onSetState={setState} onGenerate={generate} />
			<UuidList displayed={displayed} />
		</div>
	);
};
