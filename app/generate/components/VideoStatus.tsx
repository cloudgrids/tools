import { Button } from '@/components/ui/button';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';

export const VideoStatus = () => {
	const { generateResult, videoStatus } = usePopVidStore();
	const { getVideoStatus } = usePopVid();

	return generateResult ? (
		<div className=" rounded-xl p-5 shadow">
			<div className="flex justify-between items-center">
				<h2 className="font-semibold">Video Status</h2>

				<Button onClick={() => getVideoStatus()} className="border px-4 py-2 rounded-lg">
					Refresh
				</Button>
			</div>

			<p className="mt-3">
				Status: <span className="font-semibold">{videoStatus?.status}</span>
			</p>

			{videoStatus?.videoUrl && (
				<div className="mt-4">
					<video controls className="w-full rounded-lg" src={videoStatus.videoUrl} />

					<a href={videoStatus.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 mt-2 inline-block">
						Open Video
					</a>
				</div>
			)}
		</div>
	) : null;
};
