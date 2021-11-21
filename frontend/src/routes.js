import MainLayout from 'src/components/MainLayout';
import { ClassesPage } from './pages/Classes';

export const routes = [
	{
		path: '/',
		element: <MainLayout />,
		children: [
			{
				path: '/',
				element: <ClassesPage />
			}
		]
	}
];
