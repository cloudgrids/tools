'use client';

import { GeometryExportState, ImageExportFormat } from '@/app/geometry/components/contracts';
import { basename } from 'path';
import { useState } from 'react';
import { toast } from 'sonner';

export const useExport = () => {
	const [loading, setLoading] = useState<boolean>(false);

	const downloadFile = (url: string, fileName: string) => {
		const link = document.createElement('a');
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();

		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	};

	const getFile = (blob: Blob, extension: string, width: number, height: number) => {
		const url = URL.createObjectURL(blob);

		const timestamp = new Date().toISOString().replace(/[:.]/g, '_');
		const pathname = basename(window.location.pathname);
		const fileName = `Tools_${pathname}_${width || 0}x${height || 0}_${timestamp}.${extension}`;

		const file = new File([blob], fileName, { type: blob.type });

		return { fileName: file.name, url };
	};

	const handleExport = async (param: GeometryExportState) => {
		setLoading(true);
		if (!param.svg) {
			toast.error('No SVG data to export!');
			setLoading(false);
			return;
		}

		try {
			const blob = await getImage(param.svg, param.width, param.height, param.type);

			const { fileName, url } = getFile(blob, param.type, param.width, param.height);

			downloadFile(url, fileName);

			toast.success('Export successful!');
		} catch (error) {
			toast.error('Export failed!', {
				description: error instanceof Error ? error.message : 'An unknown error occurred.'
			});
		} finally {
			setLoading(false);
		}
	};

	const getImage = async (svg: string, width: number, height: number, type: ImageExportFormat): Promise<Blob> => {
		const svgBlob = new Blob([svg], { type: 'image/svg+xml' });

		if (type === 'svg') return svgBlob;

		return new Promise((res, rej) => {
			const url = URL.createObjectURL(svgBlob);
			const img = new Image();

			img.onload = () => {
				const canvas = document.createElement('canvas');
				canvas.width = width;
				canvas.height = height;

				const ctx = canvas.getContext('2d');

				if (!ctx) {
					rej(new Error('Could not get canvas context'));
					return;
				}

				ctx.drawImage(img, 0, 0, width, height);

				canvas.toBlob(
					(blob) => {
						if (!blob) {
							rej(new Error('Could not convert canvas to blob'));
							return;
						}

						res(blob);
						URL.revokeObjectURL(url);
					},
					`image/${type}`,
					1
				);
			};

			img.onerror = rej;
			img.src = url;
		});
	};

	return {
		loading,
		handleExport
	};
};
