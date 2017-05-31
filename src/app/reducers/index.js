import { combineReducers } from 'redux';
import FireBaseUserReducer from './firebase_user_reducer';
import FireBaseUserSettingsReducer from './firebase_user_data_reducer'

const rootReducer = combineReducers({
    currentUser: FireBaseUserReducer,
    currentUserSettings: FireBaseUserSettingsReducer,
});

export default rootReducer;
