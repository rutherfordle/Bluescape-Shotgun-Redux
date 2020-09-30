import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import store from "../store";
import {createMessage, returnErrors} from "./messages";

import {GET_PLAYLIST, GET_PLAYLIST_IMAGES, REMOVE_PLAYLIST} from "./types";

export const getPlaylist = () => (dispatch, getState) => {
    const getPlaylistID = getState().project.getPlaylistID;
    let playlistID = '';
    console.log('getPlaylist.getPlaylistID = ' + getPlaylistID)
    if (getPlaylistID) {
        playlistID = 'filter[project.Project.id]='+ getPlaylistID
    }else if (!getPlaylistID || typeof getPlaylistID == 'undefined'){
        playlistID =  ''
    }

    axios
        .get('https://bluescape.shotgunstudio.com/api/v1/entity/playlists?' + playlistID + '&fields=*',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_PLAYLIST,
                payload: res.data.data
            });
        })
        .catch(err => {
            (err.response.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
        });
};

export const getPlaylistImages = (id,name,createdBy) => (dispatch, getState) => {
    removePlaylist(dispatch, getState)
    axios
        .get('https://bluescape.shotgunstudio.com/api/v1/entity/Version/?filter[playlists.Playlist.id]=' + id + '&fields=sg_uploaded_movie_image,cached_display_name,tags,user,image',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_PLAYLIST_IMAGES,
                payload: res.data.data,
                name:name,
                createdBy:createdBy
            });
        })
        .catch(err => {
            (err.response.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
        });
};

export const removePlaylist = () => (dispatch, getState) => {
    dispatch({
        type: REMOVE_PLAYLIST,
    });
};