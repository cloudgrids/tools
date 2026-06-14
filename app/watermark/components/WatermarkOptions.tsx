import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { WatermarkProps } from '@/lib/contracts';
import { Blend } from '@/lib/enumerations';
import { cn } from '@/lib/utils';
import { Input } from '@base-ui/react';
import { RotateCcw } from 'lucide-react';
import { useCallback } from 'react';

interface RangeControlProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	display: string;
	onChange: (value: number) => void;
}

const blendOptions: Blend[] = ['over', 'multiply', 'screen', 'overlay', 'soft-light', 'difference'];
const positionOptions: NonNullable<WatermarkProps['position']>[] = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];

const RangeControl: React.FC<RangeControlProps> = ({ label, value, min, max, step, display, onChange }) => (
	<div className="space-y-2">
		<div className="flex items-center justify-between gap-3">
			<Label>{label}</Label>
			<span className="min-w-14 text-right text-xs text-muted-foreground">{display}</span>
		</div>
		<Slider
			value={[value]}
			min={min}
			max={max}
			step={step}
			onValueChange={(next) => onChange(Array.isArray(next) ? (next[0] ?? value) : next)}
		/>
	</div>
);

interface WatermarkOptionsProps {
	options: WatermarkProps;
	onOptionsChange: (options: WatermarkProps) => void;
	defaultOptions: WatermarkProps;
	selectedOutputAssets: string[];
	watermarked: string[];
}

export const WatermarkOptions: React.FC<WatermarkOptionsProps> = ({
	options,
	onOptionsChange,
	defaultOptions,
	selectedOutputAssets,
	watermarked
}) => {
	const handleResetOptions = useCallback(() => {
		onOptionsChange(defaultOptions);
	}, [defaultOptions, onOptionsChange]);

	return (
		<Card>
			<CardHeader className="border-b pb-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<CardTitle>Options</CardTitle>
						<CardDescription>These settings are sent to the watermark API.</CardDescription>
					</div>
					<Button variant="ghost" size="icon-sm" onClick={handleResetOptions} title="Reset options">
						<RotateCcw className="size-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-5">
				<div className="space-y-2">
					<Label htmlFor="watermark-text">Text</Label>
					<Textarea
						id="watermark-text"
						value={options.text ?? ''}
						onChange={(e) => onOptionsChange({ ...options, text: e.target.value })}
						placeholder="Watermark text"
						className="min-h-20 resize-none"
					/>
				</div>

				<div className="grid grid-cols-[1fr_72px] gap-3">
					<div className="space-y-2">
						<Label htmlFor="watermark-color">Color</Label>
						<Input
							id="watermark-color"
							value={options.color ?? '#ffffff'}
							onChange={(e) => onOptionsChange({ ...options, color: e.target.value })}
						/>
					</div>
					<div className="space-y-2">
						<Label htmlFor="watermark-color-picker">Pick</Label>
						<Input
							id="watermark-color-picker"
							type="color"
							value={options.color ?? '#ffffff'}
							onChange={(e) => onOptionsChange({ ...options, color: e.target.value })}
							className="p-1"
						/>
					</div>
				</div>

				<div className="space-y-3">
					<RangeControl
						label="Opacity"
						value={options.opacity ?? defaultOptions.opacity}
						min={0}
						max={1}
						step={0.05}
						display={`${Math.round((options.opacity ?? 0) * 100)}%`}
						onChange={(value) => onOptionsChange({ ...options, opacity: value })}
					/>
					<RangeControl
						label="Size"
						value={options.fontSize ?? defaultOptions.fontSize}
						min={12}
						max={140}
						step={1}
						display={`${options.fontSize ?? defaultOptions.fontSize}px`}
						onChange={(value) => onOptionsChange({ ...options, fontSize: value })}
					/>
					<RangeControl
						label="Angle"
						value={options.angle ?? defaultOptions.angle}
						min={-90}
						max={90}
						step={1}
						display={`${options.angle ?? defaultOptions.angle} deg`}
						onChange={(value) => onOptionsChange({ ...options, angle: value })}
					/>
					<RangeControl
						label="Margin"
						value={options.margin ?? defaultOptions.margin}
						min={0}
						max={160}
						step={4}
						display={`${options.margin ?? defaultOptions.margin}px`}
						onChange={(value) => onOptionsChange({ ...options, margin: value })}
					/>
				</div>

				<div className="space-y-2">
					<Label>Position</Label>
					<div className="grid grid-cols-2 gap-2">
						{positionOptions.map((position) => (
							<Button
								key={position}
								variant={options.position === position ? 'default' : 'outline'}
								onClick={() => onOptionsChange({ ...options, position })}
								className="justify-start capitalize"
							>
								{position.replace('-', ' ')}
							</Button>
						))}
					</div>
				</div>

				<div className="grid grid-cols-2 gap-3">
					<div className="space-y-2">
						<Label htmlFor="watermark-blend">Blend</Label>
						<select
							id="watermark-blend"
							value={options.blend ?? defaultOptions.blend}
							onChange={(e) => onOptionsChange({ ...options, blend: e.target.value as Blend })}
							className="h-8 w-full rounded-lg border border-input bg-background px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
						>
							{blendOptions.map((blend) => (
								<option key={blend} value={blend}>
									{blend}
								</option>
							))}
						</select>
					</div>

					<div className="flex items-end justify-between rounded-lg border p-3">
						<div className="space-y-1">
							<Label htmlFor="watermark-tiled">Tile</Label>
							<p className="text-xs text-muted-foreground">Repeat text</p>
						</div>
						<Switch
							id="watermark-tiled"
							checked={options.tiled ?? false}
							onCheckedChange={(checked) => onOptionsChange({ ...options, tiled: checked })}
						/>
					</div>
				</div>

				<div className={cn('rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground', !watermarked.length && 'hidden')}>
					{selectedOutputAssets.length || watermarked.length} selected for export. Use ZIP for multiple images.
				</div>
			</CardContent>
		</Card>
	);
};
