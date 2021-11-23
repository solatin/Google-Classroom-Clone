import { Navigate } from 'react-router';
import ClassLayout from 'src/components/ClassDetailLayout/ClassLayout';
import ClassListLayout from 'src/components/ClassListLayout/ClassListLayout';
import ClassFeed from 'src/components/ClassDetailLayout/ClassFeed/ClassFeed';
import ClassAssignments from 'src/components/ClassDetailLayout/ClassAssignments/ClassAssignments';
import MainLayout from './components/MainLayout';
import { ClassesPage } from './pages/Classes';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import ClassMembers from './components/ClassDetailLayout/ClassMembers/ClassMembers';

export const routes = [
	{
		path: '/classes',
		element: <ClassListLayout />,
		children: [
			{
				path: '/',
				element: <ClassesPage />
			}
		]
	},
	{
		path: '/class-details/:id',
		element: <ClassLayout />,
		children: [
			{
				path: '/feed',
				element: <ClassFeed />
			},
			{
				path: '/assignments',
				element: <ClassAssignments />
			},
			{
				path: '/members',
				element: <ClassMembers />
			}
		]
	},
	{ path: '/profile', element: <ClassListLayout />, children: [{ path: '/', element: <div>profile</div> }] },
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{ path: 'login', element: <Login /> },
			{ path: 'register', element: <Register /> },
			{ path: '404', element: <div>not found</div> },
			{ path: '/', element: <Navigate to="/classes" /> },
			{ path: '*', element: <Navigate to="/404" replace /> }
		]
	},
	{ path: '/acceptInvite/:id/:email', element: <div></div> }
];
