import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';

interface Shade {
	hex: string;
	l: number;
}

interface ColorShadesProps {
	shades: Shade[];
	onPickerChange: (hex: string) => void;
}

export const ColorShades: React.FC<ColorShadesProps> = ({ shades, onPickerChange }) => (
	<Card className="min-w-0">
		<CardHeader>
			<CardTitle>Shades &amp; Tints</CardTitle>
		</CardHeader>
		<CardContent className="space-y-2">
			{shades.map(({ hex: sh, l }) => (
				<div
					key={l}
					className="flex min-w-0 cursor-pointer items-center gap-3 rounded p-2 transition-colors hover:bg-muted"
					onClick={() => onPickerChange(sh)}
				>
					<div className="shrink-0 rounded border border-input" style={{ width: 40, height: 28, background: sh }} />
					<code className="min-w-0 flex-1 font-mono text-xs text-secondary-foreground">{sh}</code>
					<span className="text-xs text-muted-foreground">L{l}</span>
					<CopyButton text={sh} label="Copy" />
				</div>
			))}
		</CardContent>
	</Card>
);
