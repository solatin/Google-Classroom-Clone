import { Navigate } from 'react-router';
import ClassLayout from 'src/components/ClassDetailLayout/ClassLayout';
import ClassListLayout from 'src/components/ClassListLayout/ClassListLayout';
import MainLayout from './components/MainLayout';
import { ClassesPage } from './pages/Classes';

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
				element: <div>feed</div>
			},
			{
				path: '/assignments',
				element: <div>assignments</div>
			},
			{
				path: '/members',
				element: <div>members</div>
			}
		]
	},
	{ path: '/profile', element: <ClassListLayout />, children: [{path: '/', element: <div>profile</div>}] },
	{
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <div>login</div> },
      { path: 'register', element: <div>register</div> },
      { path: '404', element: <div>not found</div> },
      { path: '/', element: <Navigate to="/classes" /> },
      { path: '*', element: <Navigate to="/404" replace/> }
    ]
  }
];
