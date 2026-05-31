interface SvgRendererProps {
	points: [number, number][];
	lines: [number, number][];
	viewBox: string;
	width?: number | string;
	height?: number | string;
	className?: string;
}

export function SvgRenderer({ points, lines, viewBox, width = '100%', height = '100%', className }: SvgRendererProps) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox={viewBox}
			width={width}
			height={height}
			className={className}
			fill="none"
			overflow="visible"
			aria-hidden="true"
		>
			<defs>
				<linearGradient id="cg-gradient" x1="8" y1="20" x2="112" y2="84" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor="#22D3EE" />
					<stop offset="45%" stopColor="#60A5FA" />
					<stop offset="100%" stopColor="#D946EF" />
				</linearGradient>

				<filter id="cg-glow" x="-50%" y="-50%" width="200%" height="200%">
					<feGaussianBlur stdDeviation="2.8" result="blur" />

					<feMerge>
						<feMergeNode in="blur" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>

			{/* glow */}
			<g filter="url(#cg-glow)" stroke="url(#cg-gradient)" strokeWidth="2.4" opacity="0.4">
				{lines.map(([a, b], i) => {
					const p1 = points[a];
					const p2 = points[b];

					return <line key={`glow-${i}`} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
				})}
			</g>

			{/* mesh */}
			<g stroke="url(#cg-gradient)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round">
				{lines.map(([a, b], i) => {
					const p1 = points[a];
					const p2 = points[b];

					return <line key={`line-${i}`} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
				})}
			</g>

			{/* nodes */}
			<g filter="url(#cg-glow)">
				{points.map(([x, y], i) => (
					<circle key={`node-${i}`} cx={x} cy={y} r="2" fill="white" />
				))}
			</g>
		</svg>
	);
}
