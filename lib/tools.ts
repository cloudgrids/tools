import type { Tool } from '@/lib/contracts';

export const TOOLS: Tool[] = [
	{
		id: 'json',
		icon: 'braces',
		name: 'JSON Formatter',
		desc: 'Format, validate & minify JSON',
		category: 'formatters',
		keywords: ['json', 'format', 'validate', 'minify', 'pretty']
	},
	{
		id: 'regex',
		icon: 'regex',
		name: 'Regex Tester',
		desc: 'Live regex match highlighting with groups',
		category: 'utilities',
		keywords: ['regex', 'regexp', 'pattern', 'match', 'test']
	},
	{
		id: 'color',
		icon: 'palette',
		name: 'Color Converter',
		desc: 'HEX · RGB · HSL converter, palettes & contrast',
		category: 'converters',
		keywords: ['color', 'hex', 'rgb', 'hsl', 'palette', 'contrast', 'a11y']
	},
	{
		id: 'markdown',
		icon: 'file-text',
		name: 'Markdown Preview',
		desc: 'Live side-by-side markdown editor',
		category: 'formatters',
		keywords: ['markdown', 'md', 'preview', 'editor']
	},
	{
		id: 'gradient',
		icon: 'blend',
		name: 'CSS Gradient Builder',
		desc: 'Visual gradient creator with CSS output',
		category: 'generators',
		keywords: ['css', 'gradient', 'linear', 'radial', 'conic', 'background']
	},
	{
		id: 'base64',
		icon: 'binary',
		name: 'Base64 Codec',
		desc: 'Encode & decode text or files',
		category: 'converters',
		keywords: ['base64', 'encode', 'decode', 'file', 'codec']
	},
	{
		id: 'hash',
		icon: 'hash',
		name: 'Hash Generator',
		desc: 'MD5-like, SHA-1, SHA-256, SHA-512 hashing',
		category: 'generators',
		keywords: ['hash', 'sha', 'sha256', 'sha512', 'checksum', 'crypto']
	},
	{
		id: 'uuid',
		icon: 'fingerprint',
		name: 'UUID Generator',
		desc: 'Generate UUID v4 in bulk',
		category: 'generators',
		keywords: ['uuid', 'guid', 'unique', 'id', 'generate']
	},
	{
		id: 'password',
		icon: 'shield-check',
		name: 'Password Generator',
		desc: 'Strong, configurable password generator',
		category: 'generators',
		keywords: ['password', 'passphrase', 'secure', 'random', 'strong']
	},
	{
		id: 'diff',
		icon: 'diff',
		name: 'Text Diff Viewer',
		desc: 'Side-by-side text & code diff comparison',
		category: 'utilities',
		keywords: ['diff', 'compare', 'difference', 'text', 'code']
	},
	{
		id: 'url',
		icon: 'link',
		name: 'URL Encoder',
		desc: 'Encode, decode & parse URLs',
		category: 'converters',
		keywords: ['url', 'encode', 'decode', 'parse', 'uri', 'query']
	},
	{
		id: 'jwt',
		icon: 'key-round',
		name: 'JWT Decoder',
		desc: 'Inspect & decode JWT tokens',
		category: 'utilities',
		keywords: ['jwt', 'token', 'decode', 'auth', 'bearer']
	}
];

export const TOOL_MAP = new Map<string, Tool>(TOOLS.map((t) => [t.id, t]));

export function getTool(id: string): Tool | undefined {
	return TOOL_MAP.get(id);
}
