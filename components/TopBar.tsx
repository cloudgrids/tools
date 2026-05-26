'use client';

import { ToolIcon } from '@/components/ToolIcon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TOOL_MAP } from '@/lib/tools';
import { Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { GithubStar } from './GithubStar';
import { ThemeToggle } from './ThemeToggle';

export function TopBar() {
	const pathname = usePathname();
	const toolId = pathname.startsWith('/tools/') ? pathname.split('/tools/')[1] : null;
	const tool = toolId ? TOOL_MAP.get(toolId) : null;

	return (
		<header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-background/80 px-4 backdrop-blur-md supports-backdrop-filter:bg-background/60 md:px-6">
			<div className="flex min-w-0 items-center gap-3">
				<SidebarTrigger className="lg:hidden" />

				<span className="hidden h-5 w-px bg-border lg:block" aria-hidden="true" />

				<Avatar size="sm">
					<AvatarFallback>
						{tool ? <ToolIcon name={tool.icon} className="size-3.5" /> : <Wrench className="size-3.5" aria-hidden="true" />}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0">
					<div className="truncate text-sm font-semibold text-foreground">{tool ? tool.name : 'Tools'}</div>
					{tool && <div className="hidden truncate text-xs text-muted-foreground md:block">{tool.desc}</div>}
				</div>
			</div>

			<div className="flex items-center gap-3">
				<ThemeToggle />
				<GithubStar />
			</div>
		</header>
	);
}
