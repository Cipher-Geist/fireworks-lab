import { useState } from 'react';

interface Props {
	currentStep: number;
	totalSteps: number;
	bestQuality: number | null;
	bestPosition: { x: number; y: number; z: number } | null;
	isRunning: boolean;
	onSolve: () => void;
	onStop: () => void;
	onReset: () => void;
	disabled: boolean;
	error: string | null;
}

export default function ResultsPanel({
	currentStep,
	totalSteps,
	bestQuality,
	bestPosition,
	isRunning,
	onSolve,
	onStop,
	onReset,
	disabled,
	error,
}: Props) {
	const [collapsed, setCollapsed] = useState(false);
	const progress = totalSteps > 0 ? (currentStep / totalSteps) * 100 : 0;

	return (
		<div className={`card card-collapsible${collapsed ? ' collapsed' : ''}`}>
			<div className="card-header" onClick={() => setCollapsed((v) => !v)}>
				Results
				<span className="collapse-chevron" />
			</div>
			<div className="card-body">
				<div className="results-stats">
					<div className="stat-item">
						<div className="stat-value">
							{currentStep} / {totalSteps || '—'}
						</div>
						<div className="stat-label">Step</div>
					</div>
					<div className="stat-item">
						<div className="stat-value">{bestQuality !== null ? bestQuality.toExponential(4) : '—'}</div>
						<div className="stat-label">Best Quality</div>
					</div>
					<div className="stat-item stat-item-wide">
						<div className="stat-value">
							{bestPosition ? `(${bestPosition.x.toFixed(3)}, ${bestPosition.y.toFixed(3)})` : '(—, —)'}
						</div>
						<div className="stat-label">Best Position</div>
					</div>
				</div>

				<div className="progress-bar">
					<div className="progress-fill" style={{ '--progress': `${progress}%` } as React.CSSProperties} />
				</div>

				{error && <div className="solver-error">{error}</div>}

				<div className="btn-group">
					{!isRunning ? (
						<button className="btn btn-primary" onClick={onSolve} disabled={disabled}>
							Solve
						</button>
					) : (
						<button className="btn btn-danger" onClick={onStop}>
							Stop
						</button>
					)}
					<button className="btn btn-secondary" onClick={onReset} disabled={isRunning}>
						Reset
					</button>
				</div>
			</div>
		</div>
	);
}
