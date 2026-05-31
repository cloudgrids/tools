'use client';

import { useMemo } from 'react';

import { projectIsometric } from './isometric-project';
import { SvgRenderer } from './SvgRenderer';
import { generateVoxelCluster, GenerateVoxelOptions } from './voxel-generator';
import { buildVoxelMesh } from './voxel-mesh';

interface LogoProps extends GenerateVoxelOptions {
	width?: number | string;
	height?: number | string;
	className?: string;
}

export function RandomLogo({
	width = '100%',
	height = '100%',
	className,
	voxelCount = 20,
	symmetry = true,
	maxHeight = 4,
	_remakeCount = 0
}: LogoProps = {}) {
	const geometry = useMemo(() => {
		const voxels = generateVoxelCluster({
			voxelCount,
			symmetry,
			_remakeCount,
			maxHeight
		});

		const mesh = buildVoxelMesh(voxels);

		const projected = projectIsometric(mesh.vertices);

		return {
			points: projected.points,
			lines: mesh.lines,
			viewBox: projected.viewBox
		};
	}, [voxelCount, _remakeCount, symmetry, maxHeight]);

	return (
		<SvgRenderer
			points={geometry.points}
			lines={geometry.lines}
			viewBox={geometry.viewBox}
			width={width}
			height={height}
			className={className}
		/>
	);
}
