import { compile } from 'mathjs';

export function validateFormula(expression: string): string | null {
	if (!expression.trim()) return 'Formula is required';
	try {
		const code = compile(expression);
		code.evaluate({ x: 0, y: 0 });
		return null;
	} catch (e: any) {
		return e.message || 'Invalid formula';
	}
}

export function generateSurfaceData(
	expression: string,
	xRange: [number, number],
	yRange: [number, number],
	resolution: number = 60
): { x: number[]; y: number[]; z: number[][] } {
	const code = compile(expression);

	const x = linspace(xRange[0], xRange[1], resolution);
	const y = linspace(yRange[0], yRange[1], resolution);
	const z: number[][] = [];

	for (let j = 0; j < y.length; j++) {
		const row: number[] = [];
		for (let i = 0; i < x.length; i++) {
			try {
				const val = code.evaluate({ x: x[i], y: y[j] });
				row.push(isFinite(val) ? val : NaN);
			} catch {
				row.push(NaN);
			}
		}
		z.push(row);
	}

	return { x, y, z };
}

function linspace(start: number, end: number, n: number): number[] {
	const step = (end - start) / (n - 1);
	return Array.from({ length: n }, (_, i) => start + i * step);
}
