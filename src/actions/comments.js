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
        console.log('comments.onmessage.message = ', message.data);
    };

    return {
        type: HANDLE_COMMENT,
        comment: msg
      };
}

// const mapStateToProps = state => ({
//     count: state.count
//   });
  
//   export default connect(mapStateToProps)(connectToServer);
// connectToServer()

// RETURN Comments
// export const returnComment = (msg, status) => {
//     return {
//       type: RETURN_COMMENT,
//       comment: { msg, status }
//     };
//   };
  

// function ChatRoomComponent(){
//     const dispatch = useDispatch();

//     useEffect(() => {
//         socket.on('event://get-message', payload => {
//             // update messages
//             useDispatch({ type: UPDATE_CHAT_LOG }, payload)
//         });
//         socket.on('event://user-joined', payload => {
//             // handling a new user joining to room
//         });
//     });
    
//     // other implementations
// }