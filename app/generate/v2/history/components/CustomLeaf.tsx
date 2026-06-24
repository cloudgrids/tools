import { MemeStatus } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { Clapperboard, Trash2 } from 'lucide-react';
import { sc } from './HistoryTreePage';

interface CustomLeafProps {
	meme: MemeStatus;
	isLast: boolean;
	isSelected: boolean;
	onClick: () => void;
	onDelete: () => void;
}

export const CustomLeaf: React.FC<CustomLeafProps> = ({ meme, isLast, isSelected, onClick, onDelete }) => {
	const colors = sc(meme.status);
	return (
		<div className="relative flex items-start gap-0 ml-4">
			{!isLast && <div className="absolute left-3 top-0 bottom-0 w-px bg-sky-500/15" />}
			<div className="relative shrink-0 mt-0" style={{ width: 24 }}>
				<div
					className="absolute border-l border-b border-sky-500/20 rounded-bl"
					style={{ left: 12, top: 0, width: 12, height: 20, borderWidth: '0 0 1px 1px' }}
				/>
				{!isLast && <div className="absolute left-3 top-5 bottom-0 w-px bg-sky-500/15" />}
				<div className="absolute top-4 left-5 size-1.5 rounded-full bg-sky-400/50 ring-1 ring-sky-500/15" />
			</div>
			<div
				className={cn(
					'flex-1 ml-1 mt-2 mb-1 rounded-xl border transition-all duration-150 overflow-hidden',
					isSelected ? 'border-sky-500/40 bg-sky-500/8' : 'border-white/6 bg-white/3 hover:bg-white/5'
				)}
			>
				<button onClick={onClick} className="w-full px-3 py-2 text-left group">
					<div className="flex items-center gap-2">
						<Clapperboard className="size-3 text-sky-400/60 shrink-0" />
						<span className="flex-1 text-[11px] font-medium text-white/55 group-hover:text-white/80 truncate">
							{meme.prompt?.slice(0, 35) || `Meme ${meme.nodeId?.slice(0, 8)}`}
						</span>
						<span
							className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-semibold capitalize ${colors.pill}`}
						>
							<span className={`size-1 rounded-full ${colors.dot}`} />
							{meme.status ?? 'pending'}
						</span>
						<div
							onClick={(e) => {
								e.stopPropagation();
								onDelete();
							}}
							className="shrink-0 p-0.5 text-white/20 hover:text-red-400 transition-colors"
						>
							<Trash2 className="size-3" />
						</div>
					</div>
				</button>
			</div>
		</div>
	);
};
