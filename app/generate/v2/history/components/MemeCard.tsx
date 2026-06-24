import { MemeStatus } from '@/lib/contracts';
import { Clapperboard, Download, ExternalLink, Loader2, RefreshCw, Trash2 } from 'lucide-react';
import { memo } from 'react';
import { sc } from './HistoryTreePage';

interface MemeCardProps {
	meme: MemeStatus;
	idx: number;
	total: number;
	sessionId: string;
	isCustom: boolean;
	onDelete: () => void;
	onRefresh: () => void;
}

export const MemeCard: React.FC<MemeCardProps> = memo(({ meme, idx, total, onDelete, onRefresh }) => {
	const colors = sc(meme.status);
	return (
		<div className="relative rounded-2xl border border-white/8 bg-white/2.5 overflow-hidden group">
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />

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

			{meme.prompt && (
				<div className="px-4 pt-3 pb-2">
					<p className="text-xs text-white/60 leading-relaxed line-clamp-3">{meme.prompt}</p>
				</div>
			)}

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
