import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

function subscribeToViewport(callback: () => void) {
	const query = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
	query.addEventListener('change', callback);
	return () => query.removeEventListener('change', callback);
}

function getViewportSnapshot() {
	return window.innerWidth < MOBILE_BREAKPOINT;
}

function getServerSnapshot() {
	return false;
}

export function useIsMobile() {
	return React.useSyncExternalStore(subscribeToViewport, getViewportSnapshot, getServerSnapshot);
}
