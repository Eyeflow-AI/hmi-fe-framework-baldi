import React, { useMemo, lazy } from 'react';

import { Navigate, Outlet } from 'react-router-dom';

import updatePath from './utils/functions/updatePath';

const Menu = lazy(() => import("./pages/Menu"));
const Login = lazy(() => import("./pages/Login"));
const MonitorBatch = lazy(() => import("./pages/MonitorBatch"));
const MonitorSerial = lazy(() => import("./pages/MonitorSerial"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Management = lazy(() => import("./pages/Management"));
const History = lazy(() => import("./pages/History"));

const homeURL = "/app/:stationSlugLabel/home";

const Query = lazy(() => import("./toolsPages/Query"));
const Monitor = lazy(() => import("./toolsPages/Monitor"));

function NotFound() {
  return (
    <>
      404: Not Found
    </>
  )
};

const components = {
  Menu: (pageOptions) => <Menu pageOptions={pageOptions} />,
  MonitorBatch: (pageOptions) => <MonitorBatch pageOptions={pageOptions} />,
  MonitorSerial: (pageOptions) => <MonitorSerial pageOptions={pageOptions} />,
  Dashboard: (pageOptions) => <Dashboard pageOptions={pageOptions} />,
  Management: (pageOptions) => <Management pageOptions={pageOptions} />,
  History: (pageOptions) => <History pageOptions={pageOptions} />,

  Query: (pageOptions) => <Query pageOptions={pageOptions} />,
  Monitor: (pageOptions) => <Monitor pageOptions={pageOptions} />,
};


export default function Routes({
  station
  , authenticated
  // , hasUserManagementPermission
  // , hasCaptureImagesPermission
}) {

  return useMemo(() => {

    let appRoutes = [];
    let updatedHomeURL = updatePath(homeURL, station);

    // eslint-disable-next-line
    for (let [key, value] of Object.entries(window.app_config.pages)) {
      let aclCondition = true; //TODO
      if (value.active && aclCondition && value.path.startsWith("/app")) {
        // console.log(`Loading page: ${key}. Station: ${station?.label}. Path: ${value.path}`);
        console.log({ value })
        appRoutes.push({
          path: value.path,
          element: components[value.component](value)
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