import { AppConfig } from '@/lib/app.config';

export const metadata = {
	title: `Legal Terms | ${AppConfig.applicationName}`
};

export default function Legal() {
	return (
		<main className="relative min-h-screen">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold tracking-tight mb-4">Legal Terms</h1>
				<p className="text-muted-foreground mb-12">
					Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
				</p>

				<div className="space-y-8 text-foreground/80 leading-relaxed">
					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">1. Terms of Service</h2>
						<p>
							By accessing or using {AppConfig.applicationName}, you agree to be bound by these Legal Terms and our Privacy
							Policy. If you do not agree with any part of these terms, you must not use our website.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">2. Use License</h2>
						<p className="mb-4">
							Permission is granted to temporarily download one copy of the materials (information or software) on{' '}
							{AppConfig.applicationName}&apos;s website for personal, non-commercial transitory viewing only. This is the
							grant of a license, not a transfer of title, and under this license you may not:
						</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Modify or copy the materials;</li>
							<li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
							<li>Attempt to decompile or reverse engineer any software contained on the website;</li>
							<li>Remove any copyright or other proprietary notations from the materials; or</li>
							<li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">3. Disclaimer</h2>
						<p>
							The materials on {AppConfig.applicationName}&apos;s website are provided on an &apos;as is&apos; basis. We make
							no warranties, expressed or implied, and hereby disclaim and negate all other warranties including, without
							limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or
							non-infringement of intellectual property or other violation of rights.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">5. Limitations</h2>
						<p>
							In no event shall {AppConfig.applicationName} or its suppliers be liable for any damages (including, without
							limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or
							inability to use the materials on our website.
						</p>
					</section>
				</div>
			</div>
		</main>
	);
}
