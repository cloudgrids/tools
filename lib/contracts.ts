import type { GradientType, ToolCategory, ToolIconName } from '@/lib/enumerations';

export interface Tool {
	id: string;
	icon: ToolIconName;
	name: string;
	desc: string;
	category: ToolCategory;
	keywords: string[];
}

export interface ColorStop {
	color: string;
	pos: number;
}

export interface GradientConfig {
	type: GradientType;
	angle: number;
	stops: ColorStop[];
}

export interface GradientPreset {
	name: string;
	stops: ColorStop[];
}

export interface HashResult {
	algorithm: string;
	hash: string;
	bits: number;
}

export interface DiffLine {
	type: 'add' | 'remove' | 'equal';
	content: string;
	lineA?: number;
	lineB?: number;
}

export interface RegexMatch {
	match: string;
	index: number;
	groups: (string | undefined)[];
}

export interface RegexSample {
	pattern: string;
	flags: string;
}

export interface ContrastResult {
	ratio: number;
	aaSmall: boolean;
	aaLarge: boolean;
	aaaSmall: boolean;
	aaaLarge: boolean;
}

export interface JwtPayload {
	header: Record<string, unknown>;
	payload: Record<string, unknown>;
	signature: string;
	valid: boolean;
}
