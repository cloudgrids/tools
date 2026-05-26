'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { JSON_SAMPLE } from '@/lib/tool-samples';
import { Check, Sparkles, X } from 'lucide-react';
import { useCallback, useState } from 'react';

export function JsonTool() {
	const [input, setInput] = useState(JSON_SAMPLE);
	const [output, setOutput] = useState('');
	const [status, setStatus] = useState<'valid' | 'invalid' | null>(null);
	const [stats, setStats] = useState('');

	const format = useCallback(
		(indent: number) => {
			try {
				const parsed = JSON.parse(input.trim());
				const formatted = JSON.stringify(parsed, null, indent);
				setOutput(formatted);
				setStatus('valid');
				const keyMatches = JSON.stringify(parsed).match(/"[^"]+"\s*:/g);
				const keys = keyMatches ? keyMatches.length : 0;
				const bytes = new TextEncoder().encode(formatted).length;
				setStats(`${keys} keys · ${bytes.toLocaleString()} bytes`);
			} catch (e) {
				setOutput(`Error: ${(e as Error).message}`);
				setStatus('invalid');
				setStats('');
			}
		},
		[input]
	);

	const validate = useCallback(() => {
		try {
			JSON.parse(input.trim());
			setOutput('Valid JSON');
			setStatus('valid');
		} catch (e) {
			setOutput((e as Error).message);
			setStatus('invalid');
		}
	}, [input]);

	const handleInput = (val: string) => {
		setInput(val);
		if (!val.trim()) {
			setStatus(null);
			return;
		}
		try {
			JSON.parse(val.trim());
			setStatus('valid');
		} catch {
			setStatus('invalid');
		}
	};

	return (
		<div className="grid gap-4 lg:grid-cols-2">
			<Card className="min-w-0">
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<CardTitle>Input JSON</CardTitle>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setInput(JSON_SAMPLE);
								}}
							>
								Sample
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setInput('');
									setOutput('');
									setStatus(null);
									setStats('');
								}}
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
						value={input}
						onChange={(e) => handleInput(e.target.value)}
						placeholder="Paste your JSON here…"
						spellCheck={false}
					/>
					<div className="flex flex-wrap gap-2">
						<Button onClick={() => format(2)}>
							<Sparkles data-icon="inline-start" />
							Format
						</Button>
						<Button variant="outline" onClick={() => format(0)}>
							Minify
						</Button>
						<Button variant="outline" onClick={validate}>
							Validate
						</Button>
					</div>
				</CardContent>
			</Card>

			<Card className="min-w-0">
				<CardHeader>
					<div className="flex flex-wrap items-center justify-between gap-2">
						<CardTitle>Output</CardTitle>
						<div className="flex flex-wrap items-center gap-2">
							{status === 'valid' && (
								<span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100">
									<Check className="mr-1 inline size-3.5" aria-hidden="true" />
									Valid
								</span>
							)}
							{status === 'invalid' && (
								<span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100">
									<X className="mr-1 inline size-3.5" aria-hidden="true" />
									Invalid
								</span>
							)}
							<CopyButton text={output} label="Copy" />
						</div>
					</div>
				</CardHeader>
				<CardContent className="space-y-4">
					<pre
						id="json-output"
						className="w-full h-80 p-2 rounded-lg border border-input bg-muted font-mono text-sm overflow-auto"
					>
						{output}
					</pre>
					{stats && <div className="text-xs text-muted-foreground">{stats}</div>}
				</CardContent>
			</Card>
		</div>
	);
}
