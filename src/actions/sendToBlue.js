import axios from "axios";
import {tokenConfig,loadUser} from "./auth"
import store from "../store";
//use messages here to display errors if they occur (like bad auth token)
import {createMessage, returnErrors} from "./messages";

import {ON_IMAGE_LOAD, ON_IMG_LOAD, SEND_TO_BLUE} from "./types";

export const imageToUpload = (img) => (dispatch, getState) => {
    dispatch({
        type: ON_IMAGE_LOAD,
        img:img
    });

}

export const sendToBlue = (index) => (dispatch, getState) => {
    const getImageToUpload = getState().sendToBlue.uploadableImage;
    const getPlaylistNameSelected = getState().playlist.playlistNameSelected;
    console.log('getPlaylistNameSelected', getPlaylistNameSelected);
    console.log('getImageToUpload', getImageToUpload);
    console.log('index.relationships name', index.relationships.user.data.name);
    // let playlistID = '';
    // if (getPlaylistID) {
    //     playlistID = 'filter[project.Project.id]='+ getPlaylistID
    // }else if (!getPlaylistID || typeof getPlaylistID == 'undefined'){
    //     playlistID =  ''
    // }

    // this.state = {
    //     result:[],
    //     dimensions: [],
    //     counter: 0,
    //     orgID: 'wOETxsWt3SAmuyUQbbLy',
    //     workspaceUID: 'L8V-DgUmfe8n2dYMwPpj',
    //     accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0eXBlIjoiVVNFUiIsInN1YiI6IkJDMGkwd3paNUNhcGg3aTg3MUthIiwic3BpZCI6NTI3LCJhdWQiOlsiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5YmY4YyIsIjZjNDM3MjIzZTNiMDk2MmMzMWYyOWU3OWYwYmZkYTI5ZWExYTY4OWMiLCIzNmY4Y2Y1MTc1ZTRmYWFhNGYwNjcxODQwNGI3ZGY5NGRkYzBkOGFlIiwiMDE1ZjQ4MWFjZmU0MDJjOWJhZTQzNTM4OWVmYmI2OTE0OTI5Y2U5ZCJdLCJleHAiOjE1OTk4NTk1NzMsImF6cCI6Ijc0YjkwYTYwIiwic2NvcGVzIjpbInVzZXIiXSwiYXBwX2F1dGhvcml6YXRpb25faWQiOjE0MTUzLCJuYmYiOjE1OTg2NDk5NjMsImlhdCI6MTU5ODY0OTk3MywiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS1hcGkuYXBwcy51cy5ibHVlc2NhcGUuY29tIn0.frwJksFbw7Z9X_oH_0lJf_y2bMN5yTL--VA1YHQmLYc',
    //     canvasUID:''
    // }

    // const pName = getState().playlist.playlistNameSelected;
    // const pName = getState().playlist.playlistNameSelected;
    // console.log('action.sendToBlue.pName= ', pName)

    // const selectedImage = (index.attributes.sg_uploaded_movie_image)? (index.attributes.sg_uploaded_movie_image.url) : index.attributes.image
    // //const selectedImage = this.state.result[index].attributes.sg_uploaded_movie_image.url
    // // console.log('dimensions',this.state.dimensions);
    // const image = this.state.dimensions.find( el => el.source == selectedImage)
    // console.log('Image.height!!!', image.height);
    // console.log('Image.width', image.width);
    
    // console.log('action.sendToBlue.result.user.name= ',index.relationships.user.data.name)
    // console.log('action.sendToBlue.result.images= ',(selectedImage))
    
    // let ts = new Date().toLocaleDateString()
    
    // //date | playlist name | user
    // const canvasName = ts  + ' | ' + this.state.playlistName + ' | ' + index.relationships.user.data.name
    // console.log('sendToBlue:canvasName = ' + canvasName)
    // // this.uploadImageFetch( selectedImage)
    // this.createCanvas( canvasName)
    // this.uploadImage( selectedImage)    


    // axios
    //     .get('https://bluescape.shotgunstudio.com/api/v1/entity/playlists?' + playlistID + '&fields=*',tokenConfig(getState))
    //     .then(res => {
    //         dispatch({
    //             type: GET_PLAYLIST,
    //             payload: res.data.data
    //         });
    //     })
    //     .catch(err => {
    //         (err.response.status === 401) ? store.dispatch(loadUser()):''
    //         dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
    //     });
};

export const createCanvas = ( canvasName) => {
    console.log('createCanvas.canvasName = ' + canvasName)
    
    const rndCoord = 5000
    var data = JSON.stringify({
                            "name":canvasName,
                            "width":1000,
                            "height":1000,
                            'x':this.getRandomInt(rndCoord),
                            'y':this.getRandomInt(rndCoord)
                        });

    var config = {
        method: 'post',
        url: 'https://api.apps.us.bluescape.com/v2/workspaces/' + this.state.workspaceUID + '/elements/canvas',
        headers: { 
            'Authorization': 'Bearer ' + this.state.accessToken,
            'Content-Type': 'application/json'
          },
          data : data
        };

        axios(config)
            .then(function (response) {
                const canvasUID = JSON.stringify(response.data.canvas.id)
                console.log('canvasUID = ' + canvasUID);
                this.setState ({"canvasUID": canvasUID})
        })
        .catch(function (error) {
            console.log(error);
    });    
}

export const uploadImage = ( imageURL, canvasName) => {
    console.log('uploadImage.canvasName = ' + canvasName)
    console.log('   uploadImage.sgVersion.imageURL = ', imageURL)
    
    const rndCoord = 5000

    // axios({
    //     method: 'post',
    //     url: 'myurl',
    //     data: bodyFormData,
    //     headers: {'Content-Type': 'multipart/form-data' }
    //     })
    //     .then(function (response) {
    //         //handle success
    //         console.log(response);
    //     })
    //     .catch(function (response) {
    //         //handle error
    //         console.log(response);
    //     });




    // var data = new FormData();
    var data = new FormData();
    data.append('url', imageURL);
    data.append('x', this.getRandomInt(rndCoord));
    data.append('y', this.getRandomInt(rndCoord));

    var config = {
        method: 'post',
        url: 'https://cors-anywhere.herokuapp.com/https://api.apps.us.bluescape.com/v2/workspaces/' + this.state.workspaceUID + '/elements/images',
        headers: { 
            'Authorization': 'Bearer ' + this.state.accessToken, 
            'Content-Type': 'multipart/form-data'
        },
        data : data
        };

        axios(config)
            .then(function (response) {
            console.log(JSON.stringify(response.data));
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
            (err.response.status === 401) ? store.dispatch(loadUser()):''
            dispatch(createMessage({tokenReset:"Resetting token, please try again"}))
        });
};

export const removePlaylist = () => (dispatch, getState) => {
    dispatch({
        type: REMOVE_PLAYLIST,
    });
};