'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { WatermarkProps } from '@/lib/contracts';
import { RotateCcw } from 'lucide-react';
import { useCallback } from 'react';
import { ImageLayerOptions } from './ImageLayerOptions';
import { ModeSelector } from './ModeSelector';
import { OutputOptions } from './OutputOptions';
import { SharedLayerOptions } from './SharedLayerOptions';
import { TextLayerOptions } from './TextLayerOptions';

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
	/** Patch a single key on the options object. */
	const set = useCallback(
		<K extends keyof WatermarkProps>(key: K, value: WatermarkProps[K]) => {
			onOptionsChange({ ...options, [key]: value });
		},
		[options, onOptionsChange]
	);

	const handleReset = useCallback(() => onOptionsChange(defaultOptions), [defaultOptions, onOptionsChange]);

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
					<Button variant="ghost" size="icon-sm" onClick={handleReset} title="Reset options">
						<RotateCcw className="size-4" />
					</Button>
				</div>
			</CardHeader>

			<CardContent className="space-y-5">
				<ModeSelector mode={options.mode} onChange={(mode) => set('mode', mode)} />

				{showText && <TextLayerOptions options={options} defaultOptions={defaultOptions} onChange={set} />}

				{showImage && <ImageLayerOptions options={options} defaultOptions={defaultOptions} onChange={set} />}

				<SharedLayerOptions options={options} defaultOptions={defaultOptions} onChange={set} onOptionsChange={onOptionsChange} />

				<OutputOptions options={options} onChange={set} selectedOutputAssets={selectedOutputAssets} watermarked={watermarked} />
			</CardContent>
		</Card>
	);
};
