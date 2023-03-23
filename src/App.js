import { useRoutes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getUserAuthenticated, getHasUserManagementPermission, getHasCaptureImagesPermission } from './store/slices/auth';
import { getStation } from './store/slices/app';

import GetRoutes from './GetRoutes';


function App() {

  const authenticated = useSelector(getUserAuthenticated);
  const hasUserManagementPermission = useSelector(getHasUserManagementPermission);
  const hasCaptureImagesPermission = useSelector(getHasCaptureImagesPermission);
  const station = useSelector(getStation);

  const routesList = GetRoutes({station, authenticated, hasUserManagementPermission, hasCaptureImagesPermission});
  return useRoutes(routesList);
};

export default App;
