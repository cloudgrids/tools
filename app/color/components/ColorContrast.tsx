import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { contrastRatio } from '@/lib/color';
import { Check, X } from 'lucide-react';
import type { ColorState } from './Color';

type ContrastResult = ReturnType<typeof contrastRatio>;

interface ColorContrastProps {
	state: ColorState;
	contrast: ContrastResult | null;
	onSetState: React.Dispatch<React.SetStateAction<ColorState>>;
}

function WcagBadge({ pass, label }: { pass: boolean; label: string }) {
	return (
		<span className={`px-2 py-1 rounded text-xs font-medium ${pass ? 'bg-green-100 text-green-900' : 'bg-red-100 text-red-900'}`}>
			{label} {pass ? <Check className="inline size-3.5" aria-hidden="true" /> : <X className="inline size-3.5" aria-hidden="true" />}
		</span>
	);
}

export const ColorContrast: React.FC<ColorContrastProps> = ({ state, contrast, onSetState }) => (
	<Card>
		<CardHeader>
			<CardTitle>WCAG Contrast Checker</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="grid gap-4 md:grid-cols-2">
				<div className="rounded-lg border-2 border-input p-4" style={{ background: state.contrastBg }}>
					<div className="mb-2 text-2xl font-bold" style={{ color: state.contrastText }}>
						Large Text Sample (18px+)
					</div>
					<div className="text-sm" style={{ color: state.contrastText }}>
						Normal text for readability check — The quick brown fox.
					</div>
				</div>
				<div className="space-y-4">
					{[
						{ label: 'Text Color', key: 'contrastText' as const, value: state.contrastText },
						{ label: 'Background Color', key: 'contrastBg' as const, value: state.contrastBg }
					].map(({ label, key, value }) => (
						<div key={key}>
							<label className="text-sm font-medium">{label}</label>
							<div className="mt-1 flex items-center gap-2">
								<input
									type="color"
									value={value}
									onChange={(e) => onSetState((prev) => ({ ...prev, [key]: e.target.value }))}
									className="h-8 w-12 cursor-pointer rounded border-input"
								/>
								<span className="font-mono text-xs text-secondary-foreground">{value}</span>
							</div>
						</div>
					))}
					{contrast && (
						<div className="mt-4">
							<div className="mb-2 text-3xl font-bold">{contrast.ratio}:1</div>
							<div className="flex flex-wrap gap-2">
								<WcagBadge pass={contrast.aaSmall} label="AA Normal" />
								<WcagBadge pass={contrast.aaLarge} label="AA Large" />
								<WcagBadge pass={contrast.aaaSmall} label="AAA Normal" />
								<WcagBadge pass={contrast.aaaLarge} label="AAA Large" />
							</div>
						</div>
					)}
				</div>
			</div>
		</CardContent>
	</Card>
);
