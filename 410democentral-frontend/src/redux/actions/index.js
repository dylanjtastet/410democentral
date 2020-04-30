import { CLEAR_SESSION_STATE } from './actionTypes';

export * from './categoryActions';
export * from './programActions';
export * from './groupActions';

export const clearSessionState = () => ({
    type: CLEAR_SESSION_STATE
});