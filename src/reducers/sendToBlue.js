import {ON_IMAGE_LOAD, LOADING_BS} from "../actions/types";

const initialState = {
  onImgLoad:'',
  canvasUID:''
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

    default:
      return state;
  }
}