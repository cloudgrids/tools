import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';

interface UrlOutputProps {
	output: string;
}

export const UrlOutput: React.FC<UrlOutputProps> = ({ output }) => (
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
				className="h-40 w-full overflow-auto rounded-lg border border-input bg-muted p-2 font-mono text-sm"
			>
				{output}
			</pre>
		</CardContent>
	</Card>
);
