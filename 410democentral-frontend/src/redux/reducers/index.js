import { combineReducers } from "redux";

import programs from './programs';
import categories from './categories';
import groups from './groups';

import { CLEAR_SESSION_STATE } from '../actions/actionTypes';

const appReducer = combineReducers({programs, categories, groups});

const rootReducer = (state, action) => {
    if (action.type === CLEAR_SESSION_STATE) {
        state = undefined;
    }
    return appReducer(state, action);
}

export default rootReducer;