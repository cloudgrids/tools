'use client';

import { contrastRatio, generatePalette, generateShades, hexToRgb, isValidHex, rgbToHsl } from '@/lib/color';
import { useMemo, useState } from 'react';
import { ColorContrast } from './ColorContrast';
import { ColorPalette } from './ColorPalette';
import { ColorPicker } from './ColorPicker';
import { ColorShades } from './ColorShades';

const DEFAULT = '#7c3aed';

export interface ColorState {
	hex: string;
	hexInput: string;
	contrastText: string;
	contrastBg: string;
}

const emptyState: ColorState = {
	hex: DEFAULT,
	hexInput: DEFAULT,
	contrastText: '#ffffff',
	contrastBg: DEFAULT
};

export const Color = () => {
	const [state, setState] = useState<ColorState>(emptyState);

	const colorInfo = useMemo(() => {
		if (!isValidHex(state.hex)) return null;
		const [r, g, b] = hexToRgb(state.hex);
		const [h, s, l] = rgbToHsl(r, g, b);
		return {
			rgb: `rgb(${r}, ${g}, ${b})`,
			hsl: `hsl(${h}, ${s}%, ${l}%)`,
			cssVar: `--color-primary: hsl(${h}, ${s}%, ${l}%)`,
			shades: generateShades(state.hex),
			palette: generatePalette(state.hex)
		};
	}, [state.hex]);

	const contrast = useMemo(() => {
		if (!isValidHex(state.contrastText) || !isValidHex(state.contrastBg)) return null;
		return contrastRatio(state.contrastText, state.contrastBg);
	}, [state.contrastText, state.contrastBg]);

	const handleHexInput = (val: string) => {
		setState((prev) => ({ ...prev, hexInput: val, ...(isValidHex(val) ? { hex: val } : {}) }));
	};

	const handlePickerChange = (val: string) => {
		setState((prev) => ({ ...prev, hex: val, hexInput: val }));
	};

	if (!colorInfo) return <div className="text-muted-foreground">Enter a valid hex color.</div>;

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-2">
				<ColorPicker state={state} colorInfo={colorInfo} onHexInput={handleHexInput} onPickerChange={handlePickerChange} />
				<ColorShades shades={colorInfo.shades} onPickerChange={handlePickerChange} />
			</div>
			<ColorPalette palette={colorInfo.palette} onPickerChange={handlePickerChange} />
			<ColorContrast state={state} contrast={contrast} onSetState={setState} />
		</div>
	);
};
