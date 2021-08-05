import { LOGIN, LOGOUT, SET_CURRENT_USER } from "../actions/actionTypes";
import isEmpty from "../helpers/is-Empty";
const initialState = {
  isAuth: false,
  user: {},
};

export default function (state = initialState, action) {
  //  (action.payload);
  switch (action.type) {
    case LOGIN:
      return {
        ...state,
        isAuth: true,
        user: action.payload,
      };

    case LOGOUT:
      return { ...state, isAuth: false, user: {} };

    case SET_CURRENT_USER:
      return {
        ...state,
        isAuth: !isEmpty(action.payload),
        currUser: action.payload,
      };

    default:
      return state;
  }
}
