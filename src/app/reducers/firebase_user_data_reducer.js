import {
  FETCH_FIREBASE_USER_SETTINGS,
} from '../actions/types';


export default function (state = null, action) {
    switch (action.type) {
    case FETCH_FIREBASE_USER_SETTINGS:
        return action.payload;
    default:
        return state;
    }
}
