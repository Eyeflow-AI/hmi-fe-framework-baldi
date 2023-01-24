import { Navigate, Outlet } from 'react-router-dom';
import {
  Login,
  // Monitor,
} from './pages';

const defaultAppURL = "/app/batch";

function NotFound() {
  return (
    <>
      404: Not Found
    </>
  )
};

const routes = ({authenticated, hasUserManagementPermission, hasCaptureImagesPermission}) => [
  // {
  //   path: '/app',
  //   element: authenticated ? <Outlet /> : <Navigate to="/login" />,
  //   children: [
  //     { path: '/app/monitor', element: <Monitor /> },
  //     { path: '/app/batch', element: <IHM /> },
  //     { path: '/app/dashboard', element: <Dashboard /> },
  //     { path: '/app/search', element: <Search /> },
  //     { path: '/app/get-images', element: hasCaptureImagesPermission ? <GetImages /> : <Navigate to={defaultAppURL} />},
  //     { path: '/app/user-management', element: hasUserManagementPermission ? <UserManagement /> : <Navigate to={defaultAppURL} />},
  //     { path: '/app/user-settings', element: <UserSettings /> },
  //     { path: '/app', element: <Navigate to={defaultAppURL} /> },
  //   ],
  // },
  {
    path: '/',
    element: !authenticated ? <Outlet /> : <Navigate to={defaultAppURL} />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/', element: <Navigate to="/login" /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;