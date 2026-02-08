import { useState, useCallback, useRef } from 'react';
import {
	Problem,
	ProblemTarget,
	Dimension,
	Interval,
	FireworksAlgorithm,
	FireworksAlgorithm2012,
	DynamicFireworksAlgorithm,
	FireworksAlgorithmSettings,
	FireworksAlgorithmSettings2012,
	DynamicFireworksAlgorithmSettings,
	StepCounterStopCondition,
	Randomizer,
	RandomizerType,
	FireworkType,
} from 'fireworks-ts';
import type { AlgorithmStateEventArgs } from 'fireworks-ts';
import { compile } from 'mathjs';

export type AlgorithmVariant = 'fwa' | 'efwa' | 'dynfwa';

export interface FireworkPoint {
	x: number;
	y: number;
	z: number;
	type?: string;
	parentX?: number;
	parentY?: number;
	parentZ?: number;
}

export interface SolverSettings {
	variant: AlgorithmVariant;
	locationsNumber: number;
	explosionSparksNumberModifier: number;
	maxSteps: number;
	animationSpeed: number;
}

export interface SolverState {
	isRunning: boolean;
	currentStep: number;
	totalSteps: number;
	fireworkPositions: FireworkPoint[];
	bestPosition: FireworkPoint | null;
	bestQuality: number | null;
	trailPositions: FireworkPoint[];
	error: string | null;
}

const DEFAULT_STATE: SolverState = {
	isRunning: false,
	currentStep: 0,
	totalSteps: 0,
	fireworkPositions: [],
	bestPosition: null,
	bestQuality: null,
	trailPositions: [],
	error: null,
};

export function useSolver() {
	const [state, setState] = useState<SolverState>(DEFAULT_STATE);
	const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const stoppedRef = useRef(false);

	const stop = useCallback(() => {
		stoppedRef.current = true;
		if (timerRef.current) {
			clearTimeout(timerRef.current);
			timerRef.current = null;
		}
		setState((prev) => ({ ...prev, isRunning: false }));
	}, []);

	const reset = useCallback(() => {
		stop();
		setState(DEFAULT_STATE);
	}, [stop]);

	const solve = useCallback(
		(
			formulaStr: string,
			xRange: [number, number],
			yRange: [number, number],
			settings: SolverSettings
		) => {
			stop();
			stoppedRef.current = false;

			try {
				const code = compile(formulaStr);
				const evalFn = (x: number, y: number): number => code.evaluate({ x, y });

				const dimX = new Dimension(new Interval(xRange[0], xRange[1]));
				const dimY = new Dimension(new Interval(yRange[0], yRange[1]));
				const initialRanges = new Map<Dimension, Interval>([
					[dimX, new Interval(xRange[0], xRange[1])],
					[dimY, new Interval(yRange[0], yRange[1])],
				]);

				const targetFunction = (coords: Map<Dimension, number>): number => {
					const x = coords.get(dimX)!;
					const y = coords.get(dimY)!;
					return evalFn(x, y);
				};

				const problem = new Problem(
					[dimX, dimY],
					initialRanges,
					targetFunction,
					ProblemTarget.Minimum
				);
				const stopCondition = new StepCounterStopCondition(settings.maxSteps);
				const randomizer = new Randomizer(RandomizerType.MersenneTwister);

				// Cap specificSparksNumber to locationsNumber to prevent
				// nextUniqueInt32s from throwing when range is too small
				const specificSparksNumber = Math.min(5, settings.locationsNumber);

				let algorithm: any;

				if (settings.variant === 'fwa') {
					const s = new FireworksAlgorithmSettings();
					s.locationsNumber = settings.locationsNumber;
					s.explosionSparksNumberModifier = settings.explosionSparksNumberModifier;
					s.explosionSparksNumberLowerBound = 0.04;
					s.explosionSparksNumberUpperBound = 0.8;
					s.explosionSparksMaximumAmplitude = 40;
					s.specificSparksNumber = specificSparksNumber;
					s.specificSparksPerExplosionNumber = 1;
					algorithm = new FireworksAlgorithm(problem, stopCondition, randomizer, s);
				} else if (settings.variant === 'efwa') {
					const s = new FireworksAlgorithmSettings2012();
					s.locationsNumber = settings.locationsNumber;
					s.explosionSparksNumberModifier = settings.explosionSparksNumberModifier;
					s.explosionSparksNumberLowerBound = 0.04;
					s.explosionSparksNumberUpperBound = 0.8;
					s.explosionSparksMaximumAmplitude = 40;
					s.specificSparksNumber = specificSparksNumber;
					s.specificSparksPerExplosionNumber = 1;
					s.functionOrder = 2;
					s.samplingNumber = Math.max(settings.locationsNumber, 10);
					algorithm = new FireworksAlgorithm2012(problem, stopCondition, randomizer, s);
				} else {
					const s = new DynamicFireworksAlgorithmSettings();
					s.locationsNumber = settings.locationsNumber;
					s.explosionSparksNumberModifier = settings.explosionSparksNumberModifier;
					s.explosionSparksNumberLowerBound = 0.04;
					s.explosionSparksNumberUpperBound = 0.8;
					s.explosionSparksMaximumAmplitude = 40;
					s.specificSparksNumber = specificSparksNumber;
					s.specificSparksPerExplosionNumber = 1;
					s.functionOrder = 2;
					s.samplingNumber = Math.max(settings.locationsNumber, 10);
					s.amplificationCoefficent = 1.2;
					s.reductionCoefficent = 0.9;
					algorithm = new DynamicFireworksAlgorithm(problem, stopCondition, randomizer, s);
				}

				let trail: FireworkPoint[] = [];

				algorithm.addStepCompletedListener((args: AlgorithmStateEventArgs) => {
					const fireworks = args.state.fireworks;
					const positions: FireworkPoint[] = fireworks.map((fw: any) => {
						const point: FireworkPoint = {
							x: fw.coordinates.get(dimX) ?? 0,
							y: fw.coordinates.get(dimY) ?? 0,
							z: fw.quality ?? 0,
							type: fw.fireworkType ?? FireworkType.Initial,
						};
						if (fw.parentFirework) {
							point.parentX = fw.parentFirework.coordinates.get(dimX) ?? 0;
							point.parentY = fw.parentFirework.coordinates.get(dimY) ?? 0;
							point.parentZ = fw.parentFirework.quality ?? 0;
						}
						return point;
					});

					const best = args.state.bestSolution;
					const bestPos: FireworkPoint = {
						x: best.coordinates.get(dimX) ?? 0,
						y: best.coordinates.get(dimY) ?? 0,
						z: best.quality ?? 0,
					};

					trail = [...trail, ...positions];

					setState((prev) => ({
						...prev,
						currentStep: args.state.stepNumber,
						fireworkPositions: positions,
						bestPosition: bestPos,
						bestQuality: best.quality,
						trailPositions: trail,
					}));
				});

				algorithm.initialize();

				setState({
					isRunning: true,
					currentStep: 0,
					totalSteps: settings.maxSteps,
					fireworkPositions: [],
					bestPosition: null,
					bestQuality: null,
					trailPositions: [],
					error: null,
				});

				const runStep = () => {
					if (stoppedRef.current) return;
					try {
						if (!algorithm.shouldStop()) {
							algorithm.makeStep();
							timerRef.current = setTimeout(runStep, settings.animationSpeed);
						} else {
							setState((prev) => ({ ...prev, isRunning: false }));
						}
					} catch (err: any) {
						setState((prev) => ({
							...prev,
							isRunning: false,
							error: `Algorithm error: ${err.message || err}`,
						}));
					}
				};

				timerRef.current = setTimeout(runStep, settings.animationSpeed);
			} catch (err: any) {
				setState((prev) => ({
					...prev,
					isRunning: false,
					error: `Initialization error: ${err.message || err}`,
				}));
			}
		},
		[stop]
	);

	return { ...state, solve, stop, reset };
}
