import { combineReducers } from 'redux';

import globalReducer from './global.reducer';
import profileReducer from './profile.reducer';
import positionsReducer from './positions.reducer';

const rootReducer = combineReducers({
  globalReducer,
  profileReducer,
  positionsReducer
});

export default rootReducer;