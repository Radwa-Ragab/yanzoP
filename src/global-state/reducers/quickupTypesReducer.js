import {  IS_DEMAND } from "../actions/actionTypes";

const initialState = {
  isdemand: "",
};

export default function (state = initialState, action) {
  //  (action.payload);
  switch (action.type) {
   
    case IS_DEMAND:
      return {
        ...state,
        isdemand: action.payload,
      };

    default:
      return state;
  }
}
