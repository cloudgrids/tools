import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { sc } from './HistoryTreePage';

interface TreeLeafProps {
	label: string;
	status?: string;
	isLast: boolean;
	isSelected: boolean;
	onClick: () => void;
}

export const TreeLeaf: React.FC<TreeLeafProps> = ({ label, status, isLast, isSelected, onClick }) => {
	const colors = sc(status);
	return (
		<div className="relative flex items-start gap-0 ml-4">
			{!isLast && <div className="absolute left-3 top-0 bottom-0 w-px bg-violet-500/20" />}
			<div className="relative shrink-0 mt-0" style={{ width: 24 }}>
				<div
					className="absolute border-l border-b border-violet-500/25 rounded-bl"
					style={{ left: 12, top: 0, width: 12, height: 20, borderWidth: '0 0 1px 1px' }}
				/>
				{!isLast && <div className="absolute left-3 top-5 bottom-0 w-px bg-violet-500/20" />}
				<div className="absolute top-4 left-5 size-1.5 rounded-full bg-violet-400/50 ring-1 ring-violet-500/20" />
			</div>
			<button
				onClick={onClick}
				className={cn(
					'flex-1 ml-1 mt-2 mb-1 rounded-xl border px-3 py-2 text-left transition-all duration-150 group',
					isSelected
						? 'border-violet-500/50 bg-violet-500/10'
						: 'border-white/6 bg-white/3 hover:bg-white/5 hover:border-white/10'
				)}
			>
				<div className="flex items-center gap-2">
					<Sparkles className="size-3 text-violet-400/60 shrink-0" />
					<span className="flex-1 text-[11px] font-medium text-white/60 group-hover:text-white/80 truncate">{label}</span>
					<span
						className={`shrink-0 inline-flex items-center gap-1 rounded-full border px-1.5 py-px text-[9px] font-semibold capitalize ${colors.pill}`}
					>
						<span className={`size-1 rounded-full ${colors.dot}`} />
						{status ?? 'pending'}
					</span>
				</div>
			</button>
		</div>
	);
};
