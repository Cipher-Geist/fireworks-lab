import { useState, useEffect, useCallback, useContext, createContext } from 'react';

export type ThemeName = 'neon' | 'synthwave' | 'terminal';

interface ThemeContextValue {
	theme: ThemeName;
	setTheme: (t: ThemeName) => void;
}

export const ThemeContext = createContext<ThemeContextValue>({
	theme: 'neon',
	setTheme: () => {},
});

export function useThemeProvider() {
	const [theme, setThemeState] = useState<ThemeName>(() => {
		return (localStorage.getItem('fireworks-lab-theme') as ThemeName) || 'neon';
	});

	useEffect(() => {
		document.documentElement.setAttribute('data-theme', theme);
		localStorage.setItem('fireworks-lab-theme', theme);
	}, [theme]);

	const setTheme = useCallback((t: ThemeName) => {
		setThemeState(t);
	}, []);

	return { theme, setTheme };
}

export function useTheme() {
	return useContext(ThemeContext);
}
