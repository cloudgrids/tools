import { Textarea } from '@/components/ui/textarea';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { Button } from '@base-ui/react';

interface GenerateInputProps {
	loading: boolean;
}

export const GenerateInput: React.FC<GenerateInputProps> = ({ loading }) => {
	const { setGenerateInput, generateInput, uploadResult } = usePopVidStore();
	const { handleGenerate } = usePopVid();

	const generateVideo = async () => {
		await handleGenerate(generateInput?.videoPrompt || '');
	};

	return (
		<div className=" rounded-xl p-5 shadow space-y-4">
			<h2 className="font-semibold">Generation Settings</h2>
			<sub className="block text-xs text-gray-500">Configure the prompt and settings for your video generation.</sub>

			<Textarea
				placeholder="Describe the video..."
				value={generateInput?.videoPrompt || ''}
				onChange={(e) =>
					setGenerateInput({
						...generateInput,
						videoPrompt: e.target.value
					})
				}
				className="w-full border rounded-lg p-3 min-h-30"
			/>

			<Button
				onClick={generateVideo}
				disabled={!uploadResult || loading}
				className="bg-purple-600 px-6 py-3 rounded-lg disabled:opacity-50"
			>
				{loading ? 'Generating...' : 'Generate Video'}
			</Button>
		</div>
	);
};
