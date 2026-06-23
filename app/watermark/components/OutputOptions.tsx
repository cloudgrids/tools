'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { WatermarkOutputFormat, WatermarkProps } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { SectionDivider, VisualSlider } from './controls';

const FORMAT_OPTIONS: WatermarkOutputFormat[] = ['jpeg', 'png', 'webp'];

interface OutputOptionsProps {
	options: WatermarkProps;
	onChange: <K extends keyof WatermarkProps>(key: K, value: WatermarkProps[K]) => void;
	selectedOutputAssets: string[];
	watermarked: string[];
}

export const OutputOptions: React.FC<OutputOptionsProps> = ({ options, onChange, selectedOutputAssets, watermarked }) => (
	<>
		<SectionDivider label="Output" />

		<div className="space-y-2">
			<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Format</Label>
			<div className="grid grid-cols-3 gap-2">
				{FORMAT_OPTIONS.map((fmt) => (
					<Button
						key={fmt}
						variant={options.outputFormat === fmt ? 'default' : 'outline'}
						onClick={() => onChange('outputFormat', fmt)}
						className="text-xs uppercase tracking-widest"
					>
						{fmt}
					</Button>
				))}
			</div>
		</div>

		{options.outputFormat !== 'png' && (
			<VisualSlider
				id="watermark-quality"
				label="Quality"
				value={options.quality ?? 100}
				min={10}
				max={100}
				step={5}
				display={`${options.quality ?? 100}%`}
				color="hsl(140 60% 45%)"
				onChange={(v) => onChange('quality', v)}
			/>
		)}

		{/* Export summary */}
		<div className={cn('rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground', !watermarked.length && 'hidden')}>
			{selectedOutputAssets.length || watermarked.length} selected for export.
		</div>
	</>
);
