import {
    GET_PROJECT, PLAYLIST_SELECT
} from "../actions/types";

const initialState = {
    project: [],
    getPlaylistID: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PROJECT:
            return {
                ...state,
                project: action.payload
            };
        case PLAYLIST_SELECT:
            return {
                ...state,
                getPlaylistID: action.payload
            }
        default:
            return state;
    }
}