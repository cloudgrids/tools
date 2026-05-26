'use client';

import { CodeOutput, FileDropzone, StatusBadge, ToolPanel } from '@/components/tools/shared/ToolUi';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import type { HashResult } from '@/lib/contracts';
import { hashBuffer, hashText } from '@/lib/crypto';
import { formatBytes } from '@/lib/helpers';
import { HASH_DEFAULT_TEXT, HASH_LABELS } from '@/lib/tool-samples';
import { useEffect, useState } from 'react';

interface HashToolState {
	loading: boolean;
	results: HashResult[];
	fileName: string;
	fileSize: string;
	fileResults: HashResult[];
}

export function HashTool() {
	const [input, setInput] = useState(HASH_DEFAULT_TEXT);
	const [hashState, setHashState] = useState<HashToolState>({
		loading: true,
		results: [],
		fileName: '',
		fileSize: '',
		fileResults: []
	});

	async function run(text: string) {
		if (!text.trim()) return;
		setHashState((previous) => ({ ...previous, loading: true }));
		const results = await hashText(text);
		setHashState((previous) => ({ ...previous, results, loading: false }));
	}

	useEffect(() => {
		let mounted = true;
		void hashText(HASH_DEFAULT_TEXT).then((results) => {
			if (mounted) setHashState((previous) => ({ ...previous, results, loading: false }));
		});
		return () => {
			mounted = false;
		};
	}, []);

	async function handleFile(file: File) {
		setHashState((previous) => ({ ...previous, fileName: file.name, fileSize: formatBytes(file.size) }));
		const buffer = await file.arrayBuffer();
		const results = await hashBuffer(buffer);
		setHashState((previous) => ({ ...previous, fileResults: results }));
	}

	return (
		<div className="flex flex-col gap-4">
			<ToolPanel
				title="Input Text"
				action={
					<div className="flex flex-wrap gap-2">
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setInput(HASH_DEFAULT_TEXT);
								void run(HASH_DEFAULT_TEXT);
							}}
						>
							Sample
						</Button>
						<Button
							variant="ghost"
							size="sm"
							onClick={() => {
								setInput('');
								setHashState((previous) => ({ ...previous, results: [] }));
							}}
						>
							Clear
						</Button>
					</div>
				}
				contentClassName="space-y-4"
			>
				<Textarea
					id="hash-input"
					className="min-h-32 font-mono text-sm"
					value={input}
					onChange={(event) => setInput(event.target.value)}
					placeholder="Enter text to hash..."
					spellCheck={false}
				/>
				<Button onClick={() => void run(input)} disabled={hashState.loading}>
					{hashState.loading ? 'Computing...' : 'Generate All Hashes'}
				</Button>
			</ToolPanel>

			<ToolPanel title="Hash Results" contentClassName="space-y-4">
				{hashState.results.length === 0 && !hashState.loading && (
					<p className="text-sm text-muted-foreground">Enter text and generate hashes.</p>
				)}
				{hashState.loading && <p className="text-sm text-muted-foreground">Computing...</p>}
				{hashState.results.map(({ algorithm, hash }) => (
					<div key={algorithm} className="space-y-2">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<StatusBadge tone="info">{HASH_LABELS[algorithm] ?? algorithm}</StatusBadge>
							<CopyButton text={hash} label="Copy" />
						</div>
						<CodeOutput>{hash}</CodeOutput>
					</div>
				))}
			</ToolPanel>

			<ToolPanel title="File Checksum" contentClassName="space-y-4">
				<FileDropzone
					id="hash-file"
					title="Drop a file here or click to browse"
					description="Compute SHA-256 and SHA-512 checksums"
					onFile={(file) => void handleFile(file)}
				/>
				{hashState.fileResults.length > 0 && (
					<div className="space-y-4">
						<p className="break-all font-semibold">
							{hashState.fileName} <span className="text-sm text-muted-foreground">({hashState.fileSize})</span>
						</p>
						{hashState.fileResults.map(({ algorithm, hash }) => (
							<div key={algorithm} className="space-y-2">
								<div className="flex flex-wrap items-center justify-between gap-2">
									<StatusBadge tone="info">{algorithm}</StatusBadge>
									<CopyButton text={hash} label="Copy" />
								</div>
								<CodeOutput>{hash}</CodeOutput>
							</div>
						))}
					</div>
				)}
			</ToolPanel>
		</div>
	);
}
