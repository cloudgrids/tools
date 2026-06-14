import { Badge } from '@/components/ui/badge';
import { ImageIcon, Sparkles } from 'lucide-react';

interface WatermarkHeaderProps {
	files: File[];
	watermarked: string[];
}

export const WatermarkHeader: React.FC<WatermarkHeaderProps> = ({ files, watermarked }) => {
	return (
		<div className="flex flex-col gap-4 rounded-xl border bg-background p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-lg border bg-primary/10 text-primary">
					<Sparkles className="size-5" />
				</div>

				<div>
					<h1 className="text-xl font-semibold tracking-tight">Watermark Images</h1>
					<p className="text-sm text-muted-foreground">Upload, tune, preview, select, and export watermarked images.</p>
				</div>
			</div>

			<div className="flex flex-wrap items-center gap-2">
				<Badge variant="outline">
					<ImageIcon className="size-3" />
					{files.length} file{files.length === 1 ? '' : 's'}
				</Badge>
				<Badge variant="outline">{watermarked.length ? 'Processed' : 'Draft'}</Badge>
			</div>
		</div>
	);
};
