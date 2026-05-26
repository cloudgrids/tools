export function parseUrl(raw: string): Record<string, string> | null {
	try {
		const url = new URL(raw);
		const params: Record<string, string> = {};
		url.searchParams.forEach((value, key) => {
			params[key] = value;
		});

		return {
			protocol: url.protocol,
			host: url.host,
			hostname: url.hostname,
			port: url.port || '(default)',
			pathname: url.pathname,
			search: url.search,
			hash: url.hash || '(none)',
			origin: url.origin,
			...Object.fromEntries(Object.entries(params).map(([key, value]) => [`param:${key}`, value]))
		};
	} catch {
		return null;
	}
}
