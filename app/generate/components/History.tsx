import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger
} from '@/components/ui/sheet';
import { usePopVidStore } from '@/hooks/popvid.store';
import { GenerationHistory } from '@/lib/contracts';
import { Clock, Copy, Download, RefreshCw, Search, Trash2, Video } from 'lucide-react';
import Image from 'next/image';
import { useMemo, useState } from 'react';

export const History = () => {
	const { history } = usePopVidStore();
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<'all' | 'completed' | 'pending' | 'failed'>('all');

	const filteredHistory = useMemo(() => {
		return history.filter((item) => {
			const matchesSearch = item.videoPrompt.toLowerCase().includes(search.toLowerCase());

			const matchesFilter = filter === 'all' ? true : item.status?.toLowerCase() === filter;

			return matchesSearch && matchesFilter;
		});
	}, [history, search, filter]);

	const completed = history.filter((item) => item.status?.toLowerCase() === 'completed').length;

	const getImageUrl = (item: GenerationHistory) => `https://storage.googleapis.com/${item.imageBucket}/${item.imagePath}`;

	return (
		<Sheet>
			<SheetTrigger render={<Button variant="outline" />}>History</SheetTrigger>

			<SheetContent className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
				<SheetHeader>
					<SheetTitle>Generation History</SheetTitle>
					<SheetDescription>View and manage generated videos.</SheetDescription>
				</SheetHeader>

				<div className="grid grid-cols-2 md:grid-cols-3 gap-3 py-4">
					<div className="rounded-lg border p-3">
						<div className="text-xs text-muted-foreground">Total</div>
						<div className="text-2xl font-bold">{history.length}</div>
					</div>

					<div className="rounded-lg border p-3">
						<div className="text-xs text-muted-foreground">Completed</div>
						<div className="text-2xl font-bold">{completed}</div>
					</div>

					<div className="rounded-lg border p-3">
						<div className="text-xs text-muted-foreground">Pending</div>
						<div className="text-2xl font-bold">{history.length - completed}</div>
					</div>
				</div>

				<div className="relative mb-4">
					<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

					<Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search prompts..." className="pl-9" />
				</div>

				<div className="flex flex-wrap gap-2 mb-4">
					{['all', 'completed', 'pending', 'failed'].map((status) => (
						<Button
							key={status}
							size="sm"
							variant={filter === status ? 'default' : 'outline'}
							onClick={() => setFilter(status as 'all' | 'completed' | 'pending' | 'failed')}
						>
							{status}
						</Button>
					))}
				</div>

				<div className="space-y-4 max-h-[70vh] overflow-y-auto">
					{filteredHistory.length === 0 ? (
						<div className="flex flex-col items-center justify-center py-16 text-center">
							<Video className="h-12 w-12 text-muted-foreground mb-4" />
							<p className="font-medium">No generations found</p>
							<p className="text-sm text-muted-foreground">Try changing filters or create a video.</p>
						</div>
					) : (
						filteredHistory.map((item, index) => (
							<div key={index} className="rounded-xl border overflow-hidden hover:bg-muted/40 transition">
								<div className="grid grid-cols-1">
									{/* Preview Section */}
									<div className="border-r bg-muted/20 p-3">
										<div className="grid gap-3">
											{/* Source Image */}
											<div>
												<p className="text-xs font-medium mb-2 text-muted-foreground">Source Image</p>

												<Image
													className="w-full aspect-video object-cover rounded-md border"
													src={getImageUrl(item)}
													alt="Source"
													loading="lazy"
													width={300}
													height={400}
												/>
											</div>

											{/* Generated Video */}
											{item.videoUrl && (
												<div>
													<p className="text-xs font-medium mb-2 text-muted-foreground">Generated Video</p>

													<video
														className="w-full aspect-video object-cover rounded-md border"
														src={item.videoUrl}
														muted
														controls
														preload="metadata"
													/>
												</div>
											)}
										</div>
									</div>

									{/* Content */}
									<div className="p-4 space-y-4">
										<div>
											<p className="font-medium line-clamp-3">{item.videoPrompt}</p>

											<div className="flex gap-2 mt-3 flex-wrap">
												<Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
													{item.status ?? 'pending'}
												</Badge>

												<Badge variant="outline">{item.sessionId.slice(0, 12)}</Badge>
											</div>
										</div>

										<div className="grid grid-cols-2 md:flex md:flex-wrap gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => navigator.clipboard.writeText(item.videoPrompt)}
											>
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
													<Button
														nativeButton={false}
														size="sm"
														render={<a href={item.videoUrl} target="_blank" />}
													>
														View Video
													</Button>

													<Button
														nativeButton={false}
														size="sm"
														variant="outline"
														render={<a href={item.videoUrl} download />}
													>
														<Download className="h-4 w-4 mr-2" />
														Download
													</Button>
												</>
											)}

											<Button size="sm" variant="outline">
												<RefreshCw className="h-4 w-4 mr-2" />
												Retry
											</Button>

											<Button size="sm" variant="destructive">
												<Trash2 className="h-4 w-4 mr-2" />
												Delete
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
					)}
				</div>

				<SheetFooter className="pt-4">
					<SheetClose render={<Button variant="outline" />}>Close</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
