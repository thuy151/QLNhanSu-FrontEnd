import { legacy_createStore as createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import { persistStore, persistReducer } from 'redux-persist';

import rootReducer from './reducers';

const persistConfig = {
    key: 'reducer',
    storage: storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

const loggerMiddleware = createLogger();

export const store = createStore(
    persistedReducer,
    applyMiddleware(
        thunkMiddleware,
        loggerMiddleware
    )
);
export const persistor = persistStore(store);
