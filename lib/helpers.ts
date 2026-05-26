export const formatBytes = (bytes: number) => {
	if (!bytes) return '0 B';
	const base = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const power = Math.min(Math.floor(Math.log(bytes) / Math.log(base)), sizes.length - 1);

	return parseFloat((bytes / Math.pow(base, power)).toFixed(2)) + ' ' + sizes[power];
};
