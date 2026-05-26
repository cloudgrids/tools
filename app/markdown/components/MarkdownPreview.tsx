import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MarkdownPreviewProps {
	html: string;
}

export const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ html }) => (
	<Card className="flex min-h-96 min-w-0 flex-1 flex-col lg:min-h-0">
		<CardHeader>
			<CardTitle>Preview</CardTitle>
		</CardHeader>
		<CardContent
			id="md-preview"
			className="flex-1 overflow-auto px-4 pb-4 text-sm leading-7 text-foreground [&_a]:text-primary [&_a]:underline [&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-primary [&_blockquote]:bg-muted/50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:italic [&_code]:rounded [&_code]:bg-muted [&_code]:px-1 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_del]:text-muted-foreground [&_h1]:mb-3 [&_h1]:mt-4 [&_h1]:text-2xl [&_h1]:font-bold [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-xl [&_h2]:font-semibold [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-lg [&_h3]:font-semibold [&_hr]:my-5 [&_li]:ml-5 [&_li]:list-item [&_ol]:my-3 [&_ol]:list-decimal [&_p]:my-3 [&_pre]:my-4 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-input [&_pre]:bg-muted [&_pre]:p-4 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-foreground [&_ul]:my-3 [&_ul]:list-disc"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	</Card>
);
