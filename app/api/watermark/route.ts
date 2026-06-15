import { applyWatermark } from '@/lib/watermark';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const getOptions = (value: FormDataEntryValue | null) => {
	if (typeof value !== 'string') return {};

	try {
		return JSON.parse(value);
	} catch {
		return {};
	}
};

export async function POST(request: NextRequest) {
	try {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const options = getOptions(formData.get('options'));

		if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const watermarkedBuffer = await applyWatermark(buffer, options);

		return new NextResponse(new Uint8Array(watermarkedBuffer), {
			status: 200,
			headers: {
				'Content-Type': 'image/jpeg',
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
