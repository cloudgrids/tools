'use client';

import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { Braces, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

interface GenerateInputProps {
	loading: boolean;
	customInput: Record<string, unknown>;
	setCustomInput: React.Dispatch<React.SetStateAction<Record<string, unknown>>>;
}

export const GenerateInput = memo(({ loading, customInput, setCustomInput }: GenerateInputProps) => {
	const { setGenerateInput, generateInput, uploadResult } = usePopVidStore();
	const { handleGenerate } = usePopVid();

	const [jsonText, setJsonText] = useState<string>(() => JSON.stringify(customInput, null, 2));
	const [jsonError, setJsonError] = useState<string>('');
	const prevCustomInputRef = useRef(customInput);

	useEffect(() => {
		if (customInput !== prevCustomInputRef.current) {
			prevCustomInputRef.current = customInput;
			setJsonText(JSON.stringify(customInput, null, 2));
			setJsonError('');
		}
	}, [customInput]);

	const handlePromptChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			setGenerateInput({ ...generateInput, videoPrompt: e.target.value });
		},
		[generateInput, setGenerateInput]
	);

	const handleJsonChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			const value = e.target.value;
			setJsonText(value);
			try {
				setCustomInput(JSON.parse(value));
				setJsonError('');
			} catch {
				setJsonError('Invalid JSON');
			}
		},
		[setCustomInput]
	);

	const generateVideo = useCallback(async () => {
		await handleGenerate(generateInput?.videoPrompt || '', customInput);
	}, [handleGenerate, generateInput?.videoPrompt, customInput]);

	const canGenerate = !!uploadResult && !loading && !jsonError;

	return (
		<div className="relative rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md space-y-5">
			<div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />

			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
					<Wand2 className="size-4" />
				</div>
				<div>
					<p className="text-sm font-semibold leading-none">Generation Settings</p>
					<p className="mt-1 text-xs text-muted-foreground">Craft your prompt and fine-tune generation parameters</p>
				</div>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="video-prompt"
					className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
				>
					<Sparkles className="size-3" />
					Video Prompt
				</label>
				<Textarea
					id="video-prompt"
					placeholder="A cinematic close-up of a misty forest at dawn, golden light filtering through ancient trees…"
					value={generateInput?.videoPrompt || ''}
					onChange={handlePromptChange}
					className="min-h-32 resize-y font-normal text-sm leading-relaxed"
				/>
			</div>

			<div className="space-y-2">
				<label
					htmlFor="custom-json"
					className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground"
				>
					<Braces className="size-3" />
					Custom Parameters
					<span className="ml-auto font-normal normal-case tracking-normal text-muted-foreground/60">optional JSON</span>
				</label>
				<div className="relative">
					<Textarea
						id="custom-json"
						value={jsonText}
						onChange={handleJsonChange}
						className={`min-h-28 resize-y font-mono text-xs leading-relaxed transition-colors ${
							jsonError ? 'border-destructive focus-visible:ring-destructive/30' : ''
						}`}
						spellCheck={false}
					/>
					{jsonError && (
						<p className="mt-1.5 flex items-center gap-1 text-xs text-destructive">
							<span className="font-semibold">⚠</span> {jsonError}
						</p>
					)}
				</div>
			</div>

			<Button
				onClick={generateVideo}
				disabled={!canGenerate}
				className="w-full gap-2 bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed h-11"
			>
				{loading ? (
					<>
						<Loader2 className="size-4 animate-spin" />
						Generating…
					</>
				) : (
					<>
						<Sparkles className="size-4" />
						Generate Video
					</>
				)}
			</Button>

			{!uploadResult && <p className="text-center text-xs text-muted-foreground/60">Upload an image above to enable generation</p>}
		</div>
	);
});

GenerateInput.displayName = 'GenerateInput';
