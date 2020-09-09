import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
} from "../actions/types";

const initialState = {
    token: localStorage.getItem("access"),
    isAuthenticated: false,
    user: null
};

export default function(state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                isLoading: true
            };
        case USER_LOADED:
            localStorage.setItem("access", action.payload.access_token)
            localStorage.setItem("token", action.payload.refresh_token)
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                token: action.payload.access_token
            };
        case LOGIN_SUCCESS:
            localStorage.setItem("access", action.payload.access_token)
            localStorage.setItem("token", action.payload.refresh_token)
            localStorage.setItem("username", action.username)
            return {
                ...state,
                ...action.payload,
                token: action.payload.access_token,
                isAuthenticated: true,
                isLoading: false,
            };
        case AUTH_ERROR:
        case LOGIN_FAIL:
        case LOGOUT_SUCCESS:
            localStorage.removeItem("token");
            return {
                ...state,
                token: null,
                user: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
}
