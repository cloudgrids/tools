'use client';

import { useExport } from '@/hooks/useExport';
import { WatermarkProps } from '@/lib/contracts';
import { useMemo, useState } from 'react';
import { WatermarkHeader } from './WatermarkHeader';
import { WatermarkOptions } from './WatermarkOptions';
import { WatermarkPreviews } from './WatermarkPreviews';

const defaultOptions: WatermarkProps = {
	// shared
	mode: 'text',
	opacity: 0.5,
	angle: -30,
	blend: 'over',
	position: 'center',
	tiled: false,
	margin: 48,
	outputFormat: 'jpeg',
	quality: 100,
	// text
	text: 'Sample Watermark',
	fontSize: 48,
	color: '#ffffff',
	strokeWidth: 1,
	strokeColor: '#000000',
	// image
	imageDataUri: undefined,
	widthRatio: 0.25,
	grayscale: false,
	tileGapX: 20,
	tileGapY: 20,
	tileCountX: 4,
	tileCountY: 4,
	layers: []
};

export const Watermark = () => {
	const [files, setFiles] = useState<File[]>([]);
	const [previews, setPreviews] = useState<string[]>([]);
	const [watermarked, setWatermarked] = useState<string[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const [options, setOptions] = useState<WatermarkProps>(defaultOptions);
	const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
	const { loading: exporting } = useExport();

	const selectedOutputAssets = useMemo(
		() => selectedAssets.filter((asset) => watermarked.includes(asset)),
		[selectedAssets, watermarked]
	);
	const canExport = watermarked.length > 0;

	return (
		<div className="space-y-5">
			<WatermarkHeader files={files} watermarked={watermarked} />
			<div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
				<WatermarkPreviews
					files={files}
					options={options}
					previews={previews}
					watermarked={watermarked}
					loading={loading}
					exporting={exporting}
					canExport={canExport}
					onLoading={setLoading}
					onReceiveFiles={setFiles}
					onPreviews={setPreviews}
					onWatermarked={setWatermarked}
					selectedAssets={selectedAssets}
					onSelectedAssets={setSelectedAssets}
					selectedOutputAssets={selectedOutputAssets}
				/>

				<div className="max-h-[calc(100vh-8rem)] overflow-y-auto rounded-xl">
					<WatermarkOptions
						options={options}
						onOptionsChange={setOptions}
						defaultOptions={defaultOptions}
						selectedOutputAssets={selectedOutputAssets}
						watermarked={watermarked}
					/>
				</div>
			</div>
		</div>
	);
};
