import { ToolPanel } from '@/components/ToolUi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import type { PasswordState } from './Password';

interface PasswordConfigProps {
	state: PasswordState;
	onSetState: React.Dispatch<React.SetStateAction<PasswordState>>;
	onRegenerate: () => void;
}

const CHAR_OPTIONS = [
	{ id: 'pw-upper', label: 'Uppercase (A-Z)', key: 'upper' as const },
	{ id: 'pw-lower', label: 'Lowercase (a-z)', key: 'lower' as const },
	{ id: 'pw-digits', label: 'Digits (0-9)', key: 'digits' as const },
	{ id: 'pw-symbols', label: 'Symbols (!@#...)', key: 'symbols' as const }
];

export const PasswordConfig: React.FC<PasswordConfigProps> = ({ state, onSetState, onRegenerate }) => (
	<ToolPanel title="Configuration" contentClassName="space-y-6">
		<div className="space-y-3">
			<Label htmlFor="pw-length">Length: {state.length}</Label>
			<Slider
				id="pw-length"
				min={8}
				max={128}
				step={1}
				value={[state.length]}
				onValueChange={(values) =>
					onSetState((prev) => ({ ...prev, length: typeof values === 'number' ? values : (values[0] ?? 20) }))
				}
			/>
		</div>
		<div className="grid gap-3 sm:grid-cols-2">
			{CHAR_OPTIONS.map(({ id, label, key }) => (
				<label
					key={id}
					className="flex items-center justify-between gap-3 rounded-lg border border-input bg-muted/30 px-3 py-2"
					htmlFor={id}
				>
					<span className="text-sm">{label}</span>
					<Switch
						id={id}
						checked={state.options[key]}
						onCheckedChange={(checked) =>
							onSetState((prev) => ({ ...prev, options: { ...prev.options, [key]: checked } }))
						}
					/>
				</label>
			))}
		</div>
		<div className="flex flex-wrap items-end gap-4">
			<div className="space-y-2">
				<Label htmlFor="pw-count">Count</Label>
				<Input
					id="pw-count"
					type="number"
					className="w-20"
					min={1}
					max={50}
					value={state.count}
					onChange={(e) =>
						onSetState((prev) => ({ ...prev, count: Math.max(1, Math.min(50, Number(e.target.value))) }))
					}
				/>
			</div>
			<Button onClick={onRegenerate}>Generate</Button>
		</div>
	</ToolPanel>
);
