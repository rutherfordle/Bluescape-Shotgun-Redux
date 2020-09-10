import {ON_IMAGE_LOAD, SEND_TO_BLUE} from "../actions/types";

const initialState = {
  onImgLoad:''
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEND_TO_BLUE:
      return (state = action.payload);
    default:
      return state;
    case ON_IMAGE_LOAD:
      return {
        ...state,
        uploadableImage:action.img
      };
  }
}