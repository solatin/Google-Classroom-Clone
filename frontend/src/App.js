import { useRoutes } from 'react-router-dom';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { routes } from './routes';
import theme from 'src/theme';

function App() {
	const routing = useRoutes(routes);
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{routing}
		</ThemeProvider>
	);
}

export default App;
