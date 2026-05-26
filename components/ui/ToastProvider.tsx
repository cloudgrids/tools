'use client';

import { Toaster } from '@/components/ui/sonner';
import { createContext, useCallback, useContext } from 'react';
import { toast } from 'sonner';

interface ToastCtx {
	showToast: (message: string, type?: 'success' | 'error') => void;
}

const Ctx = createContext<ToastCtx>({ showToast: () => {} });

export function useToast() {
	return useContext(Ctx);
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
	const showToast = useCallback((message: string, type: 'success' | 'error' = 'success') => {
		if (type === 'error') {
			toast.error(message);
			return;
		}
		toast.success(message);
	}, []);

	return (
		<Ctx.Provider value={{ showToast }}>
			{children}
			<Toaster richColors closeButton position="top-right" />
		</Ctx.Provider>
	);
}
