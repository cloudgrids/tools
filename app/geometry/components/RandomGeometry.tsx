'use client';

import { useMemo } from 'react';
import { GeometryProps } from './contracts';
import { buildVoxelMesh, generateVoxelCluster, projectIsometric } from './generators';
import { SvgRenderer } from './SvgRenderer';

export function RandomGeometry({
	width,
	height,
	className,
	voxelCount,
	symmetry,
	maxHeight,
	_remakeCount,
	background,
	nodeStyle,
	lineStyle,
	rotation,
	shape,
	padding,
	paletteType
}: GeometryProps) {
	const geometry = useMemo(() => {
		const voxels = generateVoxelCluster({
			voxelCount,
			symmetry,
			_remakeCount,
			maxHeight,
			shape
		});

		const mesh = buildVoxelMesh(voxels);

		return {
			vertices: mesh.vertices,
			lines: mesh.lines
		};
	}, [voxelCount, _remakeCount, symmetry, maxHeight, shape]);

	return (
		<SvgRenderer
			points={projectIsometric(geometry.vertices, padding, rotation).points}
			lines={geometry.lines}
			viewBox={projectIsometric(geometry.vertices, padding, rotation).viewBox}
			width={width}
			height={height}
			className={className}
			background={background}
			lineStyle={lineStyle}
			nodeStyle={nodeStyle}
			paletteType={paletteType}
		/>
	);
}
