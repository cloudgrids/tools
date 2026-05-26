import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/Topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { ToastProvider } from '@/components/ui/ToastProvider';
import { TooltipProvider } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
	title: { default: 'Tools', template: '%s · Tools' },
	description:
		'12 beautiful developer utilities in one app — JSON formatter, regex tester, color converter, CSS gradients, hash generator and more. Zero installs, 100% offline.',
	keywords: ['developer tools', 'devkit', 'tools', 'json formatter', 'regex tester', 'base64', 'hash generator', 'open source'],
	openGraph: {
		title: 'Tools',
		description: 'All-in-one developer toolkit. Beautiful, offline-first, open source.',
		type: 'website'
	}
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-scroll-behavior="smooth" className={cn('font-sans', geist.variable)}>
			<body>
				<TooltipProvider>
					<ToastProvider>
						<SidebarProvider defaultOpen>
							<Sidebar />
							<SidebarInset>
								<TopBar />
								{children}
							</SidebarInset>
						</SidebarProvider>
					</ToastProvider>
				</TooltipProvider>
			</body>
		</html>
	);
}
