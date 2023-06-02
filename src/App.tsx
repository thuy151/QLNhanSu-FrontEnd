import {ConfigProvider} from "antd";
import Routes from './Routes';
import {useDispatch} from 'react-redux';
import {notification} from 'antd';
import moment from 'moment';
import viVN from 'antd/es/locale/vi_VN';
import enUS from 'antd/es/locale/en_US';
import {useEffect} from "react";

import LocalStorage from "./utils/localStorage";
import {LANGUAGE_LIST, VI_MOMENT_CONFIG} from "./utils/constants";
import GlobalDialog from './components/GlobalDialog'
import {saveProfile} from "./redux/actions/profile.actions";

import userServices from "./services/users.service";
import  jwt_decode  from 'jwt-decode';

const localLanguage = LocalStorage.getInstance().read('language') || LANGUAGE_LIST[0]?.value;

let locale = viVN
switch (localLanguage) {
    case LANGUAGE_LIST[1]?.value:
        locale = enUS
        break;
    default:
        moment.locale('vi', VI_MOMENT_CONFIG);
        locale = viVN
        break;
}

notification.config({
    duration: 10,
});

function App() {
    // const dispatch = useDispatch();

    // useEffect(() => {
    //     // initial load
    //     const accessToken = LocalStorage.getInstance().read('accessToken');
    //     if (accessToken) {
    //     const user = jwt_decode(accessToken);
    //     dispatch(saveProfile(user))
    //     }
    // }, [dispatch])

    return (
        <>
            <ConfigProvider locale={locale}>
                <Routes/>
                <GlobalDialog />
            </ConfigProvider>
        </>
    );
}

export default App;
