import {
    GET_PLAYLIST, GET_PLAYLIST_IMAGES, REMOVE_PLAYLIST
} from "../actions/types";

const initialState = {
    playlist: [],
    playlistImages: [],
    playlistNameSelected:''
};

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_PLAYLIST:
            return {
                ...state,
                playlist: action.payload
            };
        case GET_PLAYLIST_IMAGES:
            return {
                ...state,
                playlistImages: action.payload,
                playlistNameSelected:action.name
            };
        case REMOVE_PLAYLIST:
            return {
                ...state,
                playlistImages: 0
            };

        default:
            return state;
    }
}