import type { WatermarkProps } from '@/lib/contracts';
import { WatermarkLayer } from '@/lib/enumerations';
import { applyWatermark } from '@/lib/watermark';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getOptions = (value: FormDataEntryValue | null): WatermarkProps | null => {
	if (typeof value !== 'string') return null;
	try {
		return JSON.parse(value) as WatermarkProps;
	} catch {
		return null;
	}
};

const MIME_MAP: Record<string, string> = {
	jpeg: 'image/jpeg',
	png: 'image/png',
	webp: 'image/webp'
};

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File | null;
		const options = getOptions(formData.get('options'));

		if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
		if (!options) return NextResponse.json({ error: 'Invalid options' }, { status: 400 });

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const {
			mode = 'text',
			opacity,
			angle,
			blend,
			position,
			tiled,
			margin,
			outputFormat = 'jpeg',
			quality = 100,
			text,
			fontSize,
			color,
			strokeWidth,
			strokeColor,
			imageDataUri,
			widthRatio,
			grayscale,
			tileGapX,
			tileGapY
		} = options;

		// Build layers based on mode
		const layers: WatermarkLayer[] = [];

		if ((mode === 'text' || mode === 'both') && text?.trim()) {
			layers.push({
				type: 'text',
				text,
				fontSize,
				color,
				opacity,
				angle,
				blend,
				position,
				tiled,
				margin,
				strokeWidth,
				strokeColor
			});
		}

		if ((mode === 'image' || mode === 'both') && imageDataUri) {
			// Decode base64 data-URI → Buffer
			const base64Data = imageDataUri.replace(/^data:[^;]+;base64,/, '');
			const imageBuffer = Buffer.from(base64Data, 'base64');

			layers.push({
				type: 'image',
				image: imageBuffer,
				opacity,
				angle,
				blend,
				position,
				tiled,
				margin,
				widthRatio,
				grayscale,
				tileGap: { x: tileGapX, y: tileGapY }
			});
		}

		if (layers.length === 0) {
			return NextResponse.json({ error: 'No watermark content specified.' }, { status: 400 });
		}

		const watermarkedBuffer = await applyWatermark(buffer, { layers, outputFormat, quality });

		return new NextResponse(new Uint8Array(watermarkedBuffer), {
			status: 200,
			headers: {
				'Content-Type': MIME_MAP[outputFormat] ?? 'image/jpeg',
				'Cache-Control': 'no-store, no-cache, must-revalidate',
				'Pragma': 'no-cache',
				'Expires': '0',
				'x-timestamp': Date.now().toString()
			}
		});
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
	}
}
