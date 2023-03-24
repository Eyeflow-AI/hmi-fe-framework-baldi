import React, {lazy, Suspense} from 'react';
import ReactDOM from 'react-dom/client';

import ConfigProvider from './ConfigProvider';
import StoreWrapper from './store/Wrapper';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AdapterDateFNS from '@date-io/date-fns';
import CssBaseline from '@mui/material/CssBaseline';
import LoadingPage from './components/LoadingPage';

import reportWebVitals from './reportWebVitals';
import theme from './theme';
import './reset.css';

const App = lazy(() => import("./App"));
const PrepareApp = lazy(() => import("./PrepareApp"));

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StoreWrapper>
    <Suspense fallback={<LoadingPage />}>
      <ConfigProvider>
        <LocalizationProvider dateAdapter={AdapterDateFNS}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <BrowserRouter>
              <PrepareApp>
                <App />
              </PrepareApp>
            </BrowserRouter>
          </ThemeProvider>
        </LocalizationProvider>
      </ConfigProvider>
    </Suspense>
  </StoreWrapper>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
