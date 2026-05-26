// ── WebCrypto helpers ─────────────────────────────────────────
import type { HashResult } from '@/lib/contracts';

const HASH_ALGORITHMS: { name: string; bits: number }[] = [
	{ name: 'SHA-1', bits: 160 },
	{ name: 'SHA-256', bits: 256 },
	{ name: 'SHA-384', bits: 384 },
	{ name: 'SHA-512', bits: 512 }
];

function bufToHex(buf: ArrayBuffer): string {
	return Array.from(new Uint8Array(buf))
		.map((b) => b.toString(16).padStart(2, '0'))
		.join('');
}

export async function hashText(text: string): Promise<HashResult[]> {
	const encoder = new TextEncoder();
	const data = encoder.encode(text);
	const results = await Promise.all(
		HASH_ALGORITHMS.map(async ({ name, bits }) => {
			const buf = await crypto.subtle.digest(name, data);
			return { algorithm: name, hash: bufToHex(buf), bits };
		})
	);
	return results;
}

export async function hashBuffer(buffer: ArrayBuffer): Promise<HashResult[]> {
	const algos = HASH_ALGORITHMS.filter((a) => ['SHA-256', 'SHA-512'].includes(a.name));
	return Promise.all(
		algos.map(async ({ name, bits }) => {
			const buf = await crypto.subtle.digest(name, buffer);
			return { algorithm: name, hash: bufToHex(buf), bits };
		})
	);
}

export function generateUUID(): string {
	if (crypto.randomUUID) return crypto.randomUUID();
	// Fallback
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

export function generatePassword(
	length: number,
	opts: {
		upper: boolean;
		lower: boolean;
		digits: boolean;
		symbols: boolean;
	}
): string {
	const sets: string[] = [];
	if (opts.upper) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
	if (opts.lower) sets.push('abcdefghijklmnopqrstuvwxyz');
	if (opts.digits) sets.push('0123456789');
	if (opts.symbols) sets.push('!@#$%^&*()_+-=[]{}|;:,.<>?');
	if (sets.length === 0) return '';

	const alphabet = sets.join('');
	const arr = new Uint32Array(length);
	crypto.getRandomValues(arr);

	// Guarantee at least one char from each set
	const required = sets.map((s) => {
		const idx = crypto.getRandomValues(new Uint32Array(1))[0] % s.length;
		return s[idx];
	});

	const rest = Array.from(arr)
		.slice(required.length)
		.map((n) => alphabet[n % alphabet.length]);

	const all = [...required, ...rest];
	// Shuffle
	for (let i = all.length - 1; i > 0; i--) {
		const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
		[all[i], all[j]] = [all[j], all[i]];
	}
	return all.join('');
}

export function passwordStrength(pw: string): {
	score: number;
	label: string;
	color: string;
} {
	let score = 0;
	if (pw.length >= 8) score++;
	if (pw.length >= 12) score++;
	if (pw.length >= 16) score++;
	if (/[A-Z]/.test(pw)) score++;
	if (/[a-z]/.test(pw)) score++;
	if (/[0-9]/.test(pw)) score++;
	if (/[^A-Za-z0-9]/.test(pw)) score++;

	if (score <= 2) return { score, label: 'Weak', color: '#ef4444' };
	if (score <= 4) return { score, label: 'Fair', color: '#f59e0b' };
	if (score <= 5) return { score, label: 'Good', color: '#06b6d4' };
	return { score, label: 'Strong', color: '#10b981' };
}
