import React from 'react';
import App from './app/App';
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Router } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import { persistor, store } from './helpers/store';
import { PersistGate } from 'redux-persist/integration/react';
import ScrollToTop from './app/ScrollToTop';
import { config as i18nextConfig } from './translations/index';
import { history } from "./helpers/history";
import { CookiesProvider } from 'react-cookie';
import 'primereact/resources/themes/nova-light/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

i18next.init(i18nextConfig);
render(
    <CookiesProvider>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter basename='/'>
                    <I18nextProvider i18n={i18next}>
                        <ScrollToTop>
                            <Router history={history}>
                                <App />
                            </Router>
                        </ScrollToTop>
                    </I18nextProvider>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    </CookiesProvider>,
    document.getElementById('root')
);
