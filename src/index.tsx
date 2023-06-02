import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/reset.css';
import './resources/main.scss'; // or 'antd/dist/antd.less'
import "./utils/i18n";
import {Provider} from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import {store, persistor} from "./redux/store";
import {LoadingOutlined} from "@ant-design/icons";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  // <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={<LoadingOutlined style={{ fontSize: 24 }} spin />} persistor={persistor}>
                <App />
            </PersistGate>
        </Provider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
