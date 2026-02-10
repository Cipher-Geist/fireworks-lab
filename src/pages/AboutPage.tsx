export default function AboutPage() {
	return (
		<div className="about-page">
			<h1>About Fireworks Lab</h1>

			<p>
				Fireworks Lab is an interactive visualization tool for the Fireworks Algorithm (FWA), a swarm
				intelligence optimization method inspired by the explosion of fireworks. Configure algorithm parameters,
				define custom objective functions, and watch the optimization process unfold in real time.
			</p>

			<h2>Algorithm Variants</h2>

			<div className="variant-cards">
				<div className="variant-card">
					<h3>FWA 2010 &mdash; Original Fireworks Algorithm</h3>
					<p>
						The foundational algorithm using explosion sparks, Gaussian sparks, and distance-based location
						selection to maintain population diversity.
					</p>
				</div>
				<div className="variant-card">
					<h3>EFWA 2012 &mdash; Enhanced Fireworks Algorithm</h3>
					<p>
						Enhances the original with an elite strategy using polynomial fitting and root-finding to
						generate high-quality sparks. Replaces the worst firework with an elite spark when beneficial.
					</p>
				</div>
				<div className="variant-card">
					<h3>dynFWA 2014 &mdash; Dynamic Fireworks Algorithm</h3>
					<p>
						Introduces adaptive explosion amplitude for a tracked &ldquo;core firework&rdquo;. Amplifies
						successful explosions and reduces unsuccessful ones, accelerating convergence while maintaining
						exploration.
					</p>
				</div>
			</div>

			<h2>How It Works</h2>

			<p>Each firework represents a candidate solution in the search space. During each iteration:</p>
			<p>
				1. Fireworks &ldquo;explode&rdquo; to produce sparks (new candidate solutions).
				<br />
				2. Better fireworks produce more focused explosions (exploitation).
				<br />
				3. Worse fireworks produce wider explosions (exploration).
				<br />
				4. The best candidates are selected for the next iteration.
			</p>
			<p>
				The 3D surface plot shows your objective function, with firework positions and the current best solution
				(diamond marker) updated at each step.
			</p>

			<h2>Using the Solver</h2>

			<p>
				Enter any objective function of <code>x</code> and <code>y</code> in the formula input, or choose one of
				the built-in presets (Sphere, Rastrigin, Rosenbrock, Ackley, Beale, Himmelblau). Adjust the search
				bounds for each variable, select an algorithm variant, and tune the parameters:
			</p>
			<p>
				<strong>Fireworks</strong> &mdash; the number of candidate solutions maintained each iteration
				(2&ndash;20). More fireworks increase population diversity but slow convergence.
				<br />
				<strong>Sparks</strong> &mdash; controls how many explosion sparks are generated per firework
				(5&ndash;200). Higher values improve local search at the cost of computation.
				<br />
				<strong>Max Steps</strong> &mdash; the iteration limit before the solver stops (10&ndash;1000).
				<br />
				<strong>Speed</strong> &mdash; the delay in milliseconds between animation frames. Set to 0 for maximum
				speed, or increase to watch the optimization step by step.
			</p>
			<p>
				Press <strong>Solve</strong> to start the optimization. You can <strong>Stop</strong> the solver at any
				time and <strong>Reset</strong> to clear all results. Toggle <strong>Types</strong> in the visualization
				header to differentiate fireworks from sparks by marker shape, and toggle <strong>Links</strong> to draw
				lines connecting sparks to their parent firework.
			</p>

			<h2>Benchmark Functions</h2>

			<p>
				The preset functions are standard optimization benchmarks commonly used to evaluate metaheuristic
				algorithms:
			</p>
			<p>
				<strong>Sphere</strong> &mdash; a simple convex bowl with a global minimum at the origin. Useful for
				validating basic convergence.
				<br />
				<strong>Rastrigin</strong> &mdash; a highly multimodal landscape with regularly spaced local minima.
				Tests the algorithm&rsquo;s ability to escape local optima.
				<br />
				<strong>Rosenbrock</strong> &mdash; a narrow curved valley where the global minimum lies inside a long,
				parabolic flat region. Difficult for algorithms that lack fine-grained search.
				<br />
				<strong>Ackley</strong> &mdash; combines an exponential envelope with a cosine modulation, creating a
				nearly flat outer region with a deep central well.
				<br />
				<strong>Beale</strong> &mdash; a polynomial surface with sharp ridges and a single global minimum.
				<br />
				<strong>Himmelblau</strong> &mdash; notable for having four identical local minima, making it a good
				test for multi-modal search strategies.
			</p>

			<h2>Powered By</h2>
			<p>
				Built with{' '}
				<a href="https://github.com/Cipher-Geist/fireworks-ts" target="_blank" rel="noopener noreferrer">
					fireworks-ts
				</a>{' '}
				&mdash; a fully featured Fireworks Algorithm optimization library in TypeScript. The visualization uses{' '}
				<a href="https://plotly.com/javascript/" target="_blank" rel="noopener noreferrer">
					Plotly.js
				</a>{' '}
				for interactive 3D surface plots and{' '}
				<a href="https://mathjs.org/" target="_blank" rel="noopener noreferrer">
					math.js
				</a>{' '}
				for parsing user-defined formulas at runtime.
			</p>

			<h2>References</h2>
			<p>
				Tan, Y.; Zhu, Y. <em>Fireworks Algorithm for Optimization</em>. ICSI 2010.
				<br />
				Zheng, S.; Janecek, A.; Tan, Y. <em>Enhanced Fireworks Algorithm</em>. CEC 2012.
				<br />
				Zheng, S.; Tan, Y. <em>Dynamic Search in Fireworks Algorithm</em>. CEC 2014.
			</p>
		</div>
	);
}
