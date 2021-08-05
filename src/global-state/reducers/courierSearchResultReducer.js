import { AGENT_CO_REQUEST } from "../actions/actionTypes";
const initialState = {
  courierSearchResult: {},
};

export default function (state = initialState, action) {
  //  (action.payload);
  switch (action.type) {
    case AGENT_CO_REQUEST:
      return {
        ...state,
        courierSearchResult: action.payload,
      };

    default:
      return state;
  }
}