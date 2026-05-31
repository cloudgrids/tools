'use client';

import ToolsLogo from '@/components/ToolsLogo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { Boxes, Layers3, RotateCcw, Sparkles } from 'lucide-react';

import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { RandomLogo } from './RandomLogo';

export const Logo = () => {
	const [symmetry, setSymmetry] = useState<boolean>(true);
	const [generate, setGenerate] = useState<boolean>(false);
	const [remakeCount, setRemakeCount] = useState<number>(0);
	const [voxelCount, setVoxelCount] = useState<number>(20);
	const [maxHeight, setMaxHeight] = useState<number>(4);

	return (
		<Card className="overflow-hidden border-border/60 bg-background/70 backdrop-blur-xl">
			<CardHeader className="space-y-4">
				<div className="flex flex-wrap items-start justify-between gap-4">
					<div className="space-y-1">
						<CardTitle className="flex items-center gap-2 text-lg">
							<Sparkles className="size-4" />
							Procedural Logo Generator
						</CardTitle>

						<CardDescription>Generate voxel-based procedural identities dynamically</CardDescription>
					</div>

					<Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
						Experimental
					</Badge>
				</div>

				<Separator />

				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
					{/* Generate / Remake */}
					<div className="rounded-xl border bg-muted/30 p-3">
						<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<RotateCcw className="size-3.5" />
							Generation
						</div>

						<div className="flex gap-2">
							{!generate ? (
								<Button size="sm" className="w-full" onClick={() => setGenerate(true)}>
									Generate
								</Button>
							) : (
								<Button size="sm" className="w-full" onClick={() => setRemakeCount((prev) => prev + 1)}>
									Remake
								</Button>
							)}
						</div>
					</div>

					{/* Symmetry */}
					<div className="rounded-xl border bg-muted/30 p-3">
						<div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
							<Layers3 className="size-3.5" />
							Symmetry
						</div>

						<Button
							size="sm"
							variant={symmetry ? 'default' : 'secondary'}
							className="w-full"
							onClick={() => setSymmetry((prev) => !prev)}
						>
							{symmetry ? 'Enabled' : 'Disabled'}
						</Button>
					</div>

					{/* Height */}
					<div className="rounded-xl border bg-muted/30 p-3">
						<div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
							<span>Max Height</span>

							<Badge variant="outline">{maxHeight}</Badge>
						</div>

						<div className="flex gap-2">
							<Button
								size="sm"
								variant="secondary"
								className="flex-1"
								onClick={() => setMaxHeight((prev) => Math.max(1, prev - 1))}
							>
								-
							</Button>

							<Button size="sm" variant="secondary" className="flex-1" onClick={() => setMaxHeight((prev) => prev + 1)}>
								+
							</Button>
						</div>
					</div>

					{/* Voxels */}
					<div className="rounded-xl border bg-muted/30 p-3">
						<div className="mb-2 flex items-center justify-between text-xs font-medium text-muted-foreground">
							<div className="flex items-center gap-2">
								<Boxes className="size-3.5" />

								<span>Voxel Count</span>
							</div>

							<Badge variant="outline">{voxelCount}</Badge>
						</div>

						<div className="flex gap-2">
							<Button
								size="sm"
								variant="secondary"
								className="flex-1"
								onClick={() => setVoxelCount((prev) => Math.max(5, prev - 5))}
							>
								-5
							</Button>

							<Button size="sm" variant="secondary" className="flex-1" onClick={() => setVoxelCount((prev) => prev + 5)}>
								+5
							</Button>
						</div>
					</div>
				</div>
			</CardHeader>

			<CardContent>
				<div className="relative flex h-80 items-center justify-center overflow-hidden rounded-2xl border bg-linear-to-br from-muted/40 via-background to-muted/20">
					{/* background glow */}
					<div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08),transparent_70%)]" />

					{/* logo */}
					<div className="relative z-10 transition-all duration-500 hover:scale-[1.03]">
						{!generate ? (
							<ToolsLogo width={120} height={120} />
						) : (
							<RandomLogo
								width={220}
								height={220}
								voxelCount={voxelCount}
								_remakeCount={remakeCount}
								maxHeight={maxHeight}
								symmetry={symmetry}
							/>
						)}
					</div>

					{/* subtle grid */}
					<div className="pointer-events-none absolute inset-0 opacity-[0.04]">
						<div className="h-full w-full bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-size-[24px_24px]" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
