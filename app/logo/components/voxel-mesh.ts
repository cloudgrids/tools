import type { Voxel } from './voxel-generator';

export interface MeshData {
	vertices: string[];
	lines: [number, number][];
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
