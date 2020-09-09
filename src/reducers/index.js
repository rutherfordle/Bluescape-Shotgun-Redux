import { combineReducers } from "redux";
import auth from "./auth";
import project from "./project"
import playlist from "./playlist"
import errors from "./errors"
import messages from "./messages"

export default combineReducers({
    auth,
    project,
    playlist,
    errors,
    messages
});
