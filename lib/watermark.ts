import sharp from 'sharp';
import type { Blend } from './enumerations';

export interface WatermarkProps {
	text?: string;
	imageBuffer?: Buffer;
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

const getTextLines = (value: string) => value.split(/\r?\n/).map((line) => escapeSvg(line || ' '));

const renderTspans = (lines: string[], x: number | string, fontSize: number) =>
	lines.map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : fontSize * 1.25}">${line}</tspan>`).join('');

const getPosition = (position: WatermarkProps['position'], width: number, height: number, margin: number) => {
	switch (position) {
		case 'top-left':
			return { x: margin, y: margin, anchor: 'start', baseline: 'hanging' };
		case 'top-right':
			return { x: width - margin, y: margin, anchor: 'end', baseline: 'hanging' };
		case 'bottom-left':
			return { x: margin, y: height - margin, anchor: 'start', baseline: 'auto' };
		case 'bottom-right':
			return { x: width - margin, y: height - margin, anchor: 'end', baseline: 'auto' };
		default:
			return { x: width / 2, y: height / 2, anchor: 'middle', baseline: 'middle' };
	}
};

export const applyWatermark = async (buffer: Buffer, props: WatermarkProps): Promise<Buffer> => {
	const {
		text = 'Sample Watermark',
		fontSize = 32,
		color = '#ffffff',
		angle = 0,
		opacity = 0.5,
		blend = 'over',
		position = 'center',
		tiled = false,
		margin = 48
	} = props;

	const metadata = await sharp(buffer).metadata();

	const width = metadata.width ?? 1000;
	const height = metadata.height ?? 1000;
	const lines = getTextLines(text);

	const longestLine = lines.reduce((longest, line) => Math.max(longest, line.length), 0);
	const resolvedMargin = Math.max(0, margin);

	const { x, y, anchor, baseline } = getPosition(position, width, height, resolvedMargin);

	const tileWidth = Math.max(180, fontSize * Math.max(longestLine * 0.7, 6));
	const tileHeight = Math.max(120, fontSize * Math.max(lines.length + 2, 4));

	const svg = `
		<svg width="${width}" height="${height}">
			<defs>
				<pattern id="watermark-tile" width="${tileWidth}" height="${tileHeight}" patternUnits="userSpaceOnUse">
					<text
						x="${tileWidth / 2}"
						y="${tileHeight / 2}"
						text-anchor="middle"
						dominant-baseline="middle"
						transform="rotate(${angle}, ${tileWidth / 2}, ${tileHeight / 2})"
						class="text"
					>
						${renderTspans(lines, tileWidth / 2, fontSize)}
					</text>
				</pattern>
			</defs>

			<style>
				.text {
					fill: ${color};
					font-size: ${fontSize}px;
					font-weight: bold;
					opacity: ${opacity};
					font-family: Arial, Helvetica, sans-serif;
				}
			</style>

			${
				tiled
					? `<rect width="100%" height="100%" fill="url(#watermark-tile)" />`
					: `<g transform="rotate(${angle}, ${x}, ${y})">
				<text
					x="${x}"
					y="${y}"
					text-anchor="${anchor}"
					dominant-baseline="${baseline}"
						class="text"
					>
						${renderTspans(lines, x, fontSize)}
					</text>
				</g>`
			}
		</svg>
	`;

	console.log('Generated SVG:', svg);

	return await sharp(buffer)
		.composite([
			{
				input: Buffer.from(svg),
				gravity: 'center',
				blend
			}
		])
		.jpeg({ quality: 100 })
		.toBuffer()
		.catch((error) => {
			console.error('Error applying watermark:', error);
			throw error;
		});
};
