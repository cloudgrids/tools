import { SvgRendererProps } from './contracts';
import { getBackgroundStyles, getPalette, LINE_STYLES } from './generators';

export function SvgRenderer({
	points,
	lines,
	viewBox,
	width = '100%',
	height = '100%',
	className,
	background,
	lineStyle,
	nodeStyle,
	paletteType
}: SvgRendererProps) {
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
			style={getBackgroundStyles(background)}
		>
			<defs>
				<linearGradient id="cg-gradient" x1="8" y1="20" x2="112" y2="84" gradientUnits="userSpaceOnUse">
					<stop offset="0%" stopColor={getPalette(paletteType).start} />
					<stop offset="45%" stopColor={getPalette(paletteType).mid} />
					<stop offset="100%" stopColor={getPalette(paletteType).end} />
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
			<g filter="url(#cg-glow)" stroke="url(#cg-gradient)" strokeWidth={LINE_STYLES[lineStyle]} opacity="0.4">
				{lines.map(([a, b], i) => {
					const p1 = points[a];
					const p2 = points[b];

					return <line key={`glow-${i}`} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
				})}
			</g>

			{/* mesh */}
			<g stroke="url(#cg-gradient)" strokeWidth={LINE_STYLES[lineStyle]} strokeLinecap="round" strokeLinejoin="round">
				{lines.map(([a, b], i) => {
					const p1 = points[a];
					const p2 = points[b];

					return <line key={`line-${i}`} x1={p1[0]} y1={p1[1]} x2={p2[0]} y2={p2[1]} />;
				})}
			</g>

			{/* nodes */}
			{nodeStyle !== 'none' && (
				<g filter={nodeStyle === 'glow' ? 'url(#cg-glow)' : undefined}>
					{points.map(([x, y], i) => (
						<circle
							key={`node-${i}`}
							cx={x}
							cy={y}
							r={nodeStyle === 'glow' ? '3' : '2'}
							fill={nodeStyle === 'glow' ? 'url(#cg-gradient)' : 'white'}
							opacity={nodeStyle === 'glow' ? 0.8 : 1}
						/>
					))}
				</g>
			)}
		</svg>
	);
}
