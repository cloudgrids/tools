import { GenerationHistory } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Sparkles, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { getImageUrl, sc } from './HistoryTreePage';
import { TreeLeaf } from './TreeLeaf';

interface TreeRootProps {
	item: GenerationHistory;
	isLast: boolean;
	isActive: boolean;
	expandedMemeIdx: number | null;
	onSelectSession: () => void;
	onSelectMeme: (idx: number) => void;
	onDelete: () => void;
}

export const TreeRoot: React.FC<TreeRootProps> = ({ item, isLast, isActive, expandedMemeIdx, onSelectSession, onSelectMeme, onDelete }) => {
	const [expanded, setExpanded] = useState<boolean>(false);
	const hasMemes = (item.memes?.length ?? 0) > 0;
	const colors = sc(item.status);

	return (
		<div className="relative">
			{!isLast && (
				<div className="absolute left-4 w-px bg-linear-to-b from-violet-500/20 to-violet-500/5" style={{ top: 48, bottom: -4 }} />
			)}
			<button
				onClick={onSelectSession}
				className={cn(
					'relative w-full text-left rounded-2xl border overflow-hidden mb-1 transition-all duration-200 group',
					isActive
						? 'border-violet-500/50 bg-violet-500/8 shadow-lg shadow-violet-500/10'
						: 'border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/12'
				)}
			>
				{isActive && (
					<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-violet-400/60 to-transparent" />
				)}
				<div className="flex items-center gap-3 px-3 py-2.5">
					<div
						className={cn(
							'relative shrink-0 size-3 rounded-full ring-2 mt-0.5',
							isActive ? 'bg-violet-400 ring-violet-500/40' : 'bg-violet-500/40 ring-violet-500/10'
						)}
					/>
					<div className="relative shrink-0 size-10 rounded-lg overflow-hidden border border-white/10 bg-black/40">
						<Image src={getImageUrl(item)} alt="Source" fill className="object-cover" sizes="40px" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-xs font-medium text-white/75 line-clamp-1 leading-snug">{item.videoPrompt}</p>
						<div className="flex items-center gap-1.5 mt-1">
							<span
								className={cn(
									'inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-semibold capitalize',
									colors.pill
								)}
							>
								<span className={cn('size-1 rounded-full', colors.dot)} />
								{item.status ?? 'pending'}
							</span>
							{hasMemes && (
								<span className="inline-flex items-center gap-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-1.5 py-px text-[9px] font-semibold text-violet-400">
									<Sparkles className="size-2" />
									{item.memes!.length}
								</span>
							)}
						</div>
					</div>
					<div className="flex items-center gap-1 shrink-0">
						{hasMemes && (
							<div
								onClick={(e) => {
									e.stopPropagation();
									setExpanded((p) => !p);
								}}
								className="p-1 rounded-md text-white/25 hover:text-white/70 hover:bg-white/8 transition-all"
							>
								{expanded ? <ChevronDown className="size-3.5" /> : <ChevronRight className="size-3.5" />}
							</div>
						)}
						<div
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							className="p-1 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/8 transition-all"
						>
							<Trash2 className="size-3" />
						</div>
					</div>
				</div>
			</button>

			{expanded && hasMemes && (
				<div className="mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
					{item.memes!.map((meme, idx) => (
						<TreeLeaf
							key={meme.nodeId ?? idx}
							label={meme.prompt?.slice(0, 40) || `Meme #${idx + 1}`}
							status={meme.status}
							isLast={idx === item.memes!.length - 1}
							isSelected={expandedMemeIdx === idx && isActive}
							onClick={() => {
								onSelectSession();
								onSelectMeme(idx);
							}}
						/>
					))}
				</div>
			)}
		</div>
	);
};
