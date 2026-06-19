'use client';

import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { CheckCircle2, ImageIcon, Loader2, Upload } from 'lucide-react';
import Image from 'next/image';
import { memo, useCallback, useEffect, useRef, useState } from 'react';
import { FileProps } from './Generate';

interface UploadResultProps {
	files: FileProps[];
	loading: boolean;
	setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>;
}

export const UploadResult = memo(({ files, setFiles, loading }: UploadResultProps) => {
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
		(selectedFiles: File[]) => {
			if (!selectedFiles[0]) return;
			setFiles([{ file: selectedFiles[0], uploaded: false }]);
		},
		[setFiles]
	);

	const uploadFile = useCallback(async () => {
		if (!files.length) return;
		await handleUpload(files[0].file);
	}, [files, handleUpload]);

	return (
		<div className="relative rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-sky-500/40 to-transparent" />

			<div className="flex items-start gap-3 mb-4">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-500">
					<ImageIcon className="size-4" />
				</div>
				<div>
					<p className="text-sm font-semibold leading-none">Source Image</p>
					<p className="mt-1 text-xs text-muted-foreground">Upload the image that will animate into a video</p>
				</div>
			</div>

			<Dropzone onFilesAdded={onFilesAdded} />

			{previewUrl && (
				<div className="mt-4 rounded-xl border border-border bg-muted/30 overflow-hidden">
					<div className="relative w-full aspect-video">
						<Image src={previewUrl} alt="Preview" fill className="object-contain" sizes="(max-width: 768px) 100vw, 600px" />
					</div>
					<div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-border">
						<p className="text-xs text-muted-foreground truncate flex-1">{files[0].file.name}</p>
						<Button
							onClick={uploadFile}
							disabled={loading}
							size="sm"
							className="gap-1.5 bg-sky-500 hover:bg-sky-600 text-white shadow-sm shadow-sky-500/20 shrink-0"
						>
							{loading ? (
								<Loader2 className="size-3.5 animate-spin" />
							) : (
								<Upload className="size-3.5" />
							)}
							{loading ? 'Uploading…' : 'Upload'}
						</Button>
					</div>
				</div>
			)}

			{uploadResult && (
				<div className="mt-4 rounded-xl border border-green-500/20 bg-green-500/5 overflow-hidden">
					<div className="flex items-center gap-2 px-4 py-2.5 border-b border-green-500/10">
						<CheckCircle2 className="size-4 text-green-500 shrink-0" />
						<span className="text-xs font-medium text-green-600 dark:text-green-400">Uploaded successfully</span>
					</div>
					<div className="relative w-full aspect-video">
						<Image
							src={uploadResult.imageUrl}
							alt="Uploaded"
							fill
							className="object-contain"
							sizes="(max-width: 768px) 100vw, 600px"
							loading="eager"
							key={uploadResult.imageUrl}
						/>
					</div>
				</div>
			)}
		</div>
	);
});

UploadResult.displayName = 'UploadResult';
