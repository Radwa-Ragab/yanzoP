import { AGENT_REQUEST } from "../actions/actionTypes";
const initialState = {
  searchData: {},
};

export default function (state = initialState, action) {
  //  (action.payload);
  switch (action.type) {
    case AGENT_REQUEST:
      return {
        ...state,
        searchData: action.payload,
      };

    default:
      return state;
  }
}
