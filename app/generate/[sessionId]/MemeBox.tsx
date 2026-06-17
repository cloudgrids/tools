'use client';

import { useMemo, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { GenerationHistory } from '@/lib/contracts';
import { Clapperboard, Loader2, RefreshCw } from 'lucide-react';

interface MemeCardProps {
	video: GenerationHistory;
	sessionId: string;
}

export const MemeBox: React.FC<MemeCardProps> = ({ video, sessionId }) => {
	const [prompt, setPrompt] = useState<string>('');
	const { makeMeme, getMEMEStatus, loading } = usePopVid();
	const { memes } = usePopVidStore();

	const getTwistId = (url?: string) => url?.match(/\/twist_([^/]+)\.mp4$/i)?.[1];

	const sources = useMemo(() => {
		const rootId = sessionId || video.sessionId.replace(/^ugc_video_/, '');
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
	}, [memes, sessionId, video.sessionId]);

	const [sourceId, setSourceId] = useState(() => {
		const latest = [...memes].reverse().find((meme) => meme.videoUrl);

		if (latest?.videoUrl) {
			const twistId = getTwistId(latest.videoUrl);

			if (twistId) return twistId;
		}

		if (sources.length) return sources[0].id;

		return '';
	});

	return (
		<div className="overflow-hidden rounded-2xl border bg-card shadow-sm">
			<div className="border-b p-4">
				<div className="flex items-start justify-between">
					<div className="min-w-0">
						<h3 className="truncate text-sm font-semibold">{video.sessionId}</h3>

						<p className="mt-1 text-xs text-muted-foreground">
							Status:
							<span className="ml-1 font-medium">{video.status}</span>
						</p>
					</div>

					<Clapperboard className="h-5 w-5 shrink-0 text-muted-foreground" />
				</div>
			</div>

			<div className="space-y-4 p-4">
				{video.videoUrl && (
					<div className="overflow-hidden rounded-xl border bg-black">
						<video src={video.videoUrl} controls className="aspect-video w-full" />
					</div>
				)}

				<div className="space-y-3">
					<label className="text-sm font-medium">Create Meme</label>

					<select
						value={sourceId}
						onChange={(e) => setSourceId(e.target.value)}
						className="w-full rounded-md border px-3 py-2 text-sm"
					>
						{sources.map((source) => (
							<option key={source.id} value={source.id}>
								{source.label}
							</option>
						))}
					</select>

					<Input value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Enter a meme prompt..." />

					<Button
						className="w-full"
						disabled={!prompt.trim() || loading || !sourceId}
						onClick={() => makeMeme(prompt, sourceId, video.sessionId)}
					>
						{loading ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Generating
							</>
						) : (
							`Create Meme From ${sources.find((s) => s.id === sourceId)?.label ?? 'Source'}`
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
									</div>

									<Button size="sm" variant="outline" onClick={() => getMEMEStatus(meme.memeId, meme.nodeId)}>
										<RefreshCw className="mr-2 h-4 w-4" />
										Refresh
									</Button>
								</div>

								{meme.videoUrl && <video src={meme.videoUrl} controls className="aspect-video w-full rounded-lg" />}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};
