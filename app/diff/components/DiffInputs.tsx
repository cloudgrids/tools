import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { DiffState } from './Diff';

interface DiffInputsProps {
	state: DiffState;
	onSetState: React.Dispatch<React.SetStateAction<DiffState>>;
}

export const DiffInputs: React.FC<DiffInputsProps> = ({ state, onSetState }) => (
	<div className="grid gap-4 lg:grid-cols-2">
		{[
			{ id: 'diff-a', title: 'Original', key: 'textA' as const, placeholder: 'Paste original text here…' },
			{ id: 'diff-b', title: 'Modified', key: 'textB' as const, placeholder: 'Paste modified text here…' }
		].map(({ id, title, key, placeholder }) => (
			<Card key={id} className="min-w-0">
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<CardTitle>{title}</CardTitle>
						<Button variant="ghost" size="sm" onClick={() => onSetState((prev) => ({ ...prev, [key]: '' }))}>
							Clear
						</Button>
					</div>
				</CardHeader>
				<CardContent>
					<Textarea
						id={id}
						className="h-64 font-mono text-sm"
						value={state[key]}
						onChange={(e) => onSetState((prev) => ({ ...prev, [key]: e.target.value }))}
						placeholder={placeholder}
						spellCheck={false}
					/>
				</CardContent>
			</Card>
		))}
	</div>
);
