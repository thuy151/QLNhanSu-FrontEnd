import * as Constants from '../constants/global.constants';

interface GlobalDialog {
    globalDialogContent?: any,
    globalDialogTitle?: string,
    globalDialogHandleOk?: () => void,
}
export const openGlobalDialog = (payload:GlobalDialog) => {
    return {
        type: Constants.OPEN_GLOBAL_DIALOG,
        payload: payload
    }
}

export const closeGlobalDialog = () => {
    return {
        type: Constants.CLOSE_GLOBAL_DIALOG,
    }
}
