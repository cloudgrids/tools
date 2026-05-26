import { ToolIcon } from '@/components/ToolIcon';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TOOLS } from '@/lib/tools';
import Link from 'next/link';
import { HomeHeader } from './HomeHeader';

export const Home = () => {
	return (
		<main className="mx-auto w-full max-w-7xl px-4 py-6 md:px-6 md:py-8">
			<Card className="border-border bg-card shadow-sm md:p-2 transition-colors">
				<CardContent className="space-y-5 p-6 md:p-8">
					<HomeHeader />
					<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{TOOLS.map((tool) => (
							<Link key={tool.id} href={`/${tool.id}`} className="group">
								<Card className="h-full border-border bg-card py-2 gap-2 transition-all duration-300 ease-out group-hover:-translate-y-1 group-hover:border-primary/50 group-hover:shadow-lg dark:group-hover:shadow-primary/5">
									<CardHeader className="pb-2">
										<CardTitle className="flex items-center justify-start gap-2 text-sm text-foreground transition-colors group-hover:text-primary">
											<ToolIcon name={tool.icon} className="size-5 text-primary" />
											<span>{tool.name}</span>
										</CardTitle>
									</CardHeader>
									<CardContent className="pb-4">
										<CardDescription className="text-xs text-muted-foreground">{tool.desc}</CardDescription>
									</CardContent>
								</Card>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>
		</main>
	);
};
