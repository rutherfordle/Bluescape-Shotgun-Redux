import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import {GET_PROJECT, PLAYLIST_SELECT} from "./types";
import { returnErrors } from "./messages";
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
            dispatch(returnErrors(err.response.data.errors[0].title, err.response.status))
        });
};

export const getProjectPlaylist = (playlistID) => (dispatch) => {
    dispatch({type: PLAYLIST_SELECT,
    payload: playlistID});
}
