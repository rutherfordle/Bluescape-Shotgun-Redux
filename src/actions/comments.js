// import { socket } from 'socketUtil.js';
// import { useDispatch } from 'react-redux';
import store from "../store";
import thunk from "redux-thunk";
import { w3cwebsocket as W3CWebSocket } from "websocket";
//use messages here to display when comments appear:
import {createMessage, returnErrors} from "./messages";

import {SOCKET_CONNECTED, SOCKET_CONNECT, HANDLE_COMMENT} from "./types";


const client = new W3CWebSocket('ws://127.0.0.1:8000');
export const connectToServer = msg => {
    //poll the server to see if there is a new 
    //setup the socket connectoin:
    
    console.log("comments.connectToServer")
    client.onopen = () => {
        console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
        // const dataFromServer = JSON.parse(message.data);
        let data = JSON.parse(message.data)
        let comment = data.text
        let user = data.name
        console.log('comments.onmessage.comment = ', comment + " | " + user);

        //dispatch new comment and send it to shotgun
        // axios
        // .get("https://bluescape.shotgunstudio.com/api/v1/entity/projects?fields=cached_display_name",tokenConfig(getState))
        // .then(res => {
        //     dispatch({
        //         type: GET_PROJECT,
        //         payload: res.data.data
        //     });
        // })
        // .catch(err => {
        //     (err.response.status === 401) ? store.dispatch(loadUser()):''
        //     dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
        // });
    };

    return {
        type: HANDLE_COMMENT,
        comment: msg
      };
}