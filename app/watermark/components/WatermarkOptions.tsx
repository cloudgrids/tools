import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import type { WatermarkMode, WatermarkOutputFormat, WatermarkProps } from '@/lib/contracts';
import type { Blend } from '@/lib/enumerations';
import { cn } from '@/lib/utils';
import { Input } from '@base-ui/react';
import { ImageIcon, Layers2, RotateCcw, TextIcon } from 'lucide-react';
import { useCallback, useRef } from 'react';

interface RangeControlProps {
	label: string;
	value: number;
	min: number;
	max: number;
	step: number;
	display: string;
	onChange: (value: number) => void;
	id?: string;
}

export const blendOptions: Blend[] = ['over', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'difference', 'color-dodge'];
export const positionOptions: WatermarkProps['position'][] = ['center', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
export const modeOptions: { value: WatermarkMode; label: string; icon: React.ReactNode }[] = [
	{ value: 'text', label: 'Text', icon: <TextIcon className="size-3.5" /> },
	{ value: 'image', label: 'Image', icon: <ImageIcon className="size-3.5" /> },
	{ value: 'both', label: 'Both', icon: <Layers2 className="size-3.5" /> }
];
export const formatOptions: WatermarkOutputFormat[] = ['jpeg', 'png', 'webp'];

const RangeControl: React.FC<RangeControlProps> = ({ label, value, min, max, step, display, onChange, id }) => (
	<div className="space-y-2">
		<div className="flex items-center justify-between gap-3">
			<Label htmlFor={id}>{label}</Label>
			<span className="min-w-14 text-right text-xs text-muted-foreground">{display}</span>
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

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
	<div className="flex items-center gap-2 py-1">
		<div className="h-px flex-1 bg-border" />
		<span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">{label}</span>
		<div className="h-px flex-1 bg-border" />
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
	const logoInputRef = useRef<HTMLInputElement>(null);

	const set = useCallback(
		<K extends keyof WatermarkProps>(key: K, value: WatermarkProps[K]) => {
			onOptionsChange({ ...options, [key]: value });
		},
		[options, onOptionsChange]
	);

	const handleResetOptions = useCallback(() => onOptionsChange(defaultOptions), [defaultOptions, onOptionsChange]);

	const handleLogoFile = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => set('imageDataUri', reader.result as string);
			reader.readAsDataURL(file);
			// Reset input so the same file can be re-picked
			e.target.value = '';
		},
		[set]
	);

	const showText = options.mode === 'text' || options.mode === 'both';
	const showImage = options.mode === 'image' || options.mode === 'both';

	return (
		<Card>
			<CardHeader className="border-b pb-4">
				<div className="flex items-start justify-between gap-3">
					<div>
						<CardTitle>Options</CardTitle>
						<CardDescription>Configure watermark layers and output.</CardDescription>
					</div>
					<Button variant="ghost" size="icon-sm" onClick={handleResetOptions} title="Reset options">
						<RotateCcw className="size-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-5">
				{/* ── Mode ─────────────────────────────────────── */}
				<div className="space-y-2">
					<Label>Watermark Type</Label>
					<div className="grid grid-cols-3 gap-2">
						{modeOptions.map(({ value, label, icon }) => (
							<Button
								key={value}
								variant={options.mode === value ? 'default' : 'outline'}
								onClick={() => set('mode', value)}
								className="flex items-center gap-1.5"
							>
								{icon}
								{label}
							</Button>
						))}
					</div>
				</div>

				{/* ── Text layer ───────────────────────────────── */}
				{showText && (
					<>
						<SectionDivider label="Text Layer" />

						<div className="space-y-2">
							<Label htmlFor="watermark-text">Text</Label>
							<Textarea
								id="watermark-text"
								value={options.text ?? ''}
								onChange={(e) => set('text', e.target.value)}
								placeholder="Watermark text…"
								className="min-h-20 resize-none"
							/>
						</div>

						<div className="grid grid-cols-[1fr_72px] gap-3">
							<div className="space-y-2">
								<Label htmlFor="watermark-color">Fill Color</Label>
								<Input
									id="watermark-color"
									value={options.color ?? '#ffffff'}
									onChange={(e) => set('color', e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="watermark-color-picker">Pick</Label>
								<Input
									id="watermark-color-picker"
									type="color"
									value={options.color ?? '#ffffff'}
									onChange={(e) => set('color', e.target.value)}
									className="p-1"
								/>
							</div>
						</div>

						<div className="grid grid-cols-[1fr_72px] gap-3">
							<div className="space-y-2">
								<Label htmlFor="watermark-stroke-color">Stroke Color</Label>
								<Input
									id="watermark-stroke-color"
									value={options.strokeColor ?? '#000000'}
									onChange={(e) => set('strokeColor', e.target.value)}
								/>
							</div>
							<div className="space-y-2">
								<Label htmlFor="watermark-stroke-color-picker">Pick</Label>
								<Input
									id="watermark-stroke-color-picker"
									type="color"
									value={options.strokeColor ?? '#000000'}
									onChange={(e) => set('strokeColor', e.target.value)}
									className="p-1"
								/>
							</div>
						</div>

						<RangeControl
							id="watermark-font-size"
							label="Font Size"
							value={options.fontSize ?? defaultOptions.fontSize}
							min={12}
							max={140}
							step={1}
							display={`${options.fontSize ?? defaultOptions.fontSize}px`}
							onChange={(v) => set('fontSize', v)}
						/>

						<RangeControl
							id="watermark-stroke-width"
							label="Stroke Width"
							value={options.strokeWidth ?? defaultOptions.strokeWidth}
							min={0}
							max={8}
							step={0.5}
							display={`${options.strokeWidth ?? 1}px`}
							onChange={(v) => set('strokeWidth', v)}
						/>
					</>
				)}

				{/* ── Image layer ──────────────────────────────── */}
				{showImage && (
					<>
						<SectionDivider label="Image Layer" />

						<div className="space-y-2">
							<Label>Logo / Stamp Image</Label>
							<div className="flex items-center gap-2">
								<Button variant="outline" className="flex-1" onClick={() => logoInputRef.current?.click()}>
									<ImageIcon className="size-4" />
									{options.imageDataUri ? 'Change Image' : 'Choose Image'}
								</Button>
								{options.imageDataUri && (
									<Button variant="ghost" size="icon-sm" onClick={() => set('imageDataUri', undefined)}>
										<RotateCcw className="size-4" />
									</Button>
								)}
							</div>
							<input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
							{options.imageDataUri && (
								<div className="flex items-center justify-center overflow-hidden rounded-md border bg-muted p-2">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img src={options.imageDataUri} alt="Logo preview" className="max-h-20 max-w-full object-contain" />
								</div>
							)}
						</div>

						<RangeControl
							id="watermark-width-ratio"
							label="Logo Size"
							value={options.widthRatio ?? defaultOptions.widthRatio}
							min={0.05}
							max={0.9}
							step={0.01}
							display={`${Math.round((options.widthRatio ?? 0.25) * 100)}%`}
							onChange={(v) => set('widthRatio', v)}
						/>

						<div className="flex items-center justify-between rounded-lg border p-3">
							<div className="space-y-1">
								<Label htmlFor="watermark-grayscale">Greyscale</Label>
								<p className="text-xs text-muted-foreground">Convert logo to grey</p>
							</div>
							<Switch
								id="watermark-grayscale"
								checked={options.grayscale ?? false}
								onCheckedChange={(checked) => set('grayscale', checked)}
							/>
						</div>

						{options.tiled && (
							<div className="grid grid-cols-2 gap-3">
								<RangeControl
									id="watermark-tile-gap-x"
									label="Tile Gap X"
									value={options.tileGapX ?? 20}
									min={0}
									max={200}
									step={4}
									display={`${options.tileGapX ?? 20}px`}
									onChange={(v) => set('tileGapX', v)}
								/>
								<RangeControl
									id="watermark-tile-gap-y"
									label="Tile Gap Y"
									value={options.tileGapY ?? 20}
									min={0}
									max={200}
									step={4}
									display={`${options.tileGapY ?? 20}px`}
									onChange={(v) => set('tileGapY', v)}
								/>
							</div>
						)}
					</>
				)}

				{/* ── Shared controls ──────────────────────────── */}
				<SectionDivider label="Shared" />

				<div className="space-y-3">
					<RangeControl
						id="watermark-opacity"
						label="Opacity"
						value={options.opacity ?? defaultOptions.opacity}
						min={0}
						max={1}
						step={0.05}
						display={`${Math.round((options.opacity ?? 0) * 100)}%`}
						onChange={(v) => set('opacity', v)}
					/>
					<RangeControl
						id="watermark-angle"
						label="Angle"
						value={options.angle ?? defaultOptions.angle}
						min={-180}
						max={180}
						step={1}
						display={`${options.angle ?? 0}°`}
						onChange={(v) => set('angle', v)}
					/>
					<RangeControl
						id="watermark-margin"
						label="Margin"
						value={options.margin ?? defaultOptions.margin}
						min={0}
						max={160}
						step={4}
						display={`${options.margin ?? defaultOptions.margin}px`}
						onChange={(v) => set('margin', v)}
					/>
				</div>

				<div className="space-y-2">
					<Label>Position</Label>
					<div className="grid grid-cols-2 gap-2">
						{positionOptions.map((position) => (
							<Button
								key={position}
								variant={options.position === position ? 'default' : 'outline'}
								onClick={() => set('position', position)}
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
							onChange={(e) => set('blend', e.target.value as Blend)}
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
							<p className="text-xs text-muted-foreground">Repeat across image</p>
						</div>
						<Switch
							id="watermark-tiled"
							checked={options.tiled ?? false}
							onCheckedChange={(checked) => set('tiled', checked)}
						/>
					</div>
				</div>

				{/* ── Output ───────────────────────────────────── */}
				<SectionDivider label="Output" />

				<div className="space-y-2">
					<Label>Format</Label>
					<div className="grid grid-cols-3 gap-2">
						{formatOptions.map((fmt) => (
							<Button
								key={fmt}
								variant={options.outputFormat === fmt ? 'default' : 'outline'}
								onClick={() => set('outputFormat', fmt)}
								className="uppercase"
							>
								{fmt}
							</Button>
						))}
					</div>
				</div>

				{options.outputFormat !== 'png' && (
					<RangeControl
						id="watermark-quality"
						label="Quality"
						value={options.quality ?? 100}
						min={10}
						max={100}
						step={5}
						display={`${options.quality ?? 100}%`}
						onChange={(v) => set('quality', v)}
					/>
				)}

				{/* Export summary */}
				<div className={cn('rounded-lg border bg-muted/40 p-3 text-xs text-muted-foreground', !watermarked.length && 'hidden')}>
					{selectedOutputAssets.length || watermarked.length} selected for export. Use ZIP for multiple images.
				</div>
			</CardContent>
		</Card>
	);
};
