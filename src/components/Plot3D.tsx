import { useRef, useEffect, useMemo } from 'react';
import Plotly from 'plotly.js-dist-min';
import type { ThemeName } from '../hooks/useTheme';

export interface FireworkPoint {
	x: number;
	y: number;
	z: number;
	type?: string;
	parentX?: number;
	parentY?: number;
	parentZ?: number;
}

interface PlotColors {
	colorscale: [number, string][];
	background: string;
	grid: string;
	zeroline: string;
	axis: string;
	firework: string;
	fireworkLine: string;
	spark: string;
	sparkLine: string;
	best: string;
	bestLine: string;
	trail: string;
	link: string;
}

const PLOT_THEMES: Record<ThemeName, PlotColors> = {
	neon: {
		colorscale: [
			[0, '#0a0a12'],
			[0.15, '#102030'],
			[0.3, '#1a4050'],
			[0.5, '#207068'],
			[0.7, '#30a08a'],
			[0.85, '#50d0aa'],
			[1, '#00ffd5'],
		],
		background: '#08081a',
		grid: '#1a1a40',
		zeroline: '#2a2a60',
		axis: '#6a6a8a',
		firework: '#ff2d75',
		fireworkLine: '#ff6e9e',
		spark: '#ffb800',
		sparkLine: '#ffd060',
		best: '#00ffd5',
		bestLine: '#ffffff',
		trail: 'rgba(255, 255, 255, 0.15)',
		link: 'rgba(255, 184, 0, 0.4)',
	},
	synthwave: {
		colorscale: [
			[0, '#0f0728'],
			[0.12, '#2a0845'],
			[0.28, '#6b1d6e'],
			[0.45, '#b02a8f'],
			[0.62, '#e04e75'],
			[0.8, '#ff8c5a'],
			[1, '#ffcf48'],
		],
		background: '#0a0520',
		grid: '#2a1050',
		zeroline: '#3a2070',
		axis: '#7755aa',
		firework: '#ffb86c',
		fireworkLine: '#ffcf90',
		spark: '#50fa7b',
		sparkLine: '#80ffaa',
		best: '#ff6ec7',
		bestLine: '#ffffff',
		trail: 'rgba(189, 147, 249, 0.2)',
		link: 'rgba(80, 250, 123, 0.4)',
	},
	terminal: {
		colorscale: [
			[0, '#000000'],
			[0.15, '#001a00'],
			[0.3, '#003300'],
			[0.5, '#006600'],
			[0.7, '#009900'],
			[0.85, '#00cc00'],
			[1, '#00ff41'],
		],
		background: '#000000',
		grid: '#0a1a0a',
		zeroline: '#1a3a1a',
		axis: '#008822',
		firework: '#ffff00',
		fireworkLine: '#ffff66',
		spark: '#00ffff',
		sparkLine: '#66ffff',
		best: '#00ff41',
		bestLine: '#ffffff',
		trail: 'rgba(0, 255, 65, 0.15)',
		link: 'rgba(0, 255, 255, 0.4)',
	},
};

interface Props {
	surfaceData: { x: number[]; y: number[]; z: number[][] } | null;
	fireworkPositions: FireworkPoint[];
	bestPosition: FireworkPoint | null;
	trailPositions: FireworkPoint[];
	theme: ThemeName;
	showTypes: boolean;
	showLinks: boolean;
}

export default function Plot3D({ surfaceData, fireworkPositions, bestPosition, trailPositions, theme, showTypes, showLinks }: Props) {
	const plotRef = useRef<HTMLDivElement>(null);
	const cameraRef = useRef<any>(null);
	const initializedRef = useRef(false);

	// Cleanup on unmount
	useEffect(() => {
		const el = plotRef.current;
		return () => {
			if (el) Plotly.purge(el);
		};
	}, []);

	const colors = PLOT_THEMES[theme];

	const plotData = useMemo(() => {
		const traces: any[] = [];

		if (surfaceData) {
			traces.push({
				type: 'surface',
				x: surfaceData.x,
				y: surfaceData.y,
				z: surfaceData.z,
				colorscale: colors.colorscale,
				opacity: 0.85,
				showscale: false,
				contours: {
					z: { show: true, usecolormap: true, highlightcolor: '#ffffff', project: { z: false } },
				},
				hoverinfo: 'x+y+z',
				lighting: {
					ambient: 0.6,
					diffuse: 0.5,
					specular: 0.3,
					roughness: 0.5,
				},
			});
		}

		if (trailPositions.length > 0) {
			traces.push({
				type: 'scatter3d',
				x: trailPositions.map((p) => p.x),
				y: trailPositions.map((p) => p.y),
				z: trailPositions.map((p) => p.z),
				mode: 'markers',
				marker: { size: 2, color: colors.trail },
				hoverinfo: 'skip',
				showlegend: false,
			});
		}

		if (fireworkPositions.length > 0) {
			if (showTypes) {
				// Split by type: "Initial" = fireworks, everything else = sparks
				const fireworks = fireworkPositions.filter((p) => p.type === 'Initial');
				const sparks = fireworkPositions.filter((p) => p.type !== 'Initial');

				if (fireworks.length > 0) {
					traces.push({
						type: 'scatter3d',
						x: fireworks.map((p) => p.x),
						y: fireworks.map((p) => p.y),
						z: fireworks.map((p) => p.z),
						mode: 'markers',
						marker: {
							size: 9,
							color: colors.best,
							symbol: 'circle',
							line: { width: 2, color: colors.bestLine },
						},
						name: 'Fireworks',
						hoverinfo: 'x+y+z',
					});
				}

				if (sparks.length > 0) {
					traces.push({
						type: 'scatter3d',
						x: sparks.map((p) => p.x),
						y: sparks.map((p) => p.y),
						z: sparks.map((p) => p.z),
						mode: 'markers',
						marker: {
							size: 4,
							color: colors.spark,
							symbol: 'circle',
							line: { width: 1, color: colors.sparkLine },
						},
						name: 'Sparks',
						hoverinfo: 'x+y+z',
					});
				}
			} else {
				// Default: all as one trace
				traces.push({
					type: 'scatter3d',
					x: fireworkPositions.map((p) => p.x),
					y: fireworkPositions.map((p) => p.y),
					z: fireworkPositions.map((p) => p.z),
					mode: 'markers',
					marker: {
						size: 5,
						color: colors.firework,
						line: { width: 1, color: colors.fireworkLine },
					},
					name: 'Fireworks',
					hoverinfo: 'x+y+z',
				});
			}

			// Parent-child link lines
			if (showLinks) {
				const lx: (number | null)[] = [];
				const ly: (number | null)[] = [];
				const lz: (number | null)[] = [];

				for (const p of fireworkPositions) {
					if (p.parentX !== undefined && p.parentY !== undefined && p.parentZ !== undefined) {
						lx.push(p.parentX, p.x, null);
						ly.push(p.parentY, p.y, null);
						lz.push(p.parentZ, p.z, null);
					}
				}

				if (lx.length > 0) {
					traces.push({
						type: 'scatter3d',
						x: lx,
						y: ly,
						z: lz,
						mode: 'lines',
						line: {
							color: colors.link,
							width: 2,
						},
						hoverinfo: 'skip',
						showlegend: false,
					});
				}
			}
		}

		if (bestPosition) {
			traces.push({
				type: 'scatter3d',
				x: [bestPosition.x],
				y: [bestPosition.y],
				z: [bestPosition.z],
				mode: 'markers',
				marker: {
					size: 6,
					color: colors.best,
					symbol: 'diamond',
					line: { width: 2, color: colors.bestLine },
				},
				name: 'Best',
				hoverinfo: 'x+y+z',
			});
		}

		return traces;
	}, [surfaceData, fireworkPositions, bestPosition, trailPositions, colors, showTypes, showLinks]);

	useEffect(() => {
		if (!plotRef.current) return;

		const axisStyle = {
			gridcolor: colors.grid,
			zerolinecolor: colors.zeroline,
			showbackground: true,
			backgroundcolor: colors.background,
			color: colors.axis,
		};

		const layout = {
			autosize: true,
			height: 500,
			margin: { l: 0, r: 0, t: 0, b: 0 },
			paper_bgcolor: 'rgba(0,0,0,0)',
			plot_bgcolor: 'rgba(0,0,0,0)',
			uirevision: 'preserve',
			scene: {
				xaxis: axisStyle,
				yaxis: axisStyle,
				zaxis: axisStyle,
				camera: cameraRef.current || { eye: { x: 1.5, y: 1.5, z: 1.2 } },
			},
			showlegend: false,
		};

		const config = {
			responsive: true,
			displayModeBar: true,
			displaylogo: false,
			modeBarButtonsToRemove: ['toImage', 'sendDataToCloud'] as any[],
		};

		Plotly.react(plotRef.current, plotData, layout, config);

		if (!initializedRef.current) {
			initializedRef.current = true;
			(plotRef.current as any).on('plotly_relayout', (data: any) => {
				if (data['scene.camera']) {
					cameraRef.current = data['scene.camera'];
				}
			});
		}
	}, [plotData, colors]);

	return <div ref={plotRef} className="plot-container" />;
}
