'use client';

import ToolsLogo from '@/components/ToolsLogo';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useMemo, useState } from 'react';
import { GeometryBackground, GeometryLineStyle, GeometryNodeStyle, GeometryPaletteType, GeometryProps, GeometryShape } from './contracts';
import { generateVoxelCluster } from './generators';
import { Geometry3D } from './Geometry3d';
import { GeometryHeader } from './GeometryHeader';
import { GeometryOptions } from './GeometryOptions';
import { RandomGeometry } from './RandomGeometry';

const emptyGeometry: GeometryProps = {
	symmetry: true,
	voxelCount: 20,
	maxHeight: 4,
	_remakeCount: 0,
	background: GeometryBackground.DARK,
	className: '',
	height: '100%',
	width: '100%',
	lineStyle: GeometryLineStyle.SOLID,
	nodeStyle: GeometryNodeStyle.DOTS,
	rotation: 6,
	shape: GeometryShape.ORGANIC,
	paletteType: GeometryPaletteType.DEFAULT,
	padding: 4
};

export const Geometry = () => {
	const [geometryState, setGeometryState] = useState<GeometryProps>(emptyGeometry);
	const [generate, setGenerate] = useState(false);
	const [renderMode, setRenderMode] = useState<'2d' | '3d'>('2d');

	const voxels = useMemo(
		() =>
			generate
				? generateVoxelCluster({
						voxelCount: geometryState.voxelCount,
						symmetry: geometryState.symmetry,
						_remakeCount: geometryState._remakeCount,
						maxHeight: geometryState.maxHeight,
						shape: geometryState.shape
					})
				: [],
		[
			generate,
			geometryState.voxelCount,
			geometryState.symmetry,
			geometryState._remakeCount,
			geometryState.maxHeight,
			geometryState.shape
		]
	);

	// Debug log
	if (typeof window !== 'undefined' && generate) {
		console.log('Voxels generated:', voxels.length, voxels);
	}

	return (
		<Card className="overflow-hidden border-border/60 bg-background/70 backdrop-blur-xl">
			<CardHeader className="space-y-4">
				<GeometryHeader />
				<Separator />
				<div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border bg-linear-to-br from-muted/40 via-background to-muted/20">
					{renderMode === '2d' ? (
						<>
							<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />
							<div className="relative z-10 transition-all duration-500 hover:scale-[1.03]">
								{!generate ? <ToolsLogo width={120} height={120} /> : <RandomGeometry {...geometryState} />}
							</div>
							<div className="pointer-events-none absolute inset-0 opacity-[0.04]">
								<div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px]" />
							</div>
						</>
					) : (
						<div className="absolute inset-0 z-10">
							{!generate ? <ToolsLogo width="100%" height="100%" /> : <Geometry3D {...geometryState} voxels={voxels} />}
						</div>
					)}
				</div>
				<Separator />
			</CardHeader>
			<CardContent>
				<GeometryOptions
					geometryState={geometryState}
					setGeometryState={setGeometryState}
					renderMode={renderMode}
					setRenderMode={setRenderMode}
					generate={generate}
					setGenerate={setGenerate}
				/>
			</CardContent>
		</Card>
	);
};
