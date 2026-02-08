import { useState, useCallback, useMemo } from 'react';
import FormulaInput from '../components/FormulaInput';
import Plot3D from '../components/Plot3D';
import AlgorithmPanel from '../components/AlgorithmPanel';
import ResultsPanel from '../components/ResultsPanel';
import { useSolver, SolverSettings } from '../hooks/useSolver';
import { useTheme } from '../hooks/useTheme';
import { validateFormula, generateSurfaceData } from '../utils/formulaParser';

const DEFAULT_FORMULA = 'x^2 + y^2';
const DEFAULT_X_RANGE: [number, number] = [-5, 5];
const DEFAULT_Y_RANGE: [number, number] = [-5, 5];

const DEFAULT_SETTINGS: SolverSettings = {
	variant: 'fwa',
	locationsNumber: 5,
	explosionSparksNumberModifier: 50,
	maxSteps: 50,
	animationSpeed: 100,
};

export default function SolverPage() {
	const [formula, setFormula] = useState(DEFAULT_FORMULA);
	const [xRange, setXRange] = useState<[number, number]>(DEFAULT_X_RANGE);
	const [yRange, setYRange] = useState<[number, number]>(DEFAULT_Y_RANGE);
	const [settings, setSettings] = useState<SolverSettings>(DEFAULT_SETTINGS);
	const [showTypes, setShowTypes] = useState(false);
	const [showLinks, setShowLinks] = useState(false);

	const { theme } = useTheme();
	const solver = useSolver();

	const formulaError = useMemo(() => validateFormula(formula), [formula]);

	const surfaceData = useMemo(() => {
		if (formulaError) return null;
		try {
			return generateSurfaceData(formula, xRange, yRange, 60);
		} catch {
			return null;
		}
	}, [formula, xRange, yRange, formulaError]);

	const handleSolve = useCallback(() => {
		if (formulaError) return;
		solver.solve(formula, xRange, yRange, settings);
	}, [formula, xRange, yRange, settings, formulaError, solver]);

	return (
		<div className="solver-page">
			<div>
				<h1 className="solver-title">FIREWORKS LAB</h1>
				<p className="solver-subtitle">Optimization Visualizer</p>
			</div>

			<div className="card">
				<div className="card-header">Objective Function</div>
				<div className="card-body">
					<FormulaInput
						formula={formula}
						xRange={xRange}
						yRange={yRange}
						error={formulaError}
						onFormulaChange={setFormula}
						onXRangeChange={setXRange}
						onYRangeChange={setYRange}
					/>
				</div>
			</div>

			<div className="card">
				<div className="card-header viz-header">
					<span>Visualization</span>
					<div className="viz-toggles">
						<label className="toggle-label">
							<span>Types</span>
							<button
								className={`toggle-switch${showTypes ? ' active' : ''}`}
								onClick={() => setShowTypes((v) => !v)}
								aria-pressed={showTypes}
							>
								<span className="toggle-knob" />
							</button>
						</label>
						<label className="toggle-label">
							<span>Links</span>
							<button
								className={`toggle-switch${showLinks ? ' active' : ''}`}
								onClick={() => setShowLinks((v) => !v)}
								aria-pressed={showLinks}
							>
								<span className="toggle-knob" />
							</button>
						</label>
					</div>
				</div>
				<div className="card-body card-body-flush">
					<Plot3D
						surfaceData={surfaceData}
						fireworkPositions={solver.fireworkPositions}
						bestPosition={solver.bestPosition}
						trailPositions={solver.trailPositions}
						theme={theme}
						showTypes={showTypes}
						showLinks={showLinks}
					/>
				</div>
			</div>

			<div className="algo-grid">
				<AlgorithmPanel
					settings={settings}
					onSettingsChange={setSettings}
					isRunning={solver.isRunning}
				/>
				<ResultsPanel
					currentStep={solver.currentStep}
					totalSteps={solver.totalSteps}
					bestQuality={solver.bestQuality}
					bestPosition={solver.bestPosition}
					isRunning={solver.isRunning}
					onSolve={handleSolve}
					onStop={solver.stop}
					onReset={solver.reset}
					disabled={!!formulaError}
					error={solver.error}
				/>
			</div>
		</div>
	);
}
