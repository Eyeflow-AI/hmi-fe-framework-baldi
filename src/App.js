import React, {Suspense} from 'react';

import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserAuthenticated, getHasUserManagementPermission, getHasCaptureImagesPermission } from './store/slices/auth';

import GetRoutes from './GetRoutes';


function App() {

  const authenticated = useSelector(getUserAuthenticated);
  const hasUserManagementPermission = useSelector(getHasUserManagementPermission);
  const hasCaptureImagesPermission = useSelector(getHasCaptureImagesPermission);

  const routesList = GetRoutes({authenticated, hasUserManagementPermission, hasCaptureImagesPermission});
  const Routes = () => useRoutes(routesList);

  return (
    <Suspense fallback={<p> Loading...</p>}>
      <Routes />
    </Suspense>
  );
};

export default App;
