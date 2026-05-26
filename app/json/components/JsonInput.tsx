'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { JSON_SAMPLE } from '@/lib/tool-samples';
import { Sparkles } from 'lucide-react';
import type { JsonState } from './Json';

interface JsonInputProps {
	state: JsonState;
	onSetState: React.Dispatch<React.SetStateAction<JsonState>>;
	onFormat: (indent: number) => void;
	onValidate: () => void;
	onInput: (val: string) => void;
}

export const JsonInput: React.FC<JsonInputProps> = ({ state, onSetState, onFormat, onValidate, onInput }) => (
	<Card className="min-w-0">
		<CardHeader>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<CardTitle>Input JSON</CardTitle>
				<div className="flex gap-2">
					<Button variant="ghost" size="sm" onClick={() => onInput(JSON_SAMPLE)}>
						Sample
					</Button>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => onSetState((prev) => ({ ...prev, input: '', output: '', status: null, stats: '' }))}
					>
						Clear
					</Button>
				</div>
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<Textarea
				id="json-input"
				className="h-80 font-mono text-sm"
				value={state.input}
				onChange={(e) => onInput(e.target.value)}
				placeholder="Paste your JSON here…"
				spellCheck={false}
			/>
			<div className="flex flex-wrap gap-2">
				<Button onClick={() => onFormat(2)}>
					<Sparkles data-icon="inline-start" />
					Format
				</Button>
				<Button variant="outline" onClick={() => onFormat(0)}>
					Minify
				</Button>
				<Button variant="outline" onClick={onValidate}>
					Validate
				</Button>
			</div>
		</CardContent>
	</Card>
);
