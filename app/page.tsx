import { ToolIcon } from '@/components/tools/shared/ToolIcon';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TOOLS } from '@/lib/tools';
import { Rocket, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
	title: 'tools — All-in-One Developer Toolkit',
	description:
		'12 beautiful developer utilities. JSON formatter, regex tester, color converter, CSS gradients, hash generator, and more. Zero installs, 100% offline.'
};

export default function HomePage() {
	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
			<Card className="border-slate-200 bg-white shadow-sm md:p-2">
				<CardContent className="space-y-5 p-6 md:p-8">
					<div className="inline-flex items-center gap-1.5 rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700">
						<Sparkles className="size-3.5" aria-hidden="true" />
						Open Source · MIT License
					</div>

					<h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Developer Toolkit</h1>

					<p className="mt-3 max-w-3xl text-sm text-slate-600 md:text-base">
						12 powerful utilities in one beautiful app. Zero installs, zero backend, works completely offline.
					</p>

					<div className="mt-5 flex flex-wrap gap-2">
						<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
							<Zap className="size-3.5" aria-hidden="true" />
							100% Offline
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
							<ShieldCheck className="size-3.5" aria-hidden="true" />
							Privacy First
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
							<Rocket className="size-3.5" aria-hidden="true" />
							Zero Dependencies
						</span>
						<span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
							<Star className="size-3.5" aria-hidden="true" />
							Open Source
						</span>
					</div>

					<div>
						<Button
							variant="outline"
							size="sm"
							nativeButton={false}
							render={<a href="https://github.com/cloudgrids/devkit-pro" target="_blank" rel="noopener noreferrer" />}
						>
							<Star data-icon="inline-start" />
							Star on GitHub
						</Button>
					</div>

					<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{TOOLS.map((tool) => (
							<Link key={tool.id} href={`/tools/${tool.id}`} className="group">
								<Card className="h-full border-slate-200 py-2 gap-2 transition group-hover:-translate-y-0.5 group-hover:border-violet-300 group-hover:shadow-xl">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-start gap-2 text-sm text-slate-900 group-hover:text-violet-700">
											<ToolIcon name={tool.icon} className="size-5 text-violet-600" />
											<span>{tool.name}</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="pb-4">
										<CardDescription className="text-xs text-slate-600">{tool.desc}</CardDescription>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</main>
	);
}
