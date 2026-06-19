'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { Film } from 'lucide-react';
import { useCallback, useState } from 'react';
import { History } from './History';
import { ResultsPanel } from './ResultsPanel';
import { StudioPanel } from './StudioPanel';

export interface FileProps {
	file: File;
	uploaded: boolean;
}

export const Generate = () => {
	const { loading } = usePopVid();
	const { generateResult } = usePopVidStore();
	const [customInput, setCustomInput] = useState<Record<string, unknown>>({});
	const [files, setFiles] = useState<FileProps[]>([]);

	const handleSetFiles = useCallback((updater: React.SetStateAction<FileProps[]>) => setFiles(updater), []);

	return (
		<>
			<header className="relative flex shrink-0 items-center justify-between gap-4 border-b border-border/60 px-4 py-3 sm:px-6 md:px-8">
				<div className="absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-violet-500/50 to-transparent" />
				<div className="flex items-center gap-3">
					<div className="flex size-8 items-center justify-center rounded-lg bg-linear-to-br from-violet-500 to-indigo-600 shadow-md shadow-violet-500/30">
						<Film className="size-4 text-white" />
					</div>
					<div>
						<h1 className="text-base font-bold leading-none">AI Video Generator</h1>
						<p className="text-[10px] text-muted-foreground mt-0.5 leading-none">PopVid Studio</p>
					</div>
				</div>
				<History />
			</header>

			<div className="flex flex-col gap-0 lg:hidden">
				<StudioPanel files={files} setFiles={handleSetFiles} loading={loading} mobile />
				<div className="h-px bg-border/60" />
				<ResultsPanel
					loading={loading}
					customInput={customInput}
					setCustomInput={setCustomInput}
					generateResult={generateResult}
					mobile
				/>
			</div>

			<div className="hidden lg:flex flex-1 overflow-hidden" style={{ height: 'calc(100vh - 3.5rem - 49px)' }}>
				<StudioPanel files={files} setFiles={handleSetFiles} loading={loading} />
				<div className="relative shrink-0 w-px bg-border/60">
					<div className="absolute inset-y-0 left-0 w-px bg-linear-to-b from-transparent via-violet-500/30 to-transparent" />
				</div>
				<ResultsPanel loading={loading} customInput={customInput} setCustomInput={setCustomInput} generateResult={generateResult} />
			</div>
		</>
	);
};
