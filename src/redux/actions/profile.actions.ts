import * as Constants from '../constants/profile.constants';

export const saveProfile = (payload:any) => {
    return {
        type: Constants.SAVE_PROFILE,
        payload: payload
    }
}

