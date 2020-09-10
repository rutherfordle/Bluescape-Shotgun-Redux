import {ON_IMAGE_LOAD, LOADING_BS, UPLOAD_IMAGE} from "../actions/types";

const initialState = {
  onImgLoad:'',
  canvasUID:'',
  imagePayload:''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_BS:
      return {
        ...state,
        canvasUID:action.payload
      };
  
    case ON_IMAGE_LOAD:
      return {
        ...state,
        uploadableImage:action.img
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