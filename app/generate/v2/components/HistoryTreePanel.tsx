'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { GenerationHistory } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { GitBranch, FolderTree, Search, Video, X } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { RootNode } from './TreeNode';

type FilterType = 'all' | 'completed' | 'pending' | 'failed';

interface HistoryTreePanelProps {
	isOpen: boolean;
	onClose: () => void;
}

// Re-export for TreeNode to use
export const getImageUrl = (item: GenerationHistory) =>
	`https://storage.googleapis.com/${item.imageBucket}/${item.imagePath}`;

export const HistoryTreePanel: React.FC<HistoryTreePanelProps> = ({ isOpen, onClose }) => {
	const history = usePopVidStore((s) => s.history);
	const setHistory = usePopVidStore((s) => s.setHistory);
	const setGenerateInput = usePopVidStore((s) => s.setGenerateInput);
	const setGenerateResult = usePopVidStore((s) => s.setGenerateResult);
	const setVideoStatus = usePopVidStore((s) => s.setVideoStatus);
	const setUploadResult = usePopVidStore((s) => s.setUploadResult);
	const generateResult = usePopVidStore((s) => s.generateResult);

	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<FilterType>('all');
	const scrollRef = useRef<HTMLDivElement>(null);

	const filtered = useMemo(() => {
		return history.filter((item) => {
			const matchesSearch = item.videoPrompt?.toLowerCase().includes(search.toLowerCase());
			const matchesFilter = filter === 'all' ? true : item.status?.toLowerCase() === filter;
			return matchesSearch && matchesFilter;
		});
	}, [history, search, filter]);

	const completed = history.filter((i) => i.status?.toLowerCase() === 'completed').length;
	const pending = history.length - completed;

	const handleLoad = (item: GenerationHistory) => {
		setGenerateInput({
			videoPrompt: item.videoPrompt,
			token: item.token,
			imageBucket: item.imageBucket,
			imagePath: item.imagePath
		});
		setGenerateResult({ sessionId: item.sessionId, status: item.status });
		setVideoStatus({ status: item.status, videoUrl: item.videoUrl });
		setUploadResult({
			bucket: item.imageBucket,
			imageUrl: getImageUrl(item),
			path: item.imagePath,
			success: !!item.status
		});
		toast.success('Session loaded into studio');
		onClose();
	};

	const handleDeleteRoot = (sessionId: string) => {
		setHistory((prev) => prev.filter((h) => h.sessionId !== sessionId));
	};

	const handleDeleteMeme = (sessionId: string, memeIdx: number) => {
		setHistory((prev) =>
			prev.map((item) =>
				item.sessionId === sessionId
					? { ...item, memes: item.memes?.filter((_, i) => i !== memeIdx) }
					: item
			)
		);
	};

	return (
		<>
			{/* Backdrop */}
			{isOpen && (
				<div
					className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
					onClick={onClose}
				/>
			)}

			{/* Panel */}
			<aside
				className={cn(
					'fixed top-0 left-0 z-40 h-full flex flex-col',
					'w-[min(380px,92vw)]',
					'bg-[#0c0c10]/95 backdrop-blur-2xl',
					'border-r border-white/8',
					'transition-transform duration-300 ease-out',
					isOpen ? 'translate-x-0' : '-translate-x-full'
				)}
			>
				{/* Ambient glow top */}
				<div className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-violet-500/8 to-transparent" />
				<div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/40 to-transparent" />

				{/* Header */}
				<div className="relative shrink-0 flex items-center gap-3 px-4 py-4 border-b border-white/8">
					<div className="flex size-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
						<FolderTree className="size-4 text-white" />
					</div>
					<div>
						<h2 className="text-sm font-bold leading-none text-white">Generation Tree</h2>
						<p className="mt-0.5 text-[10px] text-white/40 leading-none">Sessions & derived memes</p>
					</div>
					<button
						onClick={onClose}
						className="ml-auto rounded-lg p-1.5 text-white/30 hover:text-white hover:bg-white/8 transition-all"
						aria-label="Close panel"
					>
						<X className="size-4" />
					</button>
				</div>

				{/* Stats strip */}
				<div className="shrink-0 grid grid-cols-3 gap-px bg-white/5 border-b border-white/8">
					{[
						{ label: 'Total', value: history.length, color: 'text-white' },
						{ label: 'Done', value: completed, color: 'text-emerald-400' },
						{ label: 'Pending', value: pending, color: 'text-amber-400' }
					].map(({ label, value, color }) => (
						<div key={label} className="flex flex-col items-center py-3 bg-[#0c0c10]/95">
							<span className={`text-xl font-bold leading-none ${color}`}>{value}</span>
							<span className="mt-1 text-[10px] text-white/30 font-medium">{label}</span>
						</div>
					))}
				</div>

				{/* Search & filter */}
				<div className="shrink-0 px-3 pt-3 pb-2 space-y-2">
					<div className="relative">
						<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/30" />
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search prompts…"
							className="w-full rounded-xl border border-white/8 bg-white/[0.04] pl-8 pr-3 py-2 text-xs text-white/80 placeholder:text-white/25 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
						/>
						{search && (
							<button
								onClick={() => setSearch('')}
								className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/70"
							>
								<X className="size-3" />
							</button>
						)}
					</div>
					<div className="flex gap-1.5">
						{(['all', 'completed', 'pending', 'failed'] as FilterType[]).map((f) => (
							<button
								key={f}
								onClick={() => setFilter(f)}
								className={cn(
									'rounded-lg px-2.5 py-1 text-[10px] font-semibold capitalize transition-all border',
									filter === f
										? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
										: 'bg-white/[0.03] border-white/8 text-white/40 hover:text-white/70 hover:bg-white/[0.06]'
								)}
							>
								{f}
							</button>
						))}
					</div>
				</div>

				{/* Legend */}
				<div className="shrink-0 px-3 pb-2">
					<div className="flex items-center gap-3 rounded-xl border border-white/6 bg-white/[0.02] px-3 py-2">
						<div className="flex items-center gap-1.5 text-[10px] text-white/30">
							<div className="size-2.5 rounded-full bg-violet-400/80 ring-2 ring-violet-500/20" />
							<span>Session</span>
						</div>
						<div className="h-3 w-px bg-white/10" />
						<div className="flex items-center gap-1.5 text-[10px] text-white/30">
							<div className="size-2 rounded-full bg-violet-400/50 ring-1 ring-violet-500/15" />
							<span>Meme</span>
						</div>
						<div className="h-3 w-px bg-white/10" />
						<div className="flex items-center gap-1.5 text-[10px] text-white/30">
							<GitBranch className="size-2.5 text-violet-400/50" />
							<span>Expand node</span>
						</div>
					</div>
				</div>

				{/* Tree scroll area */}
				<div
					ref={scrollRef}
					className="flex-1 overflow-y-auto overflow-x-hidden px-3 pb-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
				>
					{filtered.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-20 text-center gap-3">
							<div className="flex size-14 items-center justify-center rounded-2xl bg-white/4 border border-white/8">
								<Video className="size-6 text-white/20" />
							</div>
							<div>
								<p className="text-sm font-medium text-white/40">No sessions found</p>
								<p className="text-xs text-white/20 mt-1">Generate a video to see it here</p>
							</div>
						</div>
					) : (
						<div className="relative pt-2">
							{/* Root spine */}
							<div className="absolute left-4 top-4 bottom-4 w-px bg-gradient-to-b from-violet-500/20 via-violet-500/10 to-transparent pointer-events-none" />

							{filtered.map((item, idx) => (
								<RootNode
									key={item.sessionId ?? idx}
									item={item}
									isActive={generateResult?.sessionId === item.sessionId}
									isLast={idx === filtered.length - 1}
									onLoad={handleLoad}
									onDelete={() => handleDeleteRoot(item.sessionId)}
									onDeleteMeme={(memeIdx) => handleDeleteMeme(item.sessionId, memeIdx)}
								/>
							))}
						</div>
					)}
				</div>

				{/* Footer glow */}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0c0c10] to-transparent" />
			</aside>
		</>
	);
};
