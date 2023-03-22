import React, { useMemo, lazy } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import updatePath from './utils/functions/updatePath';

const Login = lazy(() => import("./pages/Login"));
const Monitor1 = lazy(() => import("./pages/Monitor1"));
const MonitorBatch = lazy(() => import("./pages/MonitorBatch"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Management = lazy(() => import("./pages/Management"));
const History = lazy(() => import("./pages/History"));

const defaultAppURL = "/app/:stationSlugLabel/monitor";

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
  Management: () => <Management />,
  History: () => <History />,
};

export default function Routes({ station, authenticated, hasUserManagementPermission, hasCaptureImagesPermission }) {

  return useMemo(() => {

    let appRoutes = [];
    let updatedDefaultAppUrl = updatePath(defaultAppURL, station);
    for (let [key, value] of Object.entries(window.app_config.pages)) {
      let aclCondition = true; //TODO
      if (value.active && aclCondition && value.path.startsWith("/app")) {
        let updatedPath = updatePath(value.path, station);
        console.log(`Loading page: ${key}. Station: ${station?.label}. Path: ${updatedPath}`);
        appRoutes.push({
          path: updatedPath,
          element: components[value.id]()
        })
      };
    };
    appRoutes.push({ path: '/app', element: <Navigate to={updatedDefaultAppUrl} /> });

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
  }, [station, authenticated, /*hasUserManagementPermission, hasCaptureImagesPermission*/]);
};