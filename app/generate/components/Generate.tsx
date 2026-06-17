'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { useState } from 'react';
import { AuthTokenCard } from './AuthTokenCard';
import { GenerateInput } from './GenerateInput';
import { History } from './History';
import { UploadResult } from './UploadResult';
import { VideoStatus } from './VideoStatus';

export interface FileProps {
	file: File;
	uploaded: boolean;
}

export const Generate = () => {
	const { loading } = usePopVid();
	const { generateResult } = usePopVidStore();
	const [files, setFiles] = useState<FileProps[]>([]);

	return (
		<div className="min-h-screen">
			<div className="mx-auto max-w-7xl p-6">
				<div className="mb-6 flex items-center justify-between">
					<h1 className="text-4xl font-bold">AI Video Generator</h1>

					<History />
				</div>

				<div className="grid gap-6 lg:grid-cols-[1fr_400px]">
					{/* Main Content */}
					<div className="space-y-6">
						<AuthTokenCard />

						<UploadResult files={files} setFiles={setFiles} loading={loading} />

						<GenerateInput loading={loading} />
					</div>

					{/* Sidebar */}
					<div className="space-y-6">
						<VideoStatus />

						{generateResult && (
							<div className="rounded-xl border bg-card p-4">
								<h3 className="mb-3 font-semibold">API Response</h3>

								<pre className="max-h-100 overflow-auto rounded-md bg-black p-3 text-xs text-green-400">
									{JSON.stringify(generateResult, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
