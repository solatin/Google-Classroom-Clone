import { experimentalStyled } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { requireAuth, useAuth } from 'src/hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const LayoutRoot = experimentalStyled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	height: '100%',
	overflow: 'hidden',
	width: '100%'
}));

const LayoutWrapper = experimentalStyled('div')(({ theme }) => ({
	height: '100%',
	flex: '1 1 auto',
	overflow: 'auto',
	display: 'flex'
}));

const AdminMainLayout = () => {
	const navigate = useNavigate();
	const { pathname } = useLocation();
	const [isSideBarOpen, setSideBarOpen] = useState(false);
	const tab = useMemo(() => pathname.split('/').at(-1), [pathname]);
	const onClickTab = useCallback((newTab) => navigate(`/${newTab}`), []);

	return (
		<LayoutRoot>
			<Navbar
				openSideBar={() => setSideBarOpen(true)}
				onClickTab={onClickTab}
				tab={tab}
			/>
			<Sidebar isSideBarOpen={isSideBarOpen} closeSideBar={() => setSideBarOpen(false)} />
			<LayoutWrapper>
				<Outlet />
			</LayoutWrapper>
		</LayoutRoot>
	);
};

export default requireAuth(AdminMainLayout);
