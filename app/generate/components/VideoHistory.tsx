import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePopVidStore } from '@/hooks/popvid.store';
import { GenerationHistory } from '@/lib/contracts';
import { getMemeId } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Clock, Copy, Download, RefreshCw, Sparkles, Trash2, Video } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { FilterType, getImageUrl } from './History';

interface VideoHistoryProps {
	search: string;
	filter: FilterType;
	onOpenChange?: (open: boolean) => void;
}

export const VideoHistory: React.FC<VideoHistoryProps> = ({ search, filter, onOpenChange }) => {
	const history = usePopVidStore((s) => s.history);
	const setHistory = usePopVidStore((s) => s.setHistory);
	const setGenerateInput = usePopVidStore((s) => s.setGenerateInput);
	const setGenerateResult = usePopVidStore((s) => s.setGenerateResult);
	const setVideoStatus = usePopVidStore((s) => s.setVideoStatus);
	const setUploadResult = usePopVidStore((s) => s.setUploadResult);
	const generateResult = usePopVidStore((s) => s.generateResult);
	const router = useRouter();

	const filteredHistory = useMemo(() => {
		return history.filter((item) => {
			const matchesSearch = item.videoPrompt.toLowerCase().includes(search.toLowerCase());
			const matchesFilter = filter === 'all' ? true : item.status?.toLowerCase() === filter;
			return matchesSearch && matchesFilter;
		});
	}, [history, search, filter]);

	const handleRetry = (item: GenerationHistory) => {
		setGenerateInput({
			videoPrompt: item.videoPrompt,
			token: item.token,
			imageBucket: item.imageBucket,
			imagePath: item.imagePath
		});

		setGenerateResult({
			sessionId: item.sessionId,
			status: item.status
		});

		setVideoStatus({
			status: item.status,
			videoUrl: item.videoUrl
		});

		setUploadResult({
			bucket: item.imageBucket,
			imageUrl: getImageUrl(item),
			path: item.imagePath,
			success: !!item.status
		});
		onOpenChange?.(false);
		toast.success('Prompt loaded. You can now generate the video again.');
	};

	return !filteredHistory?.length ? (
		<div className="flex flex-col items-center justify-center py-16 text-center">
			<Video className="h-12 w-12 text-muted-foreground mb-4" />
			<p className="font-medium">No generations found</p>
			<p className="text-sm text-muted-foreground">Try changing filters or create a video.</p>
		</div>
	) : (
		filteredHistory.map((item, index) => (
			<div
				key={index}
				className={cn(
					'rounded-xl border overflow-hidden hover:bg-muted/40 transition',
					generateResult?.sessionId === item.sessionId ? 'bg-slate-300' : ''
				)}
			>
				<div className="grid grid-cols-1">
					<div className="border-r bg-muted/20 p-3">
						<div className="grid grid-cols-2 gap-3">
							<div>
								<p className="text-xs font-medium mb-2 text-muted-foreground">Source Image</p>

								<Image src={getImageUrl(item)} alt="Source" loading="lazy" width={300} height={400} />
							</div>

							{item.videoUrl && (
								<div>
									<p className="text-xs font-medium mb-2 text-muted-foreground">Generated Video</p>

									<video src={item.videoUrl} muted controls preload="metadata" />
								</div>
							)}
						</div>
					</div>

					<div className="p-4 space-y-4">
						<div>
							<p className="font-medium line-clamp-3">{item.videoPrompt}</p>

							<div className="flex gap-2 mt-3 flex-wrap">
								<Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>{item.status ?? 'pending'}</Badge>

								<Badge variant="outline">{item?.sessionId?.slice(0, 12)}</Badge>
							</div>
						</div>

						<div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
							<Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(item.videoPrompt)}>
								<Copy className="h-4 w-4 mr-2" />
								Copy
							</Button>

							<Button
								nativeButton={false}
								size="sm"
								variant="outline"
								render={<a href={getImageUrl(item)} target="_blank" />}
							>
								Image
							</Button>

							{item.videoUrl && (
								<>
									<Button nativeButton={false} size="sm" render={<a href={item.videoUrl} target="_blank" />}>
										View Video
									</Button>

									<Button nativeButton={false} size="sm" variant="outline" render={<a href={item.videoUrl} download />}>
										<Download className="h-4 w-4 mr-2" />
										Download
									</Button>
								</>
							)}

							<Button size="sm" variant="outline" onClick={() => handleRetry(item)}>
								<RefreshCw className="h-4 w-4 mr-2" />
								Retry
							</Button>

							<Button
								size="sm"
								variant="destructive"
								onClick={() => setHistory((prev) => prev.filter((h) => h.sessionId !== item.sessionId))}
							>
								<Trash2 className="h-4 w-4 mr-2" />
								Delete
							</Button>

							<Button size="sm" variant="destructive" onClick={() => router.push(`/generate/${getMemeId(item.sessionId)}`)}>
								<Sparkles className="h-4 w-4 mr-2" />
								Make Meme
							</Button>
						</div>

						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<Clock className="h-3 w-3" />
							Session: {item.sessionId}
						</div>
					</div>
				</div>
			</div>
		))
	);
};
