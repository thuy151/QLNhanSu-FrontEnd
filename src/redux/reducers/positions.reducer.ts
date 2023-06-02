import * as Constants from '../constants/positions.constants';

const initialState = {
  positions: []
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action:any) {
  switch (action.type) {
    case Constants.SAVE_POSITIONS:
      return {
        ...state,
        positions: action?.payload,
      };
    default:
      return state
  }
}