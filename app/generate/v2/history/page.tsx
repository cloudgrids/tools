import { Suspense } from 'react';
import { HistoryTreePage } from './components/HistoryTreePage';

export default function GenerateV2HistoryPage() {
	return (
		<Suspense fallback={<div className="flex items-center justify-center w-full h-full">Loading...</div>}>
			<HistoryTreePage />
		</Suspense>
	);
}
