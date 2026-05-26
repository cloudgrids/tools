import { CodeOutput, FileDropzone } from '@/components/ToolUi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CopyButton } from '@/components/ui/CopyButton';
import { formatBytes } from '@/lib/helpers';
import { useCallback } from 'react';
import { toast } from 'sonner';
import { Base64State } from './Base64';

interface Base64FileTabProps {
	state: Base64State;
	onSetState: React.Dispatch<React.SetStateAction<Base64State>>;
}

export const Base64FileTab: React.FC<Base64FileTabProps> = ({ state, onSetState }) => {
	const handleFile = useCallback(
		(file: File) => {
			if (file.size > 5 * 1024 * 1024) {
				toast.error('File exceeds 5MB limit');
				return;
			}
			const reader = new FileReader();
			reader.onload = (e) => {
				const du = e.target?.result as string;
				const b64 = du.split(',')[1];
				onSetState((prev) => ({ ...prev, dataUrl: du, fileB64: b64, fileName: file.name, fileSize: formatBytes(file.size) }));
			};
			reader.readAsDataURL(file);
		},
		[onSetState]
	);
	return (
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

				{state.fileB64 && (
					<div className="space-y-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<div className="min-w-0">
								<span className="block truncate font-semibold">{state.fileName}</span>
								<span className="text-sm text-muted-foreground">{state.fileSize}</span>
							</div>
							<div className="flex flex-wrap gap-2">
								<CopyButton text={state.dataUrl} label="Copy Data URL" />
								<CopyButton text={state.fileB64} label="Copy Base64" />
							</div>
						</div>
						<CodeOutput className="h-64">{state.fileB64}</CodeOutput>
					</div>
				)}
			</CardContent>
		</Card>
	);
};
