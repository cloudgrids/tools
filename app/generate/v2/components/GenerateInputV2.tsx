'use client';

import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { Braces, ChevronDown, ChevronUp, ExternalLink, KeyRound, Loader2, RefreshCw, Sparkles, Video } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const STATUS_PILL: Record<string, string> = {
	completed: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25',
	processing: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
	pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
	failed: 'bg-red-500/15 text-red-400 border-red-500/25'
};

interface GenerateInputV2Props {
	customInput: Record<string, unknown>;
	setCustomInput: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
	loading: boolean;
}

export const GenerateInputV2 = memo(({ customInput, setCustomInput, loading }: GenerateInputV2Props) => {
	const { generateInput, setGenerateInput, uploadResult, videoStatus, generateResult } = usePopVidStore();
	const { handleGenerate, getVideoStatus, setAuthCookie } = usePopVid();

	const [jsonText, setJsonText] = useState(() => JSON.stringify(customInput, null, 2));
	const [jsonError, setJsonError] = useState('');
	const [showJson, setShowJson] = useState(false);
	const [showApiResp, setShowApiResp] = useState(false);
	const [refreshing, setRefreshing] = useState(false);
	const prevCustomRef = useRef(customInput);

	useEffect(() => {
		if (customInput !== prevCustomRef.current) {
			prevCustomRef.current = customInput;
			setJsonText(JSON.stringify(customInput, null, 2));
			setJsonError('');
		}
	}, [customInput]);

	const onTokenChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const v = e.target.value;
			setGenerateInput({ ...generateInput, token: v });
			setAuthCookie('popvid_access_token', v, {});
		},
		[generateInput, setGenerateInput, setAuthCookie]
	);

	const onPromptChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setGenerateInput({ ...generateInput, videoPrompt: e.target.value });
		},
		[generateInput, setGenerateInput]
	);

	const onJsonChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const v = e.target.value;
			setJsonText(v);
			try {
				setCustomInput(JSON.parse(v));
				setJsonError('');
			} catch {
				setJsonError('Invalid JSON');
			}
		},
		[setCustomInput]
	);

	const onGenerate = useCallback(async () => {
		await handleGenerate(generateInput?.videoPrompt ?? '', customInput);
	}, [handleGenerate, generateInput?.videoPrompt, customInput]);

	const onRefresh = useCallback(async () => {
		if (refreshing) return;
		setRefreshing(true);
		try {
			await getVideoStatus();
		} finally {
			setRefreshing(false);
		}
	}, [refreshing, getVideoStatus]);

	const canGenerate = !!uploadResult && !loading && !jsonError;
	const statusKey = (videoStatus?.status ?? 'pending').toLowerCase();
	const pillClass = STATUS_PILL[statusKey] ?? STATUS_PILL.pending;
	const hasVideo = !!videoStatus?.videoUrl;

	return (
		<div className="flex flex-col flex-1 overflow-hidden">
			{/* Input area */}
			<div className="flex-1 overflow-y-auto">
				<div className="flex flex-col gap-5 px-5 py-5 max-w-2xl mx-auto w-full">
					{/* Access Token */}
					<section className="space-y-1.5">
						<label
							htmlFor="v2-access-token"
							className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40"
						>
							<KeyRound className="size-3" />
							Access Token
						</label>
						<input
							id="v2-access-token"
							type="password"
							placeholder="sk-••••••••••••••••••••"
							value={generateInput?.token ?? ''}
							onChange={onTokenChange}
							autoComplete="off"
							className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 font-mono text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all"
						/>
					</section>

					{/* Video Prompt */}
					<section className="space-y-1.5">
						<label
							htmlFor="v2-video-prompt"
							className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40"
						>
							<Sparkles className="size-3" />
							Video Prompt
						</label>
						<textarea
							id="v2-video-prompt"
							placeholder="A cinematic close-up of ocean waves at golden hour…"
							value={generateInput?.videoPrompt ?? ''}
							onChange={onPromptChange}
							rows={3}
							className="w-full rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-sm text-white/80 placeholder:text-white/20 outline-none focus:border-violet-500/50 focus:ring-1 focus:ring-violet-500/20 transition-all resize-y leading-relaxed"
						/>
					</section>

					{/* Custom JSON */}
					<section className="space-y-1.5">
						<button
							type="button"
							onClick={() => setShowJson((p) => !p)}
							className="flex w-full items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors"
						>
							<Braces className="size-3" />
							Custom Parameters
							<span className="ml-auto font-normal normal-case tracking-normal text-white/20 text-[10px]">optional</span>
							{showJson ? <ChevronUp className="size-3.5 ml-1" /> : <ChevronDown className="size-3.5 ml-1" />}
						</button>

						{showJson && (
							<div className="animate-in fade-in slide-in-from-top-1 duration-200">
								<textarea
									value={jsonText}
									onChange={onJsonChange}
									rows={5}
									className={`w-full rounded-xl border bg-white/[0.03] px-3 py-2 font-mono text-xs text-white/70 placeholder:text-white/20 outline-none focus:ring-1 transition-all resize-y leading-relaxed ${
										jsonError
											? 'border-red-500/50 focus:ring-red-500/20'
											: 'border-white/8 focus:border-violet-500/50 focus:ring-violet-500/20'
									}`}
									spellCheck={false}
								/>
								{jsonError && <p className="mt-1 text-xs text-red-400/80">⚠ {jsonError}</p>}
							</div>
						)}
					</section>

					{/* Generate button */}
					<button
						onClick={onGenerate}
						disabled={!canGenerate}
						className="relative h-12 w-full rounded-xl font-semibold text-sm text-white overflow-hidden transition-all disabled:opacity-40 disabled:cursor-not-allowed group"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 group-hover:from-violet-700 group-hover:to-indigo-700 transition-all" />
						<div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
						<div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
						<span className="relative flex items-center justify-center gap-2.5">
							{loading ? (
								<>
									<Loader2 className="size-4 animate-spin" />
									Generating video…
								</>
							) : (
								<>
									<Sparkles className="size-4" />
									Generate Video
								</>
							)}
						</span>
					</button>

					{!uploadResult && <p className="text-center text-xs text-white/20">Upload an image on the left to enable generation</p>}
				</div>
			</div>

			{/* Output section */}
			{generateResult && (
				<div className="flex flex-col border-t border-white/8" style={{ height: '45%', minHeight: 220 }}>
					<div className="flex items-center gap-3 border-b border-white/8 px-5 py-2.5 shrink-0">
						<Video className="size-3.5 text-white/40" />
						<span className="text-[11px] font-semibold uppercase tracking-widest text-white/40">Output</span>
						{videoStatus && (
							<span
								className={`ml-1 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold capitalize ${pillClass}`}
							>
								<span
									className={`size-1.5 rounded-full bg-current ${
										statusKey !== 'completed' && statusKey !== 'failed' ? 'animate-pulse' : ''
									}`}
								/>
								{videoStatus.status}
							</span>
						)}
						<div className="ml-auto flex items-center gap-2">
							<button
								onClick={() => setShowApiResp((p) => !p)}
								className="text-[10px] font-medium text-white/30 hover:text-white/70 transition-colors flex items-center gap-1"
							>
								<Braces className="size-3" />
								JSON
							</button>
							<button
								onClick={onRefresh}
								disabled={refreshing}
								className="flex items-center gap-1.5 rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/40 hover:text-white/80 hover:bg-white/[0.07] transition-all disabled:opacity-40"
							>
								<RefreshCw className={`size-3 ${refreshing ? 'animate-spin' : ''}`} />
								{refreshing ? 'Refreshing' : 'Refresh'}
							</button>
						</div>
					</div>

					<div className="flex flex-1 min-h-0 overflow-hidden">
						<div className="flex flex-1 flex-col items-center justify-center overflow-y-auto p-4">
							{hasVideo ? (
								<div className="flex flex-col gap-2 w-full h-full max-w-lg items-center justify-center">
									<video
										key={videoStatus!.videoUrl}
										src={videoStatus!.videoUrl}
										controls
										preload="metadata"
										className="w-full max-h-[calc(100%-2rem)] rounded-xl border border-white/10 shadow-xl object-contain bg-black"
									/>
									<a
										href={videoStatus!.videoUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="self-end flex items-center gap-1 text-xs text-white/30 hover:text-white/70 transition-colors"
									>
										<ExternalLink className="size-3" />
										Open in new tab
									</a>
								</div>
							) : (
								<div className="flex flex-col items-center gap-3 text-white/20">
									<Loader2 className="size-7 animate-spin" />
									<p className="text-xs">Waiting for video…</p>
								</div>
							)}
						</div>

						{showApiResp && (
							<div className="w-64 shrink-0 border-l border-white/8 overflow-y-auto animate-in slide-in-from-right-4 duration-200">
								<pre className="p-4 text-[10px] text-emerald-400 font-mono leading-relaxed whitespace-pre-wrap break-all bg-black/60 min-h-full">
									{JSON.stringify(generateResult, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</div>
			)}
		</div>
	);
});

GenerateInputV2.displayName = 'GenerateInputV2';
