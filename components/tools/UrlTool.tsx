'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { parseUrl } from '@/lib/url';
import { useMemo, useState } from 'react';

export function UrlTool() {
	const [input, setInput] = useState('https://tools.cloudgrids.tech/url?query=hello+world&page=1&debug=true#section');
	const [encoded, setEncoded] = useState('');
	const [decoded, setDecoded] = useState('');

	const parsed = useMemo(() => parseUrl(input), [input]);

	function encode() {
		setEncoded(encodeURIComponent(input));
		setDecoded('');
	}
	function decode() {
		try {
			setDecoded(decodeURIComponent(input));
			setEncoded('');
		} catch {
			setDecoded('Error: Invalid encoded URI');
		}
	}
	function encodeComponent() {
		setEncoded(
			input
				.split('')
				.map((c) => (/[A-Za-z0-9\-_.~]/.test(c) ? c : '%' + c.charCodeAt(0).toString(16).toUpperCase().padStart(2, '0')))
				.join('')
		);
	}

	const output = encoded || decoded;

	return (
		<div className="flex flex-col gap-4">
			<div className="grid gap-4 lg:grid-cols-2">
				<Card className="min-w-0">
					<CardHeader>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<CardTitle>Input</CardTitle>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setInput('');
									setEncoded('');
									setDecoded('');
								}}
							>
								Clear
							</Button>
						</div>
					</CardHeader>
					<CardContent className="space-y-4">
						<Textarea
							id="url-input"
							className="h-40 font-mono text-sm"
							value={input}
							onChange={(e) => setInput(e.target.value)}
							placeholder="Enter a URL or encoded string…"
							spellCheck={false}
						/>
						<div className="flex gap-2 flex-wrap">
							<Button onClick={encode}>Encode URI</Button>
							<Button variant="outline" onClick={decode}>
								Decode URI
							</Button>
							<Button variant="outline" onClick={encodeComponent}>
								Encode Component
							</Button>
						</div>
					</CardContent>
				</Card>

				<Card className="min-w-0">
					<CardHeader>
						<div className="flex flex-wrap items-center justify-between gap-2">
							<CardTitle>Output</CardTitle>
							<CopyButton text={output} label="Copy" />
						</div>
					</CardHeader>
					<CardContent>
						<pre
							id="url-output"
							className="w-full h-40 p-2 rounded-lg border border-input bg-muted font-mono text-sm overflow-auto"
						>
							{output}
						</pre>
					</CardContent>
				</Card>
			</div>

			{parsed && (
				<Card>
					<CardHeader>
						<CardTitle>URL Breakdown</CardTitle>
					</CardHeader>
					<CardContent className="p-0">
						<div className="divide-y divide-input border-t border-input">
							{Object.entries(parsed).map(([key, val]) => (
								<div
									key={key}
									className="flex flex-col items-start gap-2 px-4 py-2.5 transition-colors hover:bg-muted sm:flex-row sm:items-center sm:gap-4"
								>
									<span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 text-purple-900 dark:bg-purple-900 dark:text-purple-100 min-w-fit">
										{key.replace('param:', '?')}
									</span>
									<code className="min-w-0 flex-1 break-all font-mono text-sm text-secondary-foreground">{val}</code>
									<CopyButton text={val} label="Copy" />
								</div>
							))}
						</div>
					</CardContent>
				</Card>
			)}
		</div>
	);
}
