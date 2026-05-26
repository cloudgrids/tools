import { StatusBadge, ToolPanel } from '@/components/ToolUi';
import { formatJwtTimestamp } from '@/lib/jwt';
import type { decodeJwt } from '@/lib/jwt';

type JwtDecoded = Exclude<ReturnType<typeof decodeJwt>, { error: string }>;

interface JwtStatusErrorProps {
	error: string;
}
interface JwtStatusSuccessProps {
	result: JwtDecoded;
	currentTime: number;
}

type JwtStatusProps = JwtStatusErrorProps | JwtStatusSuccessProps;

export const JwtStatus: React.FC<JwtStatusProps> = (props) => {
	if ('error' in props) {
		return (
			<ToolPanel title="Status">
				<StatusBadge tone="error">{props.error}</StatusBadge>
			</ToolPanel>
		);
	}

	const { result, currentTime } = props;
	const expiration = result.payload.exp as number | undefined;
	const issuedAt = result.payload.iat as number | undefined;
	const isExpired = expiration !== undefined && expiration < currentTime;

	return (
		<ToolPanel title="Status">
			<div className="flex flex-wrap items-center gap-3">
				<StatusBadge tone={isExpired ? 'error' : 'success'}>{isExpired ? 'Expired' : 'Not Expired'}</StatusBadge>
				{expiration && <span className="text-sm text-muted-foreground">Expires: {formatJwtTimestamp(expiration)}</span>}
				{issuedAt && <span className="text-sm text-muted-foreground">Issued: {formatJwtTimestamp(issuedAt)}</span>}
				{result.header.alg !== undefined && <StatusBadge tone="info">alg: {String(result.header.alg)}</StatusBadge>}
				{result.header.typ !== undefined && <StatusBadge>typ: {String(result.header.typ)}</StatusBadge>}
			</div>
		</ToolPanel>
	);
};
