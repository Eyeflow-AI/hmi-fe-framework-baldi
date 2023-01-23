import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import store, {persistor} from './index';

function StoreWrapper({children}) {

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}

export default StoreWrapper;
