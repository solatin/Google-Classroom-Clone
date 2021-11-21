import { experimentalStyled } from '@mui/material';
import { Outlet } from 'react-router';

const MainLayoutRoot = experimentalStyled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	height: '100%',
	overflow: 'hidden',
	width: '100%'
}));

const MainLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
	height: '100%',
	flex: '1 1 auto',
	overflow: 'auto',
	display: 'flex'
}));

const MainLayout = () => {

	return (
		<MainLayoutRoot>
			<MainLayoutWrapper>
				<Outlet />
			</MainLayoutWrapper>
		</MainLayoutRoot>
	);
};

export default MainLayout;