export type Voxel = [number, number, number];

export interface GenerateVoxelOptions {
	voxelCount?: number;
	symmetry?: boolean;
	maxHeight?: number;
	_remakeCount?: number;
}

export function generateVoxelCluster({ voxelCount = 20, symmetry = true, maxHeight = 4, _remakeCount = 0 }: GenerateVoxelOptions): Voxel[] {
	const voxels: Voxel[] = [[0, 0, 0]];

	const occupied = new Set<string>(['0,0,0']);

	const directions: Voxel[] = [
		[1, 0, 0],
		[-1, 0, 0],
		[0, 1, 0],
		[0, -1, 0],
		[0, 0, 1],
		[0, 0, -1]
	];

	const addVoxel = (x: number, y: number, z: number) => {
		const key = `${x},${y},${z}`;

		if (occupied.has(key)) {
			return false;
		}

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

		if (added && symmetry && voxels.length < voxelCount) {
			addVoxel(-nx, ny, nz);
		}
	}

	return voxels.slice(0, voxelCount);
}
