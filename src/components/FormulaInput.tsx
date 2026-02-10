import { useState, useCallback } from 'react';

interface Preset {
	name: string;
	formula: string;
	xRange: [number, number];
	yRange: [number, number];
}

const PRESETS: Preset[] = [
	{ name: 'Sphere', formula: 'x^2 + y^2', xRange: [-5, 5], yRange: [-5, 5] },
	{ name: 'Rastrigin', formula: '20 + x^2 - 10*cos(2*pi*x) + y^2 - 10*cos(2*pi*y)', xRange: [-5.12, 5.12], yRange: [-5.12, 5.12] },
	{ name: 'Rosenbrock', formula: '(1-x)^2 + 100*(y-x^2)^2', xRange: [-2, 2], yRange: [-1, 3] },
	{ name: 'Ackley', formula: '-20*exp(-0.2*sqrt(0.5*(x^2+y^2))) - exp(0.5*(cos(2*pi*x)+cos(2*pi*y))) + e + 20', xRange: [-5, 5], yRange: [-5, 5] },
	{ name: 'Beale', formula: '(1.5-x+x*y)^2 + (2.25-x+x*y^2)^2 + (2.625-x+x*y^3)^2', xRange: [-4.5, 4.5], yRange: [-4.5, 4.5] },
	{ name: 'Himmelblau', formula: '(x^2+y-11)^2 + (x+y^2-7)^2', xRange: [-5, 5], yRange: [-5, 5] },
	{ name: 'Easom', formula: '-cos(x)*cos(y)*exp(-((x-pi)^2 + (y-pi)^2))', xRange: [-5, 5], yRange: [-5, 5] }
];

interface Props {
	formula: string;
	xRange: [number, number];
	yRange: [number, number];
	error: string | null;
	onFormulaChange: (formula: string) => void;
	onXRangeChange: (range: [number, number]) => void;
	onYRangeChange: (range: [number, number]) => void;
}

export default function FormulaInput({ formula, xRange, yRange, error, onFormulaChange, onXRangeChange, onYRangeChange }: Props) {
	const [activePreset, setActivePreset] = useState<string | null>('Rastrigin');

	const selectPreset = useCallback((preset: Preset) => {
		onFormulaChange(preset.formula);
		onXRangeChange(preset.xRange);
		onYRangeChange(preset.yRange);
		setActivePreset(preset.name);
	}, [onFormulaChange, onXRangeChange, onYRangeChange]);

	return (
		<div className="formula-section">
			<div className="formula-row">
				<label htmlFor="formula-input" className="formula-label">f(x,y) =</label>
				<input
					id="formula-input"
					type="text"
					className={`formula-input ${error ? 'error' : ''}`}
					value={formula}
					onChange={(e) => {
						onFormulaChange(e.target.value);
						setActivePreset(null);
					}}
					placeholder="x^2 + y^2"
					spellCheck={false}
				/>
			</div>
			{error && <div className="formula-error">{error}</div>}

			<div className="presets">
				{PRESETS.map((p) => (
					<button
						key={p.name}
						className={`preset-btn ${activePreset === p.name ? 'active' : ''}`}
						onClick={() => selectPreset(p)}
					>
						{p.name}
					</button>
				))}
			</div>

			<div className="range-row">
				<div className="range-group">
					<label htmlFor="range-x-min">x &isin;</label>
					<input
						id="range-x-min"
						type="number"
						className="range-input"
						value={xRange[0]}
						onChange={(e) => onXRangeChange([parseFloat(e.target.value) || 0, xRange[1]])}
						aria-label="X range minimum"
					/>
					<span className="formula-label">,</span>
					<input
						id="range-x-max"
						type="number"
						className="range-input"
						value={xRange[1]}
						onChange={(e) => onXRangeChange([xRange[0], parseFloat(e.target.value) || 0])}
						aria-label="X range maximum"
					/>
				</div>
				<div className="range-group">
					<label htmlFor="range-y-min">y &isin;</label>
					<input
						id="range-y-min"
						type="number"
						className="range-input"
						value={yRange[0]}
						onChange={(e) => onYRangeChange([parseFloat(e.target.value) || 0, yRange[1]])}
						aria-label="Y range minimum"
					/>
					<span className="formula-label">,</span>
					<input
						id="range-y-max"
						type="number"
						className="range-input"
						value={yRange[1]}
						onChange={(e) => onYRangeChange([yRange[0], parseFloat(e.target.value) || 0])}
						aria-label="Y range maximum"
					/>
				</div>
			</div>
		</div>
	);
}
