'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { useToast } from '@/components/ui/ToastProvider';
import { Button } from '@/components/ui/button';

interface UuidListProps {
	displayed: string[];
}

export const UuidList: React.FC<UuidListProps> = ({ displayed }) => {
	const { showToast } = useToast();
	const allText = displayed.join('\n');

	return (
		<Card>
			<CardHeader>
				<div className="flex flex-wrap items-center justify-between gap-3">
					<CardTitle>{displayed.length} UUIDs</CardTitle>
					<div className="flex flex-wrap gap-2">
						<CopyButton text={allText} label="Copy All" />
						<Button
							variant="outline"
							size="sm"
							onClick={() => {
								const blob = new Blob([allText], { type: 'text/plain' });
								const a = document.createElement('a');
								a.href = URL.createObjectURL(blob);
								a.download = 'uuids.txt';
								a.click();
								showToast('Downloaded uuids.txt!');
							}}
						>
							Download
						</Button>
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-0">
				<div className="max-h-96 overflow-auto border-t border-input">
					{displayed.map((uuid, i) => (
						<div
							key={i}
							className="flex min-w-0 items-center justify-between gap-3 border-b border-input px-4 py-2.5 transition-colors last:border-0 hover:bg-muted"
						>
							<code className="min-w-0 break-all font-mono text-sm text-secondary-foreground">{uuid}</code>
							<CopyButton text={uuid} label="Copy" />
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
