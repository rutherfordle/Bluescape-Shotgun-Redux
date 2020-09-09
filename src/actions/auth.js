import axios from "axios";
import qs from "qs";
import { returnErrors } from "./messages";

import {
    USER_LOADED,
    USER_LOADING,
    AUTH_ERROR,
    LOGIN_SUCCESS,
    LOGIN_FAIL,
    LOGOUT_SUCCESS,
} from "./types";

export const loadUser = () => (dispatch, getState) => {
    if (localStorage.getItem('token'))
    {
        dispatch({type: USER_LOADING});
        const config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        };
        var data = qs.stringify({
            'grant_type': 'refresh_token',
            'refresh_token': localStorage.getItem('token')
        });

        axios
            .post("https://bluescape.shotgunstudio.com/api/v1/auth/access_token", data, config)
            .then(res => {
                dispatch({
                    type: USER_LOADED,
                    payload: res.data
                });
            })
            .catch(err => {
                console.log('failed to refresh the token')
                dispatch({
                    type: LOGIN_FAIL
                });
            });
    }
};

export const login = (grant_type,username, password) => dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    // Request Body
    var data = qs.stringify({
        'grant_type': 'password',
        'username': username,
        'password': password
    });

    axios
        .post("https://bluescape.shotgunstudio.com/api/v1/auth/access_token", data, config)
        .then(res => {
            dispatch({
                type: LOGIN_SUCCESS,
                payload: res.data,
                username: username
            });
        })
        .catch(err => {
            dispatch(returnErrors(err.response.data.errors[0].title, err.response.status))
            dispatch({
                type: LOGIN_FAIL
            });
        });
};

export const logout = () => (dispatch, getState) => {

    dispatch({ type: 'CLEAR_AUTH' });
    dispatch({
        type: LOGOUT_SUCCESS
    });
};

export const tokenConfig = getState => {
    const token = getState().auth.token;
    const config = {
        headers: {
            "Content-Type": "application/json"
        }
    };
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
};