import React from 'react';
import ReactDOM from 'react-dom/client';
import PrepareApp from './PrepareApp';
import App from './App';
import StoreWrapper from './store/Wrapper';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import AdapterDateFNS from '@date-io/date-fns';
import CssBaseline from '@mui/material/CssBaseline';

import reportWebVitals from './reportWebVitals';
import theme from './theme';
import {prepare as prepareLocale} from './locale';
import './reset.css';

console.log("App config", window.app_config);
prepareLocale(window.app_config.locale);

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <StoreWrapper>
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
  </StoreWrapper>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
