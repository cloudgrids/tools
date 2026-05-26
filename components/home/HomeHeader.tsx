import { Rocket, ShieldCheck, Sparkles, Star, Zap } from 'lucide-react';
import React from 'react';
import { GithubStar } from '../GithubStar';

const badges = [
	{
		icon: <Zap className="size-3.5" aria-hidden="true" />,
		text: '100% Offline'
	},
	{
		icon: <ShieldCheck className="size-3.5" aria-hidden="true" />,
		text: 'Privacy First'
	},
	{
		icon: <Rocket className="size-3.5" aria-hidden="true" />,
		text: 'Zero Dependencies'
	},
	{
		icon: <Star className="size-3.5" aria-hidden="true" />,
		text: 'Open Source'
	}
];

export const HomeHeader = () => {
	return (
		<React.Fragment>
			<div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
				<Sparkles className="size-3.5" aria-hidden="true" />
				Open Source · MIT License
			</div>

			<h1 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">Developer Toolkit</h1>

			<p className="mt-3 max-w-3xl text-sm text-muted-foreground md:text-base">
				12 powerful utilities in one beautiful app. Zero installs, zero backend, works completely offline.
			</p>

			<div className="mt-5 flex flex-wrap gap-2">
				{badges.map((badge, index) => (
					<span
						key={index}
						id={`badge-${index}`}
						className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
					>
						{badge.icon}
						{badge.text}
					</span>
				))}
			</div>

			<GithubStar />
		</React.Fragment>
	);
};
