import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import store from "../store";
import thunk from "redux-thunk";
//use messages here to display errors if they occur (like bad auth token)
import {createMessage, returnErrors} from "./messages";

import {ON_IMAGE_LOAD, LOADING_CANVAS, UPLOAD_IMAGE} from "./types";

export const imageToUpload = (img, playlistImages) => (dispatch, getState) => {
    dispatch({
        type: ON_IMAGE_LOAD,
        img:img,
        playlistImages:playlistImages
    });
}

const orgID = 'wOETxsWt3SAmuyUQbbLy'
const workspaceUID = 'KknIoESD5veTHuiRe8k1'
// const workspaceUID = 'L8V-DgUmfe8n2dYMwPpj'
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE2MDA5MjMxNTQsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE1OTk3MTM1NDQsImlhdCI6MTU5OTcxMzU1NCwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.WHWUZSbJyXplzeaqxT_CY4_xKkkZ8wmsR0jiDsZKJ00'
const canvasUID = ''
const padding = 50

export const sendToBlue = (index) => async ( dispatch, getState) => {
    const getImageToUpload = getState().sendToBlue.uploadableImage;
    console.log('sendToBlue!!!!')

    await createCanvas( dispatch, getState);
    console.log('after create canvas!!!!!!!')
    uploadImage(dispatch, getState)
};

export const sendToBluePlaylist = () => async (dispatch, getState) => {
    const playlistImagesState = getState().playlist.playlistImages
    console.log('actions.sendToBluePlaylist = ', playlistImagesState)
    await createCanvas( dispatch, getState);
    console.log('sendToBluePlaylist AFTER createCanvas')
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
    
    //date | playlist name | user
    const ts = new Date().toLocaleDateString()
    const canvasName = ts  + ' | ' + getPlaylistNameSelected + ' | ' + getState().playlist.playlistCreatedBy
    console.log('sendToBlue:canvasName = ' + canvasName)
    
    let canvasContainer = calculateCanvas( getState)
    
    var data = JSON.stringify({
        "name":canvasName,
        "width":canvasContainer.width,
        "height":canvasContainer.height,
        'x':canvasContainer.x,
        'y':canvasContainer.y
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
                canvasContainer.canvasUID = res.data.canvas.id
                console.log('canvasUID = ' + canvasUID);

                dispatch({
                    type: LOADING_CANVAS,
                    payload: canvasContainer
                });
                console.log('actions.sendToBlue.canvasUID = ' + getState().sendToBlue.canvasUID)
                dispatch(createMessage({tokenReset:"creating canvas"}))
        })
        .catch(err => {
            (err.res.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"canvas create error"}))
        });
}

//calculate x, y based on last created canvas, and then width, height from images to be stored in canvas:
export const calculateCanvas = (getState) => {
    //if empty, start x,y at 0,0 then loop through images to get row/col and width/height for canvas:
    
    const cWidth = 2000
    const cHeight = 2000
    const container = {
        "canvasUID":"",
        "x":0,
        "y":0,
        "width":cWidth,
        "height":cHeight
    }

    const canvasStore = getState().sendToBlue.canvasContainer
    //if we find an existing canvas, use it to calculate next canvas:
    if(canvasStore){
        container.x = canvasStore.x + canvasStore.width + padding
        container.y = canvasStore.y
    }

    return container
}

/**********************
 * i need:
 * 1. track where previous canvas was placed, to place new canvas at canvas1.x,y + canvas1.width + padding
 * 2. to layout images one by one based on width and height in new canvas
 * 3. track images that have been placed, so i know what the max height for the row
 * 4. place images on the ._x until reaching max _x or width of canvas and then go to next row, based on max image height + padding
 * 5. rinse and repeat.
 * 
 * to store:
 * 1. canvas dimensions and coordinates - use dispatch, with canvasUID
 *      {
 *          canvasUID:"2352453245345345",
 *          canvasX:"234",
 *          canvasY:"234",
 *          canvasWidth:"234234"
 *          canvasHeight:"234234"
 *      }
 * 2. store images that are placed with dimensions and coordinates - use dispatch
 *  *  {
 *          imgURL:"foo.com/badAssShit.png",
 *          imgX:"234",
 *          imgY:"234",
 *          imgWidth:"234234",
 *          imgHeight:"234234"
 *      }
 * 
 * check store:
 * 1. for canvas placement 
 * 2. for image placement 
*/
export const uploadImage = (dispatch, getState) => {

    console.log("************** uploadImage.store = ", store.getState().sendToBlue)
    const sendBlueObj = store.getState().sendToBlue
    const canvasUID = sendBlueObj.canvasContainer.canvasUID
    const height = sendBlueObj.uploadableImage.height
    const width = sendBlueObj.uploadableImage.width
    const imageURL = sendBlueObj.uploadableImage.source
    console.log('uploadImage.canvasUID = ' + canvasUID)
    console.log('   uploadImage.sgVersion.imageURL = ', imageURL)

    //5f5b039a24a5e40014af558c
	//5f5b039a24a5e40014af558c
    // URL: https://api.apps.us.bluescape.com/v2/workspaces/KknIoESD5veTHuiRe8k1/elements/canvas/%225f5b039a24a5e40014af558c%22/images

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