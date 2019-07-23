import { combineReducers } from 'redux';
import { persistReducer  } from 'redux-persist';
import localForage from 'localforage';
import alertReducer from './alertReducer';
import authenticationReducer from './authenticationReducer';
import notifyReducer from "./notifyReducer";
import registrationReducer from './registrationReducer';
import sidebarReducer from './sidebarReducer';
import usersReducer from './usersReducer';
import userTokenReducer from "./userTokenReducer";
import productReducer from './productReducer';
import categoryReducer from './categoryReducer';
import languageReducer from './languageReducer';
import translationReducer from './translationReducer'
import advantagesReducer from "./advantagesReducer";

localForage.config({
    name: 'Web DB',
    storeName: 'keyDb'
});

const rootPersistConfig = {
    version: 0,
    key: 'keyDb',
    storage: localForage,
    whitelist: ['userToken'],
};

const rootReducer = combineReducers({
    alert: alertReducer,
    authentication: authenticationReducer,
    registration: registrationReducer,
    sidebar: sidebarReducer,
    users: usersReducer,
    notify: notifyReducer,
    userToken: userTokenReducer,
    product: productReducer,
    category: categoryReducer,
    advantages: advantagesReducer,
    language: languageReducer,
    translation: translationReducer,
});

export default persistReducer(rootPersistConfig, rootReducer);