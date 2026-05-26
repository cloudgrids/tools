'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/ToastProvider';
import { generateUUID } from '@/lib/crypto';
import { RefreshCw } from 'lucide-react';
import { useCallback, useState } from 'react';

export function UuidTool() {
	const { showToast } = useToast();
	const [count, setCount] = useState(10);
	const [uuids, setUuids] = useState<string[]>(() => Array.from({ length: 10 }, generateUUID));
	const [upper, setUpper] = useState(false);
	const [noDash, setNoDash] = useState(false);

	function transform(uuid: string): string {
		let s = uuid;
		if (noDash) s = s.replace(/-/g, '');
		if (upper) s = s.toUpperCase();
		return s;
	}

	const generate = useCallback(() => {
		setUuids(Array.from({ length: count }, generateUUID));
	}, [count]);

	const displayed = uuids.slice(0, count).map(transform);
	const allText = displayed.join('\n');

	return (
		<div className="flex flex-col gap-4">
			<Card>
				<CardHeader>
					<CardTitle>Options</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-wrap items-end gap-4 sm:gap-6">
						<div>
							<label className="text-sm font-medium block mb-1" htmlFor="uuid-count">
								Count
							</label>
							<Input
								id="uuid-count"
								type="number"
								className="w-20"
								min={1}
								max={100}
								value={count}
								onChange={(e) => setCount(Math.max(1, Math.min(100, Number(e.target.value))))}
							/>
						</div>
						<div className="flex items-center gap-2">
							<Switch id="uuid-upper" checked={upper} onCheckedChange={setUpper} />
							<label htmlFor="uuid-upper" className="text-sm font-medium cursor-pointer">
								Uppercase
							</label>
						</div>
						<div className="flex items-center gap-2">
							<Switch id="uuid-nodash" checked={noDash} onCheckedChange={setNoDash} />
							<label htmlFor="uuid-nodash" className="text-sm font-medium cursor-pointer">
								No Dashes
							</label>
						</div>
						<Button onClick={generate}>
							<RefreshCw data-icon="inline-start" />
							Regenerate
						</Button>
					</div>
				</CardContent>
			</Card>
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
		</div>
	);
}
