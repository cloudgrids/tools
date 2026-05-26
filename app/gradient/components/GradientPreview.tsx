import { CodeOutput, ToolPanel } from '@/components/ToolUi';
import { CopyButton } from '@/components/ui/CopyButton';
import { Label } from '@/components/ui/label';

interface GradientPreviewProps {
	css: string;
}

export const GradientPreview: React.FC<GradientPreviewProps> = ({ css }) => {
	const cssProperty = `background-image: ${css};`;

	return (
		<ToolPanel title="Preview" contentClassName="space-y-4">
			<div className="h-48 rounded-lg border border-input" style={{ background: css }} />
			<div className="space-y-2">
				<div className="flex items-center justify-between">
					<Label>CSS Output</Label>
					<CopyButton text={cssProperty} label="Copy" />
				</div>
				<CodeOutput className="min-h-16">{cssProperty}</CodeOutput>
			</div>
			<div className="space-y-2">
				<Label>Shorthand</Label>
				<CodeOutput className="min-h-16">{`background: ${css};\nbackground-attachment: fixed;`}</CodeOutput>
			</div>
		</ToolPanel>
	);
};
