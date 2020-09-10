import { SEND_TO_BLUE} from "../actions/types";

const initialState = {};

export default function(state = initialState, action) {
  switch (action.type) {
    case SEND_TO_BLUE:
      return (state = action.payload);
    default:
      return state;
  }
}