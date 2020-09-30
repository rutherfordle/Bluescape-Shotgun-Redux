import {
    HANDLE_COMMENT, SOCKET_CONNECT, SOCKET_CONNECTED
} from "../actions/types";

const initialState = {
    comment: [],
    connected: false
};

export default function (state = initialState, action) {
    switch (action.type) {
        case HANDLE_COMMENT:
            return {
                ...state,
                comment: action.payload
            };
        case SOCKET_CONNECT:
            return {
                ...state
            };
        case SOCKET_CONNECTED:
            return {
                ...state,
                connected: true
            };            
        default:
            return state;
    }
}