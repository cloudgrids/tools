'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { KeyRound } from 'lucide-react';
import { memo, useCallback } from 'react';

export const AuthTokenCard = memo(() => {
	const { generateInput, setGenerateInput } = usePopVidStore();
	const { setAuthCookie } = usePopVid();

	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const value = e.target.value;
			setGenerateInput({ ...generateInput, token: value });
			setAuthCookie('popvid_access_token', value, {});
		},
		[generateInput, setGenerateInput, setAuthCookie]
	);

	return (
		<div className="group relative rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
			<div className="absolute inset-x-0 top-0 h-px rounded-t-2xl bg-linear-to-r from-transparent via-violet-500/40 to-transparent" />

			<div className="flex items-start gap-3 mb-4">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/10 text-violet-500">
					<KeyRound className="size-4" />
				</div>
				<div>
					<p className="text-sm font-semibold leading-none">Access Token</p>
					<p className="mt-1 text-xs text-muted-foreground">Required to authenticate API requests</p>
				</div>
			</div>

			<div className="space-y-1.5">
				<Label htmlFor="auth-token" className="sr-only">
					Access Token
				</Label>
				<Input
					id="auth-token"
					type="password"
					value={generateInput?.token || ''}
					onChange={handleChange}
					placeholder="sk-••••••••••••••••••••••"
					autoComplete="off"
					className="font-mono text-sm"
				/>
			</div>
		</div>
	);
});

AuthTokenCard.displayName = 'AuthTokenCard';
