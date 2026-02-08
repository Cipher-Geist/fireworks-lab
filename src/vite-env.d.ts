/// <reference types="vite/client" />

declare module 'plotly.js-dist-min' {
	const Plotly: {
		react(el: HTMLDivElement, data: any[], layout?: any, config?: any): Promise<any>;
		purge(el: HTMLDivElement): void;
		newPlot(el: HTMLDivElement, data: any[], layout?: any, config?: any): Promise<any>;
	};
	export default Plotly;
}
