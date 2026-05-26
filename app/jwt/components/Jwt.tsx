'use client';

import { decodeJwt } from '@/lib/jwt';
import { JWT_SAMPLE } from '@/lib/tool-samples';
import { useMemo, useState } from 'react';
import { JwtInput } from './JwtInput';
import { JwtSections } from './JwtSections';
import { JwtStatus } from './JwtStatus';

export const Jwt = () => {
	const [token, setToken] = useState(JWT_SAMPLE);
	const [currentTime] = useState(() => Math.floor(Date.now() / 1000));
	const result = useMemo(() => decodeJwt(token), [token]);

	return (
		<div className="flex flex-col gap-4">
			<JwtInput token={token} onTokenChange={setToken} />
			{'error' in result ? (
				<JwtStatus error={result.error} />
			) : (
				<>
					<JwtStatus result={result} currentTime={currentTime} />
					<JwtSections result={result} />
				</>
			)}
		</div>
	);
};
