'use client';

import type { ColorStop } from '@/lib/contracts';
import type { GradientType } from '@/lib/enumerations';
import { buildGradientCss } from '@/lib/gradient';
import { GRADIENT_PRESETS } from '@/lib/tool-samples';
import { useCallback, useState } from 'react';
import { GradientControls } from './GradientControls';
import { GradientGallery } from './GradientGallery';
import { GradientPreview } from './GradientPreview';

export interface GradientState {
	type: GradientType;
	angle: number;
	stops: ColorStop[];
}

const emptyState: GradientState = {
	type: 'linear',
	angle: 135,
	stops: GRADIENT_PRESETS[0].stops.map((stop) => ({ ...stop }))
};

export const Gradient = () => {
	const [state, setState] = useState<GradientState>(emptyState);

	const css = buildGradientCss(state.type, state.angle, state.stops);

	const updateStop = useCallback((index: number, patch: Partial<ColorStop>) => {
		setState((prev) => ({
			...prev,
			stops: prev.stops.map((stop, current) => (current === index ? { ...stop, ...patch } : stop))
		}));
	}, []);

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 md:grid-cols-2">
				<GradientControls state={state} onSetState={setState} onUpdateStop={updateStop} />
				<GradientPreview css={css} />
			</div>
			<GradientGallery onApply={(stops) => setState((prev) => ({ ...prev, stops: stops.map((s) => ({ ...s })) }))} />
		</div>
	);
};
