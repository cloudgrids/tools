import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Check, X } from 'lucide-react';
import type { JsonState } from './Json';

interface JsonOutputProps {
	state: JsonState;
}

export const JsonOutput: React.FC<JsonOutputProps> = ({ state }) => (
	<Card className="min-w-0">
		<CardHeader>
			<div className="flex flex-wrap items-center justify-between gap-2">
				<CardTitle>Output</CardTitle>
				<div className="flex flex-wrap items-center gap-2">
					{state.status === 'valid' && (
						<span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-900">
							<Check className="mr-1 inline size-3.5" aria-hidden="true" />
							Valid
						</span>
					)}
					{state.status === 'invalid' && (
						<span className="px-2 py-1 rounded text-xs font-medium bg-red-100 text-red-900">
							<X className="mr-1 inline size-3.5" aria-hidden="true" />
							Invalid
						</span>
					)}
					<CopyButton text={state.output} label="Copy" />
				</div>
			</div>
		</CardHeader>
		<CardContent className="space-y-4">
			<pre id="json-output" className="w-full h-80 p-2 rounded-lg border border-input bg-muted font-mono text-sm overflow-auto">
				{state.output}
			</pre>
			{state.stats && <div className="text-xs text-muted-foreground">{state.stats}</div>}
		</CardContent>
	</Card>
);
