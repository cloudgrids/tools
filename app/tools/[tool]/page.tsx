import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { TOOLS, getTool } from "@/lib/tools";
import { JsonTool }      from "@/components/tools/JsonTool";
import { RegexTool }     from "@/components/tools/RegexTool";
import { ColorTool }     from "@/components/tools/ColorTool";
import { MarkdownTool }  from "@/components/tools/MarkdownTool";
import { GradientTool }  from "@/components/tools/GradientTool";
import { Base64Tool }    from "@/components/tools/Base64Tool";
import { HashTool }      from "@/components/tools/HashTool";
import { UuidTool }      from "@/components/tools/UuidTool";
import { PasswordTool }  from "@/components/tools/PasswordTool";
import { DiffTool }      from "@/components/tools/DiffTool";
import { UrlTool }       from "@/components/tools/UrlTool";
import { JwtTool }       from "@/components/tools/JwtTool";

// Next.js 16: params is a Promise
interface Props {
  params: Promise<{ tool: string }>;
}

export async function generateStaticParams() {
  return TOOLS.map((t) => ({ tool: t.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tool: toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) return { title: "Not Found" };
  return {
    title: tool.name,
    description: tool.desc,
  };
}

const TOOL_COMPONENTS: Record<string, React.ComponentType> = {
  json:     JsonTool,
  regex:    RegexTool,
  color:    ColorTool,
  markdown: MarkdownTool,
  gradient: GradientTool,
  base64:   Base64Tool,
  hash:     HashTool,
  uuid:     UuidTool,
  password: PasswordTool,
  diff:     DiffTool,
  url:      UrlTool,
  jwt:      JwtTool,
};

export default async function ToolPage({ params }: Props) {
  const { tool: toolId } = await params;
  const tool = getTool(toolId);
  if (!tool) notFound();

  const Component = TOOL_COMPONENTS[toolId];
  if (!Component) notFound();

  return (
    <main className="page">
      <Component />
    </main>
  );
}
