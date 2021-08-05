import { ORDER_TYPE } from "../actions/actionTypes";
const initialState = {
  type: "1",
};

export default function (state = initialState, action) {
//   console.log (action.payload);
  switch (action.type) {
    case ORDER_TYPE:
      return {
        ...state,
        type: action.payload,
      };

    default:
      return state;
  }
}