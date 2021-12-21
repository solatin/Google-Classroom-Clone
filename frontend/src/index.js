import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import 'react-app-polyfill/ie11';
import { SnackbarProvider } from 'notistack';
import Slide from '@material-ui/core/Slide';
import store, { persistor } from './reducers/store';

import App from './App';

const LoadingOverlay = () => <div>Loading</div>;

const anchorOrigin = {
	vertical: 'bottom',
	horizontal: 'left'
};

const style = {
	marginBottom: 4
};

const Root = () => {
	console.log('Root');

	return (
		<StrictMode>
			<Provider store={store}>
				<PersistGate persistor={persistor} loading={<LoadingOverlay />}>
					<SnackbarProvider anchorOrigin={anchorOrigin} TransitionComponent={Slide} maxSnack={3} style={style}>
						<BrowserRouter>
							<App />
						</BrowserRouter>
					</SnackbarProvider>
				</PersistGate>
			</Provider>
		</StrictMode>
	);
};

ReactDOM.render(<Root />, document.getElementById('root'));
