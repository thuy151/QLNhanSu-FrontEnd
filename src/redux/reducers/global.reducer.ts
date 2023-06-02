import * as Constants from '../constants/global.constants';

const initialState = {
  globalDialogStatus: false,
  globalDialogContent: "",
  globalDialogTitle: "",
  globalDialogHandleOk: () => {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action:any) {
  switch (action.type) {
    case Constants.OPEN_GLOBAL_DIALOG:
      return {
        ...state,
        globalDialogStatus: true,
        globalDialogTitle: action?.payload?.globalDialogTitle,
        globalDialogContent: action?.payload?.globalDialogContent,
        globalDialogHandleOk: action?.payload?.globalDialogHandleOk,
      };
    case Constants.CLOSE_GLOBAL_DIALOG:
      return {
        ...state,
        globalDialogStatus: false,
        globalDialogTitle: "",
        globalDialogContent: ""
      };
    default:
      return state
  }
}