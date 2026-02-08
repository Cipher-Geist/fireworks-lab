import { useState } from 'react';
import { AlgorithmVariant, SolverSettings } from '../hooks/useSolver';

interface Props {
	settings: SolverSettings;
	onSettingsChange: (settings: SolverSettings) => void;
	isRunning: boolean;
}

const VARIANTS: { value: AlgorithmVariant; label: string; desc: string }[] = [
	{ value: 'fwa', label: 'FWA 2010', desc: 'Original Fireworks Algorithm' },
	{ value: 'efwa', label: 'EFWA 2012', desc: 'Enhanced with elite strategy' },
	{ value: 'dynfwa', label: 'dynFWA 2014', desc: 'Dynamic explosion amplitude' },
];

export default function AlgorithmPanel({ settings, onSettingsChange, isRunning }: Props) {
	const [collapsed, setCollapsed] = useState(false);
	const update = (key: keyof SolverSettings, value: any) => {
		onSettingsChange({ ...settings, [key]: value });
	};

	const parseIntOrDefault = (val: string, fallback: number) => {
		const n = parseInt(val);
		return Number.isNaN(n) ? fallback : n;
	};

	return (
		<div className={`card card-collapsible${collapsed ? ' collapsed' : ''}`}>
			<div className="card-header" onClick={() => setCollapsed((v) => !v)}>
				Algorithm
				<span className="collapse-chevron" />
			</div>
			<div className="card-body">
				<ul className="algo-variant-list">
					{VARIANTS.map((v) => (
						<li
							key={v.value}
							className="algo-variant"
							onClick={() => !isRunning && update('variant', v.value)}
						>
							<input
								type="radio"
								name="variant"
								id={`variant-${v.value}`}
								checked={settings.variant === v.value}
								onChange={() => update('variant', v.value)}
								disabled={isRunning}
								aria-label={v.label}
							/>
							<div>
								<div>{v.label}</div>
								<div className="algo-variant-desc">{v.desc}</div>
							</div>
						</li>
					))}
				</ul>

				<div className="param-grid param-grid-top">
					<div className="param-group">
						<label htmlFor="param-fireworks">Fireworks</label>
						<input
							id="param-fireworks"
							type="number"
							className="param-input"
							value={settings.locationsNumber}
							onChange={(e) => update('locationsNumber', parseIntOrDefault(e.target.value, 5))}
							disabled={isRunning}
							min={2}
							max={20}
						/>
					</div>
					<div className="param-group">
						<label htmlFor="param-sparks">Sparks</label>
						<input
							id="param-sparks"
							type="number"
							className="param-input"
							value={settings.explosionSparksNumberModifier}
							onChange={(e) => update('explosionSparksNumberModifier', parseIntOrDefault(e.target.value, 50))}
							disabled={isRunning}
							min={5}
							max={200}
						/>
					</div>
					<div className="param-group">
						<label htmlFor="param-maxsteps">Max Steps</label>
						<input
							id="param-maxsteps"
							type="number"
							className="param-input"
							value={settings.maxSteps}
							onChange={(e) => update('maxSteps', parseIntOrDefault(e.target.value, 100))}
							disabled={isRunning}
							min={10}
							max={1000}
						/>
					</div>
					<div className="param-group">
						<label htmlFor="param-speed">Speed (ms)</label>
						<input
							id="param-speed"
							type="number"
							className="param-input"
							value={settings.animationSpeed}
							onChange={(e) => update('animationSpeed', parseIntOrDefault(e.target.value, 0))}
							disabled={isRunning}
							min={0}
							max={2000}
							step={10}
						/>
					</div>
				</div>
			</div>
		</div>
	);
}
