import {ON_IMAGE_LOAD, LOADING_CANVAS, UPLOAD_IMAGE} from "../actions/types";

const initialState = {
  onImgLoad:'',
  canvasContainer:'',
  imagePayload:'',
  playlistImages:[],
  versionID:'',
  imgSource:''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_CANVAS:
      return {
        ...state,
        canvasContainer:action.payload
      };
  
    case ON_IMAGE_LOAD:
      return {
        ...state,
        uploadableImage:action.img,
        playlistImages:action.playlistImages,
        versionID:action.versionID
      };

      case UPLOAD_IMAGE:
        return {
          ...state,
          imagePayload:action.payload
        };

    default:
      return state;
  }
}