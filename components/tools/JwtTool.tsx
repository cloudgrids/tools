'use client';

import { CodeOutput, StatusBadge, ToolPanel } from '@/components/tools/shared/ToolUi';
import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/CopyButton';
import { Textarea } from '@/components/ui/textarea';
import { decodeJwt, formatJwtTimestamp } from '@/lib/jwt';
import { JWT_SAMPLE } from '@/lib/tool-samples';
import { useMemo, useState } from 'react';

interface JwtSectionProps {
	title: string;
	data: Record<string, unknown>;
}

interface JwtTokenInputProps {
	token: string;
	onTokenChange: (token: string) => void;
}

function JwtTokenInput({ token, onTokenChange }: JwtTokenInputProps) {
	return (
		<ToolPanel
			title="JWT Token"
			action={
				<div className="flex gap-2">
					<Button variant="ghost" size="sm" onClick={() => onTokenChange(JWT_SAMPLE)}>
						Sample
					</Button>
					<Button variant="ghost" size="sm" onClick={() => onTokenChange('')}>
						Clear
					</Button>
				</div>
			}
		>
			<Textarea
				id="jwt-input"
				className="min-h-32 break-all font-mono text-sm"
				value={token}
				onChange={(event) => onTokenChange(event.target.value)}
				placeholder="Paste JWT token here..."
				spellCheck={false}
			/>
		</ToolPanel>
	);
}

function JwtSection({ title, data }: JwtSectionProps) {
	const json = JSON.stringify(data, null, 2);

	return (
		<ToolPanel title={title} action={<CopyButton text={json} label="Copy JSON" />}>
			<CodeOutput className="min-h-24">{json}</CodeOutput>
		</ToolPanel>
	);
}

export function JwtTool() {
	const [token, setToken] = useState(JWT_SAMPLE);
	const [currentTime] = useState(() => Math.floor(Date.now() / 1000));
	const result = useMemo(() => decodeJwt(token), [token]);

	if ('error' in result) {
		return (
			<div className="flex flex-col gap-4">
				<JwtTokenInput token={token} onTokenChange={setToken} />
				<ToolPanel title="Status">
					<StatusBadge tone="error">{result.error}</StatusBadge>
				</ToolPanel>
			</div>
		);
	}

	const expiration = result.payload.exp as number | undefined;
	const issuedAt = result.payload.iat as number | undefined;
	const isExpired = expiration !== undefined && expiration < currentTime;

	return (
		<div className="flex flex-col gap-4">
			<JwtTokenInput token={token} onTokenChange={setToken} />

			<ToolPanel title="Status">
				<div className="flex flex-wrap items-center gap-3">
					<StatusBadge tone={isExpired ? 'error' : 'success'}>{isExpired ? 'Expired' : 'Not Expired'}</StatusBadge>
					{expiration && <span className="text-sm text-muted-foreground">Expires: {formatJwtTimestamp(expiration)}</span>}
					{issuedAt && <span className="text-sm text-muted-foreground">Issued: {formatJwtTimestamp(issuedAt)}</span>}
					{result.header.alg !== undefined && <StatusBadge tone="info">alg: {String(result.header.alg)}</StatusBadge>}
					{result.header.typ !== undefined && <StatusBadge>typ: {String(result.header.typ)}</StatusBadge>}
				</div>
			</ToolPanel>

			<JwtSection title="Header" data={result.header} />
			<JwtSection title="Payload" data={result.payload} />
			<ToolPanel title="Signature" action={<CopyButton text={result.signature} label="Copy" />} contentClassName="space-y-3">
				<CodeOutput>{result.signature}</CodeOutput>
				<p className="text-sm text-red-500">
					Signature verification requires the secret key. This tool decodes tokens only.
				</p>
			</ToolPanel>
		</div>
	);
}
