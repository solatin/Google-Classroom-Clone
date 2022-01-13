import { experimentalStyled } from '@mui/material';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router';
import { requireAuth } from 'src/hooks/useAuth';
import ClassNavbar from './ClassNavbar';
import ClassSidebar from './ClassSidebar';
import { useAuth } from 'src/hooks/useAuth';

const ClassLayoutRoot = experimentalStyled('div')(({ theme }) => ({
	backgroundColor: theme.palette.background.default,
	height: '100%',
	overflow: 'hidden',
	width: '100%'
}));

const ClassLayoutWrapper = experimentalStyled('div')(({ theme }) => ({
	height: '100%',
	flex: '1 1 auto',
	overflow: 'auto',
	display: 'flex'
}));

const ClassLayout = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { pathname } = useLocation();
	const [isSideBarOpen, setSideBarOpen] = useState(false);
	const tab = useMemo(() => pathname.split('/').at(-1), [pathname]);
	const onClickTab = useCallback((newTab) => navigate(`/class-details/${id}/${newTab}`), [navigate, id]);
	const { user } = useAuth();
	useEffect(() => {
		if (tab === 'grades' && user.role !== 'teacher') {
			navigate(`/class-details/${id}/feed`);
		}
		if (tab === 'assignments' && user.role !== 'student') {
			navigate(`/class-details/${id}/feed`);
		}
	}, [tab, user]);
	console.log(user);
	return (
		<ClassLayoutRoot>
			<ClassNavbar
				openSideBar={() => setSideBarOpen(true)}
				onClickTab={onClickTab}
				tab={tab}
				isTeacher={user.role === 'teacher'}
			/>
			<ClassSidebar isSideBarOpen={isSideBarOpen} closeSideBar={() => setSideBarOpen(false)} />
			<ClassLayoutWrapper>
				<Outlet />
			</ClassLayoutWrapper>
		</ClassLayoutRoot>
	);
};

export default requireAuth(ClassLayout);
