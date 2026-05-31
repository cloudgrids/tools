export interface ProjectedGeometry {
	points: [number, number][];
	viewBox: string;
}

export function projectIsometric(vertices: string[]): ProjectedGeometry {
	const projectedPoints = vertices.map((v) => {
		const [x, y, z] = v.split(',').map(Number);

		const px = (x - z) * Math.cos(Math.PI / 6);

		const py = -y + (x + z) * Math.sin(Math.PI / 6);

		return [px, py] as [number, number];
	});

	const minPx = Math.min(...projectedPoints.map((p) => p[0]));
	const maxPx = Math.max(...projectedPoints.map((p) => p[0]));

	const minPy = Math.min(...projectedPoints.map((p) => p[1]));
	const maxPy = Math.max(...projectedPoints.map((p) => p[1]));

	const cx = (minPx + maxPx) / 2;
	const cy = (minPy + maxPy) / 2;

	const widthPx = maxPx - minPx;
	const heightPy = maxPy - minPy;

	const scaleX = 124 / (widthPx || 1);
	const scaleY = 96 / (heightPy || 1);

	const scale = Math.min(scaleX, scaleY);

	const padding = 4;

	const exactWidth = widthPx * scale;
	const exactHeight = heightPy * scale;

	const viewBoxMinX = 62 - exactWidth / 2 - padding;
	const viewBoxMinY = 48 - exactHeight / 2 - padding;

	const viewBoxWidth = exactWidth + padding * 2;
	const viewBoxHeight = exactHeight + padding * 2;

	const points = projectedPoints.map((p) => [62 + (p[0] - cx) * scale, 48 + (p[1] - cy) * scale] as [number, number]);

	return {
		points,
		viewBox: `${viewBoxMinX} ${viewBoxMinY} ${viewBoxWidth} ${viewBoxHeight}`
	};
}
