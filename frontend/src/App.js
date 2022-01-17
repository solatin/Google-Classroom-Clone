import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { getRoutes, routes } from './routes';
import theme from 'src/theme';
import { useAuth } from './hooks/useAuth';

function App() {
	const { user } = useAuth();
	const routing = useRoutes(getRoutes(user?.role));
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{routing}
		</ThemeProvider>
	);
}

export default App;
