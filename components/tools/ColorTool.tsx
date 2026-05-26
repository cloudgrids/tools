'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/input';
import { contrastRatio, generatePalette, generateShades, hexToRgb, isValidHex, rgbToHsl } from '@/lib/color';
import { Check, X } from 'lucide-react';
import { useMemo, useState } from 'react';

const DEFAULT = '#7c3aed';

export function ColorTool() {
	const [hex, setHex] = useState(DEFAULT);
	const [hexInput, setHexInput] = useState(DEFAULT);
	const [contrastText, setContrastText] = useState('#ffffff');
	const [contrastBg, setContrastBg] = useState('#7c3aed');

	const colorInfo = useMemo(() => {
		if (!isValidHex(hex)) return null;
		const [r, g, b] = hexToRgb(hex);
		const [h, s, l] = rgbToHsl(r, g, b);
		return {
			rgb: `rgb(${r}, ${g}, ${b})`,
			hsl: `hsl(${h}, ${s}%, ${l}%)`,
			cssVar: `--color-primary: hsl(${h}, ${s}%, ${l}%)`,
			shades: generateShades(hex),
			palette: generatePalette(hex)
		};
	}, [hex]);

	const contrast = useMemo(() => {
		if (!isValidHex(contrastText) || !isValidHex(contrastBg)) return null;
		return contrastRatio(contrastText, contrastBg);
	}, [contrastText, contrastBg]);

	function handleHexInput(val: string) {
		setHexInput(val);
		if (isValidHex(val)) setHex(val);
	}

	function handlePickerChange(val: string) {
		setHex(val);
		setHexInput(val);
	}

	if (!colorInfo) return <div className="text-muted-foreground">Enter a valid hex color.</div>;

	const palette = colorInfo.palette;
	const paletteEntries = [
		{ label: 'Base', hex: palette.base },
		{ label: 'Complement', hex: palette.complement },
		{ label: 'Triadic 1', hex: palette.triadic1 },
		{ label: 'Triadic 2', hex: palette.triadic2 },
		{ label: 'Analogous 1', hex: palette.analogous1 },
		{ label: 'Analogous 2', hex: palette.analogous2 },
		{ label: 'Split-C 1', hex: palette.splitComp1 },
		{ label: 'Split-C 2', hex: palette.splitComp2 }
	];

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-2">
				{/* Picker */}
				<Card className="min-w-0">
					<CardHeader>
						<CardTitle>Color Picker</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
							<input
								type="color"
								id="color-picker"
								value={hex}
								onChange={(e) => handlePickerChange(e.target.value)}
								className="w-24 h-24 rounded-lg border-2 border-input cursor-pointer"
							/>
							<div className="w-full min-w-0 flex-1 space-y-3">
								{[
									{
										label: 'HEX',
										value: hexInput,
										id: 'color-hex',
										onChange: handleHexInput,
										readOnly: false,
										copy: hex
									},
									{
										label: 'RGB',
										value: colorInfo.rgb,
										id: 'color-rgb',
										onChange: null,
										readOnly: true,
										copy: colorInfo.rgb
									},
									{
										label: 'HSL',
										value: colorInfo.hsl,
										id: 'color-hsl',
										onChange: null,
										readOnly: true,
										copy: colorInfo.hsl
									},
									{
										label: 'CSS Variable',
										value: colorInfo.cssVar,
										id: 'color-css',
										onChange: null,
										readOnly: true,
										copy: colorInfo.cssVar
									}
								].map(({ label, value, id, onChange, readOnly, copy }) => (
									<div key={id}>
										<label htmlFor={id} className="text-sm font-medium">
											{label}
										</label>
										<div className="mt-1 flex min-w-0 gap-2">
											<Input
												id={id}
												type="text"
												className="font-mono text-xs"
												value={value}
												readOnly={readOnly}
												onChange={onChange ? (e) => onChange(e.target.value) : undefined}
												spellCheck={false}
											/>
											<CopyButton text={copy} label="Copy" />
										</div>
									</div>
								))}
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Shades */}
				<Card className="min-w-0">
					<CardHeader>
						<CardTitle>Shades &amp; Tints</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						{colorInfo.shades.map(({ hex: sh, l }) => (
							<div
								key={l}
								className="flex min-w-0 items-center gap-3 rounded p-2 transition-colors hover:bg-muted"
								onClick={() => {
									handlePickerChange(sh);
								}}
							>
								<div
									className="shrink-0 border border-input rounded"
									style={{
										width: 40,
										height: 28,
										background: sh
									}}
								/>
								<code className="min-w-0 flex-1 font-mono text-xs text-secondary-foreground">{sh}</code>
								<span className="text-xs text-muted-foreground">L{l}</span>
								<CopyButton text={sh} label="Copy" />
							</div>
						))}
					</CardContent>
				</Card>
			</div>

			{/* Palette */}
			<Card>
				<CardHeader>
					<CardTitle>Complementary Palette</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
						{paletteEntries.map(({ label, hex: ph }) => (
							<div key={label} className="flex cursor-pointer flex-col items-center text-center">
								<div
									className="mb-2 rounded-lg border border-input transition-transform hover:scale-110"
									style={{
										width: 64,
										height: 64,
										background: ph
									}}
									onClick={() => handlePickerChange(ph)}
								/>
								<code className="text-xs text-muted-foreground block font-mono">{ph}</code>
								<div className="text-xs text-muted-foreground mt-1">{label}</div>
							</div>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Contrast Checker */}
			<Card>
				<CardHeader>
					<CardTitle>WCAG Contrast Checker</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2">
						<div className="rounded-lg p-4 border-2 border-input" style={{ background: contrastBg }}>
							<div className="text-2xl font-bold mb-2" style={{ color: contrastText }}>
								Large Text Sample (18px+)
							</div>
							<div className="text-sm" style={{ color: contrastText }}>
								Normal text for readability check — The quick brown fox.
							</div>
						</div>
						<div className="space-y-4">
							<div>
								<label className="text-sm font-medium">Text Color</label>
								<div className="flex gap-2 items-center mt-1">
									<input
										type="color"
										value={contrastText}
										onChange={(e) => setContrastText(e.target.value)}
										className="w-12 h-8 rounded border-input cursor-pointer"
									/>
									<span className="text-xs font-mono text-secondary-foreground">{contrastText}</span>
								</div>
							</div>
							<div>
								<label className="text-sm font-medium">Background Color</label>
								<div className="flex gap-2 items-center mt-1">
									<input
										type="color"
										value={contrastBg}
										onChange={(e) => setContrastBg(e.target.value)}
										className="w-12 h-8 rounded border-input cursor-pointer"
									/>
									<span className="text-xs font-mono text-secondary-foreground">{contrastBg}</span>
								</div>
							</div>
							{contrast && (
								<div className="mt-4">
									<div className="text-3xl font-bold mb-2">{contrast.ratio}:1</div>
									<div className="flex gap-2 flex-wrap">
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${contrast.aaSmall ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'}`}
										>
											AA Normal{' '}
											{contrast.aaSmall ? (
												<Check className="inline size-3.5" aria-hidden="true" />
											) : (
												<X className="inline size-3.5" aria-hidden="true" />
											)}
										</span>
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${contrast.aaLarge ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'}`}
										>
											AA Large{' '}
											{contrast.aaLarge ? (
												<Check className="inline size-3.5" aria-hidden="true" />
											) : (
												<X className="inline size-3.5" aria-hidden="true" />
											)}
										</span>
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${contrast.aaaSmall ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'}`}
										>
											AAA Normal{' '}
											{contrast.aaaSmall ? (
												<Check className="inline size-3.5" aria-hidden="true" />
											) : (
												<X className="inline size-3.5" aria-hidden="true" />
											)}
										</span>
										<span
											className={`px-2 py-1 rounded text-xs font-medium ${contrast.aaaLarge ? 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100' : 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100'}`}
										>
											AAA Large{' '}
											{contrast.aaaLarge ? (
												<Check className="inline size-3.5" aria-hidden="true" />
											) : (
												<X className="inline size-3.5" aria-hidden="true" />
											)}
										</span>
									</div>
								</div>
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
