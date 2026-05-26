'use client';

import { Card, CardAction, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useState, type ComponentProps, type DragEvent, type ReactNode } from 'react';

interface ToolPanelProps {
	title: string;
	action?: ReactNode;
	children: ReactNode;
	className?: string;
	contentClassName?: string;
}

interface CodeOutputProps extends ComponentProps<'pre'> {
	children: ReactNode;
}

interface StatusBadgeProps {
	children: ReactNode;
	tone?: 'success' | 'error' | 'info' | 'neutral';
}

interface FileDropzoneProps {
	id: string;
	title: string;
	description: string;
	onFile: (file: File) => void;
}

export function ToolPanel({ title, action, children, className, contentClassName }: ToolPanelProps) {
	return (
		<Card className={cn('min-w-0', className)}>
			<CardHeader
				className={
					action ? 'gap-3 has-data-[slot=card-action]:grid-cols-1 sm:has-data-[slot=card-action]:grid-cols-[1fr_auto]' : undefined
				}
			>
				<CardTitle>{title}</CardTitle>
				{action && (
					<CardAction className="col-start-1 row-start-auto justify-self-start sm:col-start-2 sm:row-start-1 sm:justify-self-end">
						{action}
					</CardAction>
				)}
			</CardHeader>
			<CardContent className={contentClassName}>{children}</CardContent>
		</Card>
	);
}

export function CodeOutput({ className, children, ...props }: CodeOutputProps) {
	return (
		<pre
			className={cn(
				'w-full overflow-auto rounded-lg border border-input bg-muted p-3 font-mono text-sm break-all whitespace-pre-wrap',
				className
			)}
			{...props}
		>
			{children}
		</pre>
	);
}

export function StatusBadge({ children, tone = 'neutral' }: StatusBadgeProps) {
	const tones = {
		success: 'bg-green-100 text-green-900 dark:bg-green-900 dark:text-green-100',
		error: 'bg-red-100 text-red-900 dark:bg-red-900 dark:text-red-100',
		info: 'bg-cyan-100 text-cyan-900 dark:bg-cyan-900 dark:text-cyan-100',
		neutral: 'bg-muted text-muted-foreground'
	};

	return <span className={cn('inline-flex rounded px-2 py-1 text-xs font-medium', tones[tone])}>{children}</span>;
}

export function FileDropzone({ id, title, description, onFile }: FileDropzoneProps) {
	const [dragging, setDragging] = useState(false);

	function takeFirstFile(event: DragEvent<HTMLDivElement>) {
		event.preventDefault();
		setDragging(false);
		const file = event.dataTransfer.files[0];
		if (file) onFile(file);
	}

	return (
		<div
			className={cn(
				'cursor-pointer rounded-lg border-2 border-dashed border-input p-4 text-center transition-colors hover:border-primary hover:bg-muted/50 sm:p-8',
				dragging && 'border-primary bg-muted/50'
			)}
			onDragOver={(event) => {
				event.preventDefault();
				setDragging(true);
			}}
			onDragLeave={() => setDragging(false)}
			onDrop={takeFirstFile}
			onClick={() => document.getElementById(id)?.click()}
		>
			<div className="font-semibold">{title}</div>
			<div className="text-sm text-muted-foreground">{description}</div>
			<Input
				id={id}
				type="file"
				className="hidden"
				onChange={(event) => {
					const file = event.target.files?.[0];
					if (file) onFile(file);
				}}
			/>
		</div>
	);
}
