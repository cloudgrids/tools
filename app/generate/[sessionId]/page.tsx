import { Memes } from './Memes';

interface MemesPageProps {
	params: Promise<{ sessionId: string }>;
}

export default async function MemesPage({ params }: MemesPageProps) {
	const { sessionId } = await params;
	return <Memes sessionId={sessionId} />;
}
