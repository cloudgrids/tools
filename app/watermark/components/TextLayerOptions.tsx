'use client';

import { Textarea } from '@/components/ui/textarea';
import type { WatermarkProps } from '@/lib/contracts';
import { ColorRow, SectionDivider, VisualSlider } from './controls';

interface TextLayerOptionsProps {
	options: WatermarkProps;
	defaultOptions: WatermarkProps;
	onChange: <K extends keyof WatermarkProps>(key: K, value: WatermarkProps[K]) => void;
}

export const TextLayerOptions: React.FC<TextLayerOptionsProps> = ({ options, defaultOptions, onChange }) => (
	<>
		<SectionDivider label="Text Layer" />

		<div className="space-y-3">
			<Textarea
				id="watermark-text"
				value={options.text ?? ''}
				onChange={(e) => onChange('text', e.target.value)}
				placeholder="Watermark text…"
				className="min-h-16 resize-none text-sm"
			/>

			<ColorRow
				id="watermark-color"
				label="Fill Color"
				value={options.color ?? '#ffffff'}
				onChange={(v) => onChange('color', v)}
			/>
			<ColorRow
				id="watermark-stroke-color"
				label="Stroke Color"
				value={options.strokeColor ?? '#000000'}
				onChange={(v) => onChange('strokeColor', v)}
			/>

			<VisualSlider
				id="watermark-font-size"
				label="Font Size"
				value={options.fontSize ?? defaultOptions.fontSize}
				min={12}
				max={140}
				step={1}
				display={`${options.fontSize ?? defaultOptions.fontSize}px`}
				onChange={(v) => onChange('fontSize', v)}
			/>
			<VisualSlider
				id="watermark-stroke-width"
				label="Stroke Width"
				value={options.strokeWidth ?? defaultOptions.strokeWidth}
				min={0}
				max={8}
				step={0.5}
				display={`${options.strokeWidth ?? 1}px`}
				onChange={(v) => onChange('strokeWidth', v)}
			/>
		</div>
	</>
);
