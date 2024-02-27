// React
import React, { lazy, Suspense } from 'react';

// Design
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

// Internal
import reportWebVitals from './reportWebVitals';
import theme from './theme';
import './reset.css';
import LoadingPage from './components/LoadingPage';
import ConfigProvider from './ConfigProvider';
import StoreWrapper from './store/Wrapper';
import NotificationBar from './components/NotificationBar';
import CheckVersion from './utils/functions/checkVersion';

// Thirdy-Party
import ReactDOM from 'react-dom/client';
import AdapterDateFNS from '@date-io/date-fns';
import { BrowserRouter, useLocation } from 'react-router-dom';

const App = lazy(() => import("./App"));
const PrepareApp = lazy(() => import("./PrepareApp"));

function AppWrapper() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  return (
    <StoreWrapper>
      <Suspense fallback={<LoadingPage />}>
        <ConfigProvider>
          <LocalizationProvider dateAdapter={AdapterDateFNS}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <PrepareApp>
                <NotificationBar />
                {!isLoginPage && <CheckVersion />}
                <App />
              </PrepareApp>
            </ThemeProvider>
          </LocalizationProvider>
        </ConfigProvider>
      </Suspense>
    </StoreWrapper>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <BrowserRouter>
    <AppWrapper />
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
