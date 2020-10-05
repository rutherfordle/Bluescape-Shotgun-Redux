import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import store from "../store";
import thunk from "redux-thunk";
//use messages here to display errors if they occur (like bad auth token)
import {createMessage, returnErrors} from "./messages";

import {ON_IMAGE_LOAD, LOADING_CANVAS, UPLOAD_IMAGE} from "./types";
import project from "../reducers/project";

export const imageToUpload = (img, playlistImages, versionID) => (dispatch, getState) => {
    console.log("sendToBlue.imageToUpload.playlistImages = ", playlistImages)
    console.log("!!!!!!!!!sendToBlue.versionID = " + versionID)

    dispatch({
        type: ON_IMAGE_LOAD,
        img:img,
        playlistImages:playlistImages,
        versionID:versionID
    });
}

const workspaceURL = 'https://client.apps.us.bluescape.com'
const orgID = 'wOETxsWt3SAmuyUQbbLy'
const workspaceUID = '1D_yaBDGot5emDS2F2YB'
// const workspaceUID = 'L8V-DgUmfe8n2dYMwPpj'
const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE2MDIxODcwMjcsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE2MDA5Nzc0MTcsImlhdCI6MTYwMDk3NzQyNywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.ZSfM9w-5oMDipezSYWgVahmZOAHIPPPlYtj9q75J43o'
const canvasUID = ''
const padding = 150
const maxColumns = 4
let uploadAll = 0;

export const sendToBlue = (index) => async ( dispatch, getState) => {
    uploadAll = 0;
    //get the current selected image to upload:
    const getImageToUpload = getState().sendToBlue.uploadableImage;
    console.log('actions.sendToBlue.getImageToUpload = ', getImageToUpload)

    await createCanvas( dispatch, getState);
    console.log('after create canvas!!!!!!!')
    uploadImage(dispatch, getState)
    //setTraitData(123,123,123)
};

export const sendToBluePlaylist = () => async (dispatch, getState) => {
    uploadAll = 1
    const playlistImagesState = getState().playlist.playlistImages
    console.log('actions.sendToBluePlaylist.playlistImagesState = ', playlistImagesState)
    await createCanvas( dispatch, getState);
    console.log('sendToBluePlaylist AFTER createCanvas')
    // playlistImagesState.map((val2, i) =>  { 
    //     let selectedImage = (val2.attributes.sg_uploaded_movie_image)? (val2.attributes.sg_uploaded_movie_image.url) : val2.attributes.image
    // }
    uploadPlaylistImages(dispatch, getState)
    
    //loop through all the images and send them one at a time to the uploadImage function
}

export const launchWorkspace = () => ( dispatch, getState) => {
    console.log('sendToBlue.launchWorkspace')
    window.open(workspaceURL + '/' + workspaceUID, "_blank") //to open new page
};

export const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
}

export const createCanvas = async (dispatch, getState) => {
    console.log('createCanvas.getPlaylistID = ' + getState().project.getPlaylistID)
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
                dispatch(createMessage({tokenReset:"Uploading..."}))
        })
        .catch(err => {
            (err.res.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"canvas create error"}))
        });
}

//calculate x, y based on last created canvas, and then width, height from images to be stored in canvas:
export const calculateCanvas = (getState) => {
    //if empty, start x,y at 0,0 then loop through images to get row/col and width/height for canvas:
    const canvasStore = getState().sendToBlue.canvasContainer
    const playlistImages = getState().sendToBlue.playlistImages
    console.log("------------------> calculateCanvas.canvasStore = ", canvasStore)

    let rowCount = -1
    let maxRowHeight = 0
    let maxRowWidth = 0 
    let maxCanvasHeight = 0
    let maxCanvasWidth = 0
    let rowHeight = 0
    let cWidth = 0
    let cHeight = 0
    let imgX = 0
    let imgY = 0

    if( uploadAll){
        let totalWidth = 0;
        playlistImages.map((img, i) => {
        
            // console.log('')
            let containerHeight = padding + img.height
            let containerWidth = padding + img.width
            // console.log("\ni = " + i + " playlistImages.length = " + playlistImages.length)
            // console.log('calculateCanvas.containerHeight = ' + containerHeight + ' | containerWidth = ' + containerWidth )
            // console.log("calculateCanvas.cHeight = " + cHeight + " | cWidth = " + cWidth)
            // console.log('calculateCanvas.maxRowHeight = ' + maxRowHeight + ' | maxRowWidth = ' + maxRowWidth)

            // console.log('containerHeight = ' + containerHeight + ' maxRowHeight = ' + maxRowHeight )
            if( containerHeight > maxRowHeight){
                maxRowHeight = containerHeight
                // console.log("   get new maxRowHeight = " + maxRowHeight)
            }
            // console.log("containerWidth = " + containerWidth + " maxRowWidth = " + maxRowWidth + " | cWidth = " + cWidth)
            maxRowWidth += containerWidth
            img.x = padding + imgX
            imgX += containerWidth
            img.y = padding + imgY

            //start of row here, including first row
            if( ((i+1) % maxColumns == 0) || (i == playlistImages.length-1)){
                
                // console.log("*********************> new row. maxRowHeight = " + maxRowHeight + " | cHeight = " + cHeight)
                // console.log("*********************> new row. maxRowWidth = " + maxRowWidth + " | cWidth = " + cWidth)
                cHeight += maxRowHeight
                imgY += maxRowHeight

                if( maxRowWidth > cWidth){
                    // console.log("calculate new cWidth = " + maxRowWidth + " previous cWidth = " + cWidth)
                    cWidth = maxRowWidth
                }
                
                imgX = 0
                maxRowHeight = 0
                maxRowWidth = 0
                
            }
            // console.log('cHeight = ' + cHeight + ' | cWidth = ' + cWidth)
        })

        cHeight += padding
        cWidth += padding

        // console.log("final ", playlistImages)

        //add remainder of row to cHeight:
        // cHeight += rowHeight
    }
    else{
        cWidth = padding + getState().sendToBlue.uploadableImage.width + padding
        cHeight = padding + getState().sendToBlue.uploadableImage.height + padding
    }

    // console.log("calculateCanvas.cHeight = " + cHeight + " | cWidth = " + cWidth)
    // console.log("calculateCanvas.maxRowHeight = " + maxRowHeight + " | maxRowWidth = " + maxRowWidth + " rowCount = " + rowCount)

    //width = loop through images, calculate max width based on max columns and padding
    //height = max height of rows

    const container = {
        "canvasUID":"",
        "x":0,
        "y":0,
        "width":cWidth,
        "height":cHeight
    }

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
    sendBlueObj.tryCount = 0
    console.log('uploadImage.canvasUID = ' + canvasUID)
    console.log('   uploadImage.sgVersion.imageURL = ', imageURL)

    //5f5b039a24a5e40014af558c
	//5f5b039a24a5e40014af558c
    // URL: https://api.apps.us.bluescape.com/v2/workspaces/KknIoESD5veTHuiRe8k1/elements/canvas/%225f5b039a24a5e40014af558c%22/images

    
    console.log('@@@@@@@@@@@@@@@@@ uploadImage.projectID = ', store.getState().project.getPlaylistID)
    var data = new FormData();
    data.append('url', imageURL);
    data.append('x', padding)
    data.append('y', padding)

    var config = {
        method: 'post',
        url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + workspaceUID + '/elements/canvas/' + canvasUID + '/images',
        headers: { 
            'Authorization': 'Bearer ' + accessToken, 
            'Content-Type': 'multipart/form-data'
        },
        data : data
        };

        //i need what projectID and versionID for this loaded image:
        axios(config)
            .then(function (res) {
                dispatch({
                    type: UPLOAD_IMAGE,
                    payload: res.data
                });
                console.log(JSON.stringify(res.data));                    
                //store the returned imageUID to find matching comment from listener
                sendBlueObj.imageUID = res.data.image.id
                setTraitData( sendBlueObj )
        })
        .catch(function (error) {
            console.log(error);
    });
}

export const uploadPlaylistImages = (dispatch, getState) => {

    console.log("----------------> uploadPlaylistImages.store = ", store.getState().sendToBlue)
    const sendBlueObj = store.getState().sendToBlue
    const canvasUID = sendBlueObj.canvasContainer.canvasUID
    // console.log('uploadImage.canvasUID = ' + canvasUID + " | padding = " + padding)
    let rowCount = -1
    let imgX = padding
    let imgY = padding
    let maxImgHeight = 0
    let maxImgWidth = 0

    sendBlueObj.playlistImages.map((img, i) => {

        let versionID = img.versionID
        let projectID = store.getState().project.getPlaylistID
        img.projectID = projectID
        img.tryCount = 0
        console.log('@@@@@@@@@@@@@@@@@ uploadImage.projectID = ', projectID)
        console.log('@@@@@@@@@@@@@@@@@@@@@@@@ uploadPlaylistImages.img.versionID = ', versionID)
        
        let containerHeight = padding + img.height
        let containerWidth = padding + img.width
        // console.log("++++++++++ imgX = " + imgX + " | imgY = " + imgY)
        // console.log("       containerHeight = " + containerHeight + " | containerWidth = " + containerWidth)
        // console.log("   NEW! x = " + img.x + " | y = " + img.y)

        if( i % maxColumns == 0){
            // console.log("new row")
            maxImgWidth = 0;
            imgX = padding
            imgY += maxImgHeight + padding
            rowCount++
            // console.log("   NEW ROW! imgX = " + imgX + " | imgY = " + imgY) 
        }
        else{
            imgX += containerWidth

        }

        
        if( containerHeight > maxImgHeight){
            maxImgHeight = containerHeight
        }
        // console.log("   img.height = " + containerHeight + " | maxImgHeight = " + maxImgHeight)
        
        if( containerWidth > maxImgWidth){
            maxImgWidth = containerWidth
        }
        // console.log("   containerWidth = " + containerWidth + " | maxImgWidth = " + maxImgWidth)
        // console.log("-------------- > uploadPlaylistImages.imgX = " + imgX + " | imgY = " + imgY)

        var data = new FormData()
        data.append('url', img.source)
        data.append('x', img.x)
        data.append('y', img.y)

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
                    console.log('uploadPlaylistImages = ', JSON.stringify(res.data.image.id));
                    //store the returned imageUID to find matching comment from listener
                    img.imageUID = res.data.image.id
                    setTraitData( img )
            })
            .catch(function (error) {
                console.log(error);
        });

    })
}
const maxTry = 5
export const setTraitData = (imgObject) => {
    
    console.log('-----> setTraitData.imgUID = ' + imgObject.imageUID + ' | projectID = ' + imgObject.projectID + ' | versionID =' + imgObject.versionID)
    var data = JSON.stringify([{"http://www.bluescape.com/projectID":imgObject.projectID,"http://www.bluescape.com/versionID":imgObject.versionID}]);

    var config = {
        method: 'post',
        url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + workspaceUID + '/elements/images/' + imgObject.imageUID + '/traits',
        headers: { 
            'Authorization': 'Bearer ' + accessToken, 
            'Content-Type': 'application/json',
        },
        data : data
    };

    axios(config)
        .then(function (response) {
            console.log(JSON.stringify(response.data));
            imgObject.tryCount = 0
        })
        .catch(function (error) {
            console.log(error);
            console.log("****** trait fail.imgUID = " + imgObject.imageUID + " | tryCount = " + imgObject.tryCount)
            if( imgObject.tryCount < maxTry){
                imgObject.tryCount++
                setTimeout(() => {
                    console.log("timeout complete: imgUID = " + imgObject.imageUID)
                        setTraitData( imgObject)
                }, 1000);
            }
            // dispatch(createMessage({tokenReset:"error uploading image, please try again"}))
        });

}

export const getPlaylistImages = (id,name) => (dispatch, getState) => {
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~getPlaylistImages.id = ", id)
    console.log("~~~~~~~~~~~~~~~~~~~~~~~~~getPlaylistImages.name = ", name)
    axios
        .get('https://bluescape.shotgunstudio.com/api/v1/entity/Version/?filter[playlists.Playlist.id]=' + id + '&fields=sg_uploaded_movie_image,cached_display_name,tags,user,image',tokenConfig(getState))
        .then(res => {
            console.log("getPlaylistImages.res.data = ", res.data)
            console.log("getPlaylistImages.id = ", id)
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