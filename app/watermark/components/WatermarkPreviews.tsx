'use client';

import { ImageExportFormat } from '@/app/geometry/components/contracts';
import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useExport } from '@/hooks/useExport';
import { WatermarkProps } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { Check, Download, FileArchive, Loader2, Trash2, Wand2 } from 'lucide-react';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { WatermarkCanvas } from './WatermarkCanvas';

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
	onOptionsChange: React.Dispatch<React.SetStateAction<WatermarkProps>>;
	activeIndex: number;
	onActiveIndex: React.Dispatch<React.SetStateAction<number>>;
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
	onOptionsChange,
	options,
	activeIndex,
	onActiveIndex
}) => {
	const { handleExportAsZip } = useExport();
	const outputAssets = watermarked.length ? watermarked : previews;

	const handleSelect = useCallback(
		(selectedFiles: File[]) => {
			onReceiveFiles(selectedFiles);
			const previewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
			onPreviews(previewUrls);
			onWatermarked([]);
			onSelectedAssets([]);
			onActiveIndex(0);
		},
		[onReceiveFiles, onPreviews, onWatermarked, onSelectedAssets, onActiveIndex]
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
					try {
						const formData = new FormData();
						formData.append('file', file);
						formData.append('options', JSON.stringify(options));
						const response = await fetch('/api/watermark', { method: 'POST', body: formData });
						if (!response.ok) throw new Error('Failed to apply watermark');
						const blob = await response.blob();
						return `${URL.createObjectURL(blob)}#${Date.now()}`;
					} catch {
						return URL.createObjectURL(file);
					}
				})
			);
			onWatermarked(results);
			onSelectedAssets(results);
			toast.success(`Watermarked ${results.length} image${results.length === 1 ? '' : 's'}.`);
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Unknown error');
		} finally {
			onLoading(false);
		}
	}, [files, options, onLoading, onWatermarked, onSelectedAssets]);

	const handleRemovePreviews = useCallback(() => {
		onReceiveFiles([]);
		onPreviews([]);
		onWatermarked([]);
		onSelectedAssets([]);
		onActiveIndex(0);
	}, [onReceiveFiles, onPreviews, onWatermarked, onSelectedAssets, onActiveIndex]);

	const handleToggleSelect = useCallback(
		(url: string) => {
			onSelectedAssets((prev) => (prev.includes(url) ? prev.filter((a) => a !== url) : [...prev, url]));
		},
		[onSelectedAssets]
	);

	const handleExport = useCallback(
		(urls: string[]) => {
			if (!urls.length) {
				toast.error('No watermarked images to export.');
				return;
			}
			handleExportAsZip(urls.map((url) => ({ url, width: 0, height: 0, type: ImageExportFormat.JPG })));
		},
		[handleExportAsZip]
	);

	return (
		<Card className="flex flex-col">
			<CardHeader className="border-b pb-4">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<CardTitle>{watermarked.length ? 'Watermarked Output' : 'Source Images'}</CardTitle>
						<CardDescription>
							{watermarked.length
								? 'Click thumbnails to select for export.'
								: 'Drag images in, tune options on the right, then Apply.'}
						</CardDescription>
					</div>

					<div className="flex flex-wrap gap-2">
						<Button onClick={handleWatermark} disabled={loading || !files.length}>
							{loading ? <Loader2 className="size-4 animate-spin" /> : <Wand2 className="size-4" />}
							{loading ? 'Applying…' : 'Apply'}
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

			<CardContent className="flex flex-1 flex-col gap-4 pt-4">
				{!previews.length ? (
					<Dropzone onFilesAdded={handleSelect} />
				) : (
					<>
						<WatermarkCanvas imageUrl={previews[activeIndex] ?? null} options={options} onOptionsChange={onOptionsChange} />

						<div className="flex gap-2 overflow-x-auto pb-1">
							{outputAssets.map((src, index) => {
								const isActive = index === activeIndex;
								const isSelected = selectedAssets.includes(src);
								return (
									<button
										key={src}
										type="button"
										onClick={() => {
											onActiveIndex(index);
											if (watermarked.length) handleToggleSelect(src);
										}}
										className={cn(
											'group relative shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200',
											'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
											isActive ? 'border-primary shadow-md' : 'border-transparent hover:border-border',
											isSelected && watermarked.length
												? 'ring-2 ring-primary ring-offset-1 ring-offset-background'
												: ''
										)}
										style={{ width: 72, height: 72 }}
									>
										{/* eslint-disable-next-line @next/next/no-img-element */}
										<img src={src} alt={`Image ${index + 1}`} className="h-full w-full object-cover" />
										<div className="absolute bottom-1 left-1 rounded bg-black/55 px-1 text-[10px] text-white leading-tight">
											{index + 1}
										</div>
										{watermarked.length > 0 && (
											<div
												className={cn(
													'absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full border transition-all',
													isSelected
														? 'border-primary bg-primary'
														: 'border-white/60 bg-black/30 opacity-0 group-hover:opacity-100'
												)}
											>
												<Check className={cn('h-2.5 w-2.5 text-white', isSelected ? 'opacity-100' : 'opacity-0')} />
											</div>
										)}
									</button>
								);
							})}
						</div>

						{/* Add more images */}
						<div className="text-xs text-muted-foreground">
							<label className="cursor-pointer underline underline-offset-2 hover:text-foreground">
								<input
									type="file"
									accept="image/*"
									multiple
									className="hidden"
									onChange={(e) => {
										const extra = Array.from(e.target.files ?? []);
										if (!extra.length) return;
										const all = [...files, ...extra];
										onReceiveFiles(all);
										onPreviews(all.map((f) => URL.createObjectURL(f)));
										onWatermarked([]);
										onSelectedAssets([]);
										e.target.value = '';
									}}
								/>
								+ Add more images
							</label>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};
