import { Base64Tool } from '@/components/tools/Base64Tool';
import { ColorTool } from '@/components/tools/ColorTool';
import { DiffTool } from '@/components/tools/DiffTool';
import { GradientTool } from '@/components/tools/GradientTool';
import { HashTool } from '@/components/tools/HashTool';
import { JsonTool } from '@/components/tools/JsonTool';
import { JwtTool } from '@/components/tools/JwtTool';
import { MarkdownTool } from '@/components/tools/MarkdownTool';
import { PasswordTool } from '@/components/tools/PasswordTool';
import { RegexTool } from '@/components/tools/RegexTool';
import { UrlTool } from '@/components/tools/UrlTool';
import { UuidTool } from '@/components/tools/UuidTool';
import { TOOLS, getTool } from '@/lib/tools';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

interface Props {
	params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
	return TOOLS.map((t) => ({ tool: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const { tool: toolId } = await params;
	const tool = getTool(toolId);
	if (!tool) return { title: 'Not Found' };
	return {
		title: tool.name,
		description: tool.desc
	};
}

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
	json: JsonTool,
	regex: RegexTool,
	color: ColorTool,
	markdown: MarkdownTool,
	gradient: GradientTool,
	base64: Base64Tool,
	hash: HashTool,
	uuid: UuidTool,
	password: PasswordTool,
	diff: DiffTool,
	url: UrlTool,
	jwt: JwtTool
};

export default async function ToolPage({ params }: Props) {
	const { tool: toolId } = await params;
	const tool = getTool(toolId);
	if (!tool) notFound();

	const Component = TOOL_COMPONENTS[toolId];
	if (!Component) notFound();

	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
			<Component />
		</main>
	);
}
