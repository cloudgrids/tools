'use client';

import { GenerationHistory, MemeStatus } from '@/lib/contracts';
import { getMemeId } from '@/lib/helpers';
import { ChevronDown, ChevronRight, Clock, Copy, Download, ExternalLink, RefreshCw, Sparkles, Trash2, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { memo, useCallback, useState } from 'react';
import { toast } from 'sonner';

// ─── Status helpers ──────────────────────────────────────────────────────────

const STATUS_COLORS: Record<string, { pill: string; dot: string }> = {
	completed: {
		pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
		dot: 'bg-emerald-400'
	},
	processing: {
		pill: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
		dot: 'bg-sky-400 animate-pulse'
	},
	pending: {
		pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
		dot: 'bg-amber-400 animate-pulse'
	},
	failed: {
		pill: 'bg-red-500/15 text-red-400 border-red-500/30',
		dot: 'bg-red-400'
	}
};

const getStatus = (s?: string) => {
	const k = (s ?? 'pending').toLowerCase();
	return STATUS_COLORS[k] ?? STATUS_COLORS.pending;
};

const getImageUrl = (item: GenerationHistory) => `https://storage.googleapis.com/${item.imageBucket}/${item.imagePath}`;

// ─── Child (Meme) Node ───────────────────────────────────────────────────────

interface ChildNodeProps {
	meme: MemeStatus;
	isLast: boolean;
	onDelete: () => void;
	sessionId: string;
}

export const ChildNode = memo(({ meme, isLast, onDelete, sessionId }: ChildNodeProps) => {
	const router = useRouter();
	const sc = getStatus(meme.status);

	return (
		<div className="relative flex gap-0">
			{/* Connector lines */}
			<div className="relative flex flex-col items-center" style={{ width: 32 }}>
				{/* Vertical line from parent */}
				<div className="absolute left-1/2 -translate-x-1/2 w-px bg-violet-500/30" style={{ top: 0, bottom: isLast ? '50%' : 0 }} />
				{/* Horizontal elbow */}
				<div
					className="absolute border-l border-b border-violet-500/30 rounded-bl-lg"
					style={{ left: '50%', top: 0, width: 14, height: 28, borderWidth: '0 0 1px 1px' }}
				/>
				{/* Node dot */}
				<div className="absolute top-6 left-1/2 -translate-x-1/2 size-2 rounded-full bg-violet-400/70 ring-2 ring-violet-500/20" />
			</div>

			{/* Card */}
			<div className="flex-1 ml-2 mb-3 mt-2 group">
				<div className="rounded-xl border border-white/8 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-200 overflow-hidden">
					{/* Left accent */}
					<div className="flex gap-0">
						<div className="w-0.5 shrink-0 bg-gradient-to-b from-violet-500/60 to-violet-500/10 rounded-l-xl" />
						<div className="flex-1 p-3">
							<div className="flex items-start justify-between gap-2 mb-2">
								<p className="text-xs font-medium text-white/80 line-clamp-2 leading-relaxed">{meme.prompt}</p>
								<span
									className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize ${sc.pill}`}
								>
									<span className={`size-1.5 rounded-full ${sc.dot}`} />
									{meme.status ?? 'pending'}
								</span>
							</div>

							<div className="flex items-center gap-2 text-[10px] text-white/30 font-mono mb-2">
								<Clock className="size-2.5" />
								<span className="truncate">node: {meme.nodeId ?? '—'}</span>
							</div>

							{/* Media previews */}
							{(meme.videoUrl || meme.highResUrl) && (
								<div className="flex gap-2 mb-2">
									{meme.videoUrl && (
										<video
											src={meme.videoUrl}
											muted
											controls
											preload="metadata"
											className="flex-1 rounded-lg border border-white/10 max-h-28 bg-black object-contain"
										/>
									)}
									{meme.highResUrl && (
										<video
											src={meme.highResUrl}
											muted
											controls
											preload="metadata"
											className="flex-1 rounded-lg border border-white/10 max-h-28 bg-black object-contain"
										/>
									)}
								</div>
							)}

							{/* Actions */}
							<div className="flex flex-wrap gap-1.5">
								<button
									onClick={() => navigator.clipboard.writeText(meme.prompt).then(() => toast.success('Copied prompt'))}
									className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
								>
									<Copy className="size-2.5" />
									Copy
								</button>
								{meme.videoUrl && (
									<>
										<a
											href={meme.videoUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
										>
											<ExternalLink className="size-2.5" />
											View
										</a>
										<a
											href={meme.videoUrl}
											download
											className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
										>
											<Download className="size-2.5" />
											Save
										</a>
									</>
								)}
								<button
									onClick={() => router.push(`/generate/${getMemeId(sessionId)}`)}
									className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-500/10 px-2 py-1 text-[10px] text-violet-400 hover:bg-violet-500/20 transition-all"
								>
									<Sparkles className="size-2.5" />
									Remix
								</button>
								<button
									onClick={onDelete}
									className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/8 px-2 py-1 text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/15 transition-all"
								>
									<Trash2 className="size-2.5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});
ChildNode.displayName = 'ChildNode';

// ─── Root (Session) Node ─────────────────────────────────────────────────────

interface RootNodeProps {
	item: GenerationHistory;
	isActive: boolean;
	isLast: boolean;
	onLoad: (item: GenerationHistory) => void;
	onDelete: () => void;
	onDeleteMeme: (memeIdx: number) => void;
}

export const RootNode = memo(({ item, isActive, isLast, onLoad, onDelete, onDeleteMeme }: RootNodeProps) => {
	const router = useRouter();
	const [expanded, setExpanded] = useState(false);
	const sc = getStatus(item.status);
	const hasMemes = (item.memes?.length ?? 0) > 0;

	const toggle = useCallback(() => {
		if (hasMemes) setExpanded((p) => !p);
	}, [hasMemes]);

	return (
		<div className="relative">
			{/* Vertical spine line going down (connecting siblings) */}
			{!isLast && (
				<div
					className="absolute left-4 top-0 w-px bg-gradient-to-b from-violet-500/25 to-violet-500/5"
					style={{ top: 44, bottom: -8 }}
				/>
			)}

			{/* Root card */}
			<div
				className={`relative rounded-2xl border transition-all duration-200 overflow-hidden mb-2 ${
					isActive
						? 'border-violet-500/50 bg-violet-500/8 shadow-lg shadow-violet-500/10'
						: 'border-white/8 bg-white/[0.025] hover:bg-white/[0.05]'
				}`}
			>
				{/* Active glow stripe */}
				{isActive && (
					<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/60 to-transparent" />
				)}

				<div className="flex gap-3 p-3">
					{/* Spine + dot */}
					<div className="relative flex flex-col items-center mt-1" style={{ minWidth: 16 }}>
						<div
							className={`size-3 rounded-full ring-2 shrink-0 mt-0.5 ${
								isActive ? 'bg-violet-400 ring-violet-500/40' : 'bg-violet-500/40 ring-violet-500/15'
							}`}
						/>
						{hasMemes && expanded && <div className="flex-1 mt-1 w-px bg-gradient-to-b from-violet-500/40 to-violet-500/5" />}
					</div>

					{/* Content */}
					<div className="flex-1 min-w-0">
						{/* Header row */}
						<div className="flex items-center gap-2 mb-2">
							<span
								className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-semibold capitalize shrink-0 ${sc.pill}`}
							>
								<span className={`size-1.5 rounded-full ${sc.dot}`} />
								{item.status ?? 'pending'}
							</span>
							{hasMemes && (
								<span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2 py-0.5 text-[10px] font-semibold text-violet-400 shrink-0">
									<Sparkles className="size-2.5" />
									{item.memes!.length} meme{item.memes!.length !== 1 ? 's' : ''}
								</span>
							)}
							<button
								onClick={toggle}
								className="ml-auto p-1 rounded-md text-white/30 hover:text-white/70 hover:bg-white/8 transition-all"
								aria-label={expanded ? 'Collapse' : 'Expand'}
							>
								{expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
							</button>
						</div>

						{/* Image + prompt row */}
						<div className="flex gap-3">
							{/* Thumbnail */}
							<div className="relative shrink-0 size-14 rounded-lg overflow-hidden border border-white/10 bg-black/40">
								<Image src={getImageUrl(item)} alt="Source" fill className="object-cover" sizes="56px" />
							</div>

							{/* Prompt & meta */}
							<div className="flex-1 min-w-0">
								<p className="text-xs text-white/75 font-medium line-clamp-2 leading-relaxed mb-1.5">{item.videoPrompt}</p>
								<div className="flex items-center gap-1 text-[10px] font-mono text-white/25">
									<Clock className="size-2.5 shrink-0" />
									<span className="truncate">{item.sessionId?.slice(0, 20)}…</span>
								</div>
							</div>
						</div>

						{/* Generated video preview */}
						{item.videoUrl && (
							<div className="mt-2.5 rounded-xl overflow-hidden border border-white/8 bg-black/40">
								<video src={item.videoUrl} muted controls preload="metadata" className="w-full max-h-32 object-contain" />
							</div>
						)}

						{/* Action bar */}
						<div className="flex flex-wrap gap-1.5 mt-2.5">
							<button
								onClick={() => onLoad(item)}
								className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
							>
								<RefreshCw className="size-2.5" />
								Load
							</button>
							{item.videoUrl && (
								<>
									<a
										href={item.videoUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
									>
										<Video className="size-2.5" />
										View
									</a>
									<a
										href={item.videoUrl}
										download
										className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
									>
										<Download className="size-2.5" />
										Save
									</a>
								</>
							)}
							<button
								onClick={() => router.push(`/generate/${getMemeId(item.sessionId)}`)}
								className="inline-flex items-center gap-1 rounded-md border border-violet-500/30 bg-violet-500/10 px-2.5 py-1 text-[10px] text-violet-400 hover:bg-violet-500/20 transition-all"
							>
								<Sparkles className="size-2.5" />
								Meme
							</button>
							<button
								onClick={() => navigator.clipboard.writeText(item.videoPrompt).then(() => toast.success('Copied!'))}
								className="inline-flex items-center gap-1 rounded-md border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] text-white/50 hover:text-white/90 hover:bg-white/10 transition-all"
							>
								<Copy className="size-2.5" />
							</button>
							<button
								onClick={onDelete}
								className="inline-flex items-center gap-1 rounded-md border border-red-500/20 bg-red-500/8 px-2.5 py-1 text-[10px] text-red-400/70 hover:text-red-400 hover:bg-red-500/15 transition-all"
							>
								<Trash2 className="size-2.5" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Children (memes) — only shown when expanded */}
			{expanded && hasMemes && (
				<div className="ml-8 animate-in fade-in slide-in-from-top-2 duration-200">
					{item.memes!.map((meme, idx) => (
						<ChildNode
							key={meme.nodeId ?? idx}
							meme={meme}
							isLast={idx === item.memes!.length - 1}
							sessionId={item.sessionId}
							onDelete={() => onDeleteMeme(idx)}
						/>
					))}
				</div>
			)}
		</div>
	);
});
RootNode.displayName = 'RootNode';
