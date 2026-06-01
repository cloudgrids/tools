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

		const projected = projectIsometric(mesh.vertices, padding, rotation);

		return {
			points: projected.points,
			lines: mesh.lines,
			viewBox: projected.viewBox
		};
	}, [voxelCount, _remakeCount, symmetry, maxHeight, rotation, shape, padding]);

	return (
		<SvgRenderer
			points={geometry.points}
			lines={geometry.lines}
			viewBox={geometry.viewBox}
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
