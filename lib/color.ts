// ── Color utilities ──────────────────────────────────────────
import type { ContrastResult } from '@/lib/contracts';

export function hexToRgb(hex: string): [number, number, number] {
	let h = hex.replace('#', '');
	if (h.length === 3)
		h = h
			.split('')
			.map((c) => c + c)
			.join('');
	const n = parseInt(h, 16);
	return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
	r /= 255;
	g /= 255;
	b /= 255;
	const max = Math.max(r, g, b),
		min = Math.min(r, g, b);
	const l = (max + min) / 2;
	let h = 0,
		s = 0;
	if (max !== min) {
		const d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
				break;
			case g:
				h = ((b - r) / d + 2) / 6;
				break;
			case b:
				h = ((r - g) / d + 4) / 6;
				break;
		}
	}
	return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

export function hslToHex(h: number, s: number, l: number): string {
	s /= 100;
	l /= 100;
	const a = s * Math.min(l, 1 - l);
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		return l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
	};
	return (
		'#' +
		[f(0), f(8), f(4)]
			.map((x) =>
				Math.round(x * 255)
					.toString(16)
					.padStart(2, '0')
			)
			.join('')
	);
}

export function rgbToHex(r: number, g: number, b: number): string {
	return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('');
}

function toLinear(c: number): number {
	const s = c / 255;
	return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function luminance(r: number, g: number, b: number): number {
	return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

export function contrastRatio(hex1: string, hex2: string): ContrastResult {
	const [r1, g1, b1] = hexToRgb(hex1);
	const [r2, g2, b2] = hexToRgb(hex2);
	const l1 = luminance(r1, g1, b1);
	const l2 = luminance(r2, g2, b2);
	const [lighter, darker] = l1 > l2 ? [l1, l2] : [l2, l1];
	const ratio = (lighter + 0.05) / (darker + 0.05);
	return {
		ratio: Math.round(ratio * 100) / 100,
		aaSmall: ratio >= 4.5,
		aaLarge: ratio >= 3,
		aaaSmall: ratio >= 7,
		aaaLarge: ratio >= 4.5
	};
}

export function generatePalette(hex: string) {
	const [r, g, b] = hexToRgb(hex);
	const [h, s, l] = rgbToHsl(r, g, b);
	return {
		base: hex,
		complement: hslToHex((h + 180) % 360, s, l),
		triadic1: hslToHex((h + 120) % 360, s, l),
		triadic2: hslToHex((h + 240) % 360, s, l),
		analogous1: hslToHex((h + 30) % 360, s, l),
		analogous2: hslToHex((h - 30 + 360) % 360, s, l),
		splitComp1: hslToHex((h + 150) % 360, s, l),
		splitComp2: hslToHex((h + 210) % 360, s, l)
	};
}

export function generateShades(hex: string): { hex: string; l: number }[] {
	const [r, g, b] = hexToRgb(hex);
	const [h, s] = rgbToHsl(r, g, b);
	return [10, 20, 30, 40, 50, 60, 70, 80, 90].map((l) => ({
		hex: hslToHex(h, s, l),
		l
	}));
}

export function isValidHex(hex: string): boolean {
	return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
}
