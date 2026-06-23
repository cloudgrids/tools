'use client';

import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

/* ── VisualSlider ────────────────────────────────────────────────── */
export interface VisualSliderProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	display: string;
	/** Accent colour for the value chip. Defaults to primary. */
	color?: string;
	onChange: (v: number) => void;
	id?: string;
}

export const VisualSlider: React.FC<VisualSliderProps> = ({
	label,
	value,
	min,
	max,
	step,
	display,
	color = 'hsl(var(--primary))',
	onChange,
	id
}) => (
	<div className="space-y-1.5">
		<div className="flex items-center justify-between">
			<Label htmlFor={id} className="text-xs">
				{label}
			</Label>
			<span
				className="min-w-10 rounded-md px-1.5 py-0.5 text-center text-[11px] font-semibold tabular-nums"
				style={{ background: `${color}22`, color }}
			>
				{display}
			</span>
		</div>
		<Slider
			id={id}
			value={[value]}
			min={min}
			max={max}
			step={step}
			onValueChange={(next) => onChange(Array.isArray(next) ? (next[0] ?? value) : next)}
		/>
	</div>
);

/* ── SectionDivider ──────────────────────────────────────────────── */
export const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
	<div className="flex items-center gap-2 py-1">
		<div className="h-px flex-1 bg-border" />
		<span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
		<div className="h-px flex-1 bg-border" />
	</div>
);

/* ── ColorRow ────────────────────────────────────────────────────── */
export interface ColorRowProps {
	label: string;
	id: string;
	value: string;
	onChange: (v: string) => void;
}

export const ColorRow: React.FC<ColorRowProps> = ({ label, id, value, onChange }) => (
	<div className="flex items-center justify-between gap-3">
		<Label htmlFor={id} className="text-xs text-muted-foreground">
			{label}
		</Label>
		<div className="flex items-center gap-2">
			<div className="h-5 w-5 rounded-full border shadow-sm" style={{ background: value }} />
			<input
				id={id}
				type="color"
				value={value}
				onChange={(e) => onChange(e.target.value)}
				className="h-7 w-14 cursor-pointer rounded-md border border-input bg-background p-0.5"
			/>
		</div>
	</div>
);
