'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { GenerationHistory, MemeStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { ArrowLeft, Film, FolderTree, GitBranch, Hash, Plus, Search, Server, Sparkles, Video, X } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState } from 'react';
import { CustomRoot } from './CustomRoot';
import { CustomSessionDetail } from './CustomSessionDetail';
import { SessionDetail } from './SessionDetail';
import { TreeRoot } from './TreeRoot';

// ─── Types ────────────────────────────────────────────────────────────────────

type FilterType = 'all' | 'completed' | 'pending' | 'failed';
type RightPanelMode = 'session' | 'custom' | 'none';

const STATUS_COLORS: Record<string, { pill: string; dot: string }> = {
	completed: { pill: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400' },
	processing: { pill: 'bg-sky-500/15 text-sky-400 border-sky-500/30', dot: 'bg-sky-400 animate-pulse' },
	pending: { pill: 'bg-amber-500/15 text-amber-400 border-amber-500/30', dot: 'bg-amber-400 animate-pulse' },
	failed: { pill: 'bg-red-500/15 text-red-400 border-red-500/30', dot: 'bg-red-400' }
};

export const sc = (s?: string) => STATUS_COLORS[(s ?? 'pending').toLowerCase()] ?? STATUS_COLORS.pending;
export const getImageUrl = (item: GenerationHistory) => `https://storage.googleapis.com/${item.imageBucket}/${item.imagePath}`;

export const HistoryTreePage: React.FC = () => {
	const history = usePopVidStore((s) => s.history);
	const setHistory = usePopVidStore((s) => s.setHistory);
	const customMemes = usePopVidStore((s) => s.customMemes);
	const setCustomMemes = usePopVidStore((s) => s.setCustomMemes);
	const searchParams = useSearchParams();

	const [search, setSearch] = useState('');
	const [filter, setFilter] = useState<FilterType>('all');

	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(() => searchParams?.get('sessionId') || null);
	const [selectedMemeIdx, setSelectedMemeIdx] = useState<number | null>(null);
	const [selectedCustomId, setSelectedCustomId] = useState<string | null>(() => searchParams?.get('sessionId') || null);
	const [panelMode, setPanelMode] = useState<RightPanelMode>(() =>
		searchParams?.get('panel') === 'custom' ? 'custom' : searchParams?.get('panel') === 'session' ? 'session' : 'none'
	);
	const router = useRouter();
	const [mobileView, setMobileView] = useState<'tree' | 'detail'>('tree');
	const [customIdInput, setCustomIdInput] = useState('');
	const [showCustomInput, setShowCustomInput] = useState(false);

	const filtered = useMemo(
		() =>
			history.filter((item) => {
				const matchSearch = item.videoPrompt?.toLowerCase().includes(search.toLowerCase());
				const matchFilter = filter === 'all' ? true : item.status?.toLowerCase() === filter;
				return matchSearch && matchFilter;
			}),
		[history, search, filter]
	);

	const customGroups = useMemo(() => {
		const map = new Map<string, MemeStatus[]>();
		for (const m of customMemes) {
			const arr = map.get(m.memeId) ?? [];
			arr.push(m);
			map.set(m.memeId, arr);
		}
		return Array.from(map.entries());
	}, [customMemes]);

	const selectedSession = useMemo(() => history.find((h) => h.sessionId === selectedSessionId) ?? null, [history, selectedSessionId]);
	const completed = history.filter((i) => i.status?.toLowerCase() === 'completed').length;
	const totalMemes = history.reduce((acc, i) => acc + (i.memes?.length ?? 0), 0) + customMemes.length;

	const handleSelectSession = (item: GenerationHistory) => {
		setSelectedSessionId(item.sessionId);
		setSelectedCustomId(null);
		setSelectedMemeIdx(null);
		setPanelMode('session');
		setMobileView('detail');
		const params = new URLSearchParams(searchParams.toString());
		params.set('sessionId', item.sessionId);
		params.set('panel', 'session');
		router.replace(`/generate/v2/history?${params.toString()}`);
	};

	const handleSelectCustom = (id: string) => {
		setSelectedCustomId(id);
		setSelectedSessionId(null);
		setSelectedMemeIdx(null);
		setPanelMode('custom');
		setMobileView('detail');

		const params = new URLSearchParams(searchParams.toString());
		params.set('sessionId', id);
		params.set('panel', 'custom');
		router.replace(`/generate/v2/history?${params.toString()}`);
	};

	const handleOpenCustomInput = () => {
		const id = customIdInput.trim();
		if (!id) return;
		handleSelectCustom(id);
		setShowCustomInput(false);
		setCustomIdInput('');
		setCustomMemes((prev) =>
			prev.some((m) => m.memeId === id)
				? prev
				: [
						{
							memeId: id,
							nodeId: id,
							prompt: 'Custom session',
							status: 'enhanced_completed',
							videoUrl: `https://cdn.popvid.ai/${id}/animationPro_${id}.mp4`
						},
						...prev
					]
		);
	};

	const handleDeleteCustomSession = (sessionId: string) => {
		setCustomMemes((prev) => prev.filter((m) => m.memeId !== sessionId));
		if (selectedCustomId === sessionId) setPanelMode('none');
	};

	const handleDeleteCustomMeme = (nodeId: string) => {
		setCustomMemes((prev) => prev.filter((m) => m.nodeId !== nodeId));
	};

	return (
		<div className="flex flex-col h-full bg-[#080810] text-white overflow-hidden">
			<div className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute -top-40 -left-20 size-96 rounded-full bg-violet-600/6 blur-3xl" />
				<div className="absolute top-1/2 -right-20 size-80 rounded-full bg-indigo-600/5 blur-3xl" />
			</div>

			<header className="relative shrink-0 flex items-center gap-4 border-b border-white/8 px-4 py-3 sm:px-6">
				<div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />
				<Link
					href="/generate/v2"
					className="flex items-center gap-1.5 rounded-xl border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/[0.07] transition-all"
				>
					<ArrowLeft className="size-3.5" /> Studio
				</Link>

				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
						<FolderTree className="size-4 text-white" />
					</div>
					<div>
						<h1 className="text-sm font-bold leading-none">Generation Tree</h1>
						<p className="text-[10px] text-white/40 mt-0.5 leading-none">Sessions &amp; derived memes</p>
					</div>
				</div>

				<div className="ml-auto hidden sm:flex items-center gap-2">
					{[
						{ label: 'Sessions', value: history.length, color: 'text-white/80' },
						{ label: 'Done', value: completed, color: 'text-emerald-400' },
						{ label: 'Memes', value: totalMemes, color: 'text-violet-400' }
					].map(({ label, value, color }) => (
						<div
							key={label}
							className="flex flex-col items-center rounded-xl border border-white/8 bg-white/3 px-3 py-1.5 min-w-14"
						>
							<span className={`text-sm font-bold leading-none ${color}`}>{value}</span>
							<span className="text-[9px] text-white/30 mt-0.5">{label}</span>
						</div>
					))}
				</div>
			</header>

			<div className="relative flex flex-1 min-h-0 overflow-hidden">
				<aside
					className={cn(
						'flex flex-col border-r border-white/8 overflow-hidden',
						'w-full',
						mobileView === 'tree' ? 'flex' : 'hidden',
						'lg:flex lg:w-72 xl:w-80 lg:shrink-0'
					)}
				>
					<div className="shrink-0 p-3 border-b border-white/8 space-y-2">
						<div className="relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/25" />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder="Search prompts…"
								className="w-full rounded-xl border border-white/8 bg-white/3 pl-8 pr-8 py-2 text-xs text-white/70 placeholder:text-white/20 outline-none focus:border-violet-500/40 focus:ring-1 focus:ring-violet-500/15 transition-all"
							/>
							{search && (
								<button
									onClick={() => setSearch('')}
									className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60"
								>
									<X className="size-3" />
								</button>
							)}
						</div>
						<div className="flex gap-1">
							{(['all', 'completed', 'pending', 'failed'] as FilterType[]).map((f) => (
								<button
									key={f}
									onClick={() => setFilter(f)}
									className={cn(
										'flex-1 rounded-lg px-1.5 py-1 text-[10px] font-semibold capitalize transition-all border',
										filter === f
											? 'bg-violet-500/20 border-violet-500/40 text-violet-300'
											: 'bg-white/3 border-white/6 text-white/35 hover:text-white/60 hover:bg-white/5'
									)}
								>
									{f}
								</button>
							))}
						</div>
					</div>

					<div className="shrink-0 px-3 py-2 border-b border-white/6">
						<div className="flex items-center gap-3 text-[10px] text-white/25">
							<div className="flex items-center gap-1.5">
								<div className="size-2.5 rounded-full bg-violet-400/70 ring-2 ring-violet-500/20" /> Session
							</div>
							<div className="h-2.5 w-px bg-white/10" />
							<div className="flex items-center gap-1.5">
								<div className="size-1.5 rounded-full bg-violet-400/40 ring-1 ring-violet-500/15" /> Meme
							</div>
							<div className="h-2.5 w-px bg-white/10" />
							<div className="flex items-center gap-1.5">
								<div className="size-2.5 rounded-full bg-sky-400/60 ring-2 ring-sky-500/15" /> Server
							</div>
							<div className="h-2.5 w-px bg-white/10" />
							<GitBranch className="size-2.5 text-violet-400/40" /> Expand
						</div>
					</div>

					<div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
						{filtered.length > 0 && (
							<div>
								<p className="text-[9px] font-bold uppercase tracking-widest text-white/20 px-1 mb-2">History Sessions</p>
								<div className="relative">
									<div className="absolute left-4 top-2 bottom-2 w-px bg-linear-to-b from-violet-500/20 via-violet-500/10 to-transparent pointer-events-none" />
									{filtered.map((item, idx) => (
										<TreeRoot
											key={item.sessionId ?? idx}
											item={item}
											isLast={idx === filtered.length - 1}
											isActive={selectedSessionId === item.sessionId}
											expandedMemeIdx={selectedSessionId === item.sessionId ? selectedMemeIdx : null}
											onSelectSession={() => {
												handleSelectSession(item);
											}}
											onSelectMeme={(memeIdx) => setSelectedMemeIdx(memeIdx)}
											onDelete={() => {
												setHistory((prev) => prev.filter((h) => h.sessionId !== item.sessionId));
												if (selectedSessionId === item.sessionId) setPanelMode('none');
											}}
										/>
									))}
								</div>
							</div>
						)}

						{filtered.length === 0 && customGroups.length === 0 && (
							<div className="flex flex-col items-center justify-center py-12 text-center gap-3">
								<div className="flex size-12 items-center justify-center rounded-2xl bg-white/3 border border-white/8">
									<Video className="size-5 text-white/15" />
								</div>
								<p className="text-xs text-white/30">No sessions found</p>
								<Link
									href="/generate/v2"
									className="text-xs text-violet-400 hover:text-violet-300 underline underline-offset-2 transition-colors"
								>
									Generate a video →
								</Link>
							</div>
						)}

						{customGroups.length > 0 && (
							<div>
								<p className="text-[9px] font-bold uppercase tracking-widest text-white/20 px-1 mb-2">Server Sessions</p>
								<div className="relative">
									<div className="absolute left-4 top-2 bottom-2 w-px bg-linear-to-b from-sky-500/15 via-sky-500/8 to-transparent pointer-events-none" />
									{customGroups.map(([sid, memes]) => (
										<CustomRoot
											key={sid}
											sessionId={sid}
											memes={memes}
											isActive={selectedCustomId === sid}
											onSelect={() => handleSelectCustom(sid)}
											onDeleteSession={() => handleDeleteCustomSession(sid)}
											onDeleteMeme={handleDeleteCustomMeme}
										/>
									))}
								</div>
							</div>
						)}
					</div>

					<div className="shrink-0 border-t border-white/8 p-3">
						{showCustomInput ? (
							<div className="space-y-2">
								<div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-sky-400/70 mb-1">
									<Server className="size-3" /> Enter PopVid Server Video ID
								</div>
								<div className="relative">
									<Hash className="absolute left-3 top-1/2 -translate-y-1/2 size-3 text-white/25" />
									<input
										value={customIdInput}
										onChange={(e) => setCustomIdInput(e.target.value)}
										onKeyDown={(e) => e.key === 'Enter' && handleOpenCustomInput()}
										placeholder="e.g. abc123 or ugc_video_xyz"
										autoFocus
										className="w-full rounded-xl border border-sky-500/30 bg-sky-500/5 pl-8 pr-3 py-2 text-xs text-white/70 placeholder:text-white/20 outline-none focus:border-sky-500/60 focus:ring-1 focus:ring-sky-500/20 transition-all font-mono"
									/>
								</div>
								<div className="flex gap-2">
									<button
										onClick={handleOpenCustomInput}
										disabled={!customIdInput.trim()}
										className="flex-1 rounded-xl bg-sky-500/15 border border-sky-500/30 py-1.5 text-xs font-semibold text-sky-400 hover:bg-sky-500/25 transition-all disabled:opacity-40"
									>
										Open Session
									</button>
									<button
										onClick={() => {
											setShowCustomInput(false);
											setCustomIdInput('');
										}}
										className="rounded-xl border border-white/8 bg-white/3 px-3 py-1.5 text-xs text-white/40 hover:text-white hover:bg-white/[0.07] transition-all"
									>
										Cancel
									</button>
								</div>
							</div>
						) : (
							<button
								onClick={() => setShowCustomInput(true)}
								className="w-full flex items-center justify-center gap-2 rounded-xl border border-dashed border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 hover:border-sky-500/50 py-2.5 text-xs font-semibold text-sky-400/70 hover:text-sky-300 transition-all"
							>
								<Plus className="size-3.5" />
								Open Custom Server Session
							</button>
						)}
					</div>
				</aside>

				<div className="hidden lg:block relative shrink-0 w-px bg-white/8">
					<div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-violet-500/20 to-transparent" />
				</div>

				<main className={cn('flex flex-col overflow-hidden flex-1', mobileView === 'detail' ? 'flex' : 'hidden', 'lg:flex')}>
					<div
						className={cn(
							'lg:hidden shrink-0 flex items-center gap-3 border-b border-white/8 px-4 py-2.5',
							panelMode === 'none' && 'hidden'
						)}
					>
						<button
							onClick={() => setMobileView('tree')}
							className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/3 px-2.5 py-1.5 text-xs text-white/50 hover:text-white hover:bg-white/[0.07] transition-all"
						>
							<ArrowLeft className="size-3.5" /> Back to Tree
						</button>
						<span className="text-xs text-white/30 truncate">
							{panelMode === 'session' && selectedSession?.videoPrompt?.slice(0, 40)}
							{panelMode === 'custom' && selectedCustomId?.slice(0, 30)}
						</span>
					</div>
					{panelMode === 'session' && selectedSession ? (
						<SessionDetail session={selectedSession} />
					) : panelMode === 'custom' && selectedCustomId ? (
						<CustomSessionDetail sessionId={selectedCustomId} />
					) : (
						<div className="flex flex-col items-center justify-center h-full text-center gap-6 px-8">
							<div className="relative">
								<div className="flex size-20 items-center justify-center rounded-3xl bg-linear-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20">
									<FolderTree className="size-9 text-violet-400/50" />
								</div>
								<div className="absolute -bottom-1 -right-1 flex size-7 items-center justify-center rounded-xl bg-linear-to-br from-violet-500/20 to-indigo-500/20 border border-violet-500/25">
									<Sparkles className="size-3.5 text-violet-400/70" />
								</div>
							</div>
							<div>
								<p className="text-base font-bold text-white/50 mb-2">Select a session</p>
								<p className="text-sm text-white/25 max-w-xs leading-relaxed">
									Pick a history session from the tree, or use{' '}
									<button
										onClick={() => setShowCustomInput(true)}
										className="text-sky-400 hover:text-sky-300 underline underline-offset-2 transition-colors"
									>
										Open Custom Server Session
									</button>{' '}
									to create memes from any PopVid video ID
								</p>
							</div>
							{history.length === 0 && customGroups.length === 0 && (
								<Link
									href="/generate/v2"
									className="flex items-center gap-2 rounded-xl border border-violet-500/30 bg-violet-500/10 px-5 py-2.5 text-sm font-semibold text-violet-300 hover:bg-violet-500/15 transition-all"
								>
									<Film className="size-4" /> Go to Studio
								</Link>
							)}
						</div>
					)}
				</main>
			</div>
		</div>
	);
};
