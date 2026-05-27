'use client';

import { Logo } from '@/components/Logo';
import { Separator } from '@/components/ui/separator';
import { AppConfig } from '@/lib/app.config';
import { COMMUNITY, LEGAL, SOCIALS } from '@/lib/constants';
import Image from 'next/image';
import Link from 'next/link';

const footerLinks = {
	Community: COMMUNITY,
	Legal: LEGAL
};

export function Footer() {
	return (
		<footer className="border-t border-border py-12 px-4">
			<div className="mx-auto max-w-6xl">
				<div className="grid grid-cols-1 gap-10 md:grid-cols-5 mb-10">
					<div className="md:col-span-2">
						<Link href="/" className="inline-flex items-center gap-2.5 mb-3 group">
							<Logo width={28} height={28} className="transition-transform duration-200 group-hover:scale-110" />
							<span className="text-base font-bold tracking-tight text-foreground">{AppConfig.applicationName}</span>
						</Link>
						<p className="flex items-center gap-2">
							Hosted by{' '}
							<Image src="https://media.cloudgrids.tech/cloudgrids/logo.svg" alt="CloudGrids" width={20} height={20} />
							<a
								href="https://cloudgrids.tech"
								target="_blank"
								rel="noopener noreferrer"
								className="font-medium underline-offset-4 hover:text-primary hover:underline transition-colors"
							>
								CloudGrids
							</a>
						</p>
						<div className="flex items-center gap-2 mt-5">
							{SOCIALS.map(({ icon: Icon, href, label }) => (
								<a
									key={label}
									href={href}
									target={href.startsWith('mailto') ? undefined : '_blank'}
									rel="noopener noreferrer"
									aria-label={label}
									className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
								>
									<Icon className="size-4" />
								</a>
							))}
						</div>
					</div>

					{Object.entries(footerLinks).map(([category, links]) => (
						<div key={category}>
							<p className="mb-3 text-xs font-semibold uppercase tracking-widest text-foreground">{category}</p>
							<ul className="flex flex-col gap-2.5">
								{links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											target={link.href.startsWith('http') ? '_blank' : undefined}
											rel="noopener noreferrer"
											className="text-sm text-muted-foreground transition-colors hover:text-primary"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				<Separator className="mb-6" />

				<div className="flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
					<p>© {new Date().getFullYear()} Tools. All rights reserved.</p>
					<p>
						MIT License ·{' '}
						<a
							href="https://github.com/cloudgrids"
							target="_blank"
							rel="noopener noreferrer"
							className="hover:text-primary transition-colors"
						>
							Open Source
						</a>
					</p>
				</div>
			</div>
		</footer>
	);
}
