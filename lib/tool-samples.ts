import type { ColorStop, GradientPreset, RegexSample } from '@/lib/contracts';

export const JSON_SAMPLE = JSON.stringify(
	{
		name: 'tools',
		version: '1.0.0',
		tools: ['json', 'regex', 'color', 'markdown'],
		author: { name: 'Open Source Community', github: 'tools' },
		active: true,
		stars: 9999,
		config: { theme: 'aurora-dark', offline: true }
	},
	null,
	2
);

export const MARKDOWN_SAMPLE = `# Welcome to Markdown Preview

A **live** side-by-side editor with *instant* rendering — no dependencies.

## Features

- Real-time rendering
- **Bold** and *italic* text support
- \`inline code\` highlighting
- [Links](https://github.com) work too
- ~~Strikethrough~~ support

## Code Block

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}
console.log(greet("tools"));
\`\`\`

## Blockquote

> "Code is like humor. When you have to explain it, it's bad." — Cory House

---

### Ordered List

1. First item
2. Second item
3. Third item
`;

export const DIFF_SAMPLE_A = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

const result = greet("World");`;

export const DIFF_SAMPLE_B = `function greet(name: string): string {
  console.log(\`Hello, \${name}!\`);
  return \`Hello, \${name}!\`;
}

const result = greet("tools");
console.log(result);`;

export const REGEX_DEFAULT_TEXT =
	'The quick brown fox jumps over the lazy dog.\nContact: hello@example.com or admin@tools.tech\nVisit https://tools.cloudgrids.tech for more info.';

export const REGEX_SAMPLES: Record<string, RegexSample> = {
	'Email': { pattern: '[\\w._%+\\-]+@[\\w.\\-]+\\.[a-zA-Z]{2,}', flags: 'g' },
	'URL': { pattern: 'https?:\\/\\/[^\\s]+', flags: 'g' },
	'IPv4': { pattern: '\\b(?:\\d{1,3}\\.){3}\\d{1,3}\\b', flags: 'g' },
	'HEX Color': { pattern: '#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})\\b', flags: 'g' },
	'Date': { pattern: '\\b\\d{4}-\\d{2}-\\d{2}\\b', flags: 'g' }
};

export const HASH_DEFAULT_TEXT = 'The quick brown fox jumps over the lazy dog';

export const HASH_LABELS: Record<string, string> = {
	'SHA-1': 'SHA-1 (160-bit)',
	'SHA-256': 'SHA-256 (256-bit)',
	'SHA-384': 'SHA-384 (384-bit)',
	'SHA-512': 'SHA-512 (512-bit)'
};

export const JWT_SAMPLE =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkRldktpdCBQcm8iLCJpYXQiOjE1MTYyMzkwMjIsImV4cCI6OTk5OTk5OTk5OX0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export const GRADIENT_PRESETS: GradientPreset[] = [
	{
		name: 'Aurora',
		stops: [
			{ color: '#7c3aed', pos: 0 },
			{ color: '#06b6d4', pos: 50 },
			{ color: '#ec4899', pos: 100 }
		]
	},
	{
		name: 'Sunset',
		stops: [
			{ color: '#ff6b6b', pos: 0 },
			{ color: '#feca57', pos: 100 }
		]
	},
	{
		name: 'Ocean',
		stops: [
			{ color: '#0f2027', pos: 0 },
			{ color: '#203a43', pos: 50 },
			{ color: '#2c5364', pos: 100 }
		]
	},
	{
		name: 'Emerald',
		stops: [
			{ color: '#11998e', pos: 0 },
			{ color: '#38ef7d', pos: 100 }
		]
	},
	{
		name: 'Peach',
		stops: [
			{ color: '#ed213a', pos: 0 },
			{ color: '#93291e', pos: 100 }
		]
	},
	{
		name: 'Royal',
		stops: [
			{ color: '#141e30', pos: 0 },
			{ color: '#243b55', pos: 100 }
		]
	},
	{
		name: 'Neon',
		stops: [
			{ color: '#f7971e', pos: 0 },
			{ color: '#ffd200', pos: 100 }
		]
	},
	{
		name: 'Midnight',
		stops: [
			{ color: '#232526', pos: 0 },
			{ color: '#414345', pos: 100 }
		]
	}
];

export const GRADIENT_GALLERY: ColorStop[][] = [
	[
		{ color: '#6a3093', pos: 0 },
		{ color: '#a044ff', pos: 100 }
	],
	[
		{ color: '#f093fb', pos: 0 },
		{ color: '#f5576c', pos: 100 }
	],
	[
		{ color: '#4facfe', pos: 0 },
		{ color: '#00f2fe', pos: 100 }
	],
	[
		{ color: '#43e97b', pos: 0 },
		{ color: '#38f9d7', pos: 100 }
	],
	[
		{ color: '#fa709a', pos: 0 },
		{ color: '#fee140', pos: 100 }
	],
	[
		{ color: '#30cfd0', pos: 0 },
		{ color: '#330867', pos: 100 }
	],
	[
		{ color: '#f6d365', pos: 0 },
		{ color: '#fda085', pos: 100 }
	],
	[
		{ color: '#667eea', pos: 0 },
		{ color: '#764ba2', pos: 100 }
	],
	[
		{ color: '#ffecd2', pos: 0 },
		{ color: '#fcb69f', pos: 100 }
	],
	[
		{ color: '#a18cd1', pos: 0 },
		{ color: '#fbc2eb', pos: 100 }
	],
	[
		{ color: '#d299c2', pos: 0 },
		{ color: '#fef9d7', pos: 100 }
	],
	[
		{ color: '#0fd850', pos: 0 },
		{ color: '#f9f047', pos: 100 }
	]
];
