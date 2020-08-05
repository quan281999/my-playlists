import {updateObject} from '../../shared/utility';
import * as actionTypes from '../actions/actionTypes';

const initialState = {
    tokenId: null,
    userId: null,
    error: null,
    loading: false,
    authRedirectPath: '/'
}

// Begin to authorize user
const authStart = (state) => {
    return updateObject(state, { 
        loading: true
    });
}

// Successfully authorize user
const authSuccess = (state, action) => {
    return updateObject(state, {
        tokenId: action.tokenId,
        userId: action.userId,
        loading: false,
    })
}

// Fail to authorize user
const authFail = (state, action) => {
    return updateObject(state, {
        error: action.error,
        loading: false
    })
}

// Log the user out
const authLogout = (state) => {
    return updateObject(state, {
        tokenId: null,
        userId: null
    })
}

// Clear the authorization error
const clearError = (state) => {
    return updateObject(state, {
        error: null
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state);
        case actionTypes.CLEAR_ERROR: return clearError(state);
        default: return state;
    }
}

export default reducer;