import { CodeOutput, ToolPanel } from '@/components/ToolUi';
import { CopyButton } from '@/components/ui/CopyButton';
import type { decodeJwt } from '@/lib/jwt';

type JwtDecoded = Exclude<ReturnType<typeof decodeJwt>, { error: string }>;

interface JwtSectionsProps {
	result: JwtDecoded;
}

function JwtSection({ title, data }: { title: string; data: Record<string, unknown> }) {
	const json = JSON.stringify(data, null, 2);
	return (
		<ToolPanel title={title} action={<CopyButton text={json} label="Copy JSON" />}>
			<CodeOutput className="min-h-24">{json}</CodeOutput>
		</ToolPanel>
	);
}

export const JwtSections: React.FC<JwtSectionsProps> = ({ result }) => (
	<>
		<JwtSection title="Header" data={result.header} />
		<JwtSection title="Payload" data={result.payload} />
		<ToolPanel title="Signature" action={<CopyButton text={result.signature} label="Copy" />} contentClassName="space-y-3">
			<CodeOutput>{result.signature}</CodeOutput>
			<p className="text-sm text-red-500">Signature verification requires the secret key. This tool decodes tokens only.</p>
		</ToolPanel>
	</>
);
