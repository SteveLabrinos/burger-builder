import * as actionTypes from './actionsTypes';
import axios from '../../axios-orders';

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

const authSuccess = (token, userId) => {
    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: userId
    };
};

const authFail = error => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const logout = () => {
    //  remove local storage user information
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');

    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkAuthTimeout = expirationTime => dispatch => {
    setTimeout(() => {
        dispatch(logout());
    }, expirationTime * 1000);
};

export const auth = (email, password, isSignedUp) => {
    return dispatch => {
        dispatch(authStart());
        //  user authentication
        const API_KEY = 'AIzaSyDKvmZx-NapqA3iQe2ftlfX54KJasjpOek';
        const authData = {
            email: email,
            password: password,
            returnSecureToken: true
        }
        const url = isSignedUp ?
            `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}` :
            `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`
        axios.post(url, authData)
            .then(response => {
                console.log(response);
                //  store token into the local storage
                const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
                localStorage.setItem('token', response.data.idToken);
                localStorage.setItem('expirationDate', expirationDate);
                localStorage.setItem('userId', response.data.localId);

                dispatch(authSuccess(response.data.idToken, response.data.localId));
                dispatch(checkAuthTimeout(response.data.expiresIn));
            })
            .catch(error => {
                console.log(error);
                dispatch(authFail(error.response.data.error));
            })

    }
}

export const setAuthRedirectPath = path => {
    return {
        type: actionTypes.SET_AUTH_REDIRECT_PATH,
        path: path
    };
};

export const authCheckState = () => dispatch => {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expirationDate'));
    if (token && expirationDate > new Date()) {
        dispatch(authSuccess(token, localStorage.getItem('userId')));
        dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
    } else {
        dispatch(logout());
    }
}