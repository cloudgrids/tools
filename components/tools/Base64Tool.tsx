'use client';

import { CodeOutput, FileDropzone } from '@/components/tools/shared/ToolUi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/ToastProvider';
import type { Base64TabId } from '@/lib/enumerations';
import { formatBytes } from '@/lib/helpers';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { useCallback, useState } from 'react';

export function Base64Tool() {
	const { showToast } = useToast();
	const [tab, setTab] = useState<Base64TabId>('text');
	const [input, setInput] = useState('');
	const [output, setOutput] = useState('');
	const [stats, setStats] = useState('');

	// File state
	const [fileName, setFileName] = useState('');
	const [fileSize, setFileSize] = useState('');
	const [dataUrl, setDataUrl] = useState('');
	const [fileB64, setFileB64] = useState('');

	const encode = useCallback(() => {
		try {
			const enc = btoa(unescape(encodeURIComponent(input)));
			setOutput(enc);
			setStats(
				`Input: ${input.length} chars · Output: ${enc.length} chars · +${((enc.length / Math.max(input.length, 1) - 1) * 100).toFixed(1)}%`
			);
		} catch (e) {
			setOutput(`Error: ${(e as Error).message}`);
		}
	}, [input]);

	const decode = useCallback(() => {
		try {
			const dec = decodeURIComponent(escape(atob(input.trim())));
			setOutput(dec);
			setStats(`Input: ${input.trim().length} chars · Output: ${dec.length} chars`);
		} catch {
			setOutput('Error: Invalid Base64 input');
			setStats('');
		}
	}, [input]);

	const encodeUrl = useCallback(() => {
		try {
			const enc = btoa(unescape(encodeURIComponent(input)))
				.replace(/\+/g, '-')
				.replace(/\//g, '_')
				.replace(/=/g, '');
			setOutput(enc);
			setStats(`URL-safe Base64 · ${enc.length} chars`);
		} catch (e) {
			setOutput(`Error: ${(e as Error).message}`);
		}
	}, [input]);

	function handleFile(file: File) {
		if (file.size > 5 * 1024 * 1024) {
			showToast('File exceeds 5MB limit', 'error');
			return;
		}
		const reader = new FileReader();
		reader.onload = (e) => {
			const du = e.target?.result as string;
			const b64 = du.split(',')[1];
			setDataUrl(du);
			setFileB64(b64);
			setFileName(file.name);
			setFileSize(formatBytes(file.size));
		};
		reader.readAsDataURL(file);
	}

	return (
		<div className="flex flex-col gap-4">
			{/* Tab Buttons */}
			<div className="flex gap-2">
				<Button variant={tab === 'text' ? 'default' : 'outline'} onClick={() => setTab('text')}>
					Text
				</Button>
				<Button variant={tab === 'file' ? 'default' : 'outline'} onClick={() => setTab('file')}>
					File
				</Button>
			</div>

			{tab === 'text' && (
				<div className="grid gap-4 lg:grid-cols-2">
					<Card className="min-w-0">
						<CardHeader>
							<CardTitle className="flex flex-wrap items-center justify-between gap-2">
								<span>Input</span>
								<Button
									variant="ghost"
									size="sm"
									onClick={() => {
										setInput('');
										setOutput('');
										setStats('');
									}}
								>
									Clear
								</Button>
							</CardTitle>
						</CardHeader>
						<CardContent>
							<Textarea
								id="b64-input"
								className="h-72 font-mono text-sm"
								value={input}
								onChange={(e) => setInput(e.target.value)}
								placeholder="Enter text to encode or Base64 to decode…"
								spellCheck={false}
							/>
							<div className="mt-4 flex flex-wrap gap-2">
								<Button onClick={encode}>
									<ArrowUp data-icon="inline-start" />
									Encode
								</Button>
								<Button variant="outline" onClick={decode}>
									<ArrowDown data-icon="inline-start" />
									Decode
								</Button>
								<Button variant="outline" onClick={encodeUrl}>
									URL-safe
								</Button>
							</div>
						</CardContent>
					</Card>

					<Card className="min-w-0">
						<CardHeader>
							<div className="flex flex-wrap items-center justify-between gap-2">
								<CardTitle>Output</CardTitle>
								<CopyButton text={output} label="Copy" />
							</div>
						</CardHeader>
						<CardContent>
							<CodeOutput id="b64-output" className="h-72">
								{output}
							</CodeOutput>
							{stats && <div className="text-xs text-muted-foreground mt-4">{stats}</div>}
						</CardContent>
					</Card>
				</div>
			)}

			{tab === 'file' && (
				<Card>
					<CardHeader>
						<CardTitle>File to Base64</CardTitle>
					</CardHeader>
					<CardContent className="space-y-4">
						<FileDropzone
							id="b64-file"
							title="Drop a file here or click to browse"
							description="Supports any file type · Max 5MB"
							onFile={handleFile}
						/>

						{fileB64 && (
							<div className="space-y-4">
								<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
									<div className="min-w-0">
										<span className="block truncate font-semibold">{fileName}</span>
										<span className="text-sm text-muted-foreground">{fileSize}</span>
									</div>
									<div className="flex flex-wrap gap-2">
										<CopyButton text={dataUrl} label="Copy Data URL" />
										<CopyButton text={fileB64} label="Copy Base64" />
									</div>
								</div>
								<CodeOutput className="h-64">{fileB64}</CodeOutput>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
