import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card } from './ui/card';

interface DropzoneProps {
	onFilesAdded: (files: File[]) => void;
}

export const Dropzone = ({ onFilesAdded }: DropzoneProps) => {
	const onDrop = useCallback(
		(acceptedFiles: File[]) => {
			if (!acceptedFiles.length) return;
			return onFilesAdded(acceptedFiles);
		},
		[onFilesAdded]
	);

	const { getInputProps, getRootProps } = useDropzone({ onDrop, accept: { 'image/*': [], 'application/pdf': [] } });

	return (
		<Card {...getRootProps()} className='border-dashed cursor-pointer'>
			<input {...getInputProps()} className="input-zone" id="watermark-dropzone-input" />
			<div>
				<p className="text-center text-sm text-muted-foreground">Drag and drop files here, or click to select</p>
				<p className="text-center text-xs text-muted-foreground mt-1">Supported formats: Images, PDFs</p>
				<p className="text-center text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
				<p className="text-center text-xs text-muted-foreground mt-1">
					Files are processed locally and not uploaded to any server.
				</p>
			</div>
		</Card>
	);
};
