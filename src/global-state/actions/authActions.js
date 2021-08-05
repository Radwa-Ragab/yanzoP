import {
  SET_CURRENT_USER,
  LOGOUT,
  LOGIN,
  AGENT_REQUEST,
  SUPPLIER_RES,
  REQUEST_DATA,
  AGENT_CO_REQUEST
} from "./actionTypes";
import axios from "axios";
import setAuthToken from "../helpers/setAuthToken";
import jwt_decode from "jwt-decode";
import { APILINK } from "../../Endpoint";
export const userLogin = (userdata, history) => async (dispatch) => {
  const logindata = await new Promise((resolve, reject) => {
    axios
      .post(APILINK + "/auth/jwt/create", userdata)
      .then((res) => {
        console.log("hereeeeeeeeeeeeee");
        resolve(res.data);
        if (res.data) {
          if (res.data.id && res.data.user_type === "1") {
            const accessToken = res.data.access;
            const refreshToken = res.data.refresh;
            localStorage.setItem("accessToken", "Bearer " + accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setAuthToken(accessToken);
            const decodedToken = jwt_decode(accessToken);
            dispatch(setCurrentUser(decodedToken));
            dispatch({ type: LOGIN, payload: res.data });
            history.push("/agent_home");
          } else {
            const accessToken = res.data.access;
            const refreshToken = res.data.refresh;
            localStorage.setItem("accessToken", "Bearer " + accessToken);
            localStorage.setItem("refreshToken", refreshToken);
            setAuthToken(accessToken);
            const decodedToken = jwt_decode(accessToken);
            dispatch(setCurrentUser(decodedToken));
            dispatch({ type: LOGIN, payload: res.data });
            history.push("/home");
          }
        }
      })
      .catch((err) => {
        // reject(err);
        if (err.response) {
          console.log(err.response.data.detail);
          resolve(err.response.data.detail);
        }
      });
  });
  // dispatch({ type: LOGIN, payload: logindata });
  return logindata;
};

export const setCurrentUser = (decodedToken) => {
  return {
    type: SET_CURRENT_USER,
    payload: decodedToken,
  };
};

export const LogOut = () => async (dispatch) => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  setAuthToken(false);
  dispatch(setCurrentUser({}));
  dispatch({ type: AGENT_REQUEST, payload: {} });
  dispatch({ type: SUPPLIER_RES, payload: {} });
  dispatch({ type: REQUEST_DATA, payload: {} });
  dispatch({ type: AGENT_CO_REQUEST, payload: {} });

  dispatch({ type: LOGOUT });
};
