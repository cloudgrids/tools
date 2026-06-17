import { MemeOutput, MemeStatus } from './lib/contracts';

const headers = {
	Referer: 'https://popvid.ai/create?tab=story',
	Origin: 'https://popvid.ai',
	Accept: '*/*'
};

const getHeaders = async (): Promise<HeadersInit> => {
	// const cookieStore = await cookies();
	// const accessToken = cookieStore.get('popvid_access_token')?.value || '';
	const accessToken =
		'eyJhbGciOiJSUzI1NiIsImtpZCI6IjRVUXdHZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9tZW1lZ2VuLWYyMzVlIiwibmFtZSI6IkFteSBPbHNlbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJeHRkRnd1b3d5YzlneDg4bVFIcjNTOUlrT3BlNTlFVlFJN2w4TEtFSFpwaVA5a2F6cFx1MDAzZHM5Ni1jIiwiYXVkIjoibWVtZWdlbi1mMjM1ZSIsImF1dGhfdGltZSI6MTc4MTU4Mzk0MCwidXNlcl9pZCI6IjYxd0FBd3prczhPZnhPMW05djI1R0xNMnltbjEiLCJzdWIiOiI2MXdBQXd6a3M4T2Z4TzFtOXYyNUdMTTJ5bW4xIiwiaWF0IjoxNzgxNjEzMjQ0LCJleHAiOjE3ODI4MjI4NDQsImVtYWlsIjoiYW15b2xzZW4ubW9kZWxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTY2NTQzMjgyMjM2NDk2MTk3ODYiXSwiZW1haWwiOlsiYW15b2xzZW4ubW9kZWxAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.RVkId4Fdc080W9bRqQVwgUjWy7qV5Y2nOLf3vx9a3XRgk5ChyCIktcjza4FFWTcWj1CsSS04uSTV_RpQGzfqSoKxb6cm7KekDGjUJdpxs-g7X6fbTCVfFx0FbBNlbJ4SSLa4LrRGARyqQ9bj-9c-tdSh64qP5DjQwh7D_QsmlU8LmuiYuo9Vr5WFWQbLjtq6RMD_JKlg4YUoVSjqn-6cpP53ZbqlET2v6ZpuVGt_OLJnhvIXgT1BiuZ3_oz8yEBHljzpYpHyuPznyL9UI4HLNJC71ndF6GiDjn1KAfGL8YWg6cpi-vGrQ6dqMocr6HGjCTx7rKmCGw6yPNR1BrVPTQ';

	return {
		...headers,
		Cookie: `api-authorization=${accessToken}`
	};
};

export const createMeme = async (prompt: string, memeId: string): Promise<MemeOutput> => {
	if (!prompt) {
		console.error('No prompt provided for meme creation');
		return { status: 'error', nodeId: '', prompt };
	}

	try {
		const res = await fetch(`https://popvid.ai/api/v3/meme/${memeId}/story/${memeId}`, {
			method: 'POST',
			headers: { ...(await getHeaders()), 'Content-Type': 'application/json' },
			body: JSON.stringify({ textPrompt: prompt })
		});

		if (!res.ok) throw new Error('Failed to create meme');

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

		if (!res.ok) throw new Error('Failed to get meme status');

		return (await res.json()) as MemeStatus;
	} catch (error) {
		console.error('Error getting meme status from PopVid:', error instanceof Error ? error.message : error);
		throw error;
	}
};

async function test() {
	const memeId = '20260615124623_676094';
	// const prompt =
	// 	'She instinctively reaches across her shoulder, grabbing one of the thin dress straps and pulling sharply as she tries to regain her balance.';
	// const memeOutput = await createMeme(prompt, memeId);
	// console.log('Meme Output:', memeOutput);

	// if (memeOutput.nodeId) {
	// 	const memeStatus = await getMemeStatus(memeId, memeOutput.nodeId);
	// 	console.log('Meme Status:', memeStatus);
	// }

	const memeStatus = await getMemeStatus(memeId, 'ZPIJOIbmFYpruPHLQhyV');
	console.log('Meme Status:', memeStatus);
}

test();
