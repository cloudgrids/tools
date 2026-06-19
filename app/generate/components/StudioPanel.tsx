'use client';

import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { CheckCircle2, ImageIcon, Loader2, Upload, X } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FileProps } from './Generate';

interface StudioPanelProps {
	files: FileProps[];
	loading: boolean;
	setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>;
	mobile?: boolean;
}

export const StudioPanel = memo(({ files, setFiles, loading, mobile }: StudioPanelProps) => {
	const { handleUpload } = usePopVid();
	const { uploadResult } = usePopVidStore();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const prevFileRef = useRef<File | null>(null);

	useEffect(() => {
		const file = files[0]?.file ?? null;
		if (file === prevFileRef.current) return;
		prevFileRef.current = file;
		setPreviewUrl((prev) => {
			if (prev) URL.revokeObjectURL(prev);
			return file ? URL.createObjectURL(file) : null;
		});
		return () => {
			setPreviewUrl((prev) => {
				if (prev) URL.revokeObjectURL(prev);
				return null;
			});
		};
	}, [files]);

	const onFilesAdded = useCallback(
		(selected: File[]) => {
			if (!selected[0]) return;
			setFiles([{ file: selected[0], uploaded: false }]);
		},
		[setFiles]
	);

	const clearFile = useCallback(() => setFiles([]), [setFiles]);

	const uploadFile = useCallback(async () => {
		if (!files.length) return;
		await handleUpload(files[0].file);
	}, [files, handleUpload]);

	const hasFile = files.length > 0 && !!previewUrl;
	const isUploaded = !!uploadResult;

	return (
		<aside
			className={
				mobile
					? 'flex w-full flex-col'
					: 'relative flex w-full max-w-xs shrink-0 flex-col overflow-hidden lg:max-w-sm xl:max-w-md'
			}
		>
			<div className="flex items-center gap-2 border-b border-border/60 px-5 py-3 shrink-0">
				<ImageIcon className="size-3.5 text-muted-foreground" />
				<span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
					Source Image
				</span>
				{isUploaded && (
					<span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-green-500">
						<CheckCircle2 className="size-3" />
						Uploaded
					</span>
				)}
			</div>

			<div className="flex flex-1 flex-col overflow-y-auto p-5 gap-4">
				<div className={hasFile ? 'opacity-50 pointer-events-none' : ''}>
					<Dropzone onFilesAdded={onFilesAdded} />
				</div>

				{hasFile && (
					<div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<div className="group relative overflow-hidden rounded-xl border border-border bg-black/40">
							<div className="relative aspect-4/3 w-full">
								<Image
									src={previewUrl!}
									alt="Preview"
									fill
									className="object-contain"
									sizes="(max-width: 768px) 100vw, 400px"
								/>
							</div>
							<div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-linear-to-t from-black/80 to-transparent px-3 py-2">
								<p className="flex-1 truncate text-[11px] text-white/80">{files[0].file.name}</p>
								<button
									onClick={clearFile}
									className="rounded-md bg-white/10 p-1 text-white/70 hover:bg-white/20 hover:text-white transition-colors"
									aria-label="Remove image"
								>
									<X className="size-3" />
								</button>
							</div>
						</div>

						{!isUploaded ? (
							<Button
								onClick={uploadFile}
								disabled={loading}
								className="w-full gap-2 bg-sky-500 hover:bg-sky-600 text-white shadow shadow-sky-500/20 h-10"
							>
								{loading ? (
									<Loader2 className="size-4 animate-spin" />
								) : (
									<Upload className="size-4" />
								)}
								{loading ? 'Uploading…' : 'Upload to PopVid'}
							</Button>
						) : (
							<div className="flex items-center justify-center gap-2 rounded-lg border border-green-500/20 bg-green-500/8 py-2.5 text-sm font-medium text-green-500">
								<CheckCircle2 className="size-4" />
								Ready for generation
							</div>
						)}
					</div>
				)}

				{isUploaded && uploadResult && (
					<div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
						<p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
							Stored image
						</p>
						<div className="relative overflow-hidden rounded-xl border border-green-500/20 bg-black/40">
							<div className="relative aspect-4/3 w-full">
								<Image
									src={uploadResult.imageUrl}
									alt="Uploaded"
									fill
									className="object-contain"
									sizes="(max-width: 768px) 100vw, 400px"
									loading="eager"
									key={uploadResult.imageUrl}
								/>
							</div>
							<div className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/70 to-transparent px-3 py-2">
								<p className="text-[10px] text-white/60 truncate font-mono">
									{uploadResult.bucket}/{uploadResult.path}
								</p>
							</div>
						</div>
					</div>
				)}
			</div>
		</aside>
	);
});

StudioPanel.displayName = 'StudioPanel';
