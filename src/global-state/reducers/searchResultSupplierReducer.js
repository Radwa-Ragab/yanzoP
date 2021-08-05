import { SUPPLIER_RES } from "../actions/actionTypes";
const initialState = {
  supplierRes: {},
};

export default function (state = initialState, action) {
  //  (action.payload);
  switch (action.type) {
    case SUPPLIER_RES:
      return {
        ...state,
        supplierRes: action.payload,
      };

    default:
      return state;
  }
}
