'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { WatermarkProps } from '@/lib/contracts';
import type { Blend } from '@/lib/enumerations';
import { cn } from '@/lib/utils';
import { ImageIcon, X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { AngleDial } from './AngleDial';
import { PositionGrid } from './PositionGrid';
import { ColorRow, SectionDivider, VisualSlider } from './controls';

const BLEND_OPTIONS: Blend[] = ['over', 'multiply', 'screen', 'overlay', 'soft-light', 'hard-light', 'difference', 'color-dodge'];

interface SharedLayerOptionsProps {
	options: WatermarkProps;
	defaultOptions: WatermarkProps;
	onChange: <K extends keyof WatermarkProps>(key: K, value: WatermarkProps[K]) => void;
	onOptionsChange: (options: WatermarkProps) => void;
}

export const SharedLayerOptions: React.FC<SharedLayerOptionsProps> = ({ options, defaultOptions, onChange, onOptionsChange }) => {
	const bgImageInputRef = useRef<HTMLInputElement>(null);

	const handleBgImageFile = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => onChange('logoBgImageUri', reader.result as string);
			reader.readAsDataURL(file);
			e.target.value = '';
		},
		[onChange]
	);

	const handleBgImageDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files?.[0];
			if (!file || !file.type.startsWith('image/')) return;
			const reader = new FileReader();
			reader.onload = () => onChange('logoBgImageUri', reader.result as string);
			reader.readAsDataURL(file);
		},
		[onChange]
	);

	const handlePositionChange = useCallback(
		(position: WatermarkProps['position']) => {
			// Clear custom coordinates so both the preview and the server
			// fall back to resolvePosition(position, margin) — they use identical logic.
			onOptionsChange({
				...options,
				position,
				imagePositionX: undefined,
				imagePositionY: undefined,
				textPositionX: undefined,
				textPositionY: undefined
			});
		},
		[options, onOptionsChange]
	);

	return (
		<>
			<SectionDivider label="Shared" />

			{/* Opacity */}
			<VisualSlider
				id="watermark-opacity"
				label="Opacity"
				value={options.opacity ?? defaultOptions.opacity}
				min={0}
				max={1}
				step={0.05}
				display={`${Math.round((options.opacity ?? 0) * 100)}%`}
				color="hsl(280 70% 60%)"
				onChange={(v) => onChange('opacity', v)}
			/>

			{/* Angle dial + Margin side-by-side */}
			<div className="flex items-start gap-4">
				<div className="space-y-1.5">
					<Label className="text-xs text-muted-foreground">Angle</Label>
					<AngleDial value={options.angle ?? defaultOptions.angle} onChange={(v) => onChange('angle', v)} size={72} />
				</div>
				<div className="flex-1 space-y-3 pt-0.5">
					<VisualSlider
						id="watermark-margin"
						label="Margin"
						value={options.margin ?? defaultOptions.margin}
						min={0}
						max={160}
						step={4}
						display={`${options.margin ?? defaultOptions.margin}px`}
						onChange={(v) => onChange('margin', v)}
					/>
				</div>
			</div>

			{/* Position grid */}
			<div className="space-y-2">
				<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Position</Label>
				<div className="flex items-center gap-4">
					<PositionGrid value={options.position} onChange={handlePositionChange} />
					<div className="flex-1 space-y-1 text-xs text-muted-foreground">
						<p className="font-medium capitalize text-foreground">{options.position.replace('-', ' ')}</p>
						<p>Click a dot to snap, or drag on the canvas.</p>
					</div>
				</div>
			</div>

			{/* Blend mode chips */}
			<div className="space-y-2">
				<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Blend Mode</Label>
				<div className="grid grid-cols-2 gap-1.5">
					{BLEND_OPTIONS.map((blend) => (
						<button
							key={blend}
							type="button"
							onClick={() => onChange('blend', blend)}
							className={cn(
								'rounded-lg border px-2 py-1.5 text-left text-xs capitalize transition-all',
								options.blend === blend
									? 'border-primary bg-primary/10 font-semibold text-primary'
									: 'border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground'
							)}
						>
							{blend}
						</button>
					))}
				</div>
			</div>

			{/* Layer Background */}
			<SectionDivider label="Layer Background" />

			{/* Background shape */}
			<div className="space-y-2">
				<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background Shape</Label>
				<div className="grid grid-cols-3 gap-1.5">
					{(['none', 'rect', 'rounded-rect', 'circle', 'pill'] as const).map((shape) => (
						<button
							key={shape}
							type="button"
							onClick={() => onChange('logoBgShape', shape)}
							className={cn(
								'rounded-lg border px-2 py-1.5 text-center text-xs capitalize transition-all',
								(options.logoBgShape ?? 'none') === shape
									? 'border-primary bg-primary/10 font-semibold text-primary'
									: 'border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground'
							)}
						>
							{shape.replace('-', ' ')}
						</button>
					))}
				</div>
			</div>

			{/* Background Fill Type */}
			{options.logoBgShape && options.logoBgShape !== 'none' && (
				<div className="space-y-2">
					<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background Fill Type</Label>
					<div className="grid grid-cols-2 gap-1.5">
						{(['color', 'image'] as const).map((type) => (
							<button
								key={type}
								type="button"
								onClick={() => onChange('logoBgType', type)}
								className={cn(
									'rounded-lg border px-2 py-1.5 text-center text-xs capitalize transition-all',
									(options.logoBgType ?? 'color') === type
										? 'border-primary bg-primary/10 font-semibold text-primary'
										: 'border-transparent bg-muted/40 text-muted-foreground hover:border-border hover:text-foreground'
								)}
							>
								{type}
							</button>
						))}
					</div>
				</div>
			)}

			{options.logoBgShape && options.logoBgShape !== 'none' && (
				<div className="space-y-4 rounded-lg border bg-muted/10 p-3">
					{(options.logoBgType ?? 'color') === 'color' ? (
						<ColorRow
							id="logo-bg-color"
							label="Background Color"
							value={options.logoBgColor ?? '#1c1c1e'}
							onChange={(v) => onChange('logoBgColor', v)}
						/>
					) : (
						<div className="space-y-2">
							<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Background Image</Label>
							{!options.logoBgImageUri ? (
								<div
									onClick={() => bgImageInputRef.current?.click()}
									onDrop={handleBgImageDrop}
									onDragOver={(e) => e.preventDefault()}
									className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-4 transition-colors hover:border-primary/60 hover:bg-muted/40"
								>
									<div className="flex size-8 items-center justify-center rounded-full bg-muted">
										<ImageIcon className="size-4 text-muted-foreground" />
									</div>
									<div className="text-center">
										<p className="text-xs font-medium">Click or drop background image</p>
									</div>
									<input ref={bgImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgImageFile} />
								</div>
							) : (
								<div className="group relative overflow-hidden rounded-xl border bg-muted/30">
									{/* eslint-disable-next-line @next/next/no-img-element */}
									<img
										src={options.logoBgImageUri}
										alt="Background preview"
										className="mx-auto max-h-20 max-w-full object-contain p-2 transition-opacity group-hover:opacity-40"
									/>
									<div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
										<Button variant="secondary" size="xs" onClick={() => bgImageInputRef.current?.click()}>
											Change
										</Button>
										<Button
											variant="destructive"
											size="icon-xs"
											onClick={() => onChange('logoBgImageUri', undefined)}
										>
											<X className="size-3.5" />
										</Button>
									</div>
									<input ref={bgImageInputRef} type="file" accept="image/*" className="hidden" onChange={handleBgImageFile} />
								</div>
							)}
						</div>
					)}

					<VisualSlider
						id="logo-bg-opacity"
						label="Background Opacity"
						value={options.logoBgOpacity ?? 0.65}
						min={0}
						max={1}
						step={0.05}
						display={`${Math.round((options.logoBgOpacity ?? 0.65) * 100)}%`}
						onChange={(v) => onChange('logoBgOpacity', v)}
					/>

					<VisualSlider
						id="logo-padding"
						label="Padding (Spacing)"
						value={options.logoPadding ?? 10}
						min={0}
						max={50}
						step={1}
						display={`${options.logoPadding ?? 10}%`}
						onChange={(v) => onChange('logoPadding', v)}
					/>
				</div>
			)}

			{/* Tiled toggle */}
			<div className="flex items-center justify-between rounded-lg border p-3">
				<div className="space-y-0.5">
					<Label htmlFor="watermark-tiled" className="text-sm">
						Tile
					</Label>
					<p className="text-xs text-muted-foreground">Repeat watermark across image</p>
				</div>
				<Switch id="watermark-tiled" checked={options.tiled ?? false} onCheckedChange={(checked) => onChange('tiled', checked)} />
			</div>

			{/* Tile sub-controls */}
			{options.tiled && (
				<div className="space-y-3 rounded-lg border bg-muted/20 p-3">
					<div className="grid grid-cols-2 gap-3">
						<VisualSlider
							id="watermark-tile-count-x"
							label="Columns"
							value={options.tileCountX ?? defaultOptions.tileCountX}
							min={1}
							max={20}
							step={1}
							display={`${options.tileCountX ?? defaultOptions.tileCountX}`}
							onChange={(v) => onChange('tileCountX', v)}
						/>
						<VisualSlider
							id="watermark-tile-count-y"
							label="Rows"
							value={options.tileCountY ?? defaultOptions.tileCountY}
							min={1}
							max={20}
							step={1}
							display={`${options.tileCountY ?? defaultOptions.tileCountY}`}
							onChange={(v) => onChange('tileCountY', v)}
						/>
					</div>
					<div className="grid grid-cols-2 gap-3">
						<VisualSlider
							id="watermark-tile-gap-x"
							label="Gap X"
							value={options.tileGapX ?? defaultOptions.tileGapX}
							min={0}
							max={200}
							step={4}
							display={`${options.tileGapX ?? defaultOptions.tileGapX}px`}
							onChange={(v) => onChange('tileGapX', v)}
						/>
						<VisualSlider
							id="watermark-tile-gap-y"
							label="Gap Y"
							value={options.tileGapY ?? defaultOptions.tileGapY}
							min={0}
							max={200}
							step={4}
							display={`${options.tileGapY ?? defaultOptions.tileGapY}px`}
							onChange={(v) => onChange('tileGapY', v)}
						/>
					</div>
				</div>
			)}
		</>
	);
};
