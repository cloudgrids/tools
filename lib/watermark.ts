import sharp from 'sharp';
import { ApplyWatermarkProps, ImageWatermarkOptions, TextWatermarkOptions } from './contracts';
import type { WatermarkPosition } from './enumerations';

const GOOGLE_FONTS_INTER_BOLD_URL =
	'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2';

let _fontDataUri: Promise<string> | null = null;

const getFontDataUri = (): Promise<string> => {
	if (!_fontDataUri) {
		_fontDataUri = fetch(GOOGLE_FONTS_INTER_BOLD_URL)
			.then(async (res) => {
				if (!res.ok) throw new Error(`HTTP ${res.status}`);
				const arrayBuffer = await res.arrayBuffer();
				const b64 = Buffer.from(arrayBuffer).toString('base64');
				return `data:font/woff2;base64,${b64}`;
			})
			.catch((err) => {
				console.warn('[watermark] Failed to fetch Inter Bold from Google Fonts:', err?.message);
				return '';
			});
	}
	return _fontDataUri;
};

const escapeSvg = (value: string) =>
	value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const resolvePosition = (
	position: WatermarkPosition,
	canvasW: number,
	canvasH: number,
	margin: number
): { x: number; y: number; anchor: 'start' | 'middle' | 'end'; gravity: string } => {
	switch (position) {
		case 'top-left':
			return { x: margin, y: margin, anchor: 'start', gravity: 'northwest' };
		case 'top-right':
			return { x: canvasW - margin, y: margin, anchor: 'end', gravity: 'northeast' };
		case 'bottom-left':
			return { x: margin, y: canvasH - margin, anchor: 'start', gravity: 'southwest' };
		case 'bottom-right':
			return { x: canvasW - margin, y: canvasH - margin, anchor: 'end', gravity: 'southeast' };
		default:
			return { x: canvasW / 2, y: canvasH / 2, anchor: 'middle', gravity: 'center' };
	}
};

const renderMultilineText = (lines: string[], x: number, y: number, fontSize: number) => {
	return lines
		.map((line, index) => {
			const dy = index === 0 ? 0 : fontSize * 1.25;
			return `<tspan x="${x}" dy="${dy}" >${line}</tspan>`;
		})
		.join('');
};

const renderTextLayer = async (
	layer: TextWatermarkOptions,
	canvasW: number,
	canvasH: number,
	fontFamilyName: string,
	fontFaceBlock: string
): Promise<Buffer> => {
	const {
		text = 'Sample Watermark',
		fontSize = 48,
		color = '#ffffff',
		angle = -30,
		opacity = 0.5,
		position = 'center',
		tiled = false,
		margin = 48,
		strokeWidth = 1,
		strokeColor = '#000000'
	} = layer;

	const lines = text.split(/\r?\n/g).map(escapeSvg);
	const { x, y, anchor } = resolvePosition(position, canvasW, canvasH, margin);

	const tileRowH = fontSize * 4;
	const tileColW = Math.max(text.length * fontSize * 0.6, 200);

	const tiledElements = tiled
		? Array.from({ length: Math.ceil(canvasH / tileRowH) + 2 }, (_, row) =>
				Array.from({ length: Math.ceil(canvasW / tileColW) + 2 }, (_, col) => {
					const tx = col * tileColW - tileColW * 0.5;
					const ty = row * tileRowH;
					return `<text
						x="${tx}" y="${ty}"
						fill="${color}" fill-opacity="${opacity}"
						font-size="${fontSize}" font-family="${fontFamilyName}" font-weight="700"
						stroke="${strokeColor}" stroke-opacity="${opacity * 0.4}" stroke-width="${strokeWidth}"
						transform="rotate(${angle}, ${tx}, ${ty})">${renderMultilineText(lines, x, y, fontSize)}</text>`;
				}).join('')
			).join('')
		: `<text
				x="${x}" y="${y}"
				fill="${color}" fill-opacity="${opacity}"
				font-size="${fontSize}" font-family="${fontFamilyName}" font-weight="700"
				stroke="${strokeColor}" stroke-opacity="${opacity * 0.4}" stroke-width="${strokeWidth}"
				text-anchor="${anchor}"
				transform="rotate(${angle}, ${x}, ${y})"
				dominant-baseline="middle">${renderMultilineText(lines, x, y, fontSize)}</text>`;

	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasW}" height="${canvasH}">
		${fontFaceBlock}
		${tiledElements}
	</svg>`;

	return sharp(Buffer.from(svg), { density: 300 }).resize(canvasW, canvasH).png().toBuffer();
};

const renderImageLayer = async (layer: ImageWatermarkOptions, canvasW: number, canvasH: number): Promise<Buffer> => {
	const {
		image,
		widthRatio = 0.25,
		opacity = 0.5,
		position = 'center',
		tiled = false,
		margin = 48,
		angle = 0,
		grayscale = false,
		tileGap = {}
	} = layer;

	const targetW = Math.round(canvasW * widthRatio);

	let wmSharp = sharp(image).resize({ width: targetW, withoutEnlargement: true });
	if (grayscale) wmSharp = wmSharp.grayscale();

	const { data: rawData, info } = await wmSharp.ensureAlpha().raw().toBuffer({ resolveWithObject: true });

	for (let i = 3; i < rawData.length; i += 4) {
		rawData[i] = Math.round(rawData[i] * opacity);
	}

	const wmW = info.width;
	const wmH = info.height;

	const wmBuffer = await sharp(rawData, { raw: { width: wmW, height: wmH, channels: 4 } })
		.png()
		.toBuffer();

	if (tiled) {
		const gapX = tileGap.x ?? 20;
		const gapY = tileGap.y ?? 20;
		const stepX = wmW + gapX;
		const stepY = wmH + gapY;

		const compositeInputs: sharp.OverlayOptions[] = [];
		for (let row = -1; row * stepY < canvasH + stepY; row++) {
			for (let col = -1; col * stepX < canvasW + stepX; col++) {
				const left = col * stepX;
				const top = row * stepY;
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

	// Single positioned image — rotate if needed then place on canvas
	let finalWm: Buffer;
	if (angle !== 0) {
		// Rotate the watermark with a transparent background
		finalWm = await sharp(wmBuffer)
			.rotate(angle, { background: { r: 0, g: 0, b: 0, alpha: 0 } })
			.png()
			.toBuffer();
	} else {
		finalWm = wmBuffer;
	}

	const finalMeta = await sharp(finalWm).metadata();
	const finalW = finalMeta.width ?? wmW;
	const finalH = finalMeta.height ?? wmH;

	const { x, y } = resolvePosition(position, canvasW, canvasH, margin);

	// Clamp to canvas bounds
	const left = Math.max(0, Math.min(canvasW - finalW, Math.round(x - finalW / 2)));
	const top = Math.max(0, Math.min(canvasH - finalH, Math.round(y - finalH / 2)));

	return sharp({
		create: { width: canvasW, height: canvasH, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } }
	})
		.composite([{ input: finalWm, left, top }])
		.png()
		.toBuffer();
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
