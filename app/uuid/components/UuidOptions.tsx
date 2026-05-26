import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { RefreshCw } from 'lucide-react';
import type { UuidState } from './Uuid';

interface UuidOptionsProps {
	state: UuidState;
	onSetState: React.Dispatch<React.SetStateAction<UuidState>>;
	onGenerate: () => void;
}

export const UuidOptions: React.FC<UuidOptionsProps> = ({ state, onSetState, onGenerate }) => (
	<Card>
		<CardHeader>
			<CardTitle>Options</CardTitle>
		</CardHeader>
		<CardContent>
			<div className="flex flex-wrap items-end gap-4 sm:gap-6">
				<div>
					<label className="mb-1 block text-sm font-medium" htmlFor="uuid-count">
						Count
					</label>
					<Input
						id="uuid-count"
						type="number"
						className="w-20"
						min={1}
						max={100}
						value={state.count}
						onChange={(e) => onSetState((prev) => ({ ...prev, count: Math.max(1, Math.min(100, Number(e.target.value))) }))}
					/>
				</div>
				<div className="flex items-center gap-2">
					<Switch
						id="uuid-upper"
						checked={state.upper}
						onCheckedChange={(checked) => onSetState((prev) => ({ ...prev, upper: checked }))}
					/>
					<label htmlFor="uuid-upper" className="cursor-pointer text-sm font-medium">
						Uppercase
					</label>
				</div>
				<div className="flex items-center gap-2">
					<Switch
						id="uuid-nodash"
						checked={state.noDash}
						onCheckedChange={(checked) => onSetState((prev) => ({ ...prev, noDash: checked }))}
					/>
					<label htmlFor="uuid-nodash" className="cursor-pointer text-sm font-medium">
						No Dashes
					</label>
				</div>
				<Button onClick={onGenerate}>
					<RefreshCw data-icon="inline-start" />
					Regenerate
				</Button>
			</div>
		</CardContent>
	</Card>
);
