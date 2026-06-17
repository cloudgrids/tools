import { Dropzone } from '@/components/Dropzone';
import { usePopVidStore } from '@/hooks/popvid.store';
import { usePopVid } from '@/hooks/usePopVid';
import { Button } from '@base-ui/react';
import Image from 'next/image';
import React from 'react';
import { FileProps } from './Generate';

interface UploadResultProps {
	files: FileProps[];
	loading: boolean;
	setFiles: React.Dispatch<React.SetStateAction<FileProps[]>>;
}

export const UploadResult = ({ files, setFiles, loading }: UploadResultProps) => {
	const { handleUpload } = usePopVid();
	const { uploadResult } = usePopVidStore();

	const uploadFile = async () => {
		if (!files.length) return;
		await handleUpload(files[0].file);
	};
	return (
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
					<Image src={URL.createObjectURL(files[0].file)} alt="Uploaded Image" width={300} height={400} />

					<Button onClick={uploadFile} disabled={loading} className="bg-blue-600 px-4 py-2 rounded-lg">
						Upload
					</Button>
				</div>
			)}

			{uploadResult && (
				<div className="mt-3 text-green-600">
					✓ Upload successful
					<div className="w-fit">
						<Image src={uploadResult.imageUrl} alt="Uploaded Image" width={300} height={400} loading="eager" />
					</div>
				</div>
			)}
		</div>
	);
};
