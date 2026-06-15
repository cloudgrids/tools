import fs from 'node:fs/promises';
import path from 'node:path';
import sharp from 'sharp';
import type { Blend } from './enumerations';

const FONT_PATH = path.resolve(process.cwd(), 'public/fonts/Inter-Bold.woff2');

/** Module-level singleton so the file is only read once per process. */
let _fontDataUri: Promise<string> | null = null;

const getFontDataUri = (): Promise<string> => {
	if (!_fontDataUri) {
		_fontDataUri = fs
			.readFile(FONT_PATH)
			.then((buf) => `data:font/woff2;base64,${buf.toString('base64')}`)
			.catch(() => {
				// Font file missing — fall back to generic family names and hope
				// for the best. Log a warning so this is visible in prod logs.
				console.warn(
					'[watermark] Inter-Bold.woff2 not found at',
					FONT_PATH,
					'— text may be invisible in environments without system fonts.'
				);
				return '';
			});
	}
	return _fontDataUri;
};

export interface WatermarkProps {
	text?: string;
	fontSize?: number;
	color?: string;
	angle?: number;
	opacity?: number;
	blend?: Blend;
	position?: 'center' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
	tiled?: boolean;
	margin?: number;
}

const escapeSvg = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const getPosition = (position: WatermarkProps['position'], width: number, height: number, margin: number) => {
	switch (position) {
		case 'top-left':
			return {
				x: margin,
				y: margin + 40,
				anchor: 'start'
			};

		case 'top-right':
			return {
				x: width - margin,
				y: margin + 40,
				anchor: 'end'
			};

		case 'bottom-left':
			return {
				x: margin,
				y: height - margin,
				anchor: 'start'
			};

		case 'bottom-right':
			return {
				x: width - margin,
				y: height - margin,
				anchor: 'end'
			};

		default:
			return {
				x: width / 2,
				y: height / 2,
				anchor: 'middle'
			};
	}
};

export const applyWatermark = async (buffer: Buffer, props: WatermarkProps): Promise<Buffer> => {
	const {
		text = 'Sample Watermark',
		fontSize = 48,
		color = '#ffffff',
		angle = -30,
		opacity = 0.22,
		blend = 'over',
		position = 'center',
		tiled = false,
		margin = 48
	} = props;

	// Resolve the embedded font once (cached after first call).
	const fontDataUri = await getFontDataUri();
	const fontFamilyName = fontDataUri ? 'WatermarkFont' : 'sans-serif';
	const fontFaceBlock = fontDataUri
		? `<defs><style>@font-face{font-family:'WatermarkFont';src:url('${fontDataUri}') format('woff2');font-weight:700;}</style></defs>`
		: '';

	const metadata = await sharp(buffer).metadata();

	const width = metadata.width ?? 1000;
	const height = metadata.height ?? 1000;

	const safeText = escapeSvg(text);

	const { x, y, anchor } = getPosition(position, width, height, margin);

	const repeatedWatermarks = Array.from({ length: Math.ceil(height / 180) + 2 }, (_, row) =>
		Array.from({ length: Math.ceil(width / 300) + 2 }, (_, col) => {
			const tx = col * 300 - 200;
			const ty = row * 180;

			return `
						<text
							x="${tx}"
							y="${ty}"
							fill="${color}"
							fill-opacity="${opacity}"
							font-size="${fontSize}"
							font-family="${fontFamilyName}"
							font-weight="700"
							stroke="#000000"
							stroke-opacity="${opacity * 0.35}"
							stroke-width="1"
							transform="rotate(${angle}, ${tx}, ${ty})"
						>
							${safeText}
						</text>
					`;
		}).join('')
	).join('');

	const svg = `
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="${width}"
			height="${height}"
		>
			${fontFaceBlock}
			${
				tiled
					? repeatedWatermarks
					: `
						<text
							x="${x}"
							y="${y}"
							fill="${color}"
							fill-opacity="${opacity}"
							font-size="${fontSize}"
							font-family="${fontFamilyName}"
							font-weight="700"
							stroke="#000000"
							stroke-opacity="${opacity * 0.35}"
							stroke-width="1"
							text-anchor="${anchor}"
							transform="rotate(${angle}, ${x}, ${y})"
						>
							${safeText}
						</text>
					`
			}
		</svg>
	`;

	const watermarkOverlay = await sharp(Buffer.from(svg), {
		density: 300
	})
		.resize(width, height)
		.png()
		.toBuffer();

	return await sharp(buffer)
		.composite([
			{
				input: watermarkOverlay,
				blend
			}
		])
		.jpeg({
			quality: 100
		})
		.toBuffer();
};
