import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/input';
import type { ColorState } from './Color';

interface ColorInfo {
	rgb: string;
	hsl: string;
	cssVar: string;
	shades: { hex: string; l: number }[];
	palette: ReturnType<typeof import('@/lib/color').generatePalette>;
}

interface ColorPickerProps {
	state: ColorState;
	colorInfo: ColorInfo;
	onHexInput: (val: string) => void;
	onPickerChange: (val: string) => void;
}

const FIELDS = [
	{ label: 'HEX', id: 'color-hex', key: 'hexInput' as const, readOnly: false },
	{ label: 'RGB', id: 'color-rgb', key: 'rgb' as const, readOnly: true },
	{ label: 'HSL', id: 'color-hsl', key: 'hsl' as const, readOnly: true },
	{ label: 'CSS Variable', id: 'color-css', key: 'cssVar' as const, readOnly: true }
];

export const ColorPicker: React.FC<ColorPickerProps> = ({ state, colorInfo, onHexInput, onPickerChange }) => (
	<Card className="min-w-0">
		<CardHeader>
			<CardTitle>Color Picker</CardTitle>
		</CardHeader>
		<CardContent className="space-y-4">
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start">
				<input
					type="color"
					id="color-picker"
					value={state.hex}
					onChange={(e) => onPickerChange(e.target.value)}
					className="h-24 w-24 cursor-pointer rounded-lg border-2 border-input"
				/>
				<div className="w-full min-w-0 flex-1 space-y-3">
					{FIELDS.map(({ label, id, key, readOnly }) => {
						const value = key === 'hexInput' ? state.hexInput : (colorInfo as unknown as Record<string, string>)[key];
						return (
							<div key={id}>
								<label htmlFor={id} className="text-sm font-medium">
									{label}
								</label>
								<div className="mt-1 flex min-w-0 gap-2">
									<Input
										id={id}
										type="text"
										className="font-mono text-xs"
										value={value}
										readOnly={readOnly}
										onChange={!readOnly ? (e) => onHexInput(e.target.value) : undefined}
										spellCheck={false}
									/>
									<CopyButton text={value} label="Copy" />
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</CardContent>
	</Card>
);
