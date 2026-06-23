'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { WatermarkProps } from '@/lib/contracts';
import { ImageIcon, X } from 'lucide-react';
import { useCallback, useRef } from 'react';
import { SectionDivider, VisualSlider } from './controls';

interface ImageLayerOptionsProps {
	options: WatermarkProps;
	defaultOptions: WatermarkProps;
	onChange: <K extends keyof WatermarkProps>(key: K, value: WatermarkProps[K]) => void;
}

export const ImageLayerOptions: React.FC<ImageLayerOptionsProps> = ({ options, defaultOptions, onChange }) => {
	const logoInputRef = useRef<HTMLInputElement>(null);

	const handleLogoFile = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (!file) return;
			const reader = new FileReader();
			reader.onload = () => onChange('imageDataUri', reader.result as string);
			reader.readAsDataURL(file);
			e.target.value = '';
		},
		[onChange]
	);

	const handleLogoDrop = useCallback(
		(e: React.DragEvent<HTMLDivElement>) => {
			e.preventDefault();
			const file = e.dataTransfer.files?.[0];
			if (!file || !file.type.startsWith('image/')) return;
			const reader = new FileReader();
			reader.onload = () => onChange('imageDataUri', reader.result as string);
			reader.readAsDataURL(file);
		},
		[onChange]
	);

	return (
		<>
			<SectionDivider label="Image Layer" />

			{/* Logo dropzone / preview */}
			<div className="space-y-2">
				<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Logo / Stamp</Label>

				{!options.imageDataUri ? (
					<div
						onClick={() => logoInputRef.current?.click()}
						onDrop={handleLogoDrop}
						onDragOver={(e) => e.preventDefault()}
						className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border py-7 transition-colors hover:border-primary/60 hover:bg-muted/40"
					>
						<div className="flex size-10 items-center justify-center rounded-full bg-muted">
							<ImageIcon className="size-5 text-muted-foreground" />
						</div>
						<div className="text-center">
							<p className="text-sm font-medium">Click or drop an image</p>
							<p className="text-xs text-muted-foreground">PNG, JPG, SVG, GIF, WebP</p>
						</div>
						<input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
					</div>
				) : (
					<div className="group relative overflow-hidden rounded-xl border bg-muted/30">
						{/* eslint-disable-next-line @next/next/no-img-element */}
						<img
							src={options.imageDataUri}
							alt="Logo preview"
							className="mx-auto max-h-28 max-w-full object-contain p-3 transition-opacity group-hover:opacity-40"
						/>
						<div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
							<Button variant="secondary" size="sm" onClick={() => logoInputRef.current?.click()}>
								Change
							</Button>
							<Button
								variant="destructive"
								size="icon"
								className="h-8 w-8"
								onClick={() => onChange('imageDataUri', undefined)}
							>
								<X className="size-4" />
							</Button>
						</div>
						<input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoFile} />
					</div>
				)}
			</div>

			<VisualSlider
				id="watermark-width-ratio"
				label="Logo Size"
				value={options.widthRatio ?? defaultOptions.widthRatio}
				min={0.05}
				max={0.9}
				step={0.01}
				display={`${Math.round((options.widthRatio ?? 0.25) * 100)}%`}
				color="hsl(220 70% 60%)"
				onChange={(v) => onChange('widthRatio', v)}
			/>

			<div className="flex items-center justify-between rounded-lg border p-3">
				<div className="space-y-0.5">
					<Label htmlFor="watermark-grayscale" className="text-sm">
						Greyscale
					</Label>
					<p className="text-xs text-muted-foreground">Convert logo to grey</p>
				</div>
				<Switch
					id="watermark-grayscale"
					checked={options.grayscale ?? false}
					onCheckedChange={(checked) => onChange('grayscale', checked)}
				/>
			</div>
		</>
	);
};
