'use client';

import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/ToastProvider';
import { Check } from 'lucide-react';
import { useState } from 'react';

interface CopyButtonProps {
	text: string;
	label?: string;
	className?: string;
}

export function CopyButton({ text, label = 'Copy', className }: CopyButtonProps) {
	const { showToast } = useToast();
	const [copied, setCopied] = useState(false);

	async function handleCopy() {
		try {
			await navigator.clipboard.writeText(text);
		} catch {
			// Fallback
			const ta = document.createElement('textarea');
			ta.value = text;
			document.body.appendChild(ta);
			ta.select();
			document.execCommand('copy');
			ta.remove();
		}
		showToast('Copied to clipboard!');
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	return (
		<Button variant="ghost" size="sm" className={className} onClick={handleCopy} aria-label={`Copy ${label}`}>
			{copied && <Check data-icon="inline-start" />}
			{copied ? 'Copied' : label}
		</Button>
	);
}
