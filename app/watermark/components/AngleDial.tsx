'use client';

import { useCallback, useRef, useState } from 'react';

interface AngleDialProps {
	value: number; // -180 to 180
	onChange: (angle: number) => void;
	size?: number;
}

export const AngleDial: React.FC<AngleDialProps> = ({ value, onChange, size = 72 }) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const [isDragging, setIsDragging] = useState(false);
	const center = size / 2;
	const radius = size / 2 - 4;
	const innerRadius = radius - 10;

	const angleToRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
	const pointerX = center + radius * 0.6 * Math.cos(angleToRad(value));
	const pointerY = center + radius * 0.6 * Math.sin(angleToRad(value));

	const getAngleFromEvent = useCallback(
		(clientX: number, clientY: number) => {
			if (!svgRef.current) return value;
			const rect = svgRef.current.getBoundingClientRect();
			const cx = rect.left + rect.width / 2;
			const cy = rect.top + rect.height / 2;
			const rad = Math.atan2(clientY - cy, clientX - cx);
			let deg = Math.round((rad * 180) / Math.PI) + 90;
			// normalise to -180..180
			if (deg > 180) deg -= 360;
			if (deg < -180) deg += 360;
			return deg;
		},
		[value]
	);

	const handlePointerDown = useCallback(
		(e: React.PointerEvent<SVGSVGElement>) => {
			e.currentTarget.setPointerCapture(e.pointerId);
			setIsDragging(true);
			onChange(getAngleFromEvent(e.clientX, e.clientY));
		},
		[getAngleFromEvent, onChange]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<SVGSVGElement>) => {
			if (!isDragging) return;
			onChange(getAngleFromEvent(e.clientX, e.clientY));
		},
		[isDragging, getAngleFromEvent, onChange]
	);

	const handlePointerUp = useCallback(() => setIsDragging(false), []);

	// tick marks every 45 deg
	const ticks = [-180, -135, -90, -45, 0, 45, 90, 135];

	return (
		<div className="flex flex-col items-center gap-1.5">
			<svg
				ref={svgRef}
				width={size}
				height={size}
				viewBox={`0 0 ${size} ${size}`}
				className={`cursor-grab select-none touch-none rounded-full ${isDragging ? 'cursor-grabbing' : ''}`}
				onPointerDown={handlePointerDown}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
			>
				{/* Outer ring */}
				<circle cx={center} cy={center} r={radius} className="fill-muted stroke-border" strokeWidth={1.5} />

				{/* Inner disc */}
				<circle cx={center} cy={center} r={innerRadius} className="fill-background stroke-border/50" strokeWidth={1} />

				{/* Tick marks */}
				{ticks.map((tick) => {
					const rad = ((tick - 90) * Math.PI) / 180;
					const isMajor = tick % 90 === 0;
					const x1 = center + (innerRadius - 1) * Math.cos(rad);
					const y1 = center + (innerRadius - 1) * Math.sin(rad);
					const x2 = center + (isMajor ? radius - 2 : radius - 4) * Math.cos(rad);
					const y2 = center + (isMajor ? radius - 2 : radius - 4) * Math.sin(rad);
					return (
						<line
							key={tick}
							x1={x1}
							y1={y1}
							x2={x2}
							y2={y2}
							className={isMajor ? 'stroke-muted-foreground/60' : 'stroke-muted-foreground/30'}
							strokeWidth={isMajor ? 1.5 : 1}
							strokeLinecap="round"
						/>
					);
				})}

				{/* Pointer arm */}
				<line
					x1={center}
					y1={center}
					x2={pointerX}
					y2={pointerY}
					className="stroke-primary"
					strokeWidth={2.5}
					strokeLinecap="round"
				/>

				{/* Pointer head dot */}
				<circle cx={pointerX} cy={pointerY} r={3} className="fill-primary" />

				{/* Center dot */}
				<circle cx={center} cy={center} r={2.5} className="fill-muted-foreground/60" />
			</svg>
			<span className="min-w-10 text-center text-xs font-medium tabular-nums text-muted-foreground">{value}°</span>
		</div>
	);
};
