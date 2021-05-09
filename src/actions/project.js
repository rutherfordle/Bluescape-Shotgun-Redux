import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import {GET_PROJECT, ON_IMAGE_LOAD, PLAYLIST_SELECT} from "./types";
import {createMessage, returnErrors} from "./messages";
import store from "../store";

export const getProject = () => (dispatch, getState) => {
    axios
        .get("https://bluescape.shotgunstudio.com/api/v1/entity/projects?fields=cached_display_name",tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_PROJECT,
                payload: res.data.data
            });
        })
        .catch(err => {
            (err.response.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
        });
};

export const getProjectPlaylist = (projectID) => (dispatch) => {
    console.log('getProjectPlaylist.playlistID = ', projectID)
    dispatch({type: ON_IMAGE_LOAD,
    projectID: projectID});
}
