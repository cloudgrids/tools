import { StatusBadge, ToolPanel } from '@/components/ToolUi';
import { CopyButton } from '@/components/ui/CopyButton';
import type { passwordStrength } from '@/lib/crypto';

type Strength = ReturnType<typeof passwordStrength>;

interface PasswordListProps {
	passwords: string[];
	strength: Strength;
}

export const PasswordList: React.FC<PasswordListProps> = ({ passwords, strength }) => (
	<ToolPanel
		title={`${passwords.length} Passwords`}
		action={
			<StatusBadge tone={strength.score > 5 ? 'success' : strength.score > 2 ? 'info' : 'error'}>
				{strength.label}
			</StatusBadge>
		}
		contentClassName="p-0"
	>
		<div className="px-4 pb-3">
			<div className="h-1 overflow-hidden rounded bg-muted">
				<div
					className="h-full rounded transition-all"
					style={{ width: `${(strength.score / 7) * 100}%`, background: strength.color }}
				/>
			</div>
		</div>
		<div className="max-h-96 overflow-auto border-t border-input">
			{passwords.map((password) => (
				<div
					key={password}
					className="flex min-w-0 items-center justify-between gap-3 border-b border-input px-4 py-2.5 last:border-0 hover:bg-muted"
				>
					<code className="min-w-0 break-all font-mono text-sm text-secondary-foreground">{password}</code>
					<CopyButton text={password} label="Copy" />
				</div>
			))}
		</div>
	</ToolPanel>
);
