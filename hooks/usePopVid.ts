import { createMeme, generate, getMemeStatus, getStatus, upload } from '@/app/server/popvid';
import { MemeStatus } from '@/lib/contracts';
import { OptionsType, setCookie } from 'cookies-next';
import { useState } from 'react';
import { toast } from 'sonner';
import { usePopVidStore } from './popvid.store';

export const usePopVid = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const { generateResult, uploadResult, setGenerateResult, setUploadResult, setVideoStatus, generateInput, setHistory, setCustomMemes } =
		usePopVidStore();

	const setAuthCookie = (key: string, data: string, options: OptionsType) => {
		setCookie(key, data, {
			...options,
			path: '/',
			domain: process.env.NEXT_PUBLIC_NODE_ENV === 'production' ? 'tools.cloudgrids.tech' : 'localhost',
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

	const handleGenerate = async (prompt: string, customInput: {} = {}): Promise<void> => {
		setLoading(true);

		if (!uploadResult?.bucket || !uploadResult?.path || !prompt) {
			toast.error('Please upload an image and enter a prompt before generating a video', { description: uploadResult?.bucket });
			setLoading(false);
			return;
		}

		const payload = {
			imageBucket: uploadResult?.bucket as string,
			imagePath: uploadResult?.path as string,
			videoPrompt: prompt,
			token: generateInput?.token || '',
			...customInput
		};

		try {
			const res = await generate(payload);

			setGenerateResult(res);

			toast.success('Video generation started with PopVid');

			await getVideoStatus(res.sessionId);

			setHistory((prev) => [...prev, { ...payload, ...res }]);
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

			setHistory((prev) =>
				prev.map((item) => (item.sessionId === session ? { ...item, status: res.status, videoUrl: res.videoUrl } : item))
			);

			setVideoStatus(res);
		} catch (error) {
			toast.error('Failed to get video status from PopVid');
			console.error('Error getting video status from PopVid:', error instanceof Error ? error.message : error);
		}
	};

	const makeMeme = async (prompt: string, memeId: string, sessionId: string, isCustom: boolean = false): Promise<void> => {
		setLoading(true);

		if (!prompt || !memeId || !sessionId) {
			toast.error('Please fill in all fields before creating a meme');
			setLoading(false);
			return;
		}

		console.log('Creating meme with:', { prompt, memeId, sessionId });

		try {
			const res = await createMeme(prompt, memeId, sessionId);
			toast.success('Meme generation started with PopVid');

			const newMeme = { memeId, status: res.status, nodeId: res.nodeId, prompt } satisfies MemeStatus;

			if (isCustom) {
				setCustomMemes((prev) => [...prev, { ...newMeme }]);
			} else {
				setHistory((prev) =>
					prev.map((item) =>
						item.sessionId === sessionId
							? {
									...item,
									memes: [...(item.memes ?? []), newMeme]
								}
							: item
					)
				);
			}

			await getMEMEStatus(memeId, res.nodeId, isCustom);
		} catch (error) {
			toast.error('Failed to generate meme with PopVid');
			console.error('Error generating meme with PopVid:', error instanceof Error ? error.message : error);
		} finally {
			setLoading(false);
		}
	};

	const getMEMEStatus = async (memeId: string, nodeId: string, isCustom: boolean = false): Promise<void> => {
		try {
			const res = await getMemeStatus(memeId, nodeId);

			if (isCustom) {
				setCustomMemes((prev) =>
					prev.map((meme) => (meme.nodeId === nodeId ? { ...meme, status: res.status, videoUrl: res.videoUrl } : meme))
				);
			} else {
				setHistory((prev) =>
					prev.map((item) => {
						if (item.memes) {
							return {
								...item,
								memes: item.memes.map((meme) =>
									meme.nodeId === nodeId ? { ...meme, status: res.status, videoUrl: res.videoUrl } : meme
								)
							};
						}
						return item;
					})
				);
			}
		} catch (error) {
			toast.error('Failed to get meme status from PopVid');
			console.error('Error getting meme status from PopVid:', error instanceof Error ? error.message : error);
		}
	};

	return { loading, handleUpload, handleGenerate, getVideoStatus, setAuthCookie, makeMeme, getMEMEStatus };
};
