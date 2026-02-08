import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme, ThemeName } from '../hooks/useTheme';

const themes: { name: ThemeName; label: string }[] = [
	{ name: 'neon', label: 'N' },
	{ name: 'synthwave', label: 'S' },
	{ name: 'terminal', label: 'T' },
];

export default function Header() {
	const { theme, setTheme } = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);

	return (
		<header className="header">
			<div className="header-inner">
				<NavLink to="/" className="header-brand">
					<svg viewBox="0 0 32 32" fill="none">
						<circle cx="16" cy="16" r="3" fill="currentColor" />
						<line x1="16" y1="4" x2="16" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="16" y1="22" x2="16" y2="28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="4" y1="16" x2="10" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="22" y1="16" x2="28" y2="16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="7.5" y1="7.5" x2="11.7" y2="11.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="20.3" y1="20.3" x2="24.5" y2="24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="24.5" y1="7.5" x2="20.3" y2="11.7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
						<line x1="11.7" y1="20.3" x2="7.5" y2="24.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
					</svg>
					fireworks-lab
				</NavLink>
				<button
					className="burger-btn"
					onClick={() => setMenuOpen((v) => !v)}
					aria-label="Toggle menu"
				>
					<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
						<line x1="3" y1="6" x2="21" y2="6" />
						<line x1="3" y1="12" x2="21" y2="12" />
						<line x1="3" y1="18" x2="21" y2="18" />
					</svg>
				</button>
				<div className={`header-nav${menuOpen ? ' open' : ''}`}>
					<NavLink to="/" end onClick={() => setMenuOpen(false)}>Solver</NavLink>
					<NavLink to="/about" onClick={() => setMenuOpen(false)}>About</NavLink>
					<div className="theme-toggle">
						{themes.map((t) => (
							<button
								key={t.name}
								className={theme === t.name ? 'active' : ''}
								onClick={() => setTheme(t.name)}
								title={t.name}
							>
								{t.label}
							</button>
						))}
					</div>
				</div>
			</div>
		</header>
	);
}
