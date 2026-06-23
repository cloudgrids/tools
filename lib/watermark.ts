import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { ApplyWatermarkProps, ImageWatermarkOptions, TextWatermarkOptions } from './contracts';
import type { WatermarkPosition } from './enumerations';

const GOOGLE_FONTS_INTER_BOLD_URL =
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';

let _fontDataUri: Promise<string> | null = null;

const getFontDataUri = (): Promise<string> => {
	if (!_fontDataUri) {
		_fontDataUri = (async () => {
			try {
				const fontPath = path.join(process.cwd(), 'public', 'fonts', 'Inter-Bold.woff2');
				if (fs.existsSync(fontPath)) {
					const buffer = fs.readFileSync(fontPath);
					return `data:font/woff2;base64,${buffer.toString('base64')}`;
				}
				console.warn('[watermark] Local font not found, falling back to Google Fonts');
				const res = await fetch(GOOGLE_FONTS_INTER_BOLD_URL);
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const arrayBuffer = await res.arrayBuffer();
				const b64 = Buffer.from(arrayBuffer).toString('base64');
				return `data:font/woff2;base64,${b64}`;
			} catch (err: any) {
				console.warn('[watermark] Failed to load font:', err?.message);
				return '';
			}
		})();
	}
	return _fontDataUri;
};

const escapeSvg = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const renderMultilineText = (lines: string[], x: number, y: number, fontSize: number) => {
	return lines
		.map((line, index) => {
			const dy = index === 0 ? 0 : fontSize * 1.25;
			return `<tspan x="${x}" dy="${dy}" >${line}</tspan>`;
		})
		.join('');
};

const measureTextLayer = (lines: string[], fontSize: number, strokeWidth: number): { width: number; height: number } => {
	const longestLine = lines.reduce((longest, line) => Math.max(longest, line.length), 0);
	const width = Math.max(longestLine * fontSize * 0.62 + strokeWidth * 2, 1);
	const height = Math.max(lines.length * fontSize * 1.25 + strokeWidth * 2, fontSize);
	return { width, height };
};

const normalizeTileCount = (count?: { x?: number; y?: number }): { x?: number; y?: number } => ({
	x: count?.x ? Math.max(1, Math.floor(count.x)) : undefined,
	y: count?.y ? Math.max(1, Math.floor(count.y)) : undefined
});

const applyLayerBackgroundAndComposition = async (
	image: Buffer,
	options: {
		widthRatio?: number;
		opacity?: number;
		position?: WatermarkPosition;
		tiled?: boolean;
		margin?: number;
		angle?: number;
		grayscale?: boolean;
		x?: number;
		y?: number;
		tileGap?: { x?: number; y?: number };
		tileCount?: { x?: number; y?: number };
		logoBgShape?: 'none' | 'rect' | 'rounded-rect' | 'circle' | 'pill';
		logoBgColor?: string;
		logoBgOpacity?: number;
		logoPadding?: number;
		logoBgType?: 'color' | 'image';
		logoBgUseImage?: boolean;
		logoBgImage?: Buffer;
	},
	canvasW: number,
	canvasH: number,
	isTextLayer = false
): Promise<Buffer> => {
	const {
		widthRatio = 0.25,
		opacity = 0.5,
		position = 'center',
		tiled = false,
		margin = 48,
		angle = 0,
		grayscale = false,
		x,
		y,
		tileGap = {},
		tileCount,
		logoBgShape = 'none',
		logoBgColor = '#1c1c1e',
		logoBgOpacity = 0.65,
		logoPadding = 10,
		logoBgType = 'color',
		logoBgUseImage = false,
		logoBgImage
	} = options;

	const isImageBg = logoBgType === 'image' || logoBgUseImage;

	let wmSharp = sharp(image);
	if (!isTextLayer) {
		const targetW = Math.round(canvasW * widthRatio);
		wmSharp = wmSharp.resize({ width: targetW, withoutEnlargement: true });
	}
	if (grayscale) wmSharp = wmSharp.grayscale();

	const { data: rawData, info } = await wmSharp.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

	for (let i = 3; i < rawData.length; i += 4) {
		rawData[i] = Math.round(rawData[i] * opacity);
	}

	let wmW = info.width;
	let wmH = info.height;

	const logoPngBuffer = await sharp(rawData, { raw: { width: wmW, height: wmH, channels: 4 } })
		.png()
		.toBuffer();

	let baseWmBuffer: Buffer;
	let baseWmW = wmW;
	let baseWmH = wmH;

	if (isTextLayer && isImageBg && logoBgImage) {
		const pad = logoBgShape && logoBgShape !== 'none' ? Math.round(logoPadding * 1.5) : 0;

		let bgW = wmW + 2 * pad;
		let bgH = wmH + 2 * pad;
		let rx = 0;
		let ry = 0;

		if (logoBgShape && logoBgShape !== 'none') {
			if (logoBgShape === 'circle') {
				const size = Math.max(bgW, bgH);
				bgW = size;
				bgH = size;
				rx = size / 2;
				ry = size / 2;
			} else if (logoBgShape === 'pill') {
				rx = bgH / 2;
				ry = bgH / 2;
			} else if (logoBgShape === 'rounded-rect') {
				rx = Math.max(8, Math.round(bgW * 0.08));
				ry = rx;
			}
		}

		// Background shape opacity and color SVG
		const bgOp = logoBgOpacity * opacity;
		const fillAttr = logoBgShape && logoBgShape !== 'none' ? `fill="${logoBgColor}" fill-opacity="${bgOp}"` : 'fill="none"';

		const bgSvg = `<svg width="${bgW}" height="${bgH}" viewBox="0 0 ${bgW} ${bgH}" xmlns="http://www.w3.org/2000/svg">
			<rect x="0" y="0" width="${bgW}" height="${bgH}" rx="${rx}" ry="${ry}" ${fillAttr} />
		</svg>`;

		// 2. Prepare the background logo image (resize using cover to fit the entire container size bgW x bgH)
		let bgSharp = sharp(logoBgImage).resize({ width: bgW, height: bgH, fit: 'cover' });
		if (grayscale) bgSharp = bgSharp.grayscale();

		const { data: bgRawData, info: bgInfo } = await bgSharp.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

		const bgLogoOp = logoBgOpacity * opacity;
		for (let i = 3; i < bgRawData.length; i += 4) {
			bgRawData[i] = Math.round(bgRawData[i] * bgLogoOp);
		}

		const bgLogoW = bgInfo.width;
		const bgLogoH = bgInfo.height;

		const bgLogoPngBuffer = await sharp(bgRawData, { raw: { width: bgLogoW, height: bgLogoH, channels: 4 } })
			.png()
			.toBuffer();

		let bgLogoBuffer = bgLogoPngBuffer;

		// If a background shape is enabled, clip the background logo image to that shape as well!
		if (logoBgShape && logoBgShape !== 'none') {
			const maskSvg = `<svg width="${bgW}" height="${bgH}" xmlns="http://www.w3.org/2000/svg">
				<rect x="0" y="0" width="${bgW}" height="${bgH}" rx="${rx}" ry="${ry}" fill="#ffffff" />
			</svg>`;

			bgLogoBuffer = await sharp(bgLogoPngBuffer)
				.composite([{ input: Buffer.from(maskSvg), blend: 'dest-in' }])
				.png()
				.toBuffer();
		}

		const textLeft = Math.round((bgW - wmW) / 2);
		const textTop = Math.round((bgH - wmH) / 2);

		// Composite everything onto the background shape SVG
		if (logoBgShape && logoBgShape !== 'none') {
			baseWmBuffer = await sharp(Buffer.from(bgSvg))
				.composite([
					{ input: bgLogoBuffer, left: 0, top: 0 },
					{ input: logoPngBuffer, left: textLeft, top: textTop }
				])
				.png()
				.toBuffer();
		} else {
			// No shape, just composite text on top of logo directly
			baseWmBuffer = await sharp(bgLogoBuffer)
				.composite([{ input: logoPngBuffer, left: textLeft, top: textTop }])
				.png()
				.toBuffer();
		}

		baseWmW = bgW;
		baseWmH = bgH;
	} else if (logoBgShape && logoBgShape !== 'none') {
		const pad = isTextLayer ? Math.round(logoPadding * 1.5) : Math.round((logoPadding / 100) * wmW);

		let bgW = wmW + 2 * pad;
		let bgH = wmH + 2 * pad;
		let rx = 0;
		let ry = 0;

		if (logoBgShape === 'circle') {
			const size = Math.max(bgW, bgH);
			bgW = size;
			bgH = size;
			rx = size / 2;
			ry = size / 2;
		} else if (logoBgShape === 'pill') {
			rx = bgH / 2;
			ry = bgH / 2;
		} else if (logoBgShape === 'rounded-rect') {
			rx = Math.max(8, Math.round(bgW * 0.08));
			ry = rx;
		}

		const bgOp = logoBgOpacity * opacity;

		const bgSvg = `<svg width="${bgW}" height="${bgH}" viewBox="0 0 ${bgW} ${bgH}" xmlns="http://www.w3.org/2000/svg">
			<rect x="0" y="0" width="${bgW}" height="${bgH}" rx="${rx}" ry="${ry}" fill="${logoBgColor}" fill-opacity="${bgOp}" />
		</svg>`;

		const logoLeft = Math.round((bgW - wmW) / 2);
		const logoTop = Math.round((bgH - wmH) / 2);

		baseWmBuffer = await sharp(Buffer.from(bgSvg))
			.composite([{ input: logoPngBuffer, left: logoLeft, top: logoTop }])
			.png()
			.toBuffer();

		baseWmW = bgW;
		baseWmH = bgH;
	} else {
		baseWmBuffer = logoPngBuffer;
	}

	let wmBuffer: Buffer;
	if (angle !== 0) {
		wmBuffer = await sharp(baseWmBuffer)
			.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.png()
			.toBuffer();
	} else {
		wmBuffer = baseWmBuffer;
	}

	const wmMeta = await sharp(wmBuffer).metadata();
	wmW = wmMeta.width ?? baseWmW;
	wmH = wmMeta.height ?? baseWmH;

	// Safeguard: Scale down the watermark layer if it exceeds the background canvas dimensions to prevent composite failures
	if (wmW > canvasW || wmH > canvasH) {
		const scale = Math.min(canvasW / wmW, canvasH / wmH);
		const targetW = Math.max(1, Math.round(wmW * scale));
		const targetH = Math.max(1, Math.round(wmH * scale));

		wmBuffer = await sharp(wmBuffer).resize(targetW, targetH).png().toBuffer();

		wmW = targetW;
		wmH = targetH;
	}

	if (tiled) {
		const gapX = tileGap.x ?? 20;
		const gapY = tileGap.y ?? 20;
		const normalizedTileCount = normalizeTileCount(tileCount);
		const tileCols = normalizedTileCount.x ?? Math.ceil(canvasW / (wmW + gapX)) + 2;
		const tileRows = normalizedTileCount.y ?? Math.ceil(canvasH / (wmH + gapY)) + 2;
		const stepX = wmW + gapX;
		const stepY = wmH + gapY;
		const firstTileLeft = normalizedTileCount.x ? canvasW / 2 - (tileCols * wmW + (tileCols - 1) * gapX) / 2 : -stepX;
		const firstTileTop = normalizedTileCount.y ? canvasH / 2 - (tileRows * wmH + (tileRows - 1) * gapY) / 2 : -stepY;

		const compositeInputs: sharp.OverlayOptions[] = [];
		for (let row = 0; row < tileRows; row++) {
			for (let col = 0; col < tileCols; col++) {
				const left = Math.round(firstTileLeft + col * stepX);
				const top = Math.round(firstTileTop + row * stepY);
				if (left + wmW >= 0 && top + wmH >= 0 && left < canvasW && top < canvasH) {
					compositeInputs.push({ input: wmBuffer, left, top });
				}
			}
		}

		return sharp({
			create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
		})
			.composite(compositeInputs)
			.png()
			.toBuffer();
	}

	const hasCustomPosition = typeof x === 'number' && typeof y === 'number';
	let left: number;
	let top: number;

	if (hasCustomPosition) {
		const centerX = (Math.max(0, Math.min(100, x)) / 100) * canvasW;
		const centerY = (Math.max(0, Math.min(100, y)) / 100) * canvasH;
		left = Math.round(centerX - wmW / 2);
		top = Math.round(centerY - wmH / 2);
	} else {
		switch (position) {
			case 'top-left':
				left = margin;
				top = margin;
				break;
			case 'top-right':
				left = canvasW - margin - wmW;
				top = margin;
				break;
			case 'bottom-left':
				left = margin;
				top = canvasH - margin - wmH;
				break;
			case 'bottom-right':
				left = canvasW - margin - wmW;
				top = canvasH - margin - wmH;
				break;
			default:
				left = Math.round((canvasW - wmW) / 2);
				top = Math.round((canvasH - wmH) / 2);
				break;
		}
	}

	return sharp({
		create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
	})
		.composite([{ input: wmBuffer, left, top }])
		.png()
		.toBuffer();
};

const renderTextLayer = async (
	layer: TextWatermarkOptions,
	canvasW: number,
	canvasH: number,
	fontFamilyName: string,
	fontFaceBlock: string
): Promise<Buffer> => {
	const { text = 'Sample Watermark', fontSize = 48, color = '#ffffff', strokeWidth = 1, strokeColor = '#000000' } = layer;

	const lines = text.split(/\r?\n/g).map(escapeSvg);
	const textSize = measureTextLayer(lines, fontSize, strokeWidth);
	const svgW = textSize.width + 16;
	const svgH = textSize.height + 16;

	let textY = svgH / 2;
	if (lines.length > 1) {
		textY -= ((lines.length - 1) * fontSize * 1.25) / 2;
	}

	const textSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${svgW}" height="${svgH}" viewBox="0 0 ${svgW} ${svgH}">
		${fontFaceBlock}
		<text
			x="${svgW / 2}" y="${textY}"
			fill="${color}"
			font-size="${fontSize}" font-family="${fontFamilyName}" font-weight="700"
			stroke="${strokeColor}" stroke-width="${strokeWidth}"
			text-anchor="middle"
			dominant-baseline="middle">${renderMultilineText(lines, svgW / 2, textY, fontSize)}</text>
	</svg>`;

	const textBuffer = await sharp(Buffer.from(textSvg)).png().toBuffer();

	return applyLayerBackgroundAndComposition(textBuffer, layer, canvasW, canvasH, true);
};

const renderImageLayer = async (layer: ImageWatermarkOptions, canvasW: number, canvasH: number): Promise<Buffer> => {
	return applyLayerBackgroundAndComposition(layer.image, layer, canvasW, canvasH, false);
};

export const applyWatermark = async (buffer: Buffer, props: ApplyWatermarkProps): Promise<Buffer> => {
	const { layers, outputFormat = 'jpeg', quality = 100 } = props;

	if (!layers || layers.length === 0) {
		throw new Error('[watermark] At least one layer must be provided.');
	}

	const metadata = await sharp(buffer).metadata();
	const canvasW = metadata.width ?? 1000;
	const canvasH = metadata.height ?? 1000;

	const hasTextLayer = layers.some((l) => l.type === 'text');
	const fontDataUri = hasTextLayer ? await getFontDataUri() : '';
	const fontFamilyName = fontDataUri ? 'WatermarkFont' : 'sans-serif';
	const fontFaceBlock = fontDataUri
		? `<defs><style>@font-face{font-family:'WatermarkFont';src:url('${fontDataUri}') format('woff2');font-weight:700;}</style></defs>`
		: '';

	const overlays = await Promise.all(
		layers.map((layer) => {
			if (layer.type === 'text') {
				return renderTextLayer(layer, canvasW, canvasH, fontFamilyName, fontFaceBlock);
			}
			return renderImageLayer(layer, canvasW, canvasH);
		})
	);

	const compositeInputs: sharp.OverlayOptions[] = overlays.map((overlay, i) => ({
		input: overlay,
		blend: layers[i].blend ?? 'over'
	}));

	const pipeline = sharp(buffer).composite(compositeInputs);

	switch (outputFormat) {
		case 'png':
			return pipeline.png().toBuffer();
		case 'webp':
			return pipeline.webp({ quality }).toBuffer();
		default:
			return pipeline.jpeg({ quality }).toBuffer();
	}
};
