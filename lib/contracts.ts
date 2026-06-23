import type { Blend, GradientType, ToolCategory, ToolIconName, WatermarkLayer, WatermarkPosition } from '@/lib/enumerations';

export interface Tool {
	id: string;
	icon: ToolIconName;
	name: string;
	desc: string;
	category: ToolCategory;
	keywords: string[];
	isExperimental?: boolean;
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

export type WatermarkMode = 'text' | 'image' | 'both';
export type WatermarkOutputFormat = 'jpeg' | 'png' | 'webp';

export interface ApplyWatermarkProps {
	layers: WatermarkLayer[];
	outputFormat?: WatermarkOutputFormat;
	quality?: number;
}

export interface WatermarkProps {
	// --- shared ---
	mode: WatermarkMode;
	opacity: number;
	angle: number;
	blend: Blend;
	position: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	tiled: boolean;
	margin: number;
	outputFormat: WatermarkOutputFormat;
	quality: number;

	/** One or more watermark layers applied in order (bottom to top). */
	layers: WatermarkLayer[];

	// --- text layer ---
	text: string;
	fontSize: number;
	color: string;
	strokeWidth: number;
	strokeColor: string;

	// --- image layer ---
	/** Base64 data-URI of the logo/stamp image chosen by the user. */
	imageDataUri?: string;
	/** Fraction of canvas width the image watermark should occupy (0.05–0.9). */
	widthRatio: number;
	/** Convert the image watermark to greyscale. */
	grayscale: boolean;
	/**
	 * Custom center point for the image watermark, as a percentage of the source image.
	 * When undefined the server (and preview) falls back to resolvePosition(position, margin).
	 */
	imagePositionX?: number;
	imagePositionY?: number;
	/** Gap between tiles when tiled=true for image watermarks. */
	tileGapX: number;
	tileGapY: number;
	/** Number of tile columns and rows when tiled=true. */
	tileCountX: number;
	tileCountY: number;
	/** Logo background shape. */
	logoBgShape?: 'none' | 'rect' | 'rounded-rect' | 'circle' | 'pill';
	/** Logo background color. */
	logoBgColor?: string;
	/** Logo background opacity. */
	logoBgOpacity?: number;
	/** Logo background padding as a percentage of width. */
	logoPadding?: number;
	/** Custom center point for the text watermark, as a percentage of the source image. */
	textPositionX?: number;
	textPositionY?: number;
	logoBgType?: 'color' | 'image';
	logoBgImageUri?: string;
	logoBgUseImage?: boolean;
}

/** Options shared by both text and image watermarks. */
interface WatermarkBase {
	/** Blend mode applied when compositing this layer onto the source image. @default 'over' */
	blend?: Blend;
	/** Position of the watermark on the image. @default 'center' */
	position?: WatermarkPosition;
	/** Margin in pixels from the edge when using a corner position. @default 48 */
	margin?: number;
	/** Tile the watermark across the entire image. @default false */
	tiled?: boolean;
	/** Rotation angle in degrees. @default 0 */
	angle?: number;
	/** Opacity from 0 (invisible) to 1 (fully opaque). @default 0.5 */
	opacity?: number;
	/** Logo background shape. */
	logoBgShape?: 'none' | 'rect' | 'rounded-rect' | 'circle' | 'pill';
	/** Logo background color. */
	logoBgColor?: string;
	/** Logo background opacity. */
	logoBgOpacity?: number;
	/** Logo background padding as a percentage of width. */
	logoPadding?: number;
	logoBgType?: 'color' | 'image';
	logoBgImage?: Buffer;
}

export interface TextWatermarkOptions extends WatermarkBase {
	type: 'text';
	/** The watermark text. @default 'Sample Watermark' */
	text?: string;
	/** Font size in pixels. @default 48 */
	fontSize?: number;
	/** CSS color string for the text fill. @default '#ffffff' */
	color?: string;
	/** Width of the text stroke (outline). @default 1 */
	strokeWidth?: number;
	/** Color of the text stroke. @default '#000000' */
	strokeColor?: string;
	/** Tile spacing in pixels (only used when tiled=true). @default  x: 20, y: 20  */
	tileGap?: { x?: number; y?: number };
	/** Number of tile columns and rows (only used when tiled=true). */
	tileCount?: { x?: number; y?: number };
	/** Custom center point for the text watermark, as a percentage of the source image. */
	x?: number;
	y?: number;
}

export interface ImageWatermarkOptions extends WatermarkBase {
	type: 'image';
	/** The watermark image as a Buffer (PNG, JPEG, SVG, WebP, …). */
	image: Buffer;
	/** Scale the watermark to this fraction of the source image's width. @default 0.25 */
	widthRatio?: number;
	/** Convert the watermark image to greyscale before compositing. @default false */
	grayscale?: boolean;
	/** Center point for the image watermark, stored as a percentage of the source image. */
	x?: number;
	y?: number;
	/** Tile spacing in pixels (only used when tiled=true). @default  x: 20, y: 20  */
	tileGap?: { x?: number; y?: number };
	/** Number of tile columns and rows (only used when tiled=true). */
	tileCount?: { x?: number; y?: number };
}

export interface UploadResult {
	success: boolean;
	imageUrl: string;
	bucket: string;
	path: string;
}

export interface GenerateInput {
	imageBucket: string;
	imagePath: string;
	videoPrompt: string;
	token: string;
}

export interface GenerateOutput {
	status: string;
	sessionId: string;
}

export interface GenerateResult {
	status: string;
	videoUrl?: string;
}

export interface MemeOutput {
	nodeId: string;
	status: string;
	prompt: string;
}

export interface MemeStatus extends MemeOutput {
	videoUrl?: string;
	highResUrl?: string;
	memeId: string;
}

export interface GenerationHistory extends GenerateResult, GenerateInput, GenerateOutput {
	memes?: MemeStatus[];
}
