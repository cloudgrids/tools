import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useExport } from '@/hooks/useExport';
import { Download, ImageIcon, Maximize2, Sparkles } from 'lucide-react';
import { ExportProps, ImageExportFormat } from './contracts';

interface GeometryHeaderProps {
	canGenerate: boolean;
	exportState: ExportProps;
	setExportState: React.Dispatch<React.SetStateAction<ExportProps>>;
}

export const GeometryHeader: React.FC<GeometryHeaderProps> = ({ canGenerate, exportState, setExportState }) => {
	const { handleExport, loading } = useExport();

	return (
		<div className="relative overflow-hidden rounded-3xl border bg-background/80 p-6 shadow-sm backdrop-blur-xl">
			<div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
				<div className="space-y-5">
					<div className="space-y-2">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-2xl border bg-primary/10 text-primary shadow-sm">
								<Sparkles className="size-5" />
							</div>

							<div>
								<CardTitle className="text-xl font-semibold tracking-tight">Procedural Geometry Generator</CardTitle>

								<CardDescription className="mt-1 text-sm text-muted-foreground">
									Generate voxel-based procedural identities dynamically
								</CardDescription>
							</div>
						</div>

						<div className="flex flex-wrap items-center gap-2 pt-1">
							<Badge variant="secondary" className="rounded-full border px-3 py-1 text-[11px] font-medium tracking-wide">
								Experimental
							</Badge>

							<Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
								<ImageIcon className="mr-1 size-3" />
								{exportState.type.toUpperCase()}
							</Badge>

							<Badge variant="outline" className="rounded-full px-3 py-1 text-[11px]">
								<Maximize2 className="mr-1 size-3" />
								{exportState.width} × {exportState.height}
							</Badge>
						</div>
					</div>

					<div className="flex flex-col gap-3 sm:flex-row sm:items-center">
						<Button
							size="lg"
							className="min-w-42.5 rounded-xl shadow-sm"
							onClick={() => handleExport(exportState)}
							disabled={loading || !exportState.url || !canGenerate}
						>
							<Download className="mr-2 size-4" />

							{loading ? 'Exporting...' : 'Export Image'}
						</Button>

						<div className="flex gap-3">
							<div className="relative">
								<Input
									id="image-width"
									type="number"
									min={1}
									max={4096}
									step={1}
									value={exportState.width}
									onChange={(e) => {
										const newWidth = Number(e.target.value);
										setExportState((prev) => ({ ...prev, width: newWidth }));
									}}
									placeholder="Width"
									className="h-11 w-32 rounded-xl border-border/60 bg-background/60 pl-4 shadow-sm backdrop-blur"
								/>

								<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
									W
								</span>
							</div>

							<div className="relative">
								<Input
									id="image-height"
									type="number"
									min={1}
									max={4096}
									step={1}
									value={exportState.height}
									onChange={(e) => {
										const newHeight = Number(e.target.value);
										setExportState((prev) => ({ ...prev, height: newHeight }));
									}}
									placeholder="Height"
									className="h-11 w-32 rounded-xl border-border/60 bg-background/60 pl-4 shadow-sm backdrop-blur"
								/>

								<span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
									H
								</span>
							</div>

							<select
								value={exportState.type}
								onChange={(e) => setExportState((prev) => ({ ...prev, type: e.target.value as ImageExportFormat }))}
								className="h-11 rounded-xl border border-border/60 bg-background/60 px-4 text-sm shadow-sm backdrop-blur transition-colors outline-none hover:border-primary/40 focus:border-primary"
							>
								{Object.values(ImageExportFormat).map((option) => (
									<option key={option} value={option}>
										{option.toUpperCase()}
									</option>
								))}
							</select>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
