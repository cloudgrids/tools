import { ToolPanel } from '@/components/ToolUi';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { JWT_SAMPLE } from '@/lib/tool-samples';

interface JwtInputProps {
	token: string;
	onTokenChange: (token: string) => void;
}

export const JwtInput: React.FC<JwtInputProps> = ({ token, onTokenChange }) => (
	<ToolPanel
		title="JWT Token"
		action={
			<div className="flex gap-2">
				<Button variant="ghost" size="sm" onClick={() => onTokenChange(JWT_SAMPLE)}>
					Sample
				</Button>
				<Button variant="ghost" size="sm" onClick={() => onTokenChange('')}>
					Clear
				</Button>
			</div>
		}
	>
		<Textarea
			id="jwt-input"
			className="min-h-32 break-all font-mono text-sm"
			value={token}
			onChange={(e) => onTokenChange(e.target.value)}
			placeholder="Paste JWT token here..."
			spellCheck={false}
		/>
	</ToolPanel>
);
