import { writeFile } from 'fs/promises';
import { ImageResponse } from 'next/og';
import { join } from 'path';

export default async function generateIcon(width: number, height: number, name: string, subPath: string) {
	const res = new ImageResponse(
		<div
			style={{
				width,
				height,
				color: 'white',
				backgroundColor: 'blue',
				position: 'relative',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		></div>,
		{ width, height }
	);

	const buffer = Buffer.from(await res.arrayBuffer());
	const outputPath = join(process.cwd(), 'public', subPath, name);

	await writeFile(outputPath, buffer);

	console.log(`Generated ${outputPath}`);
}

async function run() {
	await generateIcon(1080, 1920, 'mobile.png', 'screenshots');
	await generateIcon(1920, 1080, 'desktop.png', 'screenshots');
	await generateIcon(180, 180, 'apple-icon-180.png', 'icons');
	await generateIcon(192, 192, 'icon-192.png', 'icons');
	await generateIcon(512, 512, 'icon-512.png', 'icons');
}

run();
