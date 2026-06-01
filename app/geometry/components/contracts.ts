export enum GeometryShape {
	ORGANIC = 'organic',
	TOWER = 'tower',
	RING = 'ring',
	CRYSTAL = 'crystal',
	DENSE = 'dense',
	FLAT = 'flat',
	CHAOTIC = 'chaotic'
}
export enum GeometryPaletteType {
	DEFAULT = 'default',
	NEON = 'neon',
	PASTEL = 'pastel',
	SUNSET = 'sunset',
	OCEAN = 'ocean',
	FOREST = 'forest',
	FIRE = 'fire',
	ICE = 'ice'
}
export enum GeometryBackground {
	DARK = 'dark',
	LIGHT = 'light',
	GRADIENT = 'gradient',
	GLASS = 'glass',
	TRANSPARENT = 'transparent'
}
export enum GeometryLineStyle {
	SOLID = 'solid',
	THIN = 'thin',
	GLOW = 'glow'
}
export enum GeometryNodeStyle {
	DOTS = 'dots',
	GLOW = 'glow',
	NONE = 'none'
}
export type Voxel = [number, number, number];

export interface GenerateVoxelOptions {
	voxelCount: number;
	symmetry: boolean;
	maxHeight: number;
	_remakeCount: number;
	shape: GeometryShape;
}

export interface ProjectedGeometry {
	points: [number, number][];
	viewBox: string;
}

export interface GeometryProps extends GenerateVoxelOptions, GeometryTheme {
	width: number | string;
	height: number | string;
	className: string;
	padding: number;
}

export interface MeshData {
	vertices: string[];
	lines: [number, number][];
}

export interface SvgRendererProps {
	points: [number, number][];
	lines: [number, number][];
	viewBox: string;
	width: number | string;
	height: number | string;
	className: string;
	background: GeometryBackground;
	paletteType: GeometryPaletteType;
	nodeStyle: GeometryNodeStyle;
	lineStyle: GeometryLineStyle;
}

export interface GeometryPalette {
	start: string;
	mid: string;
	end: string;
}

export type GeometryTheme = {
	background: GeometryBackground;
	nodeStyle: GeometryNodeStyle;
	lineStyle: GeometryLineStyle;
	rotation: number;
	shape: GeometryShape;
	paletteType: GeometryPaletteType;
};
