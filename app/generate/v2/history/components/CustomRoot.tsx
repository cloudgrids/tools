import { MemeStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, Clapperboard, Server, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { CustomLeaf } from './CustomLeaf';

interface CustomRootProps {
	sessionId: string;
	memes: MemeStatus[];
	isActive: boolean;
	onSelect: () => void;
	onDeleteSession: () => void;
	onDeleteMeme: (nodeId: string) => void;
}

export const CustomRoot: React.FC<CustomRootProps> = ({ sessionId, memes, isActive, onSelect, onDeleteSession, onDeleteMeme }) => {
	const [expanded, setExpanded] = useState<boolean>(false);
	return (
		<div className="relative">
			<button
				onClick={onSelect}
				className={cn(
					'relative w-full text-left rounded-2xl border overflow-hidden mb-1 transition-all duration-200',
					isActive
						? 'border-sky-500/40 bg-sky-500/8 shadow-lg shadow-sky-500/8'
						: 'border-white/8 bg-white/3 hover:bg-white/5 hover:border-white/10'
				)}
			>
				{isActive && (
					<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-sky-400/50 to-transparent" />
				)}
				<div className="flex items-center gap-3 px-3 py-2.5">
					<div
						className={cn(
							'shrink-0 size-3 rounded-full ring-2 mt-0.5',
							isActive ? 'bg-sky-400 ring-sky-500/40' : 'bg-sky-500/40 ring-sky-500/10'
						)}
					/>
					<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-sky-500/20 bg-sky-500/8">
						<Server className="size-4 text-sky-400/70" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="text-[11px] font-mono text-white/60 truncate">{sessionId}</p>
						<div className="flex items-center gap-1.5 mt-1">
							<span className="inline-flex items-center gap-1 rounded-full border border-sky-500/30 bg-sky-500/10 px-1.5 py-px text-[9px] font-semibold text-sky-400">
								<Server className="size-2" /> server
							</span>
							{memes.length > 0 && (
								<span className="inline-flex items-center gap-0.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-1.5 py-px text-[9px] font-semibold text-violet-400">
									<Clapperboard className="size-2" />
									{memes.length}
								</span>
							)}
						</div>
					</div>
					<div className="flex items-center gap-1 shrink-0">
						{memes.length > 0 && (
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
								onDeleteSession();
							}}
							className="p-1 rounded-md text-white/20 hover:text-red-400 hover:bg-red-500/8 transition-all"
						>
							<Trash2 className="size-3" />
						</div>
					</div>
				</div>
			</button>

			{expanded && memes.length > 0 && (
				<div className="mb-2 animate-in fade-in slide-in-from-top-1 duration-200">
					{memes.map((meme, idx) => (
						<CustomLeaf
							key={meme.nodeId ?? idx}
							meme={meme}
							isLast={idx === memes.length - 1}
							isSelected={false}
							onClick={onSelect}
							onDelete={() => onDeleteMeme(meme.nodeId)}
						/>
					))}
				</div>
			)}
		</div>
	);
};
