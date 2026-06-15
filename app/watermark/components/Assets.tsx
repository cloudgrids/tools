import { FullScreenButton } from '@/components/FullScreenButton';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

interface AssetsProps {
	url: string;
	index: number;
	isSelected: boolean;
	onToggleSelect: (url: string) => void;
	onAssetClick: (e: React.MouseEvent<HTMLDivElement>, url: string) => void;
	viewingIndex: number;
	onSetViewingIndex: React.Dispatch<React.SetStateAction<number>>;
	urls: string[];
}

export const Assets: React.FC<AssetsProps> = ({ url, isSelected, onToggleSelect, onAssetClick, viewingIndex, onSetViewingIndex, urls }) => {
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
						<Image
							src={url}
							alt="Asset"
							fill
							id={url}
							className={`object-cover transition-transform duration-500 ${!isSelected && 'group-hover:scale-110'}`}
							sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
						/>
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
