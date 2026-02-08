import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import SolverPage from './pages/SolverPage';
import AboutPage from './pages/AboutPage';
import { ThemeContext, useThemeProvider } from './hooks/useTheme';

function App() {
	const themeValue = useThemeProvider();

	return (
		<ThemeContext.Provider value={themeValue}>
			<div className="app">
				<Header />
				<main className="main-content">
					<Routes>
						<Route path="/" element={<SolverPage />} />
						<Route path="/about" element={<AboutPage />} />
					</Routes>
				</main>
			</div>
		</ThemeContext.Provider>
	);
}

export default App;
