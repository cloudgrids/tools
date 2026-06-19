'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { GenerateOutput } from '@/lib/contracts';
import { Braces, ChevronDown, ChevronUp, ExternalLink, KeyRound, Loader2, RefreshCw, Sparkles, Video } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

const STATUS_PILL: Record<string, string> = {
	completed: 'bg-green-500/15 text-green-400 border-green-500/25',
	processing: 'bg-sky-500/15 text-sky-400 border-sky-500/25',
	pending: 'bg-amber-500/15 text-amber-400 border-amber-500/25',
	failed: 'bg-red-500/15 text-red-400 border-red-500/25'
};

interface ResultsPanelProps {
	loading: boolean;
	customInput: Record<string, unknown>;
	setCustomInput: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
	generateResult: GenerateOutput | null;
	mobile?: boolean;
}

export const ResultsPanel = memo(({ loading, customInput, setCustomInput, generateResult, mobile }: ResultsPanelProps) => {
	const { generateInput, setGenerateInput, uploadResult, videoStatus } = usePopVidStore();
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
		<main className={mobile ? 'flex flex-col' : 'flex flex-1 flex-col overflow-hidden'}>
			<div className={mobile ? 'flex flex-col gap-5 px-4 sm:px-6' : 'flex flex-col overflow-y-auto border-b border-border/60'}>
				<div className={mobile ? 'flex flex-col gap-5' : 'flex flex-col gap-5 max-w-2xl mt-1 w-full mx-auto'}>
					<section className="space-y-1">
						<label
							htmlFor="access-token"
							className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
						>
							<KeyRound className="size-3" />
							Access Token
						</label>
						<Input
							id="access-token"
							type="password"
							placeholder="sk-••••••••••••••••••••"
							value={generateInput?.token ?? ''}
							onChange={onTokenChange}
							autoComplete="off"
							className="font-mono text-sm h-5"
						/>
					</section>
					<section className="space-y-1">
						<label
							htmlFor="video-prompt"
							className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
						>
							<Sparkles className="size-3" />
							Video Prompt
						</label>
						<Textarea
							id="video-prompt"
							placeholder="A cinematic close-up of ocean waves at golden hour, slow motion, film grain…"
							value={generateInput?.videoPrompt ?? ''}
							onChange={onPromptChange}
							className="min-h-16 resize-y text-sm leading-relaxed"
						/>
					</section>
					<section className="space-y-1">
						<button
							type="button"
							onClick={() => setShowJson((p) => !p)}
							className="flex w-full items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
						>
							<Braces className="size-3" />
							Custom Parameters
							<span className="ml-auto font-normal normal-case tracking-normal text-muted-foreground/50 text-[10px]">
								optional
							</span>
							{showJson ? <ChevronUp className="size-3.5 ml-1" /> : <ChevronDown className="size-3.5 ml-1" />}
						</button>

						{showJson && (
							<div className="animate-in fade-in slide-in-from-top-1 duration-200">
								<Textarea
									id="custom-json"
									value={jsonText}
									onChange={onJsonChange}
									className={`min-h-28 resize-y font-mono text-xs leading-relaxed ${
										jsonError ? 'border-destructive' : ''
									}`}
									spellCheck={false}
								/>
								{jsonError && <p className="mt-1 text-xs text-destructive">⚠ {jsonError}</p>}
							</div>
						)}
					</section>

					<Button
						onClick={onGenerate}
						disabled={!canGenerate}
						className="h-12 w-full gap-2.5 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
					>
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
					</Button>

					{!uploadResult && (
						<p className="text-center text-xs text-muted-foreground/50">Upload an image on the left to enable generation</p>
					)}
				</div>
			</div>

			{generateResult && (
				<div
					className={mobile ? 'flex flex-col border-t border-border/60' : 'flex shrink-0 flex-col overflow-hidden'}
					style={mobile ? undefined : { maxHeight: '45%' }}
				>
					<div className="flex items-center gap-3 border-b border-border/60 px-6 shrink-0">
						<Video className="size-3.5 text-muted-foreground" />
						<span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">Output</span>
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
								className="text-[10px] font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
							>
								<Braces className="size-3" />
								JSON
							</button>

							<Button
								size="sm"
								variant="ghost"
								onClick={onRefresh}
								disabled={refreshing}
								className="h-7 gap-1.5 text-xs px-2"
							>
								<RefreshCw className={`size-3 ${refreshing ? 'animate-spin' : ''}`} />
								{refreshing ? 'Refreshing' : 'Refresh'}
							</Button>
						</div>
					</div>

					<div className={mobile ? 'flex flex-col gap-4 p-4' : 'flex overflow-hidden gap-0'}>
						<div className="flex flex-1 flex-col items-center justify-center overflow-hidden bg-black/30 p-2">
							{hasVideo ? (
								<div className="flex flex-col gap-2 w-full max-w-lg">
									<video
										key={videoStatus!.videoUrl}
										src={videoStatus!.videoUrl}
										controls
										preload="metadata"
										className="w-full rounded-xl border border-white/10 shadow-xl"
									/>
									<a
										href={videoStatus!.videoUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="self-end flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
									>
										<ExternalLink className="size-3" />
										Open in new tab
									</a>
								</div>
							) : (
								<div className="flex flex-col items-center gap-3 text-muted-foreground/40">
									<Loader2 className="size-7 animate-spin" />
									<p className="text-xs">Waiting for video…</p>
								</div>
							)}
						</div>

						{showApiResp && (
							<div
								className={
									mobile
										? 'rounded-xl border border-border/60 overflow-hidden animate-in fade-in duration-200'
										: 'w-64 shrink-0 border-l border-border/60 overflow-y-auto animate-in slide-in-from-right-4 duration-200'
								}
							>
								<pre className="p-4 text-[10px] text-green-400 font-mono leading-relaxed whitespace-pre-wrap break-all bg-black/60 min-h-full">
									{JSON.stringify(generateResult, null, 2)}
								</pre>
							</div>
						)}
					</div>
				</div>
			)}
		</main>
	);
});

ResultsPanel.displayName = 'ResultsPanel';
