import { experimentalStyled } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { CreateClassModal } from 'src/containers/CreateClassModal';
import { requireAuth } from 'src/hooks/useAuth';
import MainNavbar from './MainNavbar';
import MainSidebar from './MainSidebar';

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
	const [isSideBarOpen, setSideBarOpen] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(false);

	return (
		<MainLayoutRoot>
			<MainNavbar openSideBar={() => setSideBarOpen(true)} onClickAddButton={() => setOpenCreateModal(true)}/>
			<MainSidebar isSideBarOpen={isSideBarOpen} closeSideBar={() => setSideBarOpen(false)} />
			<MainLayoutWrapper>
				<Outlet />
				<CreateClassModal
					open={openCreateModal}
					handleClose={() => setOpenCreateModal(false)}
				/>
			</MainLayoutWrapper>
		</MainLayoutRoot>
	);
};

export default requireAuth(MainLayout);