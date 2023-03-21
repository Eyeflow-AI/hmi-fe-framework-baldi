import React, {useMemo} from 'react';

import { Navigate, Outlet } from 'react-router-dom';
import { Login, Monitor1, MonitorBatch, Dashboard } from './pages';

const defaultAppURL = "/app/monitor";

function NotFound() {
  return (
    <>
      404: Not Found
    </>
  )
};


const components = {
  Monitor1: () => <Monitor1 />,
  MonitorBatch: () => <MonitorBatch />,
  Dashboard: () => <Dashboard />,
};

export default function Routes ({authenticated, hasUserManagementPermission, hasCaptureImagesPermission}) {

  return useMemo(() => {
    let appRoutes = [];
    for (let [key, value] of Object.entries(window.app_config.pages)) {
      let aclCondition = true; //TODO
      if (value.active && aclCondition && value.path.startsWith("/app")) {
        console.log(`Loading page: ${value.id}`);
        appRoutes.push({
          path: value.path,
          element: components[value.id]()
        })
      };
    };
    appRoutes.push({ path: '/app', element: <Navigate to={defaultAppURL} /> });

    return [
      {
        path: '/app',
        element: authenticated ? <Outlet /> : <Navigate to="/login" />,
        children: appRoutes
        // [
        //   { path: '/app/monitor', element: <Monitor1 /> },
        //   { path: '/app/dashboard', element: <Dashboard /> },
          // { path: '/app/batch', element: <IHM /> },
          // { path: '/app/search', element: <Search /> },
          // { path: '/app/get-images', element: hasCaptureImagesPermission ? <GetImages /> : <Navigate to={defaultAppURL} />},
          // { path: '/app/user-management', element: hasUserManagementPermission ? <UserManagement /> : <Navigate to={defaultAppURL} />},
          // { path: '/app/user-settings', element: <UserSettings /> },
          // { path: '/app', element: <Navigate to={defaultAppURL} /> },
        // ],
      },
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
    ]
  }, [authenticated, hasUserManagementPermission, hasCaptureImagesPermission]);
};