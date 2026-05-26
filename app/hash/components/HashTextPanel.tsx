import { ToolPanel } from '@/components/ToolUi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { HASH_DEFAULT_TEXT } from '@/lib/tool-samples';
import type { HashState } from './Hash';

interface HashTextPanelProps {
	state: HashState;
	onSetState: React.Dispatch<React.SetStateAction<HashState>>;
	onRun: (text: string) => Promise<void>;
}

export const HashTextPanel: React.FC<HashTextPanelProps> = ({ state, onSetState, onRun }) => (
	<ToolPanel
		title="Input Text"
		action={
			<div className="flex flex-wrap gap-2">
				<Button
					variant="ghost"
					size="sm"
					onClick={() => {
						onSetState((prev) => ({ ...prev, input: HASH_DEFAULT_TEXT }));
						void onRun(HASH_DEFAULT_TEXT);
					}}
				>
					Sample
				</Button>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onSetState((prev) => ({ ...prev, input: '', results: [] }))}
				>
					Clear
				</Button>
			</div>
		}
		contentClassName="space-y-4"
	>
		<Textarea
			id="hash-input"
			className="min-h-32 font-mono text-sm"
			value={state.input}
			onChange={(e) => onSetState((prev) => ({ ...prev, input: e.target.value }))}
			placeholder="Enter text to hash..."
			spellCheck={false}
		/>
		<Button onClick={() => void onRun(state.input)} disabled={state.loading}>
			{state.loading ? 'Computing...' : 'Generate All Hashes'}
		</Button>
	</ToolPanel>
);
