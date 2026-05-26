export const AppConfig = {
	applicationName: 'Tools',
	site_name: 'Tools',
	title: 'Tools - A collection of useful tools for developers and designers.',
	description:
		'Manage and use a variety of tools for developers and designers, including JSON formatter, regex tester, color picker, markdown editor, gradient generator, base64 encoder/decoder, hash generator, UUID generator, password generator, diff tool, URL encoder/decoder, and JWT decoder.',
	subDescription: 'Developer and designer tools for various purposes.',
	tagline: 'A collection of useful tools for developers and designers.',
	keywords: [
		'tools',
		'developer tools',
		'designer tools',
		'json formatter',
		'regex tester',
		'color picker',
		'markdown editor',
		'gradient generator',
		'base64 encoder decoder',
		'hash generator',
		'uuid generator',
		'password generator',
		'diff tool',
		'url encoder decoder',
		'jwt decoder'
	],
	siteUrl: 'https://tools.cloudgrids.tech',
	canonical: 'https://tools.cloudgrids.tech',
	locale: 'en-US',
	template: '%s | Tools',
	type: 'website' as const,
	themeColor: '#000000',
	images: {
		og: 'https://tools.cloudgrids.tech/opengraph-image',
		logo: '/logo.png',
		favicon: '/favicon.ico'
	},
	manifest: '/site.webmanifest',
	icons: [
		{ src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
		{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
		{ src: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' }
	],
	contact: {
		email: 'support-tools@cloudgrids.tech'
	}
};
