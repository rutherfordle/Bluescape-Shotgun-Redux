// import { socket } from 'socketUtil.js';
// import { useDispatch } from 'react-redux';
import axios from "axios";
import store from "../store";
import {tokenConfig,loadUser} from "./auth"
import {createMessage, returnErrors} from "./messages";
// import thunk from "redux-thunk";
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import {sendToBlue,imageToUpload,sendToBluePlaylist,launchWorkspace} from "../../actions/sendToBlue";
import {SOCKET_CONNECTED, SOCKET_CONNECT, HANDLE_COMMENT} from "./types";

// const workspaceUID = '1D_yaBDGot5emDS2F2YB'
// const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE2MDIxODcwMjcsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE2MDA5Nzc0MTcsImlhdCI6MTYwMDk3NzQyNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.ZSfM9w-5oMDipezSYWgVahmZOAHIPPPlYtj9q75J43o'
const client = new W3CWebSocket('ws://127.0.0.1:8000');
const traitDomain = 'http://acme.com/picture'
export const connectToServer = (msg) => (dispatch, getState) => {
    //poll the server to see if there is a new 
    //setup the socket connectoin:
    
    console.log("comments.connectToServer")
    client.onopen = () => {
        console.log('WebSocket Client Connected');
    };

    client.onmessage = (message) => {
        // const dataFromServer = JSON.parse(message.data);
        let msg = JSON.parse(message.data)
        let comment = msg.text
        let user = msg.name
        console.log('comments.onmessage.comment = ', comment + ' | ' + user + ' | UID = ' + msg.target.id);

        let playlistImages = store.getState().sendToBlue.playlistImages
        console.log('onMessage.store = ', playlistImages)

        const imageIndex = playlistImages.findIndex( el => el.imageUID == msg.target.id)
        console.log('onMessage.imageIndex = ', playlistImages[imageIndex])
        console.log('onMessage.projectID = ' + playlistImages.projectID + ' | versionID = ' + playlistImages[imageIndex].versionID)
        
        // const playlistImages = getState().sendToBlue.playlistImages
        // console.log('onMessage.playlistImages = ', playlistImages)
        //{"id":"5f756344b089a93080000101","target":{"id":"5f7437f4b77e930015acbc47","type":"IMAGE"},"text":"asdfsdf","name":"Kevin Koechley"}

        let data = JSON.stringify(
            {"subject":"comment sync from Bluescape",
            "read_by_current_user":"unread",
            "sg_note_type":"Client",
            "sg_status_list":"opn",
            "content":comment,
            "project":{"type":"Project","id":playlistImages.projectID},
            "note_links":[{"type":"Version","id":playlistImages[imageIndex].versionID}]}
            );

        axios
            .post('https://bluescape.shotgunstudio.com/api/v1/entity/notes/',data, tokenConfig(getState))
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                (err.response.status === 401) ? store.dispatch(loadUser()):''
                dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
            });
    };

    return {
        type: HANDLE_COMMENT,
        comment: msg
      };
}

export const getTraits = (elementUID) => {
    console.log('getTraits.elemenUID = ' + elementUID)

    var data = '';
    
    var config = {
      method: 'get',
      url: 'https://api.apps.us.bluescape.com/v2/workspaces/'+ workspaceUID + '/elements/images/' + elementUID + '/traits',
      headers: { 
        'Authorization': 'Bearer ' + accessToken
      },
      data : data
    };
    
    axios(config)
    .then(function (response) {
      const traits = JSON.stringify(response.data)
      console.log('traits = ', traits);
    })
    .catch(function (error) {
      console.log(error);
    });
}