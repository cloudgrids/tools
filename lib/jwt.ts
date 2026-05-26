import type { JwtPayload } from '@/lib/contracts';

export function decodeJwt(token: string): JwtPayload | { error: string } {
	const parts = token.trim().split('.');
	if (parts.length !== 3) return { error: 'Invalid JWT: must have exactly 3 parts (header.payload.signature)' };

	try {
		const decode = (value: string) => JSON.parse(atob(value.replace(/-/g, '+').replace(/_/g, '/'))) as Record<string, unknown>;
		return {
			header: decode(parts[0]),
			payload: decode(parts[1]),
			signature: parts[2],
			valid: true
		};
	} catch (error) {
		return { error: `Decode failed: ${(error as Error).message}` };
	}
}

export function formatJwtTimestamp(timestamp: number): string {
	return new Date(timestamp * 1000).toLocaleString(undefined, {
		dateStyle: 'medium',
		timeStyle: 'short'
	});
}
