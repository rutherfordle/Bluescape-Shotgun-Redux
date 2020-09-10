import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import store from "../store";
import thunk from "redux-thunk";
//use messages here to display errors if they occur (like bad auth token)
import {createMessage, returnErrors} from "./messages";

import {ON_IMAGE_LOAD, LOADING_BS, UPLOAD_IMAGE} from "./types";

export const imageToUpload = (img) => (dispatch, getState) => {
    dispatch({
        type: ON_IMAGE_LOAD,
        img:img
    });

}

const orgID = 'wOETxsWt3SAmuyUQbbLy'
const workspaceUID = 'cjsCO31iGlyyOMEpqYpI'
// const workspaceUID = 'L8V-DgUmfe8n2dYMwPpj'
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE2MDA5MjMxNTQsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE1OTk3MTM1NDQsImlhdCI6MTU5OTcxMzU1NCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.WHWUZSbJyXplzeaqxT_CY4_xKkkZ8wmsR0jiDsZKJ00'
const canvasUID = ''

export const sendToBlue = (index) => async ( dispatch, getState) => {
    const getImageToUpload = getState().sendToBlue.uploadableImage;
    console.log('sendToBlue!!!!')

    await createCanvas( dispatch, getState);
    // dispatch(uploadImage(dispatch, getState))
    console.log('after create canvas!!!!!!!')
    uploadImage(dispatch, getState)
};

export const sendToBluePlaylist = () => (dispatch, getState) => {
    const playlistImagesState = getState().playlist.playlistImages
    console.log('actions.sendToBluePlaylist = ', playlistImagesState)

    // playlistImagesState.map((val2, i) =>  { 
    //     let selectedImage = (val2.attributes.sg_uploaded_movie_image)? (val2.attributes.sg_uploaded_movie_image.url) : val2.attributes.image
    // }

    
    //loop through all the images and send them one at a time to the uploadImage function
}

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

export const createCanvas = async (dispatch, getState) => {
    console.log('createCanvas')
    const getPlaylistNameSelected = getState().playlist.playlistNameSelected;
    console.log('actions.sendToBlue.getPlaylistNameSelected = ', getPlaylistNameSelected);
    // console.log('actions.sendToBlue.getImageToUpload = ', getImageToUpload.source);
    // console.log('actions.sendToBlue.index.relationships.name =', index.relationships.user.data.name);
    
    const ts = new Date().toLocaleDateString()
    
    //date | playlist name | user
    const canvasName = ts  + ' | ' + getPlaylistNameSelected + ' | ' + getState().playlist.playlistCreatedBy
    console.log('sendToBlue:canvasName = ' + canvasName)
    
    const rndCoord = 5000
    var data = JSON.stringify({
                            "name":canvasName,
                            "width":2000,
                            "height":2000,
                            'x':getRandomInt(rndCoord),
                            'y':getRandomInt(rndCoord)
                        });

    var config = {
        method: 'post',
        url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + workspaceUID + '/elements/canvas',
        headers: { 
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
          },
          data : data
        };

        
        return axios(config)
            .then( res => {
                let canvasUID = JSON.stringify(res.data.canvas.id)
                console.log('canvasUID = ' + canvasUID);
                // console.log('sendToBlue.image = ' + getState().sendToBlue.uploadableImage.source)
                
                // this.setState ({"canvasUID": canvasUID}),uploadImage(getState().sendToBlue.uploadableImage.source)

                dispatch({
                    type: LOADING_BS,
                    payload: res.data.canvas.id
                });
                console.log('actions.sendToBlue.canvasUID = ' + getState().sendToBlue.canvasUID)
                dispatch(createMessage({tokenReset:"creating canvas"}))
               // uploadImage()
        })
        .catch(err => {
            (err.res.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"canvas create error"}))
        });
}

export const uploadImage = (dispatch, getState) => {

    console.log("************** uploadImage.store = ", store.getState().sendToBlue)
    const sendBlueObj = store.getState().sendToBlue
    const canvasUID = sendBlueObj.canvasUID
    const height = sendBlueObj.height
    const width = sendBlueObj.width
    const imageURL = store.getState().sendToBlue.uploadableImage.source
    console.log('uploadImage.canvasUID = ' + canvasUID)
    console.log('   uploadImage.sgVersion.imageURL = ', imageURL)
    
    const rndCoord = 5000

    var data = new FormData();
    data.append('url', imageURL);

    var config = {
        method: 'post',
        url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + workspaceUID + '/elements/canvas/' + canvasUID + '/images',
        headers: { 
            'Authorization': 'Bearer ' + accessToken, 
            'Content-Type': 'multipart/form-data'
        },
        data : data
        };

        axios(config)
            .then(function (res) {
                dispatch({
                    type: UPLOAD_IMAGE,
                    payload: res.data
                });
                console.log(JSON.stringify(res.data));
        })
        .catch(function (error) {
            console.log(error);
    });
}

export const getPlaylistImages = (id,name) => (dispatch, getState) => {
    axios
        .get('https://bluescape.shotgunstudio.com/api/v1/entity/Version/?filter[playlists.Playlist.id]=' + id + '&fields=sg_uploaded_movie_image,cached_display_name,tags,user,image',tokenConfig(getState))
        .then(res => {
            dispatch({
                type: GET_PLAYLIST_IMAGES,
                payload: res.data.data,
                name:name
            });
        })
        .catch(err => {
            (err.res.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
        });
};

export const removePlaylist = () => (dispatch, getState) => {
    dispatch({
        type: REMOVE_PLAYLIST,
    });
};