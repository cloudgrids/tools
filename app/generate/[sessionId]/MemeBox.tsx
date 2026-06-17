'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { GenerationHistory } from '@/lib/contracts';
import { Clapperboard, Loader2, RefreshCw, Trash } from 'lucide-react';
import { useMemo, useState } from 'react';

interface MemeCardProps {
	video?: GenerationHistory;
	sessionId: string;
}

export const MemeBox: React.FC<MemeCardProps> = ({ video, sessionId }) => {
	const [prompt, setPrompt] = useState<string>('');
	const { makeMeme, getMEMEStatus, loading } = usePopVid();
	const [selectedSourceId, setSelectedSourceId] = useState<string>('');
	const { setHistory, setCustomMemes, customMemes } = usePopVidStore();

	const isCustom = !sessionId.includes('ugc_video_');

	const deleteMeme = (nodeId: string) => {
		if (isCustom) {
			setCustomMemes((prev) => prev.filter((meme) => meme.nodeId !== nodeId));
			return;
		}
		setHistory((prev) => {
			const updated = prev.map((item) => {
				if (item.sessionId === video?.sessionId) {
					return {
						...item,
						memes: item.memes?.filter((meme) => meme.nodeId !== nodeId)
					};
				}
				return item;
			});

			return updated;
		});
	};

	const getTwistId = (url?: string) => url?.match(/\/twist_([^/]+)\.mp4$/i)?.[1];

	const memes = useMemo(() => {
		return isCustom ? customMemes || [] : video?.memes || [];
	}, [video, customMemes, isCustom]);

	const sources = useMemo(() => {
		const rootId = sessionId || video?.sessionId?.replace(/^ugc_video_/, '');
		return [
			{
				id: rootId,
				label: 'Original Video'
			},
			...memes
				.filter((meme) => meme.videoUrl)
				.map((meme, index) => ({
					id: getTwistId(meme.videoUrl)!,
					label: `Meme #${index + 1}`
				}))
		];
	}, [memes, sessionId, video?.sessionId]);

	const defaultSourceId = useMemo(() => {
		const latest = [...memes].reverse().find((meme) => meme.videoUrl);

		if (latest?.videoUrl) return getTwistId(latest.videoUrl);

		return sources[0]?.id as string;
	}, [memes, sources]);

	const currentSourceId = (selectedSourceId || defaultSourceId) as string;

	return (
		<div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
			<div className="border-b p-4">
				<div className="flex items-start justify-between">
					<div className="min-w-0">
						<h3 className="truncate text-sm font-semibold">{video?.sessionId}</h3>

						{isCustom && (
							<p className="mt-1 text-xs text-muted-foreground">
								Custom Meme Session: <span className="font-medium">{sessionId}</span>
							</p>
						)}

						<p className="mt-1 text-xs text-muted-foreground">
							Status:
							<span className="ml-1 font-medium">{video?.status}</span>
						</p>
					</div>

					<Clapperboard className="h-5 w-5 shrink-0 text-muted-foreground" />
				</div>
			</div>

			<div className="space-y-4 p-4">
				{video?.videoUrl && (
					<div className="overflow-hidden rounded-xl border bg-black">
						<video src={video.videoUrl} controls className="aspect-video w-full" />
					</div>
				)}

				<div className="space-y-3">
					<label className="text-sm font-medium">Create Meme</label>

					<select
						value={currentSourceId}
						onChange={(e) => setSelectedSourceId(e.target.value)}
						className="w-full rounded-md border px-3 py-2 text-sm"
					>
						{sources.map((source) => (
							<option key={`${source.id}_${source.label}`} value={source.id}>
								{source.label}
							</option>
						))}
					</select>

					<Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a meme prompt..." />

					<Button
						className="w-full"
						disabled={!prompt.trim() || loading || !currentSourceId}
						onClick={() => makeMeme(prompt, currentSourceId, video?.sessionId || (sessionId as string), isCustom)}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating
							</>
						) : (
							`Create Meme From ${sources.find((s) => s.id === currentSourceId)?.label ?? 'Source'}`
						)}
					</Button>
				</div>

				{memes.length > 0 && (
					<div className="space-y-4">
						<h3 className="text-sm font-medium">Generated Memes ({memes.length})</h3>

						{[...memes].reverse().map((meme, index) => (
							<div key={meme.nodeId} className="rounded-xl border bg-muted/40 p-4">
								<div className="mb-3 flex items-center justify-between">
									<div>
										<p className="font-medium">Meme #{memes.length - index}</p>

										{meme.prompt && <p className="text-xs text-muted-foreground">{meme.prompt}</p>}

										<p className="text-xs text-muted-foreground">Status: {meme.status}</p>
										<p className="text-xs text-muted-foreground">Node ID: {meme.nodeId}</p>
										<p className="text-xs text-muted-foreground">High Res URL(Default): {meme.highResUrl}</p>
										<p className="text-xs text-muted-foreground">Low Res URL: {meme.videoUrl}</p>
									</div>

									<Button size="sm" variant="outline" onClick={() => getMEMEStatus(meme.memeId, meme.nodeId, isCustom)}>
										<RefreshCw className="mr-2 h-4 w-4" />
										Refresh
									</Button>

									<Button size="sm" variant="destructive" onClick={() => deleteMeme(meme.nodeId)}>
										<Trash className="mr-2 h-4 w-4" />
										Delete
									</Button>
								</div>

								{meme.videoUrl || meme.highResUrl ? (
									<video src={meme.highResUrl || meme.videoUrl} controls className="aspect-video w-full rounded-lg" />
								) : null}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
