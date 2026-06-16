import { generate, getStatus, upload } from '@/app/server/popvid';
import { OptionsType, setCookie } from 'cookies-next';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePopVidStore } from './popvid.store';

export const usePopVid = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { generateResult, uploadResult, setGenerateResult, setUploadResult, setVideoStatus, generateInput } = usePopVidStore();

	const setAuthCookie = (key: string, data: string, options: OptionsType) => {
		setCookie(key, data, {
			...options,
			path: '/',
			domain: process.env.NODE_ENV === 'production' ? 'tools.cloudgrids.tech' : 'localhost',
			sameSite: 'none',
			secure: true,
			expires: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
		});
	};

	const handleUpload = async (file: File): Promise<void> => {
		setLoading(true);
		try {
			const formdata = new FormData();
			formdata.append('image', file);

			const res = await upload(file);

			setUploadResult(res);

			toast.success('Image uploaded to PopVid successfully');
		} catch (error) {
			toast.error('Failed to upload image to PopVid');
			console.error('Error uploading to PopVid:', error instanceof Error ? error.message : error);
		} finally {
			setLoading(false);
		}
	};

	const handleGenerate = async (prompt: string): Promise<void> => {
		setLoading(true);

		if (!uploadResult?.bucket || !uploadResult?.path || !prompt) {
			toast.error('Please upload an image and enter a prompt before generating a video', { description: uploadResult?.bucket });
			setLoading(false);
			return;
		}

		try {
			const res = await generate({
				imageBucket: uploadResult?.bucket as string,
				imagePath: uploadResult?.path as string,
				videoPrompt: prompt,
				token: generateInput?.token || ''
			});

			setGenerateResult(res);

			toast.success('Video generation started with PopVid');

			await getVideoStatus(res.sessionId);
		} catch (error) {
			toast.error('Failed to generate video with PopVid');
			console.error('Error generating video with PopVid:', error instanceof Error ? error.message : error);
		} finally {
			setLoading(false);
		}
	};

	const getVideoStatus = async (sessionId?: string): Promise<void> => {
		const session = sessionId || generateResult?.sessionId;
		if (!session) {
			toast.error('No session ID available for video status check');
			return;
		}

		try {
			const res = await getStatus(session as string);

			setVideoStatus(res);
		} catch (error) {
			toast.error('Failed to get video status from PopVid');
			console.error('Error getting video status from PopVid:', error instanceof Error ? error.message : error);
		}
	};

	return { loading, handleUpload, handleGenerate, getVideoStatus, setAuthCookie };
};
