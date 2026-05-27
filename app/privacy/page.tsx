import { AppConfig } from '@/lib/app.config';

export const metadata = {
	title: `Privacy Policy | ${AppConfig.applicationName}`
};

export default function PrivacyPolicy() {
	return (
		<main className="relative min-h-screen">
			<div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
				<h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
				<p className="text-muted-foreground mb-12">
					Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
				</p>

				<div className="space-y-8 text-foreground/80 leading-relaxed">
					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
						<p>
							Welcome to {AppConfig.applicationName}. We respect your privacy and are committed to protecting your personal
							data. This Privacy Policy explains how we collect, use, and safeguard your information when you visit our
							website.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
						<p className="mb-4">We may collect and process the following data about you:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>
								<strong>Usage Data:</strong> Information about how you use our website, products, and services.
							</li>
							<li>
								<strong>Technical Data:</strong> IP address, browser type and version, time zone setting, operating system,
								and platform.
							</li>
							<li>
								<strong>Cookies:</strong> We use cookies to enhance your browsing experience and analyze our traffic.
							</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
						<p className="mb-4">We use your information to:</p>
						<ul className="list-disc pl-6 space-y-2">
							<li>Provide, operate, and maintain our website.</li>
							<li>Improve, personalize, and expand our services.</li>
							<li>Understand and analyze how you use our website.</li>
						</ul>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">4. Cookies and Tracking</h2>
						<p>
							We use cookies and similar tracking technologies to track the activity on our service and hold certain
							information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.
						</p>
					</section>

					<section>
						<h2 className="text-2xl font-semibold text-foreground mb-4">5. Contact Us</h2>
						<p>
							If you have any questions about this Privacy Policy, please contact us at{' '}
							<a className="text-primary hover:text-primary/80 hover:underline" href="mailto:[support-tools@cloudgrids.tech]">
								here
							</a>
							.
						</p>
					</section>
				</div>
			</div>
		</main>
	);
}
