import React, { useMemo, lazy } from "react";

import { Navigate, Outlet } from "react-router-dom";

import updatePath from "./utils/functions/updatePath";

const Menu = lazy(() => import("./pages/Menu"));
const Login = lazy(() => import("./pages/Login"));
const UserSettings = lazy(() => import("./pages/UserSettings"));

const MonitorBatch = lazy(() => import("./pages/MonitorBatch"));
const MonitorSerial = lazy(() => import("./pages/MonitorSerial"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const Management = lazy(() => import("./pages/Management"));
const Report = lazy(() => import("./pages/Report"));

const homeURL = "/app/:stationSlugLabel/home";

const Query = lazy(() => import("./toolsPages/Query"));
const Monitor = lazy(() => import("./toolsPages/Monitor"));
const ImagesCapturer = lazy(() => import("./toolsPages/ImagesCapturer"));
const PartRegistration = lazy(() => import("./toolsPages/PartRegistration"));
const ImagesAnalyser = lazy(() => import("./toolsPages/ImagesAnalyser"));
const ChecklistConnector = lazy(() =>
  import("./toolsPages/ChecklistConnector")
);
const AppParameters = lazy(() => import("./toolsPages/AppParameters"));

function NotFound() {
  return <>404: Not Found</>;
}

const components = {
  Menu: (pageOptions) => <Menu pageOptions={pageOptions} />,
  MonitorBatch: (pageOptions) => <MonitorBatch pageOptions={pageOptions} />,
  MonitorSerial: (pageOptions) => <MonitorSerial pageOptions={pageOptions} />,
  Dashboard: (pageOptions) => <Dashboard pageOptions={pageOptions} />,
  Management: (pageOptions) => <Management pageOptions={pageOptions} />,
  Report: (pageOptions) => <Report pageOptions={pageOptions} />,

  Query: (pageOptions) => <Query pageOptions={pageOptions} />,
  Monitor: (pageOptions) => <Monitor pageOptions={pageOptions} />,
  ImagesCapturer: (pageOptions) => <ImagesCapturer pageOptions={pageOptions} />,
  PartRegistration: (pageOptions) => <PartRegistration pageOptions={pageOptions} />,
  ImagesAnalyser: (pageOptions) => <ImagesAnalyser pageOptions={pageOptions} />,
  ChecklistConnector: (pageOptions) => (
    <ChecklistConnector pageOptions={pageOptions} />
  ),
  AppParameters: (pageOptions) => <AppParameters pageOptions={pageOptions} />,
};

export default function Routes({
  station,
  authenticated,
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
        // console.log({ value });
        // console.log(components[value.component]);
        appRoutes.push({
          path: value.path,
          element: components[value.component](value),
        });
      }
    }
    appRoutes.push({ path: "/app", element: <Navigate to={updatedHomeURL} /> });

    return [
      {
        path: "/app",
        element: authenticated ? <Outlet /> : <Navigate to="/login" />,
        children: appRoutes,
      },
      {
        path: "/app/user-settings",
        element: <UserSettings />,
      },
      {
        path: "/",
        element: !authenticated ? <Outlet /> : <Navigate to={updatedHomeURL} />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/", element: <Navigate to="/login" /> },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ];
  }, [
    station,
    authenticated /*hasUserManagementPermission, hasCaptureImagesPermission*/,
  ]);
}
