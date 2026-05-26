'use client';

import { ToolIcon } from '@/components/tools/shared/ToolIcon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { TOOL_MAP } from '@/lib/tools';
import { Star, Wrench } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function TopBar() {
	const pathname = usePathname();
	const toolId = pathname.startsWith('/tools/') ? pathname.split('/tools/')[1] : null;
	const tool = toolId ? TOOL_MAP.get(toolId) : null;

	return (
		<header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-200 bg-white/90 px-4 backdrop-blur supports-backdrop-filter:bg-white/70 md:px-6">
			<div className="flex min-w-0 items-center gap-3">
				<SidebarTrigger className="lg:hidden" />

				<span className="hidden h-5 w-px bg-slate-200 lg:block" aria-hidden="true" />

				<Avatar size="sm">
					<AvatarFallback>
						{tool ? <ToolIcon name={tool.icon} className="size-3.5" /> : <Wrench className="size-3.5" aria-hidden="true" />}
					</AvatarFallback>
				</Avatar>

				<div className="min-w-0">
					<div className="truncate text-sm font-semibold text-slate-900">{tool ? tool.name : 'tools'}</div>
					{tool && <div className="hidden truncate text-xs text-slate-500 md:block">{tool.desc}</div>}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					nativeButton={false}
					render={<a href="https://github.com/cloudgrids/tools" target="_blank" rel="noopener noreferrer" />}
					aria-label="Star tools on GitHub"
				>
					<Star aria-hidden="true" />
					<span>GitHub</span>
				</Button>
			</div>
		</header>
	);
}
