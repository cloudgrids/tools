import { ToolPanel } from '@/components/ToolUi';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { ColorStop } from '@/lib/contracts';
import type { GradientType } from '@/lib/enumerations';
import { GRADIENT_PRESETS } from '@/lib/tool-samples';
import type { GradientState } from './Gradient';

interface GradientControlsProps {
	state: GradientState;
	onSetState: React.Dispatch<React.SetStateAction<GradientState>>;
	onUpdateStop: (index: number, patch: Partial<ColorStop>) => void;
}

const TYPES: GradientType[] = ['linear', 'radial', 'conic'];

export const GradientControls: React.FC<GradientControlsProps> = ({ state, onSetState, onUpdateStop }) => (
	<ToolPanel title="Controls" contentClassName="space-y-6">
		<div className="space-y-2">
			<Label>Type</Label>
			<div className="flex flex-wrap gap-2">
				{TYPES.map((value) => (
					<Button
						key={value}
						variant={state.type === value ? 'default' : 'outline'}
						onClick={() => onSetState((prev) => ({ ...prev, type: value }))}
					>
						{value.charAt(0).toUpperCase() + value.slice(1)}
					</Button>
				))}
			</div>
		</div>

		{state.type !== 'radial' && (
			<div className="space-y-3">
				<Label>Angle: {state.angle}°</Label>
				<Slider
					min={0}
					max={360}
					value={[state.angle]}
					onValueChange={(values) => onSetState((prev) => ({ ...prev, angle: typeof values === 'number' ? values : (values[0] ?? 0) }))}
				/>
			</div>
		)}

		<div className="space-y-3">
			<Label>Color Stops</Label>
			{state.stops.map((stop, index) => (
				<div key={`${stop.color}-${index}`} className="flex flex-wrap items-center gap-3">
					<input
						type="color"
						value={stop.color}
						onChange={(e) => onUpdateStop(index, { color: e.target.value })}
						className="h-8 w-10 cursor-pointer rounded border border-input"
					/>
					<Slider
						className="min-w-28 flex-1"
						min={0}
						max={100}
						value={[stop.pos]}
						onValueChange={(values) => onUpdateStop(index, { pos: typeof values === 'number' ? values : (values[0] ?? 0) })}
					/>
					<span className="w-10 text-sm text-muted-foreground">{stop.pos}%</span>
					{state.stops.length > 2 && (
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onSetState((prev) => ({ ...prev, stops: prev.stops.filter((_, i) => i !== index) }))}
						>
							Remove
						</Button>
					)}
				</div>
			))}
			<Button
				variant="outline"
				size="sm"
				onClick={() => onSetState((prev) => ({ ...prev, stops: [...prev.stops, { color: '#ffffff', pos: 75 }] }))}
			>
				Add Stop
			</Button>
		</div>

		<div className="space-y-2">
			<Label>Presets</Label>
			<div className="flex flex-wrap gap-2">
				{GRADIENT_PRESETS.map((preset) => (
					<Button
						key={preset.name}
						variant="outline"
						size="sm"
						onClick={() => onSetState((prev) => ({ ...prev, stops: preset.stops.map((s) => ({ ...s })) }))}
					>
						{preset.name}
					</Button>
				))}
			</div>
		</div>
	</ToolPanel>
);
