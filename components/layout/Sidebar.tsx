'use client';

import { ToolIcon } from '@/components/ToolIcon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarInput,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarSeparator,
	Sidebar as UiSidebar,
	useSidebar
} from '@/components/ui/sidebar';
import { TOOLS } from '@/lib/tools';
import { House, Star } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

export function Sidebar() {
	const pathname = usePathname();
	const [query, setQuery] = useState<string>('');
	const { isMobile, setOpenMobile } = useSidebar();

	const filtered = useMemo(() => {
		if (!query.trim()) return TOOLS;
		const q = query.toLowerCase();
		return TOOLS.filter((t) => t.name.toLowerCase().includes(q) || t.keywords.some((k) => k.includes(q)));
	}, [query]);

	// Close on route change (mobile)
	useEffect(() => {
		if (isMobile) setOpenMobile(false);
	}, [pathname, isMobile, setOpenMobile]);

	return (
		<UiSidebar variant="sidebar" collapsible="offcanvas">
			<SidebarHeader>
				<div className="flex items-center gap-3 px-1">
					<Avatar>
						<AvatarFallback>T</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<div className="truncate text-sm font-semibold">tools</div>
						<div className="truncate text-xs text-muted-foreground">Developer Toolkit</div>
					</div>
				</div>
				<SidebarInput
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					placeholder="Search tools…"
					aria-label="Search tools"
				/>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupLabel>Navigation</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton render={<Link href="/" />} isActive={pathname === '/'} tooltip="Home">
									<House aria-hidden="true" />
									<span>Home</span>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>

				<SidebarSeparator />

				<SidebarGroup>
					<SidebarGroupLabel>Tools</SidebarGroupLabel>
					<SidebarGroupContent>
						<SidebarMenu>
							{filtered.map((tool) => {
								const isActive = pathname === `/${tool.id}`;
								return (
									<SidebarMenuItem key={tool.id}>
										<SidebarMenuButton
											render={<Link href={`/${tool.id}`} />}
											isActive={isActive}
											tooltip={tool.name}
										>
											<ToolIcon name={tool.icon} />
											<span>{tool.name}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								);
							})}
							{filtered.length === 0 && <div className="px-2 py-4 text-xs text-muted-foreground">No tools found</div>}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							render={<a href="https://github.com/cloudgrids/tools" target="_blank" rel="noopener noreferrer" />}
						>
							<Star aria-hidden="true" />
							<span>Star on GitHub</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</UiSidebar>
	);
}
