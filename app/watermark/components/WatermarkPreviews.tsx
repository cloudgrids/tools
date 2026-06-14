import { ImageExportFormat } from '@/app/geometry/components/contracts';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExport } from '@/hooks/useExport';
import { WatermarkProps } from '@/lib/contracts';
import { Download, FileArchive, Loader2, Trash2, Wand2 } from 'lucide-react';
import { useCallback, useState } from 'react';
import { toast } from 'sonner';
import { Assets } from './Assets';

interface WatermarkPreviewsProps {
	files: File[];
	previews: string[];
	watermarked: string[];
	loading: boolean;
	options: WatermarkProps;
	exporting: boolean;
	canExport: boolean;
	selectedOutputAssets: string[];
	onLoading: React.Dispatch<React.SetStateAction<boolean>>;
	onReceiveFiles: React.Dispatch<React.SetStateAction<File[]>>;
	onPreviews: React.Dispatch<React.SetStateAction<string[]>>;
	onWatermarked: React.Dispatch<React.SetStateAction<string[]>>;
	selectedAssets: string[];
	onSelectedAssets: React.Dispatch<React.SetStateAction<string[]>>;
}

export const WatermarkPreviews: React.FC<WatermarkPreviewsProps> = ({
	files,
	previews,
	watermarked,
	loading,
	exporting,
	canExport,
	selectedOutputAssets,
	onLoading,
	onReceiveFiles,
	onPreviews,
	onWatermarked,
	selectedAssets,
	onSelectedAssets,
	options
}) => {
	const { handleExportAsZip } = useExport();
	const outputAssets = watermarked.length ? watermarked : previews;
	const [viewingIndex, setViewingIndex] = useState<number>(0);

	const handleSelect = useCallback(
		(selectedFiles: File[]) => {
			onReceiveFiles(selectedFiles);
			const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
			onPreviews(previewUrls);
			onWatermarked([]);
			onSelectedAssets([]);
		},
		[onReceiveFiles, onPreviews, onWatermarked, onSelectedAssets]
	);

	const handleWatermark = useCallback(async () => {
		if (!files.length) {
			toast.error('Add at least one image first.');
			return;
		}

		try {
			onLoading(true);

			const results = await Promise.all(
				files.map(async (file) => {
					const formData = new FormData();
					formData.append('file', file);
					formData.append('options', JSON.stringify(options));

					const response = await fetch('/api/watermark', { method: 'POST', body: formData });

					if (!response.ok) {
						const error = await response.text();
						console.log('Error response:', error);
						throw new Error(error || 'Failed to apply watermark');
					}

					const blob = await response.blob();
					return URL.createObjectURL(blob);
				})
			);

			onWatermarked(results);
			onSelectedAssets(results);
			toast.success(`Watermarked ${results.length} image${results.length === 1 ? '' : 's'}.`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Unknown error');
			console.error(error);
		} finally {
			onLoading(false);
		}
	}, [files, options, onLoading, onWatermarked, onSelectedAssets]);

	const handleRemovePreviews = useCallback(() => {
		onReceiveFiles([]);
		onPreviews([]);
		onWatermarked([]);
		onSelectedAssets([]);
	}, [onReceiveFiles, onPreviews, onWatermarked, onSelectedAssets]);

	const handleToggleSelect = useCallback(
		(url: string) => {
			onSelectedAssets((prev) => (prev.includes(url) ? prev.filter((asset) => asset !== url) : [...prev, url]));
		},
		[onSelectedAssets]
	);

	const handleExport = useCallback(
		(urls: string[]) => {
			if (!urls.length) {
				toast.error('No watermarked images to export.');
				return;
			}
			handleExportAsZip(
				urls.map((url) => ({
					url,
					width: 0,
					height: 0,
					type: ImageExportFormat.JPG
				}))
			);
		},
		[handleExportAsZip]
	);
	return (
		<Card className="min-h-130">
			<CardHeader className="border-b pb-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle>{watermarked.length ? 'Watermarked Output' : 'Source Images'}</CardTitle>
						<CardDescription>
							{watermarked.length ? 'Select finished images to export.' : 'Add images and apply your watermark settings.'}
						</CardDescription>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button onClick={handleWatermark} disabled={loading || !files.length}>
							{loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
							{loading ? 'Applying...' : 'Apply'}
						</Button>
						<Button
							variant="outline"
							onClick={() => handleExport(selectedOutputAssets.length ? selectedOutputAssets : watermarked)}
							disabled={!canExport || exporting}
						>
							<Download className="size-4" />
							Export
						</Button>
						<Button variant="outline" onClick={() => handleExport(watermarked)} disabled={!canExport || exporting}>
							<FileArchive className="size-4" />
							ZIP
						</Button>
						<Button variant="destructive" onClick={handleRemovePreviews} disabled={!previews.length && !watermarked.length}>
							<Trash2 className="size-4" />
							Clear
						</Button>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				{!previews.length ? (
					<div className="pt-2">
						<Dropzone onFilesAdded={handleSelect} />
					</div>
				) : (
					<div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
						{outputAssets.map((src, index) => (
							<div key={src} className="relative overflow-hidden rounded-lg border bg-muted">
								<Assets
									url={src}
									urls={outputAssets}
									index={index}
									viewingIndex={viewingIndex}
									onSetViewingIndex={setViewingIndex}
									isSelected={selectedAssets.includes(src)}
									onToggleSelect={watermarked.length ? handleToggleSelect : () => {}}
									onAssetClick={() => {
										if (watermarked.length) handleToggleSelect(src);
									}}
								/>
								<div className="absolute bottom-2 left-2 rounded-md bg-black/55 px-2 py-1 text-xs text-white backdrop-blur">
									{index + 1}
								</div>
							</div>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	);
};
