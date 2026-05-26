import { Sidebar } from '@/components/layout/Sidebar';
import { TopBar } from '@/components/layout/Topbar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { AppConfig } from '@/lib/app.config';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { Geist } from 'next/font/google';
import './globals.css';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });

export async function generateMetadata(): Promise<Metadata> {
	const metadata = {
		metadataBase: new URL(AppConfig.siteUrl),
		title: {
			template: AppConfig.template,
			default: AppConfig.title
		},
		alternates: {
			canonical: AppConfig.canonical
		},
		manifest: AppConfig.manifest,
		applicationName: AppConfig.applicationName,
		description: AppConfig.description,
		icons: {
			icon: [
				{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
				{ url: '/favicon-512.png', sizes: '512x512', type: 'image/png' }
			],
			apple: [
				{ url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
				{ url: '/favicon-512.png', sizes: '512x512', type: 'image/png' }
			]
		},
		openGraph: {
			siteName: AppConfig.site_name,
			title: AppConfig.title,
			description: AppConfig.description,
			type: AppConfig.type,
			locale: AppConfig.locale,
			url: AppConfig.siteUrl,
			images: [
				{
					url: AppConfig.images.og,
					width: 1200,
					height: 630,
					alt: AppConfig.title
				}
			]
		},
		twitter: {
			card: 'summary_large_image',
			title: AppConfig.title,
			description: AppConfig.description,
			images: [AppConfig.images.og]
		},
		robots: {
			index: true,
			follow: true
		},
		generator: 'Next.js',
		keywords: AppConfig.keywords
	} satisfies Metadata;
	return metadata;
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" data-scroll-behavior="smooth" className={cn('font-sans', geist.variable)} suppressHydrationWarning>
			<body>
				<Toaster position="top-center" richColors />
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<TooltipProvider>
						<SidebarProvider defaultOpen>
							<Sidebar />
							<SidebarInset>
								<TopBar />
								{children}
							</SidebarInset>
						</SidebarProvider>
					</TooltipProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
