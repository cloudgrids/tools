import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';

interface UrlBreakdownProps {
	parsed: Record<string, string>;
}

export const UrlBreakdown: React.FC<UrlBreakdownProps> = ({ parsed }) => (
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
						<span className="min-w-fit rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-900">
							{key.replace('param:', '?')}
						</span>
						<code className="min-w-0 flex-1 break-all font-mono text-sm text-secondary-foreground">{val}</code>
						<CopyButton text={val} label="Copy" />
					</div>
				))}
			</div>
		</CardContent>
	</Card>
);
