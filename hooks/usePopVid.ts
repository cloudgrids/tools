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
			expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
		});
	};

	const errorMessage = (error: unknown, message: string) => {
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		toast.error(message, {
			description: errorMessage
		});
		console.error('Error:', errorMessage);
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
			errorMessage(error, 'Failed to upload image to PopVid');
		} finally {
			setLoading(false);
		}
	};

	const handleGenerate = async (prompt: string, customInput: {} = {}): Promise<void> => {
		setLoading(true);

		if (!uploadResult?.bucket || !uploadResult?.path || !prompt) {
			errorMessage(new Error('Missing required fields'), 'Please upload an image and provide a prompt before generating a video');
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
			errorMessage(error, 'Failed to generate video with PopVid');
		} finally {
			setLoading(false);
		}
	};

	const getVideoStatus = async (sessionId?: string): Promise<void> => {
		const session = sessionId || generateResult?.sessionId;
		if (!session) {
			errorMessage(new Error('Missing session ID'), 'Session ID is required to get video status');
			return;
		}

		try {
			const res = await getStatus(session as string);

			setHistory((prev) =>
				prev.map((item) => (item.sessionId === session ? { ...item, status: res.status, videoUrl: res.videoUrl } : item))
			);

			setVideoStatus(res);
		} catch (error) {
			errorMessage(error, 'Failed to get video status from PopVid');
		}
	};

	const makeMeme = async (prompt: string, nodeOrSessionId: string, sessionId: string, isCustom: boolean = false): Promise<void> => {
		setLoading(true);

		if (!prompt || !nodeOrSessionId || !sessionId) {
			errorMessage(new Error('Missing required fields'), 'Please fill in all fields before creating a meme');
			setLoading(false);
			return;
		}

		try {
			const res = await createMeme(prompt, nodeOrSessionId, sessionId);
			toast.success('Meme generation started with PopVid');

			const newMeme = { memeId: sessionId, status: res.status, nodeId: res.nodeId, prompt } satisfies MemeStatus;

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
		} catch (error) {
			errorMessage(error, 'Failed to create meme with PopVid');
		} finally {
			setLoading(false);
		}
	};

	const getMEMEStatus = async (nodeOrSessionId: string, nodeId: string, isCustom: boolean = false): Promise<void> => {
		try {
			const res = await getMemeStatus(nodeOrSessionId, nodeId);

			const highResUrl = res?.videoUrl?.replace('twist', 'enhanced');

			if (isCustom) {
				setCustomMemes((prev) =>
					prev.map((meme) =>
						meme.nodeId === nodeId ? { ...meme, status: res.status, videoUrl: res.videoUrl, highResUrl } : meme
					)
				);
			} else {
				setHistory((prev) =>
					prev.map((item) => {
						if (item.memes) {
							return {
								...item,
								memes: item.memes.map((meme) =>
									meme.nodeId === nodeId ? { ...meme, status: res.status, videoUrl: res.videoUrl, highResUrl } : meme
								)
							};
						}
						return item;
					})
				);
			}
		} catch (error) {
			errorMessage(error, 'Failed to get meme status from PopVid');
		}
	};

	return { loading, handleUpload, handleGenerate, getVideoStatus, setAuthCookie, makeMeme, getMEMEStatus };
};
