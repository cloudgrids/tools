import { Badge } from '@/components/ui/badge';
import { CardDescription, CardTitle } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

export const GeometryHeader = () => {
	return (
		<div className="flex flex-wrap items-start justify-between gap-4">
			<div className="space-y-1">
				<CardTitle className="flex items-center gap-2 text-lg">
					<Sparkles className="size-4" />
					Procedural Geometry Generator
				</CardTitle>

				<CardDescription>Generate voxel-based procedural identities dynamically</CardDescription>
			</div>

			<Badge variant="secondary" className="rounded-full px-3 py-1 text-xs">
				Experimental
			</Badge>
		</div>
	);
};
