'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { History } from '../components/History';
import { MemeBox } from './MemeBox';

interface MemesProps {
	sessionId: string;
}

export const Memes = ({ sessionId }: MemesProps) => {
	const { history } = usePopVidStore();

	const video = history.find((item) => item.sessionId === `ugc_video_${sessionId}` || item.sessionId === sessionId);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">Create Meme</h1>
					<p className="text-muted-foreground">Session: {video?.sessionId}</p>
				</div>

				<History />
			</div>

			<MemeBox video={video} sessionId={sessionId} />
		</div>
	);
};
