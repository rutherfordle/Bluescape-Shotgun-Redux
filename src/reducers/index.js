import { combineReducers } from "redux";
import auth from "./auth";
import project from "./project"
import playlist from "./playlist"
import errors from "./errors"
import messages from "./messages"
import sendToBlue from "./sendToBlue"

export default combineReducers({
    auth,
    project,
    playlist,
    errors,
    messages,
    sendToBlue
});
