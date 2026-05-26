import type { ToolIconName } from '@/lib/enumerations';
import {
	Binary,
	Blend,
	Braces,
	FileText,
	Fingerprint,
	Hash,
	KeyRound,
	Link,
	Palette,
	Regex,
	ShieldCheck,
	SquareSplitHorizontal,
	type LucideIcon
} from 'lucide-react';

const ICONS: Record<ToolIconName, LucideIcon> = {
	'braces': Braces,
	'regex': Regex,
	'palette': Palette,
	'file-text': FileText,
	'blend': Blend,
	'binary': Binary,
	'hash': Hash,
	'fingerprint': Fingerprint,
	'shield-check': ShieldCheck,
	'diff': SquareSplitHorizontal,
	'link': Link,
	'key-round': KeyRound
};

interface ToolIconProps {
	name: ToolIconName;
	className?: string;
}

export function ToolIcon({ name, className }: ToolIconProps) {
	const Icon = ICONS[name];
	return <Icon className={className} aria-hidden="true" />;
}
