import { Label } from '@/components/ui/label';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { Input } from '@base-ui/react';

export const AuthTokenCard = () => {
	const { generateInput, setGenerateInput } = usePopVidStore();
	const { setAuthCookie } = usePopVid();

	return (
		<div className="rounded-xl p-5 shadow">
			<Label className="block text-sm font-medium mb-2">Access Token</Label>

			<sub className="block text-xs text-gray-500 mb-2">Your API token is required to authenticate requests.</sub>

			<Input
				type="password"
				value={generateInput?.token || ''}
				onChange={(e) => {
					setGenerateInput({
						...generateInput,
						token: e.target.value
					});

					setAuthCookie('popvid_access_token', e.target.value, {});
				}}
			/>
		</div>
	);
};
