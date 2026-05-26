import type { DiffLine } from '@/lib/contracts';

function lcs(a: string[], b: string[]): number[][] {
	const m = a.length,
		n = b.length;
	const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
	for (let i = 1; i <= m; i++)
		for (let j = 1; j <= n; j++) dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
	return dp;
}

function backtrack(dp: number[][], a: string[], b: string[], i: number, j: number, out: DiffLine[]): void {
	if (i === 0 && j === 0) return;
	if (i > 0 && j > 0 && a[i - 1] === b[j - 1]) {
		backtrack(dp, a, b, i - 1, j - 1, out);
		out.push({ type: 'equal', content: a[i - 1], lineA: i, lineB: j });
	} else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
		backtrack(dp, a, b, i, j - 1, out);
		out.push({ type: 'add', content: b[j - 1], lineB: j });
	} else {
		backtrack(dp, a, b, i - 1, j, out);
		out.push({ type: 'remove', content: a[i - 1], lineA: i });
	}
}

export function computeDiff(textA: string, textB: string): DiffLine[] {
	const a = textA.split('\n');
	const b = textB.split('\n');
	const dp = lcs(a, b);
	const result: DiffLine[] = [];
	backtrack(dp, a, b, a.length, b.length, result);
	return result;
}

export function diffStats(lines: DiffLine[]): { added: number; removed: number; unchanged: number } {
	return lines.reduce(
		(acc, l) => {
			if (l.type === 'add') acc.added++;
			else if (l.type === 'remove') acc.removed++;
			else acc.unchanged++;
			return acc;
		},
		{ added: 0, removed: 0, unchanged: 0 }
	);
}
