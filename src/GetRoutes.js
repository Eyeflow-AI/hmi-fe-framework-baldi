import React, { useMemo, lazy } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import updatePath from './utils/functions/updatePath';

const Login = lazy(() => import("./pages/Login"));
const Monitor1 = lazy(() => import("./pages/Monitor1"));
const MonitorBatch = lazy(() => import("./pages/MonitorBatch"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Management = lazy(() => import("./pages/Management"));
const History = lazy(() => import("./pages/History"));
const Tools = lazy(() => import("./pages/Tools"));

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
  Tools: () => <Tools />,
};

export default function Routes({ station, authenticated, hasUserManagementPermission, hasCaptureImagesPermission }) {

  return useMemo(() => {

    let appRoutes = [];
    let updatedDefaultAppUrl = updatePath(defaultAppURL, station);
    // console.log(`Default APP URL: ${updatedDefaultAppUrl}`);
    // eslint-disable-next-line
    for (let [key, value] of Object.entries(window.app_config.pages)) {
      let aclCondition = true; //TODO
      if (value.active && aclCondition && value.path.startsWith("/app")) {
        // console.log(`Loading page: ${key}. Station: ${station?.label}. Path: ${value.path}`);
        appRoutes.push({
          path: value.path,
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
      },
      {
        path: '/',
        element: !authenticated ? <Outlet /> : <Navigate to={updatedDefaultAppUrl} />,
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