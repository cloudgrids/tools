export function parseUrl(raw: string): Record<string, string> | null {
	try {
		const url = new URL(raw);
		const params: Record<string, string> = {};
		url.searchParams.forEach((value, key) => {
			params[key] = value;
		});

		return {
			...params,
			hash: url.hash,
			pathname: url.pathname,
			protocol: url.protocol,
			search: url.search,
			...Object.fromEntries(Object.entries(params).map(([key, value]) => [key, value]))
		};
	} catch {
		return null;
	}
}
