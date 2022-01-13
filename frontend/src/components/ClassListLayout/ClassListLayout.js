import { experimentalStyled } from '@mui/material';
import { useState } from 'react';
import { Outlet } from 'react-router';
import { CreateClassModal } from 'src/containers/CreateClassModal';
import { requireAuth } from 'src/hooks/useAuth';
import MainNavbar from './ClassListNavbar';
import MainSidebar from './ClassListSidebar';
import { useAuth } from 'src/hooks/useAuth';

const ClassListLayoutRoot = experimentalStyled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	height: '100%',
	overflow: 'hidden',
	width: '100%'
}));

const ClassListLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
	height: '100%',
	flex: '1 1 auto',
	overflow: 'auto',
	display: 'flex'
}));

const ClassListLayout = () => {
	const [isSideBarOpen, setSideBarOpen] = useState(false);
	const [openCreateModal, setOpenCreateModal] = useState(false);
	const { user } = useAuth();
	return (
		<ClassListLayoutRoot>
			<MainNavbar
				openSideBar={() => setSideBarOpen(true)}
				onClickAddButton={() => setOpenCreateModal(true)}
				isTeacher={user.role === 'teacher'}
			/>
			<MainSidebar isSideBarOpen={isSideBarOpen} closeSideBar={() => setSideBarOpen(false)} />
			<ClassListLayoutWrapper>
				<Outlet />
				<CreateClassModal open={openCreateModal} handleClose={() => setOpenCreateModal(false)} />
			</ClassListLayoutWrapper>
		</ClassListLayoutRoot>
	);
};

export default requireAuth(ClassListLayout);
