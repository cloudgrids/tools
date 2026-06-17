'use client';

import { Dropzone } from '@/components/Dropzone';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import Image from 'next/image';
import { useState } from 'react';
import { History } from './History';

interface FileProps {
	file: File;
	uploaded: boolean;
}

export const Generate = () => {
	const { getVideoStatus, handleGenerate, handleUpload, loading, setAuthCookie } = usePopVid();
	const { generateResult, uploadResult, videoStatus, generateInput, setGenerateInput } = usePopVidStore();
	const [files, setFiles] = useState<FileProps[]>([]);

	const uploadFile = async () => {
		if (!files.length) return;
		await handleUpload(files[0].file);
	};

	const generateVideo = async () => {
		await handleGenerate(generateInput?.videoPrompt || '');
	};

	return (
		<div className="min-h-screen">
			<div className="max-w-4xl mx-auto p-8 space-y-6">
				<h1 className="text-4xl font-bold">AI Video Generator</h1>
				<History />

				<div className="rounded-xl p-5 shadow">
					<Label className="block text-sm font-medium mb-2">Access Token</Label>
					<sub className="block text-xs text-gray-500 mb-2">Your API token is required to authenticate requests.</sub>

					<Input
						type="password"
						placeholder="Enter API token"
						value={generateInput?.token || ''}
						onChange={(e) => {
							setGenerateInput({
								...generateInput,
								token: e.target.value
							});
							setAuthCookie('popvid_access_token', e.target.value, {});
						}}
						className="w-full border rounded-lg px-4 py-2"
					/>
				</div>

				<div className="rounded-xl p-5 shadow">
					<h2 className="font-semibold mb-4">Upload Image</h2>
					<sub className="block text-xs text-gray-500 mb-2">Upload an image to use as the basis for your video.</sub>

					<Dropzone
						onFilesAdded={(selectedFiles) =>
							setFiles([
								{
									file: selectedFiles[0],
									uploaded: false
								}
							])
						}
					/>

					{files.length > 0 && (
						<div className="mt-4 flex items-center justify-between">
							<span>{files[0].file.name}</span>
							<Image src={URL.createObjectURL(files[0].file)} alt="Uploaded Image" width={100} height={100} />

							<Button onClick={uploadFile} disabled={loading} className="bg-blue-600 px-4 py-2 rounded-lg">
								Upload
							</Button>
						</div>
					)}

					{uploadResult && <div className="mt-3 text-green-600">✓ Upload successful</div>}
				</div>

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

				{/* Status */}
				{generateResult && (
					<div className=" rounded-xl p-5 shadow">
						<div className="flex justify-between items-center">
							<h2 className="font-semibold">Video Status</h2>

							<Button onClick={() => getVideoStatus()} className="border px-4 py-2 rounded-lg">
								Refresh
							</Button>
						</div>

						<p className="mt-3">
							Status: <span className="font-semibold">{videoStatus?.status}</span>
						</p>

						{videoStatus?.videoUrl && (
							<div className="mt-4">
								<video controls className="w-full rounded-lg" src={videoStatus.videoUrl} />

								<a
									href={videoStatus.videoUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-blue-600 mt-2 inline-block"
								>
									Open Video
								</a>
							</div>
						)}
					</div>
				)}

				{generateResult && (
					<pre className="bg-black text-green-400 p-4 rounded-lg overflow-auto">{JSON.stringify(generateResult, null, 2)}</pre>
				)}
			</div>
		</div>
	);
};
