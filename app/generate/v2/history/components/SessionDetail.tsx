'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { GenerationHistory, MemeStatus } from '@/lib/contracts';
import { Clapperboard, Clock, Copy, Download, ExternalLink, Loader2, RefreshCw, Sparkles, Trash2, Video } from 'lucide-react';
import Image from 'next/image';
import { memo, useMemo, useState } from 'react';
import { toast } from 'sonner';

const STATUS_COLORS: Record<string, { pill: string; dot: string; ring: string }> = {
	completed: { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', ring: 'ring-emerald-500/20' },
	processing: { pill: 'bg-sky-500/15 text-sky-400 border-sky-500/30', dot: 'bg-sky-400 animate-pulse', ring: 'ring-sky-500/20' },
	pending: { pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400 animate-pulse', ring: 'ring-amber-500/20' },
	failed: { pill: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400', ring: 'ring-red-500/20' }
};

const sc = (s?: string) => STATUS_COLORS[(s ?? 'pending').toLowerCase()] ?? STATUS_COLORS.pending;

const getImageUrl = (item: GenerationHistory) => `https://storage.googleapis.com/${item.imageBucket}/${item.imagePath}`;

const getTwistId = (url?: string) => url?.match(/\/twist_([^/]+)\.mp4$/i)?.[1];

interface MemeCardProps {
	meme: MemeStatus;
	idx: number;
	total: number;
	sessionId: string;
	isCustom: boolean;
	onDelete: () => void;
	onRefresh: () => void;
}

const MemeCard: React.FC<MemeCardProps> = memo(({ meme, idx, total, onDelete, onRefresh }) => {
	const colors = sc(meme.status);
	return (
		<div className="relative rounded-2xl border border-white/8 bg-white/2.5 overflow-hidden group">
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

			{/* Header */}
			<div className="flex items-start justify-between gap-3 px-4 py-3 border-b border-white/6">
				<div className="min-w-0">
					<div className="flex items-center gap-2 mb-0.5">
						<Clapperboard className="size-3.5 text-violet-400/70 shrink-0" />
						<span className="text-xs font-bold text-white/80">Meme #{total - idx}</span>
						<span
							className={`inline-flex items-center gap-1 rounded-full border px-2 py-px text-[10px] font-semibold capitalize ${colors.pill}`}
						>
							<span className={`size-1.5 rounded-full ${colors.dot}`} />
							{meme.status ?? 'pending'}
						</span>
					</div>
					<p className="text-[11px] text-white/40 font-mono truncate">node: {meme.nodeId ?? '—'}</p>
				</div>
				<div className="flex items-center gap-1.5 shrink-0">
					<button
						onClick={onRefresh}
						className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/4 px-2 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/8 transition-all"
					>
						<RefreshCw className="size-3" />
						Refresh
					</button>
					<button
						onClick={onDelete}
						className="rounded-lg border border-red-500/20 bg-red-500/8 p-1.5 text-red-400/60 hover:text-red-400 hover:bg-red-500/15 transition-all"
					>
						<Trash2 className="size-3" />
					</button>
				</div>
			</div>

			{/* Prompt */}
			{meme.prompt && (
				<div className="px-4 pt-3 pb-2">
					<p className="text-xs text-white/60 leading-relaxed line-clamp-3">{meme.prompt}</p>
				</div>
			)}

			{/* Video previews */}
			{(meme.videoUrl || meme.highResUrl) && (
				<div className="px-4 pb-3 grid grid-cols-2 gap-3">
					{meme.videoUrl && (
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-1.5">Low Res</p>
							<div className="rounded-xl overflow-hidden border border-white/8 bg-black">
								<video src={meme.videoUrl} controls preload="metadata" className="w-full aspect-video object-contain" />
							</div>
							<div className="flex gap-1.5 mt-1.5">
								<a
									href={meme.videoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/8 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
								>
									<ExternalLink className="size-2.5" /> View
								</a>
								<a
									href={meme.videoUrl}
									download
									className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/8 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
								>
									<Download className="size-2.5" /> Save
								</a>
							</div>
						</div>
					)}
					{meme.highResUrl && (
						<div>
							<p className="text-[10px] font-semibold uppercase tracking-wider text-white/25 mb-1.5">High Res</p>
							<div className="rounded-xl overflow-hidden border border-white/8 bg-black">
								<video src={meme.highResUrl} controls preload="metadata" className="w-full aspect-video object-contain" />
							</div>
							<div className="flex gap-1.5 mt-1.5">
								<a
									href={meme.highResUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/8 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
								>
									<ExternalLink className="size-2.5" /> View
								</a>
								<a
									href={meme.highResUrl}
									download
									className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/8 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/5 transition-all"
								>
									<Download className="size-2.5" /> Save
								</a>
							</div>
						</div>
					)}
				</div>
			)}

			{!meme.videoUrl && !meme.highResUrl && (
				<div className="flex flex-col items-center gap-2 py-6 text-white/20">
					<Loader2 className="size-5 animate-spin" />
					<p className="text-[11px]">Generating meme…</p>
				</div>
			)}
		</div>
	);
});
MemeCard.displayName = 'MemeCard';

interface SessionDetailProps {
	session: GenerationHistory;
}

export const SessionDetail: React.FC<SessionDetailProps> = memo(({ session }) => {
	const { makeMeme, getMEMEStatus, loading } = usePopVid();
	const setHistory = usePopVidStore((s) => s.setHistory);
	const setCustomMemes = usePopVidStore((s) => s.setCustomMemes);
	const customMemes = usePopVidStore((s) => s.customMemes);

	const [prompt, setPrompt] = useState('**Camera fixed on the full-body view**');
	const [selectedSourceId, setSelectedSourceId] = useState('');

	const isCustom = !session.sessionId?.includes('ugc_video_');
	const colors = sc(session.status);

	const memes = useMemo(() => {
		return isCustom ? customMemes.filter((meme) => meme.memeId === session.sessionId) || [] : session.memes || [];
	}, [customMemes, isCustom, session.memes, session.sessionId]);

	const sources = useMemo(() => {
		const rootId = session.sessionId?.replace(/^ugc_video_/, '');
		return [
			{ id: rootId, label: 'Original Video', nodeId: undefined as string | undefined },
			...memes.map((m, i) => ({
				id: (getTwistId(m.videoUrl) ?? m.nodeId) as string,
				label: `Meme #${i + 1}${m.videoUrl ? '' : ' (pending)'}`,
				nodeId: m.nodeId
			}))
		].filter((s) => !!s.id);
	}, [memes, session.sessionId]);

	const defaultSourceId = useMemo(() => {
		const latest = [...memes].reverse().find((m) => m.videoUrl || m.nodeId);
		if (latest) return getTwistId(latest.videoUrl) ?? latest.nodeId;
		return sources[0]?.id;
	}, [memes, sources]);

	const currentSourceId = defaultSourceId || selectedSourceId || '';
	const memeSessionId = session.sessionId;

	const handleMakeMeme = () => {
		makeMeme(prompt, currentSourceId, memeSessionId, isCustom);
	};

	const handleDeleteMeme = (nodeId: string) => {
		if (isCustom) {
			setCustomMemes((prev) => prev.filter((m) => m.nodeId !== nodeId));
		} else {
			setHistory((prev) =>
				prev.map((item) =>
					item.sessionId === session.sessionId ? { ...item, memes: item.memes?.filter((m) => m.nodeId !== nodeId) } : item
				)
			);
		}
	};

	const handleRefreshMeme = (meme: MemeStatus) => {
		getMEMEStatus(meme.memeId, meme.nodeId, isCustom);
	};

	return (
		<div className="flex flex-col overflow-y-scroll">
			{/* Session header */}
			<div className="shrink-0 px-6 py-5 border-b border-white/8">
				<div className="flex items-start gap-4">
					{/* Thumbnail */}
					<div className="relative shrink-0 size-20 rounded-xl overflow-hidden border border-white/10 bg-black/40">
						<Image src={getImageUrl(session)} alt="Source" fill className="object-cover" sizes="80px" />
					</div>

					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2 mb-2">
							<span
								className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${colors.pill}`}
							>
								<span className={`size-1.5 rounded-full ${colors.dot}`} />
								{session.status ?? 'pending'}
							</span>
							{memes.length > 0 && (
								<span className="inline-flex items-center gap-1 rounded-full border border-violet-500/30 bg-violet-500/10 px-2.5 py-0.5 text-xs font-semibold text-violet-400">
									<Sparkles className="size-3" />
									{memes.length} meme{memes.length !== 1 ? 's' : ''}
								</span>
							)}
						</div>
						<p className="text-sm font-medium text-white/80 leading-relaxed mb-2 line-clamp-3">{session.videoPrompt}</p>
						<div className="flex items-center gap-1.5 text-[11px] font-mono text-white/25">
							<Clock className="size-3" />
							<span className="truncate">{session.sessionId}</span>
							<button
								onClick={() => navigator.clipboard.writeText(session.sessionId).then(() => toast.success('Copied!'))}
								className="ml-1 text-white/20 hover:text-violet-400 transition-colors"
							>
								<Copy className="size-3" />
							</button>
						</div>
					</div>
				</div>
			</div>

			{/* Session video */}
			{session.videoUrl && (
				<div className="shrink-0 px-6 py-4 border-b border-white/8">
					<div className="flex items-center gap-2 mb-3">
						<Video className="size-3.5 text-white/40" />
						<span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Generated Video</span>
						<div className="ml-auto flex gap-2">
							<a
								href={session.videoUrl}
								target="_blank"
								rel="noopener noreferrer"
								className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/3 px-2.5 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all"
							>
								<ExternalLink className="size-3" /> View
							</a>
							<a
								href={session.videoUrl}
								download
								className="flex items-center gap-1 rounded-lg border border-white/8 bg-white/3 px-2.5 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all"
							>
								<Download className="size-3" /> Save
							</a>
						</div>
					</div>
					<div className="rounded-xl overflow-hidden border border-white/8 bg-black">
						<video src={session.videoUrl} controls preload="metadata" className="w-full aspect-video object-contain" />
					</div>
				</div>
			)}

			{/* ─── Make Meme Section ─────────────────────────────────────────── */}
			<div className="shrink-0 px-6 py-4 border-b border-white/8">
				<div className="flex items-center gap-2 mb-4">
					<div className="flex size-6 items-center justify-center rounded-md bg-violet-500/15">
						<Clapperboard className="size-3.5 text-violet-400" />
					</div>
					<span className="text-sm font-bold text-white/80">Create Meme</span>
				</div>

				<div className="space-y-3">
					{/* Source selector */}
					<div>
						<label className="text-[11px] font-semibold uppercase tracking-wider text-white/35 mb-1.5 block">
							Source Video
						</label>
						<select
							value={currentSourceId}
							onChange={(e) => setSelectedSourceId(e.target.value)}
							className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white/70 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all appearance-none cursor-pointer"
						>
							{sources.map((src) => (
								<option key={src.id} value={src.id} className="bg-[#0c0c10]">
									{src.label}
								</option>
							))}
						</select>
						{/* API call preview */}
						<div className="mt-2 rounded-lg border border-white/6 bg-white/15 px-3 py-2 space-y-1">
							<div className="flex items-start gap-2">
								<span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-violet-400/60 w-24">
									nodeOrSessionId
								</span>
								<span className="text-[10px] font-mono text-white/40 break-all">{currentSourceId || '—'}</span>
							</div>
							<div className="flex items-start gap-2">
								<span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-emerald-400/60 w-24">
									sessionId
								</span>
								<span className="text-[10px] font-mono text-white/40 break-all">{memeSessionId}</span>
							</div>
							<p className="text-[9px] text-white/20 pt-0.5">
								nodeId &amp; memeId are returned/set by the API after creation
							</p>
						</div>
					</div>

					{/* Prompt */}
					<div>
						<label className="text-[11px] font-semibold uppercase tracking-wider text-white/35 mb-1.5 block">Meme Prompt</label>
						<textarea
							value={prompt}
							onChange={(e) => setPrompt(e.target.value)}
							rows={3}
							placeholder="**Camera fixed on the full-body view**"
							className="w-full rounded-xl border border-white/8 bg-white/3 px-3 py-2.5 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-y leading-relaxed"
						/>
					</div>

					{/* Generate button */}
					<button
						onClick={handleMakeMeme}
						disabled={!prompt.trim() || loading || !currentSourceId}
						className="relative w-full h-11 rounded-xl font-semibold text-sm text-white overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
					>
						<div className="absolute inset-0 bg-linear-to-r from-violet-600 to-indigo-600 group-hover:from-violet-700 group-hover:to-indigo-700 transition-all" />
						<div className="absolute inset-0 bg-linear-to-t from-black/20 to-transparent" />
						<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/25 to-transparent" />
						<span className="relative flex items-center justify-center gap-2">
							{loading ? (
								<>
									<Loader2 className="size-4 animate-spin" /> Creating meme…
								</>
							) : (
								<>
									<Sparkles className="size-4" /> Create Meme from{' '}
									{sources.find((s) => s.id === currentSourceId)?.label ?? 'Source'}
								</>
							)}
						</span>
					</button>
				</div>
			</div>

			{/* ─── Memes List ────────────────────────────────────────────────── */}
			<div className="shrink-0 min-h-0 overflow-y-auto px-6 py-4">
				{memes.length === 0 ? (
					<div className="flex flex-col items-center justify-center py-12 text-center gap-3">
						<div className="flex size-12 items-center justify-center rounded-2xl bg-white/3 border border-white/8">
							<Sparkles className="size-5 text-white/15" />
						</div>
						<p className="text-sm text-white/30">No memes yet</p>
						<p className="text-xs text-white/15">Use the form above to create one</p>
					</div>
				) : (
					<div className="space-y-4">
						<div className="flex items-center gap-2 mb-3">
							<Sparkles className="size-3.5 text-violet-400/70" />
							<span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">
								Generated Memes ({memes.length})
							</span>
						</div>
						{[...memes].reverse().map((meme, idx) => (
							<MemeCard
								key={meme.nodeId ?? idx}
								meme={meme}
								idx={idx}
								total={memes.length}
								sessionId={session.sessionId}
								isCustom={isCustom}
								onDelete={() => handleDeleteMeme(meme.nodeId)}
								onRefresh={() => handleRefreshMeme(meme)}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
});
SessionDetail.displayName = 'SessionDetail';
