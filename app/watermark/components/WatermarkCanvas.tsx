/* eslint-disable @next/next/no-img-element */
'use client';

import type { WatermarkProps } from '@/lib/contracts';
import { cn } from '@/lib/utils';
import { Move, ZoomIn } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface WatermarkCanvasProps {
	imageUrl: string | null;
	options: WatermarkProps;
	onOptionsChange: (opts: WatermarkProps) => void;
}

const clampN = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const clamp = (v: number) => clampN(v, 0, 100);

const mapBlendToCss = (blend: string): React.CSSProperties['mixBlendMode'] => {
	const validCssModes = new Set([
		'normal',
		'multiply',
		'screen',
		'overlay',
		'darken',
		'lighten',
		'color-dodge',
		'color-burn',
		'hard-light',
		'soft-light',
		'difference',
		'exclusion',
		'hue',
		'saturation',
		'color',
		'luminosity'
	]);
	const normalized = blend === 'over' ? 'normal' : blend;
	return (validCssModes.has(normalized) ? normalized : 'normal') as React.CSSProperties['mixBlendMode'];
};

export const WatermarkCanvas: React.FC<WatermarkCanvasProps> = ({ imageUrl, options, onOptionsChange }) => {
	// ── Refs ─────────────────────────────────────────────────────────────
	const wrapperRef = useRef<HTMLDivElement>(null);
	// Track whether the pointer is currently hovering the wrapper
	// (ref not state — we don't need a re-render when it changes)
	const isHoveringRef = useRef(false);
	const isDraggingRef = useRef(false);

	// Stable snapshot of options for use inside event handlers
	const optsRef = useRef(options);
	useEffect(() => {
		optsRef.current = options;
	}, [options]);

	// ── State ─────────────────────────────────────────────────────────────
	// Natural pixel dimensions of the source image — set once on load
	const [naturalSize, setNaturalSize] = useState<{ w: number; h: number } | null>(null);

	// Natural pixel dimensions of the logo image — needed to compute its height % for clamping
	const [logoSize, setLogoSize] = useState<{ w: number; h: number } | null>(null);

	// Displayed pixel width of the wrapper, tracked via ResizeObserver (safe to use during render)
	const [wrapperDisplayW, setWrapperDisplayW] = useState(0);
	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;
		const ro = new ResizeObserver(([entry]) => setWrapperDisplayW(entry.contentRect.width));
		ro.observe(el);
		setWrapperDisplayW(el.offsetWidth); // seed immediately
		return () => ro.disconnect();
	}, []);

	// ── Derived ──────────────────────────────────────────────────────────
	const showImageOverlay = !!options.imageDataUri && !options.tiled && (options.mode === 'image' || options.mode === 'both');
	const showTextOverlay = (options.mode === 'text' || options.mode === 'both') && !!options.text?.trim();

	// ── Pointer → % conversion ───────────────────────────────────────────
	const toPercent = useCallback((clientX: number, clientY: number) => {
		const el = wrapperRef.current;
		if (!el) return { x: 50, y: 50 };
		const rect = el.getBoundingClientRect();
		return {
			x: clamp(((clientX - rect.left) / rect.width) * 100),
			y: clamp(((clientY - rect.top) / rect.height) * 100)
		};
	}, []);

	// ── Pointer handlers (drag to reposition logo/text) ──────────────────
	const activeDragTypeRef = useRef<'image' | 'text' | null>(null);
	const [activeDragType, setActiveDragType] = useState<'image' | 'text' | null>(null);

	const handlePointerDown = useCallback(
		(type: 'image' | 'text') => (e: React.PointerEvent<HTMLDivElement>) => {
			e.preventDefault();
			e.stopPropagation();
			e.currentTarget.setPointerCapture(e.pointerId);
			isDraggingRef.current = true;
			activeDragTypeRef.current = type;
			setActiveDragType(type);

			const { x, y } = toPercent(e.clientX, e.clientY);
			if (type === 'image') {
				onOptionsChange({ ...optsRef.current, imagePositionX: x, imagePositionY: y });
			} else {
				onOptionsChange({ ...optsRef.current, textPositionX: x, textPositionY: y });
			}
		},
		[toPercent, onOptionsChange]
	);

	const handlePointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (!isDraggingRef.current || !activeDragTypeRef.current) return;
			const { x, y } = toPercent(e.clientX, e.clientY);
			if (activeDragTypeRef.current === 'image') {
				onOptionsChange({ ...optsRef.current, imagePositionX: x, imagePositionY: y });
			} else {
				onOptionsChange({ ...optsRef.current, textPositionX: x, textPositionY: y });
			}
		},
		[toPercent, onOptionsChange]
	);

	const handlePointerUp = useCallback(() => {
		isDraggingRef.current = false;
		activeDragTypeRef.current = null;
		setActiveDragType(null);
	}, []);

	// ── Scroll to resize logo — ONLY while hovering the wrapper ──────────
	// Using a native event listener (not React's onWheel) so we can call
	// preventDefault() which React's synthetic handler can't do in passive mode.
	useEffect(() => {
		const el = wrapperRef.current;
		if (!el) return;

		const onWheel = (e: WheelEvent) => {
			// Only resize when the pointer is actually inside the canvas wrapper
			if (!isHoveringRef.current || !showImageOverlay) return;
			e.preventDefault();
			const delta = e.deltaY > 0 ? -0.02 : 0.02;
			const next = clampN((optsRef.current.widthRatio ?? 0.25) + delta, 0.05, 0.9);
			onOptionsChange({ ...optsRef.current, widthRatio: Math.round(next * 100) / 100 });
		};

		// passive: false is required to allow preventDefault()
		el.addEventListener('wheel', onWheel, { passive: false });
		return () => el.removeEventListener('wheel', onWheel);
	}, [showImageOverlay, onOptionsChange]);

	// ── Unified layer container (handles positioning, background, scale, rotation, and dragging) ──
	const renderLayerContainer = (type: 'image' | 'text', posX: number | undefined, posY: number | undefined, content: React.ReactNode) => {
		const isDragging = activeDragType === type;
		const m = options.margin ?? 48;
		const displayW = wrapperDisplayW || (naturalSize?.w ?? 1000);
		const scaledMargin = (m / (naturalSize?.w ?? 1000)) * displayW;

		let positionStyles: React.CSSProperties;

		if (posX !== undefined && posY !== undefined) {
			positionStyles = {
				left: `${posX}%`,
				top: `${posY}%`,
				transform: `translate(-50%, -50%) rotate(${options.angle ?? 0}deg)`,
				transformOrigin: 'center center'
			};
		} else {
			positionStyles =
				options.position === 'center'
					? {
							top: '50%',
							left: '50%',
							transform: `translate(-50%, -50%) rotate(${options.angle ?? 0}deg)`,
							transformOrigin: 'center center'
						}
					: options.position === 'top-left'
						? {
								top: scaledMargin,
								left: scaledMargin,
								transform: `rotate(${options.angle ?? 0}deg)`,
								transformOrigin: 'top left'
							}
						: options.position === 'top-right'
							? {
									top: scaledMargin,
									right: scaledMargin,
									transform: `rotate(${options.angle ?? 0}deg)`,
									transformOrigin: 'top right'
								}
							: options.position === 'bottom-left'
								? {
										bottom: scaledMargin,
										left: scaledMargin,
										transform: `rotate(${options.angle ?? 0}deg)`,
										transformOrigin: 'bottom left'
									}
								: {
										bottom: scaledMargin,
										right: scaledMargin,
										transform: `rotate(${options.angle ?? 0}deg)`,
										transformOrigin: 'bottom right'
									};
		}

		const hasBg = options.logoBgShape && options.logoBgShape !== 'none';
		const isImageBgType = options.logoBgType === 'image' || options.logoBgUseImage;
		const bgImageSrc = options.logoBgImageUri || (options.logoBgUseImage ? options.imageDataUri : undefined);
		const useImageBg = type === 'text' && isImageBgType && !!bgImageSrc && hasBg;

		const borderRadiusMap = {
			'none': '0px',
			'rect': '0px',
			'rounded-rect': '12px',
			'circle': '50%',
			'pill': '9999px'
		};
		const borderRadius = hasBg ? borderRadiusMap[options.logoBgShape!] : '0px';

		const hexToRgba = (hex: string, alpha: number) => {
			const cleanHex = hex.replace('#', '');
			const r = parseInt(cleanHex.substring(0, 2), 16) || 0;
			const g = parseInt(cleanHex.substring(2, 4), 16) || 0;
			const b = parseInt(cleanHex.substring(4, 6), 16) || 0;
			return `rgba(${r}, ${g}, ${b}, ${alpha})`;
		};

		const backgroundColor = hasBg ? hexToRgba(options.logoBgColor ?? '#1c1c1e', options.logoBgOpacity ?? 0.65) : 'transparent';

		return (
			<div
				className={cn(
					'absolute flex items-center justify-center overflow-hidden drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)]',
					'pointer-events-auto cursor-move select-none transition-shadow duration-200',
					'outline outline-2 outline-offset-4 rounded-sm',
					isDragging
						? 'outline-primary shadow-lg shadow-primary/20 scale-[1.02]'
						: 'outline-transparent hover:outline-primary/45 hover:outline-dashed'
				)}
				style={{
					...positionStyles,
					zIndex: type === 'text' ? 20 : 10,
					width: type === 'image' ? `${(options.widthRatio ?? 0.25) * 100}%` : undefined,
					aspectRatio: type === 'image' && logoSize ? `${logoSize.w} / ${logoSize.h}` : undefined,
					backgroundColor,
					borderRadius,
					padding: hasBg
						? type === 'image'
							? `${options.logoPadding ?? 10}%`
							: `${(options.logoPadding ?? 10) * 1.5}px`
						: '0px',
					opacity: options.opacity ?? (type === 'image' ? 0.7 : 0.5),
					mixBlendMode: mapBlendToCss(options.blend)
				}}
				onPointerDown={handlePointerDown(type)}
				onPointerMove={handlePointerMove}
				onPointerUp={handlePointerUp}
				onPointerCancel={handlePointerUp}
			>
				{useImageBg && (
					<img
						src={bgImageSrc}
						alt=""
						draggable={false}
						className={cn('absolute inset-0 w-full h-full object-cover -z-10', options.grayscale ? 'grayscale' : '')}
						style={{
							opacity: options.logoBgOpacity ?? 0.65
						}}
					/>
				)}
				{content}
			</div>
		);
	};

	// ── Text overlay ─────────────────────────────────────────────────────
	const renderTextOverlay = () => {
		if (!showTextOverlay || !naturalSize) return null;
		const displayW = wrapperDisplayW || naturalSize.w;
		const scaledFontSize = Math.max(8, ((options.fontSize ?? 48) / naturalSize.w) * displayW);

		const textNode = (
			<div
				className="whitespace-pre-line text-center font-bold leading-tight"
				style={{
					fontSize: scaledFontSize,
					color: options.color ?? '#ffffff',
					WebkitTextStroke: `${options.strokeWidth ?? 1}px ${options.strokeColor ?? '#000000'}`,
					textShadow: '0 1px 8px rgba(0,0,0,0.5)'
				}}
			>
				{options.text}
			</div>
		);

		return renderLayerContainer('text', options.textPositionX, options.textPositionY, textNode);
	};

	// ── Image watermark overlay ───────────────────────────────────────────
	const renderImageOverlay = () => {
		if (!showImageOverlay || !options.imageDataUri) return null;

		const imgNode = (
			<img
				src={options.imageDataUri}
				alt=""
				draggable={false}
				className={cn('w-full h-full object-contain', options.grayscale ? 'grayscale' : '')}
				onLoad={(e) => setLogoSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
			/>
		);

		return renderLayerContainer('image', options.imagePositionX, options.imagePositionY, imgNode);
	};

	if (!imageUrl) {
		return (
			<div className="flex h-64 items-center justify-center rounded-xl border border-dashed bg-muted/20 text-sm text-muted-foreground">
				Upload images to see the live preview
			</div>
		);
	}

	return (
		<div className="space-y-2">
			{/* Hints */}
			{(showImageOverlay || showTextOverlay) && (
				<div className="flex items-center gap-4 text-[11px] text-muted-foreground">
					{showImageOverlay && (
						<>
							<span className="flex items-center gap-1">
								<Move className="size-3" /> Drag to reposition logo
							</span>
							<span className="flex items-center gap-1">
								<ZoomIn className="size-3" /> Scroll (while hovering) to resize
							</span>
						</>
					)}
					{showTextOverlay && (
						<span className="flex items-center gap-1">
							<Move className="size-3" /> Drag to reposition text
						</span>
					)}
				</div>
			)}

			{/* Outer shell — checkerboard background */}
			<div className="w-full select-none rounded-xl border bg-[repeating-conic-gradient(#80808015_0%_25%,transparent_0%_50%)] bg-[length:20px_20px] p-3">
				{/* Inner wrapper — single coordinate space for image + overlays */}
				<div
					ref={wrapperRef}
					className="relative mx-auto w-fit h-fit overflow-hidden cursor-default"
					style={{ maxWidth: '100%', maxHeight: '70vh' }}
					// Hover tracking (ref, not state — no re-render)
					onMouseEnter={() => {
						isHoveringRef.current = true;
					}}
					onMouseLeave={() => {
						isHoveringRef.current = false;
					}}
				>
					{/* Source image — size matches wrapper bounds */}
					<img
						src={imageUrl}
						alt="Source"
						draggable={false}
						className="block max-w-full max-h-[70vh] w-auto h-auto object-contain"
						onLoad={(e) => setNaturalSize({ w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight })}
					/>

					{renderTextOverlay()}
					{renderImageOverlay()}
				</div>
			</div>

			{options.tiled && (
				<p className="text-center text-xs text-muted-foreground">Tiled mode — full preview shown after clicking Apply</p>
			)}
		</div>
	);
};
