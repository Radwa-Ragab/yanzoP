import { REQUEST_DATA } from "../actions/actionTypes";
const initialState = {
  requestData: "",
};

export default function (state = initialState, action) {
  console.log (action.payload);
  switch (action.type) {
    case REQUEST_DATA:
      return {
        ...state,
        requestData: action.payload,
      };

    default:
      return state;
  }
}

