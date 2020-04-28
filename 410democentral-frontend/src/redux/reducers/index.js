import { combineReducers } from "redux";

import programs from './programs';
import categories from './categories';
import groups from './groups';

export default combineReducers({programs, categories, groups});