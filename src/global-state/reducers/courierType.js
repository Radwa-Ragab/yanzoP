import { IS_QUICKUP } from "../actions/actionTypes";

const initialState = {
  isQuick: false,
};

export default function (state = initialState, action) {
  //  (action.payload);
  switch (action.type) {
    case IS_QUICKUP:
      return {
        ...state,
        isQuick: action.payload,
      };

  
    default:
      return state;
  }
}
