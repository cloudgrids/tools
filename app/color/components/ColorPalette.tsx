import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { generatePalette } from '@/lib/color';

type Palette = ReturnType<typeof generatePalette>;

interface ColorPaletteProps {
	palette: Palette;
	onPickerChange: (hex: string) => void;
}

const PALETTE_ENTRIES: { label: string; key: keyof Palette }[] = [
	{ label: 'Base', key: 'base' },
	{ label: 'Complement', key: 'complement' },
	{ label: 'Triadic 1', key: 'triadic1' },
	{ label: 'Triadic 2', key: 'triadic2' },
	{ label: 'Analogous 1', key: 'analogous1' },
	{ label: 'Analogous 2', key: 'analogous2' },
	{ label: 'Split-C 1', key: 'splitComp1' },
	{ label: 'Split-C 2', key: 'splitComp2' }
];

export const ColorPalette: React.FC<ColorPaletteProps> = ({ palette, onPickerChange }) => (
	<Card>
		<CardHeader>
			<CardTitle>Complementary Palette</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-8">
				{PALETTE_ENTRIES.map(({ label, key }) => {
					const ph = palette[key];
					return (
						<div key={label} className="flex cursor-pointer flex-col items-center text-center">
							<div
								className="mb-2 rounded-lg border border-input transition-transform hover:scale-110"
								style={{ width: 64, height: 64, background: ph }}
								onClick={() => onPickerChange(ph)}
							/>
							<code className="block font-mono text-xs text-muted-foreground">{ph}</code>
							<div className="mt-1 text-xs text-muted-foreground">{label}</div>
						</div>
					);
				})}
			</div>
		</CardContent>
	</Card>
);
