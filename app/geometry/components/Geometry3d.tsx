'use client';

import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { GeometryProps } from './contracts';
import { getPalette } from './generators';

// Suppress THREE.Clock deprecation warning from OrbitControls
if (typeof window !== 'undefined') {
	const originalWarn = console.warn;
	console.warn = (...args: any[]) => {
		if (typeof args[0] === 'string' && args[0].includes('THREE.Clock')) {
			return;
		}
		originalWarn(...args);
	};
}

type Geometry3dProps = Partial<GeometryProps> & {
	voxels: any[];
	voxelCount: number;
	symmetry: boolean;
	maxHeight: number;
	_remakeCount: number;
	shape: any;
	paletteType: any;
	nodeStyle: any;
	lineStyle: any;
	rotation: number;
};

function VoxelMesh({ voxels = [], paletteType }: Geometry3dProps) {
	const palette = getPalette(paletteType);
	const groupRef = useRef<THREE.Group>(null);

	const meshes = useMemo(
		() =>
			!voxels || voxels.length === 0
				? []
				: voxels.map((voxel, index) => {
						const [x, y, z] = voxel;
						const color = new THREE.Color(palette.start).lerp(new THREE.Color(palette.end), index / voxels.length);

						return (
							<mesh key={index} position={[x, z, y]}>
								<boxGeometry args={[0.8, 0.8, 0.8]} />
								<meshPhongMaterial color={color} emissive={new THREE.Color(palette.mid).multiplyScalar(0.3)} />
							</mesh>
						);
					}),
		[voxels, palette.start, palette.end, palette.mid]
	);

	return <group ref={groupRef}>{meshes}</group>;
}

export function Geometry3D(props: Geometry3dProps) {
	// Debug log
	if (typeof window !== 'undefined') {
		console.log('Geometry3D received props:', props);
		console.log('Voxels in Geometry3D:', props.voxels);
	}

	return (
		<div className="h-full w-full">
			<Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
				<PerspectiveCamera makeDefault position={[0, 0, 15]} fov={50} />

				{/* Lighting */}
				<ambientLight intensity={0.6} />
				<directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
				<directionalLight position={[-10, -10, -10]} intensity={0.4} color="#4a7c9e" />
				<pointLight position={[0, 5, 5]} intensity={0.8} color="#ff6b9d" />

				{/* Mesh */}
				<VoxelMesh {...props} />

				{/* Controls */}
				<OrbitControls autoRotate autoRotateSpeed={4} />
			</Canvas>
		</div>
	);
}
