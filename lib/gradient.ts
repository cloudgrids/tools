import type { ColorStop } from '@/lib/contracts';
import type { GradientType } from '@/lib/enumerations';

export function buildGradientCss(type: GradientType, angle: number, stops: ColorStop[]): string {
	const value = [...stops]
		.sort((a, b) => a.pos - b.pos)
		.map((stop) => `${stop.color} ${stop.pos}%`)
		.join(', ');

	if (type === 'linear') return `linear-gradient(${angle}deg, ${value})`;
	if (type === 'radial') return `radial-gradient(ellipse at center, ${value})`;
	return `conic-gradient(from ${angle}deg, ${value})`;
}
