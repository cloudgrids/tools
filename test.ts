import { GenerateInput, GenerateOutput, GenerateResult, UploadResult } from '@/lib/contracts';

const headers = {
	Referer: 'https://popvid.ai/create?tab=story',
	Origin: 'https://popvid.ai',
	Accept: '*/*'
};

const token =
	'eyJhbGciOiJSUzI1NiIsImtpZCI6IjRVUXdHZyJ9.eyJpc3MiOiJodHRwczovL3Nlc3Npb24uZmlyZWJhc2UuZ29vZ2xlLmNvbS9tZW1lZ2VuLWYyMzVlIiwibmFtZSI6IkFteSBPbHNlbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJeHRkRnd1b3d5YzlneDg4bVFIcjNTOUlrT3BlNTlFVlFJN2w4TEtFSFpwaVA5a2F6cFx1MDAzZHM5Ni1jIiwiYXVkIjoibWVtZWdlbi1mMjM1ZSIsImF1dGhfdGltZSI6MTc4MTU4Mzk0MCwidXNlcl9pZCI6IjYxd0FBd3prczhPZnhPMW05djI1R0xNMnltbjEiLCJzdWIiOiI2MXdBQXd6a3M4T2Z4TzFtOXYyNUdMTTJ5bW4xIiwiaWF0IjoxNzgxNjA0OTg4LCJleHAiOjE3ODI4MTQ1ODgsImVtYWlsIjoiYW15b2xzZW4ubW9kZWxAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZ29vZ2xlLmNvbSI6WyIxMTY2NTQzMjgyMjM2NDk2MTk3ODYiXSwiZW1haWwiOlsiYW15b2xzZW4ubW9kZWxAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoiZ29vZ2xlLmNvbSJ9fQ.lJ-kErA4uJ_6jRbYAGuYATqwS3_3usmUjk2RvAzTgZ5qbEosIBeZRGCfSt0qUM1Y3ZIEhI3onqzfU-PNS8o0vbWjvZNV5oJeLAHWppGdBU0xBpYXra3pidql-aBvpq19mXMQcCA6HQz-5rCji8DRNnLJAt0ZrExTNeQq2GUqTZDebRE91aCz2V4nX4Cd7eIaoW91yy_qGCOHKgiAjGV1HSOYBZmZTmoMgPMwCgADdGwwCVyb8jKtLVX4qyBN6qXMpIFRrd91xIWvAB0WYpkLguHf8m2Gf5ZqkeuhDVQrKEzPwB37cP0zHY4fuoo1yJ3ZQrbV2NAJGyzxo0SqL1TK6Q';

const getHeaders = async (): Promise<HeadersInit> => {
	// const cookieStore = await cookies();
	// const accessToken = cookieStore.get('popvid_access_token')?.value || '';
	return {
		...headers,
		Cookie: `api-authorization=${token}`
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

		if (!res.ok) throw new Error('Failed to get video status');

		return (await res.json()) as GenerateResult;
	} catch (error) {
		console.error('Error getting video status from PopVid:', error instanceof Error ? error.message : error);
		throw error;
	}
};

async function test() {
	// const testFile = await readFile('./image.jpg');

	// const file = new File([testFile], 'image.jpg', { type: 'image/jpeg' });

	try {
		// const uploadResult = await upload(file);
		// console.log('Upload successful:', uploadResult);

		// const generateResult = await generate({
		// 	videoPrompt: 'Oiling her boobs',
		// 	imageBucket: 'champ_user_uploaded_content',
		// 	imagePath: '61wAAwzks8OfxO1m9v25GLM2ymn1/edit_source_1781612503899.jpg'
		// });
		// console.log('Generate request successful:', generateResult);

		const statusResult = await getStatus('ugc_video_20260616123203_813387');
		console.log('Status check successful:', statusResult);
	} catch (error) {
		console.error('Test failed:', error instanceof Error ? error.message : error);
	}
}

test();
