export default function AboutPage() {
	return (
		<div className="about-page">
			<h1>About Fireworks Lab</h1>

			<p>
				Fireworks Lab is an interactive visualization tool for the Fireworks Algorithm (FWA),
				a swarm intelligence optimization method inspired by the explosion of fireworks.
				Configure algorithm parameters, define custom objective functions, and watch the
				optimization process unfold in real time.
			</p>

			<h2>Algorithm Variants</h2>

			<div className="variant-cards">
				<div className="variant-card">
					<h3>FWA 2010 &mdash; Original Fireworks Algorithm</h3>
					<p>
						The foundational algorithm using explosion sparks, Gaussian sparks, and
						distance-based location selection to maintain population diversity.
					</p>
				</div>
				<div className="variant-card">
					<h3>EFWA 2012 &mdash; Enhanced Fireworks Algorithm</h3>
					<p>
						Enhances the original with an elite strategy using polynomial fitting and
						root-finding to generate high-quality sparks. Replaces the worst firework
						with an elite spark when beneficial.
					</p>
				</div>
				<div className="variant-card">
					<h3>dynFWA 2014 &mdash; Dynamic Fireworks Algorithm</h3>
					<p>
						Introduces adaptive explosion amplitude for a tracked &ldquo;core firework&rdquo;.
						Amplifies successful explosions and reduces unsuccessful ones, accelerating
						convergence while maintaining exploration.
					</p>
				</div>
			</div>

			<h2>How It Works</h2>

			<p>
				Each firework represents a candidate solution in the search space. During each iteration:
			</p>
			<p>
				1. Fireworks &ldquo;explode&rdquo; to produce sparks (new candidate solutions).<br />
				2. Better fireworks produce more focused explosions (exploitation).<br />
				3. Worse fireworks produce wider explosions (exploration).<br />
				4. The best candidates are selected for the next iteration.
			</p>
			<p>
				The 3D surface plot shows your objective function, with firework positions (pink dots)
				and the current best solution (cyan diamond) updated at each step.
			</p>

			<h2>Powered By</h2>
			<p>
				Built with <a href="https://github.com/Cipher-Geist/fireworks-ts" target="_blank" rel="noopener noreferrer">fireworks-ts</a> &mdash;
				a fully featured Fireworks Algorithm optimization library in TypeScript.
			</p>

			<h2>References</h2>
			<p>
				Tan, Y.; Zhu, Y. <em>Fireworks Algorithm for Optimization</em>. ICSI 2010.<br />
				Zheng, S.; Janecek, A.; Tan, Y. <em>Enhanced Fireworks Algorithm</em>. CEC 2012.<br />
				Zheng, S.; Tan, Y. <em>Dynamic Search in Fireworks Algorithm</em>. CEC 2014.
			</p>
		</div>
	);
}
