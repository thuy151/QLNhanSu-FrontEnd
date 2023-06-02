import * as Constants from '../constants/positions.constants';

export const savePositions = (payload:any) => {
    return {
        type: Constants.SAVE_POSITIONS,
        payload: payload
    }
}

