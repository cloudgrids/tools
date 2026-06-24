export default function GenerateV2Layout({ children }: { children: React.ReactNode }) {
	return (
		/**
		 * This layout intentionally breaks out of the root layout's `<main>` padding
		 * and `overflow-y-auto` so that /generate/v2 and /generate/v2/history can
		 * control their own full-height, independently-scrollable panels.
		 *
		 * Strategy:
		 *  - Use negative margin to cancel the root `p-4` (1rem = 16px on all sides)
		 *  - `h-[calc(100vh-var(--topbar-height,56px))]` fills the visible viewport
		 *    minus the TopBar; fall back to `h-screen` via `min-h-0`.
		 *  - `overflow-hidden` stops the root <main> from scrolling this subtree.
		 */
		<div className="-m-4 flex flex-col overflow-hidden" style={{ height: 'calc(100vh - 56px)' }}>
			{children}
		</div>
	);
}
