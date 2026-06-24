'use client';

import { Dropzone } from '@/components/Dropzone';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { cn } from '@/lib/utils';
import { CheckCircle2, Film, FolderTree, ImageIcon, ImagePlus, Loader2, Sparkles, Upload, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { GenerateInputV2 } from './GenerateInputV2';

interface FileProps {
	file: File;
	uploaded: boolean;
}

type MobileTab = 'upload' | 'generate';

export const GenerateV2 = () => {
	const { loading, handleUpload } = usePopVid();
	const { uploadResult, history, setUploadResult } = usePopVidStore();

	const [customInput, setCustomInput] = useState<Record<string, unknown>>({});
	const [files, setFiles] = useState<FileProps[]>([]);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [mobileTab, setMobileTab] = useState<MobileTab>('upload');
	const fileInputRef = useRef<HTMLInputElement>(null);
	const prevFileRef = useRef<File | null>(null);

	// Build preview URL
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

	// Auto-switch to generate tab after successful upload (mobile only)
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		if (uploadResult) setMobileTab('generate');
	}, [uploadResult]);

	const onFilesAdded = useCallback((selected: File[]) => {
		if (!selected[0]) return;
		setFiles([{ file: selected[0], uploaded: false }]);
	}, []);

	const onFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;
		setFiles([{ file, uploaded: false }]);
		e.target.value = '';
	}, []);

	const clearFile = useCallback(() => {
		setFiles([]);
		setUploadResult(null);
	}, [setUploadResult]);

	const uploadFile = useCallback(async () => {
		if (!files.length) return;
		await handleUpload(files[0].file);
	}, [files, handleUpload]);

	const hasFile = files.length > 0 && !!previewUrl;
	const isUploaded = !!uploadResult;
	const sessionCount = history.length;

	return (
		<div className="relative flex flex-col h-full bg-[#080810] text-white overflow-hidden">
			{/* Ambient bg */}
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-40 size-96 rounded-full bg-violet-600/8 blur-3xl" />
				<div className="absolute top-1/3 -right-20 size-80 rounded-full bg-indigo-600/6 blur-3xl" />
				<div className="absolute -bottom-20 left-1/2 size-72 rounded-full bg-violet-800/5 blur-3xl" />
			</div>

			{/* ─── Header ──────────────────────────────────────────────────────── */}
			<header className="relative shrink-0 flex items-center justify-between gap-3 border-b border-white/8 px-4 py-3 sm:px-6">
				<div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

				<div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
						<Film className="size-4 text-white" />
					</div>
					<div className="min-w-0">
						<h1 className="text-sm font-bold leading-none truncate">AI Video Generator</h1>
						<p className="text-[10px] text-white/40 mt-0.5 leading-none flex items-center gap-1">
							PopVid Studio
							<span className="rounded-full border border-violet-500/40 bg-violet-500/15 px-1.5 py-px text-[9px] font-semibold text-violet-400">
								v2
							</span>
						</p>
					</div>
				</div>

				<Link
					href="/generate/v2/history"
					className="relative flex shrink-0 items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.04] px-2.5 py-2 text-xs font-medium text-white/60 hover:text-white hover:bg-white/[0.08] hover:border-violet-500/40 transition-all sm:px-3"
				>
					<FolderTree className="size-3.5" />
					<span className="hidden sm:inline">History Tree</span>
					{sessionCount > 0 && (
						<span className="flex size-4 items-center justify-center rounded-full bg-violet-500/20 text-[9px] font-bold text-violet-400 border border-violet-500/30">
							{sessionCount > 99 ? '99+' : sessionCount}
						</span>
					)}
				</Link>
			</header>

			{/* ─── Mobile tab switcher (hidden on lg+) ─────────────────────────── */}
			<div className="lg:hidden shrink-0 flex border-b border-white/8 bg-[#080810]">
				{[
					{ key: 'upload' as MobileTab, icon: ImageIcon, label: 'Source Image', done: isUploaded },
					{ key: 'generate' as MobileTab, icon: Sparkles, label: 'Generate', done: false }
				].map(({ key, icon: Icon, label, done }) => (
					<button
						key={key}
						onClick={() => setMobileTab(key)}
						className={cn(
							'flex-1 flex items-center justify-center gap-2 py-3 text-xs font-semibold border-b-2 transition-all',
							mobileTab === key ? 'border-violet-500 text-white' : 'border-transparent text-white/35 hover:text-white/55'
						)}
					>
						<Icon className="size-3.5 shrink-0" />
						{label}
						{done && <span className="size-1.5 rounded-full bg-emerald-400 shrink-0" />}
					</button>
				))}
			</div>

			{/* ─── Body ────────────────────────────────────────────────────────── */}
			<div className="relative flex flex-1 min-h-0 overflow-hidden">
				{/* ── Source Image panel ── */}
				<aside
					className={cn(
						// Mobile: full-width, show/hide by tab
						'relative flex-col overflow-hidden border-white/8',
						'w-full',
						mobileTab === 'upload' ? 'flex' : 'hidden',
						// Desktop: always visible, fixed width, with right border
						'lg:flex lg:w-auto lg:max-w-xs lg:shrink-0 xl:max-w-sm lg:border-r'
					)}
				>
					<div className="flex items-center gap-2 border-b border-white/8 px-5 py-3 shrink-0">
						<ImageIcon className="size-3.5 text-white/40" />
						<span className="text-xs font-semibold uppercase tracking-widest text-white/40">Source Image</span>
						{isUploaded && (
							<span className="ml-auto flex items-center gap-1 text-[10px] font-medium text-emerald-400">
								<CheckCircle2 className="size-3" /> Uploaded
							</span>
						)}
					</div>

					<div className="flex flex-1 flex-col overflow-y-auto p-5 gap-4">
						<div className={hasFile ? 'opacity-50 pointer-events-none' : ''}>
							<Dropzone onFilesAdded={onFilesAdded} />
						</div>

						{!hasFile && (
							<>
								<input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileInputChange} />
								<button
									type="button"
									onClick={() => fileInputRef.current?.click()}
									className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-sky-500/40 bg-sky-500/5 hover:bg-sky-500/10 text-sky-400 hover:text-sky-300 transition-all h-10 text-sm font-medium"
								>
									<ImagePlus className="size-4" /> Choose Image
								</button>
							</>
						)}

						{hasFile && (
							<div className="flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
								<div className="group relative overflow-hidden rounded-xl border border-white/10 bg-black/40">
									<div className="relative aspect-4/3 w-full">
										<Image
											src={previewUrl!}
											alt="Preview"
											fill
											className="object-contain"
											sizes="(max-width: 768px) 100vw, 400px"
										/>
									</div>
									<div className="absolute inset-x-0 bottom-0 flex items-center gap-2 bg-gradient-to-t from-black/80 to-transparent px-3 py-2">
										<p className="flex-1 truncate text-[11px] text-white/70">{files[0].file.name}</p>
										<button
											onClick={clearFile}
											className="rounded-md bg-white/10 p-1 text-white/60 hover:bg-white/20 hover:text-white transition-colors"
											aria-label="Remove image"
										>
											<X className="size-3" />
										</button>
									</div>
								</div>

								{/* Upload button — always visible when file chosen */}
								<button
									onClick={uploadFile}
									disabled={loading}
									className="flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white shadow-lg shadow-sky-500/25 h-11 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
								>
									{loading ? (
										<>
											<Loader2 className="size-4 animate-spin" /> Uploading…
										</>
									) : (
										<>
											<Upload className="size-4" /> Upload to PopVid
										</>
									)}
								</button>
							</div>
						)}

						{/* Uploaded confirmation + stored image */}
						{isUploaded && uploadResult && (
							<div className="flex flex-col gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
								<div className="flex items-center justify-between">
									<p className="text-[11px] font-semibold uppercase tracking-wider text-white/30">Stored Image</p>
									<button
										onClick={clearFile}
										className="inline-flex items-center gap-1 rounded-lg border border-white/8 bg-white/[0.03] px-2 py-1 text-[10px] text-white/40 hover:text-sky-400 hover:border-sky-500/40 hover:bg-sky-500/8 transition-all"
									>
										<ImagePlus className="size-3" /> Change
									</button>
								</div>
								<div className="relative overflow-hidden rounded-xl border border-emerald-500/20 bg-black/40">
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
									<div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
										<p className="text-[10px] text-white/50 truncate font-mono">
											{uploadResult.bucket}/{uploadResult.path}
										</p>
									</div>
								</div>
								<div className="flex items-center justify-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/8 py-2.5 text-sm font-medium text-emerald-400">
									<CheckCircle2 className="size-4" /> Ready for generation
								</div>

								{/* Mobile: shortcut to go to generate tab */}
								<button
									onClick={() => setMobileTab('generate')}
									className="lg:hidden flex w-full items-center justify-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/15 transition-all"
								>
									<Sparkles className="size-4" /> Continue to Generate →
								</button>
							</div>
						)}
					</div>
				</aside>

				{/* Divider — desktop only */}
				<div className="hidden lg:block relative shrink-0 w-px bg-white/8">
					<div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-violet-500/20 to-transparent" />
				</div>

				{/* ── Generate Input + Output ── */}
				<main className={cn('flex-col overflow-hidden', 'flex-1', mobileTab === 'generate' ? 'flex' : 'hidden', 'lg:flex')}>
					<GenerateInputV2 customInput={customInput} setCustomInput={setCustomInput} loading={loading} />
				</main>
			</div>
		</div>
	);
};
