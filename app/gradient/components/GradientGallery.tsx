import { ToolPanel } from '@/components/ToolUi';
import type { ColorStop } from '@/lib/contracts';
import { buildGradientCss } from '@/lib/gradient';
import { GRADIENT_GALLERY } from '@/lib/tool-samples';

interface GradientGalleryProps {
	onApply: (stops: ColorStop[]) => void;
}

export const GradientGallery: React.FC<GradientGalleryProps> = ({ onApply }) => (
	<ToolPanel title="Gradient Gallery" contentClassName="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
		{GRADIENT_GALLERY.map((stops, index) => {
			const background = buildGradientCss('linear', 135, stops);
			return (
				<button
					key={background}
					type="button"
					className="h-20 rounded-lg border border-input transition-transform hover:scale-105"
					style={{ background }}
					onClick={() => onApply(stops)}
					aria-label={`Apply gradient ${index + 1}`}
				/>
			);
		})}
	</ToolPanel>
);
