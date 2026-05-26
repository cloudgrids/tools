import { CodeOutput } from '@/components/ToolUi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback } from 'react';
import { Base64State } from './Base64';

interface Base64TextTabProps {
	state: Base64State;
	onSetState: React.Dispatch<React.SetStateAction<Base64State>>;
}

export const Base64TextTab: React.FC<Base64TextTabProps> = ({ onSetState, state }) => {
	const handleEncode = useCallback(() => {
		try {
			const enc = Buffer.from(state.input, 'utf-8').toString('base64');
			onSetState((prev) => ({
				...prev,
				output: enc,
				stats: `Input: ${state.input.length} chars · Output: ${enc.length} chars · +${((enc.length / Math.max(state.input.length, 1) - 1) * 100).toFixed(1)}%`
			}));
		} catch (e) {
			onSetState((prev) => ({ ...prev, output: `Error: ${(e as Error).message}` }));
		}
	}, [state.input, onSetState]);

	const handleDecode = useCallback(() => {
		try {
			const dec = decodeURIComponent(Buffer.from(state.input, 'base64').toString('utf-8'));
			onSetState((prev) => ({
				...prev,
				output: dec,
				stats: `Input: ${state.input.trim().length} chars · Output: ${dec.length} chars`
			}));
		} catch {
			onSetState((prev) => ({ ...prev, output: 'Error: Invalid Base64 input', stats: '' }));
		}
	}, [state.input, onSetState]);

	const handleEncodeUrl = useCallback(() => {
		try {
			const enc = Buffer.from(encodeURIComponent(state.input), 'utf-8')
				.toString('base64')
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=/g, '');

			onSetState((prev) => ({
				...prev,
				output: enc,
				stats: `URL-safe Base64 · ${enc.length} chars`
			}));
		} catch (e) {
			onSetState((prev) => ({ ...prev, output: `Error: ${(e as Error).message}` }));
		}
	}, [state.input, onSetState]);

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card className="min-w-0">
				<CardHeader>
					<CardTitle className="flex flex-wrap items-center justify-between gap-2">
						<span>Input</span>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => onSetState((prev) => ({ ...prev, input: '', output: '', stats: '' }))}
						>
							Clear
						</Button>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Textarea
						id="b64-input"
						className="h-72 font-mono text-sm"
						value={state.input}
						onChange={(e) => onSetState((prev) => ({ ...prev, input: e.target.value }))}
						placeholder="Enter text to encode or Base64 to decode…"
						spellCheck={false}
					/>
					<div className="mt-4 flex flex-wrap gap-2">
						<Button onClick={handleEncode}>
							<ArrowUp data-icon="inline-start" />
							Encode
						</Button>
						<Button variant="outline" onClick={handleDecode}>
							<ArrowDown data-icon="inline-start" />
							Decode
						</Button>
						<Button variant="outline" onClick={handleEncodeUrl}>
							URL-safe
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="min-w-0">
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<CardTitle>Output</CardTitle>
						<CopyButton text={state.output} label="Copy" />
					</div>
				</CardHeader>
				<CardContent>
					<CodeOutput id="b64-output" className="h-72">
						{state.output}
					</CodeOutput>
					{state.stats && <div className="text-xs text-muted-foreground mt-4">{state.stats}</div>}
				</CardContent>
			</Card>
		</div>
	);
};
