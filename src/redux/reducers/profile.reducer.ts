import * as Constants from '../constants/profile.constants';

const initialState = {
  profile: null
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action:any) {
  switch (action.type) {
    case Constants.SAVE_PROFILE:
      return {
        ...state,
        profile: action?.payload,
      };
    default:
      return state
  }
}