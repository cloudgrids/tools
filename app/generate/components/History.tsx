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
import { Search, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { CustomMemesHistory } from './CustomMemesHistory';
import { VideoHistory } from './VideoHistory';

export type FilterType = 'all' | 'completed' | 'pending' | 'failed';
export const getImageUrl = (item: GenerationHistory) => `https://storage.googleapis.com/${item.imageBucket}/${item.imagePath}`;

export const History = () => {
	const { history } = usePopVidStore();
	const [search, setSearch] = useState<string>('');
	const [filter, setFilter] = useState<FilterType>('all');
	const [isOpen, setIsOpen] = useState<boolean>(false);
	const router = useRouter();
	const [customMemeSessionId, setCustomMemeSessionId] = useState<string>('');
	const [view, setView] = useState<'video' | 'meme'>('video');

	const completed = history.filter((item) => item.status?.toLowerCase() === 'completed').length;

	return (
		<Sheet onOpenChange={(open) => setIsOpen(open)} open={!!isOpen}>
			<SheetTrigger render={<Button variant="outline" />}>History</SheetTrigger>

			<SheetContent className="w-full sm:max-w-xl md:max-w-3xl lg:max-w-5xl">
				<SheetHeader>
					<SheetTitle>Generation History</SheetTitle>
					<SheetDescription>View and manage generated videos.</SheetDescription>
					<div className="grid grid-cols-3 md:grid-cols-3 gap-1 py-1">
						<div className="rounded-lg border p-2">
							<div className="text-xs text-muted-foreground">Total</div>
							<div className="text-2xl font-bold">{history.length}</div>
						</div>

						<div className="rounded-lg border p-2">
							<div className="text-xs text-muted-foreground">Completed</div>
							<div className="text-2xl font-bold">{completed}</div>
						</div>

						<div className="rounded-lg border p-2">
							<div className="text-xs text-muted-foreground">Pending</div>
							<div className="text-2xl font-bold">{history.length - completed}</div>
						</div>
					</div>
					<div className="relative">
						<Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />

						<Input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder="Search prompts..."
							className="pl-9"
						/>
					</div>
					<div className="flex flex-wrap gap-2 my-2">
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

						<Button size="sm" variant={'outline'} onClick={() => setView(view === 'video' ? 'meme' : 'video')}>
							{view === 'video' ? 'View Memes' : 'View Videos'}
						</Button>
					</div>

					<div className="relative justify-center align-center">
						<Input value={customMemeSessionId} onChange={(e) => setCustomMemeSessionId(e.target.value)} className="pl-9" />
						<Button
							className="absolute right-3 top-2 cursor-pointer h-4 w-4 text-muted-foreground"
							variant={'destructive'}
							onClick={() => router.push(`generate/${customMemeSessionId}`)}
						>
							<Sparkles className="h-4 w-4" />
						</Button>
					</div>
				</SheetHeader>

				<div className="space-y-4 max-h-[70vh] overflow-y-auto">
					{view === 'video' ? (
						<VideoHistory search={search} filter={filter} onOpenChange={(open) => setIsOpen(open)} />
					) : (
						<CustomMemesHistory />
					)}
				</div>

				<SheetFooter className="pt-4">
					<SheetClose render={<Button variant="outline" />}>Close</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
};
