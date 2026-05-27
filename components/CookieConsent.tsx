'use client';

import { Button } from '@/components/ui/button';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export function CookieConsent() {
	const [show, setShow] = useState<boolean>(false);

	useEffect(() => {
		const timer = setTimeout(() => {
			if (!localStorage.getItem('cookie-consent')) {
				setShow(true);
			}
		}, 50);
		return () => clearTimeout(timer);
	}, []);

	const accept = () => {
		localStorage.setItem('cookie-consent', 'true');
		setShow(false);
	};

	return (
		<AnimatePresence>
			{show && (
				<motion.div
					initial={{ y: 100, opacity: 0 }}
					animate={{ y: 0, opacity: 1 }}
					exit={{ y: 100, opacity: 0 }}
					transition={{
						duration: 0.4,
						ease: [0.16, 1, 0.3, 1]
					}}
					className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 pb-safe"
				>
					<div className="mx-auto max-w-4xl rounded-2xl border border-border bg-background/90 p-6 shadow-2xl backdrop-blur-xl sm:flex sm:items-center sm:justify-between">
						<div className="mb-4 sm:mb-0 sm:mr-4">
							<p className="leading-relaxed text-sm text-foreground">
								We use cookies to improve your experience. By continuing to use our site, you agree to our{' '}
								<Link href="/privacy" className="font-medium text-primary underline-offset-4 hover:underline">
									Privacy Policy
								</Link>{' '}
								and{' '}
								<Link href="/legal" className="font-medium text-primary underline-offset-4 hover:underline">
									Legal Terms
								</Link>
								.
							</p>
						</div>

						<div className="flex shrink-0 gap-3">
							<Button onClick={accept}>Accept & Continue</Button>
						</div>
					</div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
