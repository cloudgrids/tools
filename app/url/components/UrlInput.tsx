import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import type { UrlState } from './Url';

interface UrlInputProps {
	state: UrlState;
	onSetState: React.Dispatch<React.SetStateAction<UrlState>>;
	onEncode: () => void;
	onDecode: () => void;
	onEncodeComponent: () => void;
}

export const UrlInput: React.FC<UrlInputProps> = ({ state, onSetState, onEncode, onDecode, onEncodeComponent }) => (
	<Card className="min-w-0">
		<CardHeader>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<CardTitle>Input</CardTitle>
				<Button
					variant="ghost"
					size="sm"
					onClick={() => onSetState((prev) => ({ ...prev, input: '', encoded: '', decoded: '' }))}
				>
					Clear
				</Button>
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<Textarea
				id="url-input"
				className="h-40 font-mono text-sm"
				value={state.input}
				onChange={(e) => onSetState((prev) => ({ ...prev, input: e.target.value }))}
				placeholder="Enter a URL or encoded string…"
				spellCheck={false}
			/>
			<div className="flex flex-wrap gap-2">
				<Button onClick={onEncode}>Encode URI</Button>
				<Button variant="outline" onClick={onDecode}>Decode URI</Button>
				<Button variant="outline" onClick={onEncodeComponent}>Encode Component</Button>
			</div>
		</CardContent>
	</Card>
);
