'use client';

import { ToolPanel, StatusBadge } from '@/components/tools/shared/ToolUi';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { generatePassword, passwordStrength } from '@/lib/crypto';
import { useMemo, useState } from 'react';

export function PasswordTool() {
	const [length, setLength] = useState(20);
	const [upper, setUpper] = useState(true);
	const [lower, setLower] = useState(true);
	const [digits, setDigits] = useState(true);
	const [symbols, setSymbols] = useState(true);
	const [count, setCount] = useState(5);
	const [passwords, setPasswords] = useState<string[]>(() =>
		Array.from({ length: 5 }, () => generatePassword(20, { upper: true, lower: true, digits: true, symbols: true }))
	);

	const options = { upper, lower, digits, symbols };
	const previewStrength = useMemo(() => passwordStrength(passwords[0] ?? ''), [passwords]);

	function regenerate() {
		setPasswords(Array.from({ length: count }, () => generatePassword(length, options)));
	}

	return (
		<div className="flex flex-col gap-4">
			<ToolPanel title="Configuration" contentClassName="space-y-6">
				<div className="space-y-3">
					<Label htmlFor="pw-length">Length: {length}</Label>
					<Slider
						id="pw-length"
						min={8}
						max={128}
						step={1}
						value={[length]}
						onValueChange={(values) => setLength(typeof values === 'number' ? values : (values[0] ?? 20))}
					/>
				</div>
				<div className="grid gap-3 sm:grid-cols-2">
					{[
						{ id: 'pw-upper', label: 'Uppercase (A-Z)', value: upper, onChange: setUpper },
						{ id: 'pw-lower', label: 'Lowercase (a-z)', value: lower, onChange: setLower },
						{ id: 'pw-digits', label: 'Digits (0-9)', value: digits, onChange: setDigits },
						{ id: 'pw-symbols', label: 'Symbols (!@#...)', value: symbols, onChange: setSymbols }
					].map(({ id, label, value, onChange }) => (
						<label
							key={id}
							className="flex items-center justify-between gap-3 rounded-lg border border-input bg-muted/30 px-3 py-2"
							htmlFor={id}
						>
							<span className="text-sm">{label}</span>
							<Switch id={id} checked={value} onCheckedChange={onChange} />
						</label>
					))}
				</div>
				<div className="flex flex-wrap items-end gap-4">
					<div className="space-y-2">
						<Label htmlFor="pw-count">Count</Label>
						<Input
							id="pw-count"
							type="number"
							className="w-20"
							min={1}
							max={50}
							value={count}
							onChange={(event) => setCount(Math.max(1, Math.min(50, Number(event.target.value))))}
						/>
					</div>
					<Button onClick={regenerate}>Generate</Button>
				</div>
			</ToolPanel>

			<ToolPanel
				title={`${passwords.length} Passwords`}
				action={
					<StatusBadge tone={previewStrength.score > 5 ? 'success' : previewStrength.score > 2 ? 'info' : 'error'}>
						{previewStrength.label}
					</StatusBadge>
				}
				contentClassName="p-0"
			>
				<div className="px-4 pb-3">
					<div className="h-1 overflow-hidden rounded bg-muted">
						<div
							className="h-full rounded transition-all"
							style={{ width: `${(previewStrength.score / 7) * 100}%`, background: previewStrength.color }}
						/>
					</div>
				</div>
				<div className="max-h-96 overflow-auto border-t border-input">
					{passwords.map((password) => (
						<div
							key={password}
							className="flex min-w-0 items-center justify-between gap-3 border-b border-input px-4 py-2.5 last:border-0 hover:bg-muted"
						>
							<code className="min-w-0 break-all font-mono text-sm text-secondary-foreground">{password}</code>
							<CopyButton text={password} label="Copy" />
						</div>
					))}
				</div>
			</ToolPanel>
		</div>
	);
}
