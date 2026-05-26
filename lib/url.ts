export function parseUrl(raw: string): URL | null {
	try {
		const url = new URL(raw);
		const params: Record<string, string> = {};
		url.searchParams.forEach((value, key) => {
			params[key] = value;
		});

		return url;
	} catch {
		return null;
	}
}
