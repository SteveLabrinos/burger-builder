import * as actionTypes from '../actions/actionsTypes';
import {updateObject} from '../utility';

const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    authRedirect: '/'
};

const authStart = state => {
    const updatedObject = {error: null, loading: true};
    return updateObject(state, updatedObject)
};

const authSuccess = (state, action) => {
    const updatedObject = {
        token: action.idToken,
        userId: action.userId,
        error: null,
        loading: false
    };
    return updateObject(state, updatedObject);
};

const authFail = (state, action) => {
    const updatedObject = {
        error: action.error,
        loading: false
    };
    return updateObject(state, updatedObject);
};

const authLogout = state => {
    return updateObject(state, { token: null, userId: null });
};

const setAuthRedirectPath = (state, action) => {
    return updateObject(state, { authRedirect: action.path });
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state);
        case actionTypes.SET_AUTH_REDIRECT_PATH: return setAuthRedirectPath(state, action);
        default: return state;
    }
};

export default reducer;