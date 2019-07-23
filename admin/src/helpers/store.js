import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { persistStore } from 'redux-persist';
import rootReducer from '../redux/reducers';
import { socketMiddleware,socketReceiver } from './socket';

const composeEnhancers =
    // typeof window === 'object' &&
    //     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    //     window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
    //         // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    //     }) : compose;
    typeof window === 'object'&&compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunkMiddleware, socketMiddleware)
    )
);
socketReceiver(store.dispatch);
const persistor = persistStore(store);

export {
    store,
    persistor
}
