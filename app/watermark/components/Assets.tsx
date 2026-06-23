import { FullScreenButton } from '@/components/FullScreenButton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import React, { useState } from 'react';

interface AssetsProps {
	url: string;
	index: number;
	isSelected: boolean;
	onToggleSelect: (url: string) => void;
	onAssetClick: (e: React.MouseEvent<HTMLDivElement>, url: string) => void;
	viewingIndex: number;
	onSetViewingIndex: React.Dispatch<React.SetStateAction<number>>;
	urls: string[];
	watermarkPreview?: {
		src: string;
		x: number;
		y: number;
		widthRatio: number;
		enabled: boolean;
		onMove: (x: number, y: number) => void;
	};
}

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const Assets: React.FC<AssetsProps> = ({
	url,
	isSelected,
	onToggleSelect,
	onAssetClick,
	viewingIndex,
	onSetViewingIndex,
	urls,
	watermarkPreview
}) => {
	const [imageSize, setImageSize] = useState({ width: 1, height: 1 });
	const isWide = imageSize.width >= imageSize.height;

	const handleMoveWatermark = (e: React.PointerEvent<HTMLDivElement>) => {
		if (!watermarkPreview?.enabled) return;
		const rect = e.currentTarget.getBoundingClientRect();
		const x = clampPercent(((e.clientX - rect.left) / rect.width) * 100);
		const y = clampPercent(((e.clientY - rect.top) / rect.height) * 100);
		watermarkPreview.onMove(x, y);
	};

	return (
		<motion.div
			layout
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className={`relative aspect-square overflow-hidden group transition-all duration-300 ${isSelected ? 'p-2' : 'p-0'}`}
		>
			<div
				className={`relative w-full h-full cursor-pointer transition-all duration-300 overflow-hidden ${
					isSelected ? 'rounded-xl shadow-lg ring-2 ring-primary ring-offset-2 ring-offset-background' : 'rounded-none'
				}`}
			>
				<div className="relative w-full h-full bg-muted overflow-hidden" onClick={(e) => onAssetClick(e, url)}>
					{url ? (
						<div className="flex h-full w-full items-center justify-center">
							<div
								className={cn(
									'relative overflow-hidden',
									isWide ? 'w-full' : 'h-full',
									watermarkPreview?.enabled && 'cursor-crosshair'
								)}
								style={{ aspectRatio: `${imageSize.width} / ${imageSize.height}` }}
								onClick={(e) => {
									if (watermarkPreview?.enabled) e.stopPropagation();
								}}
								onPointerDown={(e) => {
									if (!watermarkPreview?.enabled) return;
									e.stopPropagation();
									e.currentTarget.setPointerCapture(e.pointerId);
									handleMoveWatermark(e);
								}}
								onPointerMove={(e) => {
									if (!watermarkPreview?.enabled || e.buttons !== 1) return;
									e.stopPropagation();
									handleMoveWatermark(e);
								}}
							>
								{/* eslint-disable-next-line @next/next/no-img-element */}
								<img
									src={url}
									alt="Asset"
									id={url}
									className={cn('h-full w-full object-contain transition-transform duration-500', !isSelected && 'group-hover:scale-105')}
									onLoad={(e) => setImageSize({ width: e.currentTarget.naturalWidth, height: e.currentTarget.naturalHeight })}
								/>
								{watermarkPreview?.enabled && (
									// eslint-disable-next-line @next/next/no-img-element
									<img
										src={watermarkPreview.src}
										alt=""
										className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_1px_6px_rgba(0,0,0,0.45)]"
										style={{
											left: `${watermarkPreview.x}%`,
											top: `${watermarkPreview.y}%`,
											width: `${Math.round(watermarkPreview.widthRatio * 100)}%`
										}}
									/>
								)}
							</div>
						</div>
					) : (
						<div className="flex items-center justify-center h-full text-muted-foreground text-[10px] uppercase tracking-tighter text-center px-1">
							No Preview
						</div>
					)}
				</div>

				{isSelected && <div className="absolute inset-0 bg-primary/10 pointer-events-none" />}

				<div
					className="absolute top-1 left-1 z-10"
					onClick={(e) => {
						e.stopPropagation();
						onToggleSelect(url);
					}}
				>
					<div
						className={cn(
							'h-5 w-5 rounded-full border border-white/40 flex',
							'items-center justify-center transition-all duration-200',
							isSelected ? 'bg-primary border-primary scale-110 shadow-sm' : 'bg-black/20 backdrop-blur-sm'
						)}
					>
						<Check className={cn('h-3 w-3 text-white', isSelected ? 'opacity-100' : 'opacity-0')} />
					</div>
				</div>

				<div className="absolute bottom-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
					<FullScreenButton urls={urls} currentIdx={viewingIndex} setCurrentlyViewingIndex={onSetViewingIndex} />
				</div>
			</div>
		</motion.div>
	);
};
