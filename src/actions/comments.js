// import { socket } from 'socketUtil.js';
// import { useDispatch } from 'react-redux';
import axios from "axios";
import store from "../store";
import {tokenConfig,loadUser} from "./auth"
import {createMessage, returnErrors} from "./messages";
// import thunk from "redux-thunk";
import { w3cwebsocket as W3CWebSocket } from "websocket";
// import { he as he } from "he";
// import {sendToBlue,imageToUpload,sendToBluePlaylist,launchWorkspace} from "../../actions/sendToBlue";
import {SOCKET_CONNECTED, SOCKET_CONNECT, HANDLE_COMMENT} from "./types";

// const workspaceUID = '1D_yaBDGot5emDS2F2YB'
// const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE2MDIxODcwMjcsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE2MDA5Nzc0MTcsImlhdCI6MTYwMDk3NzQyNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.ZSfM9w-5oMDipezSYWgVahmZOAHIPPPlYtj9q75J43o'
const client = new W3CWebSocket('ws://127.0.0.1:8000');
const traitDomain = 'http://acme.com/picture'
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE2MDIxODcwMjcsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE2MDA5Nzc0MTcsImlhdCI6MTYwMDk3NzQyNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.ZSfM9w-5oMDipezSYWgVahmZOAHIPPPlYtj9q75J43o'
const workspaceUID = '1D_yaBDGot5emDS2F2YB'
let traitsResponse = ''
let comment = ''
export const connectToServer = (msg) => (dispatch, getState) => {
    //poll the server to see if there is a new 
    //setup the socket connectoin:
    
    console.log("comments.connectToServer")
    client.onopen = () => {
        console.log('WebSocket Client Connected');
    };

    client.onclose = function() {
        console.log('echo-protocol Client Closed');
    };

    client.onerror = function() {
        console.log('Connection Error');
    };

    client.onmessage = (message) => {
        // const dataFromServer = JSON.parse(message.data);
        let msg = JSON.parse(message.data)
        //find special chars and convert html quote and single quote to human readable:
        comment = msg.text.replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        let user = msg.name
        let imgUID = msg.target.id
        console.log('comments.onmessage.comment = ', comment + ' | ' + user + ' | UID = ' + imgUID);
        // getTraits(imgUID, comment)

        console.log("getTraits.imgUID = " + imgUID)

        var data = '';

        var config = {
        method: 'get',
        url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + workspaceUID + '/elements/images/' + imgUID + '/traits',
        headers: { 
            'Authorization': 'Bearer ' + accessToken, 
        },
        data : data
        };

        axios(config)
            .then(function (response) {
                console.log(response.data);
                traitsResponse = response.data
                sendComment(dispatch, getState)
            })
            .catch(function (error) {
                console.log(error);
        });
    };
}

export const getTraits = (imgUID, comment) => {
    console.log("getTraits.imgUID = " + imgUID)

    var data = '';

    var config = {
    method: 'get',
    url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + workspaceUID + '/elements/images/' + imgUID + '/traits',
    headers: { 
        'Authorization': 'Bearer ' + accessToken, 
    },
    data : data
    };

    axios(config)
        .then(function (response) {
            console.log(response.data);
            sendComment(dispatch, getState)
        })
        .catch(function (error) {
            console.log(error);
    });
}

export const sendComment = (dispatch, getState) => {
    const traitObj = traitsResponse.traits[ traitsResponse.traits.length - 1]
    console.log('sendComment.traits = ', traitObj)
    //evaluate string to key:
    let projectID = traitObj['http://www.bluescape.com/projectID']
    let versionID = traitObj['http://www.bluescape.com/versionID']
    console.log('projectID = ' + projectID + ' | versionID = ' + versionID)
    //console.log('http://www.bluescape.com/projectID = ', traitObj.http://www.bluescape.com/projectID )

    //check if shotgun command is sent from comment:
    let splitComment = comment.split("/shotgun note ");
    console.log('onComment.splitComment = ', splitComment)
    //console.log('onComment.comment = ' + decode(comment))
    if( (splitComment.length > 1) && (splitComment[0]== '')){

        let data = JSON.stringify(
            {"subject":"comment sync from Bluescape",
            "read_by_current_user":"unread",
            "sg_note_type":"Client",
            "sg_status_list":"opn",
            "content":splitComment[1],
            "project":{"type":"Project","id":projectID},
            "note_links":[{"type":"Version","id":versionID}]}
            );

        axios
            .post('https://bluescape.shotgunstudio.com/api/v1/entity/notes/',data, tokenConfig(getState))
            .then(function (response) {
                console.log(response.data);
            })
            .catch(function (error) {
                (err.response.status === 401) ? store.dispatch(loadUser()):''
                dispatch(createMessage({tokenReset:"uploading Note to shotgun failed, please try again"}))
            });
    }
}

export const decode = (str) => {
    console.log('decode string = ' + str)
    return str.replace(/&#(\d+);/g, function(match, dec) {
        return String.fromCharCode(dec);
    });
}