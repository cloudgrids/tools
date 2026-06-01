import {
	GenerateVoxelOptions,
	GeometryBackground,
	GeometryPalette,
	GeometryPaletteType,
	GeometryShape,
	MeshData,
	ProjectedGeometry,
	Voxel
} from './contracts';

export const getDirections = (shape: GeometryShape) => {
	switch (shape) {
		case 'organic':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1]
			];
		case 'tower':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0]
			];
		case 'ring':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0]
			];
		case 'crystal':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1],
				[1, 1, 0],
				[-1, -1, 0],
				[1, -1, 0],
				[-1, 1, 0]
			];
		case 'dense':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1]
			];
		case 'flat':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0]
			];
		case 'chaotic':
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1],
				[1, 1, 0],
				[-1, -1, 0],
				[1, -1, 0],
				[-1, 1, 0]
			];
		default:
			return [
				[1, 0, 0],
				[-1, 0, 0],
				[0, 1, 0],
				[0, -1, 0],
				[0, 0, 1],
				[0, 0, -1]
			];
	}
};

export const getBackgroundStyles = (background: GeometryBackground) => {
	switch (background) {
		case 'dark':
			return { backgroundColor: '#1a1a1a' };
		case 'light':
			return { backgroundColor: '#f5f5f5' };
		case 'gradient':
			return { background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' };
		case 'glass':
			return { backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)' };
		case 'transparent':
		default:
			return { backgroundColor: 'transparent' };
	}
};

export const getPalette = (palette: GeometryPaletteType): GeometryPalette => {
	switch (palette) {
		case 'fire':
			return {
				start: '#ff9a9e',
				mid: '#fad0c4',
				end: '#fad0c4'
			};
		case 'ocean':
			return {
				start: '#a1c4fd',
				mid: '#c2e9fb',
				end: '#c2e9fb'
			};
		case 'forest':
			return {
				start: '#d4fc79',
				mid: '#96e6a1',
				end: '#96e6a1'
			};
		case 'sunset':
			return {
				start: '#fbc2eb',
				mid: '#a6c1ee',
				end: '#a6c1ee'
			};
		case 'neon':
			return {
				start: '#f0f',
				mid: '#0ff',
				end: '#f0f'
			};
		case 'pastel':
			return {
				start: '#ff9a9e',
				mid: '#fad0c4',
				end: '#fbc2eb'
			};
		default:
			return {
				start: '#fff',
				mid: '#fff',
				end: '#fff'
			};
	}
};

export function projectIsometric(vertices: string[], padding: number = 4, rotation: number = 6): ProjectedGeometry {
	const projectedPoints = vertices.map((v) => {
		const [x, y, z] = v.split(',').map(Number);

		const px = (x - z) * Math.cos(Math.PI / rotation);

		const py = -y + (x + z) * Math.sin(Math.PI / rotation);

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

export function generateVoxelCluster({
	voxelCount = 20,
	symmetry = true,
	maxHeight = 4,
	_remakeCount = 0,
	shape
}: GenerateVoxelOptions): Voxel[] {
	const voxels: Voxel[] = [[0, 0, 0]];

	const occupied = new Set<string>(['0,0,0']);

	const directions = getDirections(shape);

	const addVoxel = (x: number, y: number, z: number) => {
		const key = `${x},${y},${z}`;

		if (occupied.has(key)) return false;

		occupied.add(key);

		voxels.push([x, y, z]);

		return true;
	};

	while (voxels.length < voxelCount) {
		const base = voxels[Math.floor(Math.random() * voxels.length)];

		const dir = directions[Math.floor(Math.random() * directions.length)];

		const nx = base[0] + dir[0];
		const ny = Math.max(0, Math.min(maxHeight, base[1] + dir[1]));
		const nz = base[2] + dir[2];

		const added = addVoxel(nx, ny, nz);

		if (added && symmetry && voxels.length < voxelCount) addVoxel(-nx, ny, nz);
	}

	return voxels.slice(0, voxelCount);
}

export function buildVoxelMesh(voxels: Voxel[]): MeshData {
	const edgesSet = new Set<string>();
	const verticesSet = new Set<string>();

	voxels.forEach(([x, y, z]) => {
		const v = [
			`${x},${y},${z}`,
			`${x + 1},${y},${z}`,
			`${x + 1},${y},${z + 1}`,
			`${x},${y},${z + 1}`,

			`${x},${y + 1},${z}`,
			`${x + 1},${y + 1},${z}`,
			`${x + 1},${y + 1},${z + 1}`,
			`${x},${y + 1},${z + 1}`
		];

		v.forEach((vertex) => verticesSet.add(vertex));

		const edgePairs = [
			[v[0], v[1]],
			[v[1], v[2]],
			[v[2], v[3]],
			[v[3], v[0]],

			[v[4], v[5]],
			[v[5], v[6]],
			[v[6], v[7]],
			[v[7], v[4]],

			[v[0], v[4]],
			[v[1], v[5]],
			[v[2], v[6]],
			[v[3], v[7]]
		];

		edgePairs.forEach(([a, b]) => {
			const edge = [a, b].sort().join('|');

			edgesSet.add(edge);
		});
	});

	const vertices = Array.from(verticesSet);

	const vertexToIndex = new Map(vertices.map((v, i) => [v, i]));

	const lines: [number, number][] = Array.from(edgesSet).map((edge) => {
		const [a, b] = edge.split('|');

		return [vertexToIndex.get(a)!, vertexToIndex.get(b)!];
	});

	return {
		vertices,
		lines
	};
}

export const LINE_STYLES: Record<string, number> = {
	solid: 0.8,
	thin: 1.4,
	glow: 2.5
};

export const NODE_STYLES: Record<string, string> = {
	dots: 'circle',
	glow: 'glow',
	none: 'none'
};
