'use client';

import { Button } from '@/components/ui/button';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { ExternalLink, Loader2, RefreshCw, Video } from 'lucide-react';
import { memo, useCallback, useState } from 'react';

const STATUS_COLORS: Record<string, string> = {
	completed: 'bg-green-500/15 text-green-500 border-green-500/20',
	pending: 'bg-amber-500/15 text-amber-500 border-amber-500/20',
	processing: 'bg-sky-500/15 text-sky-500 border-sky-500/20',
	failed: 'bg-destructive/15 text-destructive border-destructive/20'
};

export const VideoStatus = memo(() => {
	const { generateResult, videoStatus } = usePopVidStore();
	const { getVideoStatus } = usePopVid();
	const [refreshing, setRefreshing] = useState(false);

	const handleRefresh = useCallback(async () => {
		if (refreshing) return;
		setRefreshing(true);
		try {
			await getVideoStatus();
		} finally {
			setRefreshing(false);
		}
	}, [refreshing, getVideoStatus]);

	if (!generateResult) return null;

	const status = videoStatus?.status?.toLowerCase() ?? 'pending';
	const statusClass = STATUS_COLORS[status] ?? STATUS_COLORS['pending'];
	const isCompleted = status === 'completed';

	return (
		<div className="relative rounded-2xl border border-border bg-card overflow-hidden">
			<div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-emerald-500/40 to-transparent" />

			<div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
				<div className="flex items-center gap-2.5">
					<div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
						<Video className="size-4" />
					</div>
					<div>
						<p className="text-sm font-semibold leading-none">Video Status</p>
						<p className="mt-0.5 text-xs text-muted-foreground">Session: {generateResult.sessionId?.slice(0, 16)}…</p>
					</div>
				</div>

				<Button onClick={handleRefresh} disabled={refreshing} variant="outline" size="sm" className="gap-1.5 shrink-0">
					<RefreshCw className={`size-3.5 ${refreshing ? 'animate-spin' : ''}`} />
					{refreshing ? 'Refreshing…' : 'Refresh'}
				</Button>
			</div>

			<div className="px-5 py-4 space-y-4">
				<div className="flex items-center gap-2">
					<span className="text-xs text-muted-foreground font-medium">Current status</span>
					<span
						className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize ${statusClass}`}
					>
						{isCompleted && <span className="size-1.5 rounded-full bg-green-500" />}
						{!isCompleted && !['failed'].includes(status) && (
							<span className="size-1.5 rounded-full bg-current animate-pulse" />
						)}
						{videoStatus?.status ?? 'Pending'}
					</span>
				</div>

				{videoStatus?.videoUrl && (
					<div className="rounded-xl overflow-hidden border border-border bg-black">
						<video controls className="w-full block" src={videoStatus.videoUrl} key={videoStatus.videoUrl} preload="metadata" />
						<div className="px-3 py-2 border-t border-border/50 flex justify-end">
							<Button
								size="sm"
								variant="ghost"
								render={<a href={videoStatus.videoUrl} target="_blank" rel="noopener noreferrer" />}
								className="gap-1.5 text-xs h-7"
								nativeButton={false}
							>
								<ExternalLink className="size-3" />
								Open in new tab
							</Button>
						</div>
					</div>
				)}

				{!videoStatus?.videoUrl && (
					<div className="flex flex-col items-center justify-center py-8 text-center gap-2">
						<Loader2 className="size-6 text-muted-foreground/40 animate-spin" />
						<p className="text-xs text-muted-foreground/60">Waiting for video to be ready…</p>
					</div>
				)}
			</div>
		</div>
	);
});

VideoStatus.displayName = 'VideoStatus';
