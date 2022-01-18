import { Navigate } from 'react-router';
import ClassLayout from 'src/components/ClassDetailLayout/ClassLayout';
import ClassListLayout from 'src/components/ClassListLayout/ClassListLayout';
import ClassFeed from 'src/components/ClassDetailLayout/ClassFeed/ClassFeed';
import ClassAssignments from 'src/components/ClassDetailLayout/ClassAssignments/ClassAssignments';
import MainLayout from './components/MainLayout';
import Profile from './components/Profile/Profile';
import ChangePassword from './components/Profile/ChangePassword';
import { ClassesPage } from './pages/Classes';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import ClassMembers from './components/ClassDetailLayout/ClassMembers/ClassMembers';
import AcceptInvitation from './components/AcceptInvitation/AcceptInvitation';
import ClassGradeEdit from './components/ClassDetailLayout/ClassGradeStructure/ClassGradeEdit';
import ClassGrade from './components/ClassDetailLayout/ClassGrades/index';
import AdminMainLayout from 'src/components/AdminLayout/MainLayout';
import { ListAdmin } from 'src/containers/admin/ListAdmin';
import { ListUser } from './containers/admin/ListUser';
import { ListClass } from './containers/admin/ListClass';
import ListAssignments from './pages/TeacherReview/ListAssignment';

const routes = [
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
				path: '/',
				element: <Navigate to={`/classes`} />
			},
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
			},
			{
				path: '/grade/structure',
				element: <ClassGradeEdit />
			},
			{
				path: '/grades',
				element: <ClassGrade />
			},
			{
				path: '/gradeReviews',
				element: <ListAssignments />
			}
		]
	},
	{ path: '/profile', element: <ClassListLayout />, children: [{ path: '/', element: <Profile /> }] },
	{ path: '/changePassword', element: <ClassListLayout />, children: [{ path: '/', element: <ChangePassword /> }] },
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

	{ path: '/acceptInvite/:id', element: <AcceptInvitation /> }
];

const adminRoutes = [
	{
		path: '/',
		element: <AdminMainLayout />,
		children: [
			{
				path: '/manage-admins',
				element: <ListAdmin />
			},
			{
				path: '/manage-users',
				element: <ListUser />
			},
			{
				path: '/manage-classes',
				element: <ListClass />
			},
			{ path: '/', element: <Navigate to="/manage-admins" /> },

		]
	}
];

export const getRoutes = (role) => {
	switch (role) {
		case 'admin':
			return adminRoutes;
		default:
			return routes;
	}
};
