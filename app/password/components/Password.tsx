'use client';

import { generatePassword, passwordStrength } from '@/lib/crypto';
import { useMemo, useState } from 'react';
import { PasswordConfig } from './PasswordConfig';
import { PasswordList } from './PasswordList';

export interface PasswordOptions {
	upper: boolean;
	lower: boolean;
	digits: boolean;
	symbols: boolean;
}

export interface PasswordState {
	length: number;
	count: number;
	options: PasswordOptions;
	passwords: string[];
}

export const Password = () => {
	const [state, setState] = useState<PasswordState>({
		length: 20,
		count: 5,
		options: { upper: true, lower: true, digits: true, symbols: true },
		passwords: Array.from({ length: 5 }, () => generatePassword(20, { upper: true, lower: true, digits: true, symbols: true }))
	});

	const previewStrength = useMemo(() => passwordStrength(state.passwords[0] ?? ''), [state.passwords]);

	function regenerate() {
		setState((prev) => ({
			...prev,
			passwords: Array.from({ length: prev.count }, () => generatePassword(prev.length, prev.options))
		}));
	}

	return (
		<div className="flex flex-col gap-4">
			<PasswordConfig state={state} onSetState={setState} onRegenerate={regenerate} />
			<PasswordList passwords={state.passwords} strength={previewStrength} />
		</div>
	);
};
