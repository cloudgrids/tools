'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { WatermarkMode } from '@/lib/contracts';
import { ImageIcon, Layers2, TextIcon } from 'lucide-react';

const MODE_OPTIONS: { value: WatermarkMode; label: string; icon: React.ReactNode }[] = [
	{ value: 'text', label: 'Text', icon: <TextIcon className="size-3.5" /> },
	{ value: 'image', label: 'Image', icon: <ImageIcon className="size-3.5" /> },
	{ value: 'both', label: 'Both', icon: <Layers2 className="size-3.5" /> }
];

interface ModeSelectorProps {
	mode: WatermarkMode;
	onChange: (mode: WatermarkMode) => void;
}

export const ModeSelector: React.FC<ModeSelectorProps> = ({ mode, onChange }) => (
	<div className="space-y-2">
		<Label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Watermark Type</Label>
		<div className="grid grid-cols-3 gap-2">
			{MODE_OPTIONS.map(({ value, label, icon }) => (
				<Button
					key={value}
					variant={mode === value ? 'default' : 'outline'}
					onClick={() => onChange(value)}
					className="flex items-center gap-1.5"
				>
					{icon}
					{label}
				</Button>
			))}
		</div>
	</div>
);
