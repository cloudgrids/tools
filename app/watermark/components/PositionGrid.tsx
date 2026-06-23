'use client';

import type { WatermarkProps } from '@/lib/contracts';
import { cn } from '@/lib/utils';

type Position = WatermarkProps['position'];

interface PositionGridProps {
	value: Position;
	onChange: (pos: Position) => void;
}

const POSITIONS: { pos: Position; row: number; col: number; label: string }[] = [
	{ pos: 'top-left', row: 0, col: 0, label: 'Top Left' },
	{ pos: 'top-right', row: 0, col: 2, label: 'Top Right' },
	{ pos: 'center', row: 1, col: 1, label: 'Center' },
	{ pos: 'bottom-left', row: 2, col: 0, label: 'Bottom Left' },
	{ pos: 'bottom-right', row: 2, col: 2, label: 'Bottom Right' }
];

export const PositionGrid: React.FC<PositionGridProps> = ({ value, onChange }) => {
	return (
		<div
			className="relative grid h-20 w-20 shrink-0 rounded-lg border bg-muted/30 p-1"
			style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(3, 1fr)' }}
			title="Click to set watermark position"
		>
			<div className="pointer-events-none absolute inset-2 border border-dashed border-border/50 rounded" />

			{POSITIONS.map(({ pos, row, col, label }) => {
				const isActive = value === pos;
				return (
					<button
						key={pos}
						type="button"
						title={label}
						onClick={() => onChange(pos)}
						className={cn(
							'flex items-center justify-center rounded transition-all duration-150',
							'focus:outline-none focus-visible:ring-2 focus-visible:ring-ring',
							isActive ? 'scale-110' : 'opacity-40 hover:opacity-80'
						)}
						style={{ gridRow: row + 1, gridColumn: col + 1 }}
					>
						<div
							className={cn(
								'rounded-full transition-all duration-150',
								isActive ? 'h-3.5 w-3.5 bg-primary shadow-sm shadow-primary/40' : 'h-2 w-2 bg-foreground/50'
							)}
						/>
					</button>
				);
			})}
		</div>
	);
};
