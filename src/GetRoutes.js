import React, { useMemo, lazy } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import updatePath from './utils/functions/updatePath';

const Login = lazy(() => import("./pages/Login"));
const Home = lazy(() => import("./pages/Home"));
const Monitor1 = lazy(() => import("./pages/Monitor1"));
const MonitorBatch = lazy(() => import("./pages/MonitorBatch"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Management = lazy(() => import("./pages/Management"));
const History = lazy(() => import("./pages/History"));
const Tools = lazy(() => import("./pages/Tools"));

const homeURL = "/app/:stationSlugLabel/home";

function NotFound() {
  return (
    <>
      404: Not Found
    </>
  )
};

const components = {
  Home: (pageOptions) => <Home pageOptions={pageOptions}/>,
  Monitor1: (pageOptions) => <Monitor1 pageOptions={pageOptions}/>,
  MonitorBatch: (pageOptions) => <MonitorBatch pageOptions={pageOptions}/>,
  Dashboard: (pageOptions) => <Dashboard pageOptions={pageOptions}/>,
  Management: (pageOptions) => <Management pageOptions={pageOptions}/>,
  History: (pageOptions) => <History pageOptions={pageOptions}/>,
  Tools: (pageOptions) => <Tools pageOptions={pageOptions}/>,
};

export default function Routes({ station, authenticated, hasUserManagementPermission, hasCaptureImagesPermission }) {

  return useMemo(() => {

    let appRoutes = [];
    let updatedHomeURL = updatePath(homeURL, station);

    for (let [key, value] of Object.entries(window.app_config.pages)) {
      let aclCondition = true; //TODO
      if (value.active && aclCondition && value.path.startsWith("/app")) {
        // console.log(`Loading page: ${key}. Station: ${station?.label}. Path: ${value.path}`);
        appRoutes.push({
          path: value.path,
          element: components[value.id](value)
        })
      };
    };
    appRoutes.push({ path: '/app', element: <Navigate to={updatedHomeURL} /> });

    return [
      {
        path: '/app',
        element: authenticated ? <Outlet /> : <Navigate to="/login" />,
        children: appRoutes
      },
      {
        path: '/',
        element: !authenticated ? <Outlet /> : <Navigate to={updatedHomeURL} />,
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