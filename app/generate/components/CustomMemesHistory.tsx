import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePopVidStore } from '@/hooks/popvid.store';
import { getMemeId } from '@/lib/helpers';
import { cn } from '@/lib/utils';
import { Clock, Copy, Download, Sparkles, Trash2 } from 'lucide-react';
import router from 'next/router';

export const CustomMemesHistory: React.FC = () => {
	const customMemes = usePopVidStore((s) => s.customMemes);
	const setCustomMemes = usePopVidStore((s) => s.setCustomMemes);

	return customMemes?.map((item, index) => (
		<div key={index} className={cn('rounded-xl border overflow-hidden hover:bg-muted/40 transition')}>
			<div className="grid grid-cols-1">
				<div className="border-r bg-muted/20 p-3">
					<div className="grid grid-cols-2 gap-3">
						{item.highResUrl && (
							<div>
								<p className="text-xs font-medium mb-2 text-muted-foreground">High Res Video</p>
								<video src={item.highResUrl} muted controls preload="metadata" />
							</div>
						)}
						{item.videoUrl && (
							<div>
								<p className="text-xs font-medium mb-2 text-muted-foreground">Low Res Video</p>
								<video src={item.videoUrl} muted controls preload="metadata" />
							</div>
						)}
					</div>
				</div>

				<div className="p-4 space-y-4">
					<div>
						<p className="font-medium line-clamp-3">{item.prompt}</p>

						<div className="flex gap-2 mt-3 flex-wrap">
							<Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>{item.status ?? 'pending'}</Badge>

							<Badge variant="outline">{item.memeId}</Badge>
						</div>
					</div>

					<div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
						<Button size="sm" variant="outline" onClick={() => navigator.clipboard.writeText(item.prompt)}>
							<Copy className="h-4 w-4 mr-2" />
							Copy
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

						<Button
							size="sm"
							variant="destructive"
							onClick={() => setCustomMemes((prev) => prev.filter((h) => h.memeId !== item.memeId))}
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Delete
						</Button>

						<Button size="sm" variant="destructive" onClick={() => router.push(`/generate/${getMemeId(item.memeId)}`)}>
							<Sparkles className="h-4 w-4 mr-2" />
							Make Meme
						</Button>
					</div>

					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<Clock className="h-3 w-3" />
						Session: {item.memeId}
					</div>
				</div>
			</div>
		</div>
	));
};
