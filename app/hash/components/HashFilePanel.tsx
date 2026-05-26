import { CodeOutput, FileDropzone, StatusBadge, ToolPanel } from '@/components/ToolUi';
import { CopyButton } from '@/components/ui/CopyButton';
import { HASH_LABELS } from '@/lib/tool-samples';
import type { HashState } from './Hash';

interface HashFilePanelProps {
	state: HashState;
	onFile: (file: File) => Promise<void>;
}

export const HashFilePanel: React.FC<HashFilePanelProps> = ({ state, onFile }) => (
	<ToolPanel title="File Checksum" contentClassName="space-y-4">
		<FileDropzone
			id="hash-file"
			title="Drop a file here or click to browse"
			description="Compute SHA-256 and SHA-512 checksums"
			onFile={(file) => void onFile(file)}
		/>
		{state.fileResults.length > 0 && (
			<div className="space-y-4">
				<p className="break-all font-semibold">
					{state.fileName} <span className="text-sm text-muted-foreground">({state.fileSize})</span>
				</p>
				{state.fileResults.map(({ algorithm, hash }) => (
					<div key={algorithm} className="space-y-2">
						<div className="flex flex-wrap items-center justify-between gap-2">
							<StatusBadge tone="info">{HASH_LABELS[algorithm] ?? algorithm}</StatusBadge>
							<CopyButton text={hash} label="Copy" />
						</div>
						<CodeOutput>{hash}</CodeOutput>
					</div>
				))}
			</div>
		)}
	</ToolPanel>
);
