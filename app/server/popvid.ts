'use server';

import { GenerateInput, GenerateOutput, GenerateResult, MemeOutput, MemeStatus, UploadResult } from '@/lib/contracts';
import { cookies } from 'next/headers';

const headers = {
	Referer: 'https://popvid.ai/create?tab=story',
	Origin: 'https://popvid.ai',
	Accept: '*/*'
};

const getHeaders = async (): Promise<HeadersInit> => {
	const cookieStore = await cookies();
	const accessToken = cookieStore.get('popvid_access_token')?.value || '';
	return {
		...headers,
		Cookie: `api-authorization=${accessToken}`
	};
};

export const upload = async (file: File): Promise<UploadResult> => {
	try {
		const authHeaders = await getHeaders();

		console.log('Uploading file:', {
			name: file.name,
			type: file.type,
			size: file.size
		});

		console.log('Request headers:', authHeaders);

		const formData = new FormData();
		formData.append('image', file);

		const res = await fetch('https://popvid.ai/api/v3/images/upload', {
			method: 'POST',
			body: formData,
			headers: authHeaders
		});

		console.log('Response status:', res.status);
		console.log('Response statusText:', res.statusText);
		console.log('Response headers:', Object.fromEntries(res.headers.entries()));

		const responseText = await res.text();

		console.log('Raw response body:', responseText);

		if (!res.ok) {
			throw new Error(`Upload failed (${res.status} ${res.statusText})\n${responseText}`);
		}

		let data: UploadResult;

		try {
			data = JSON.parse(responseText);
		} catch (e) {
			throw new Error(`Expected JSON response but received:\n${responseText}:: ${e instanceof Error ? e.message : 'Unknown error'}`);
		}

		console.log('Parsed response:', data);

		return data;
	} catch (error) {
		console.error('Error uploading to PopVid:', error);

		if (error instanceof Error) {
			console.error('Message:', error.message);
			console.error('Stack:', error.stack);
		}

		throw error;
	}
};

export const generate = async (param: GenerateInput): Promise<GenerateOutput> => {
	try {
		const res = await fetch('https://popvid.ai/api/v3/ugc/video/generate', {
			body: JSON.stringify(param),
			method: 'POST',
			headers: { ...(await getHeaders()), 'Content-Type': 'application/json' }
		});

		return (await res.json()) as GenerateOutput;
	} catch (error) {
		console.error('Error generating video with PopVid:', error instanceof Error ? error.message : error);
		throw error;
	}
};

export const getStatus = async (sessionId: string): Promise<GenerateResult> => {
	if (!sessionId) {
		console.error('No session ID available for video status check');
		return { status: 'error' };
	}

	try {
		const res = await fetch(`https://popvid.ai/api/v3/ugc/video/${sessionId}/status`, { method: 'GET', headers: await getHeaders() });

		if (!res.ok) throw new Error('Failed to get video status', { cause: await res.text() });

		return (await res.json()) as GenerateResult;
	} catch (error) {
		console.error('Error getting video status from PopVid:', error instanceof Error ? error.message : error);
		throw error;
	}
};

export const createMeme = async (prompt: string, memeId: string, sessionId: string): Promise<MemeOutput> => {
	if (!prompt) {
		console.error('No prompt provided for meme creation');
		return { status: 'error', nodeId: '', prompt };
	}

	try {
		const res = await fetch(`https://popvid.ai/api/v3/meme/${sessionId}/story/${memeId}`, {
			method: 'POST',
			headers: { ...(await getHeaders()), 'Content-Type': 'application/json' },
			body: JSON.stringify({ textPrompt: prompt })
		});

		if (!res.ok) throw new Error('Failed to create meme', { cause: await res.text() });

		return (await res.json()) as MemeOutput;
	} catch (error) {
		console.error('Error creating meme with PopVid:', error instanceof Error ? error.message : error);
		throw error;
	}
};

export const getMemeStatus = async (memeId: string, nodeId: string): Promise<MemeStatus> => {
	if (!nodeId) {
		console.error('No node ID available for meme status check');
		return { status: 'error', nodeId: '', memeId, prompt: '' };
	}

	try {
		const res = await fetch(`https://popvid.ai/api/v3/meme/${memeId}/story/${nodeId}/status`, {
			method: 'GET',
			headers: await getHeaders()
		});

		if (!res.ok) throw new Error('Failed to get meme status', { cause: await res.text() });

		return (await res.json()) as MemeStatus;
	} catch (error) {
		console.error('Error getting meme status from PopVid:', error instanceof Error ? error.message : error);
		throw error;
	}
};
