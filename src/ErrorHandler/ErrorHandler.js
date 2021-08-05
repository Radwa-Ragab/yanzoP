import React, { Component } from "react";
import Modal from "./Modal/Modal";
import axios from "axios";
import { APILINK } from "../Endpoint";
// import Aux from '../Auxilliary'
const axiosApiInstance = axios.create();

const ErrorHandler = (WrappedComponent, axios) => {
  return class extends Component {
    state = {
      error: null,
      show: false,
    };

    componentWillMount() {
      this.reqInterceptor = axios.interceptors.request.use(async (config) => {
        config.headers.Authorization = localStorage.getItem("accessToken");
        console.log("dgquwg")
        this.setState({ error: null });
        return config;
      });
      this.resInterceptor = axios.interceptors.response.use(
        (response) => {
          return response;
        },
        async (error) => {
          const originalRequest = error.config;
          console.log(error.response);

          if (
            error.response &&
            error.response.status === 401 &&
            !originalRequest._retry
          ) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
              });
            //   await this.refreshAccessToken();
            let access_token = await x;

            axios.defaults.headers.common["Authorization"] =
              "Bearer " + access_token;
            localStorage.setItem("accessToken", "Bearer " + access_token);

            return axiosApiInstance(originalRequest);
          } else if (error.response) {
            if (error.response.status === 400 && error.response.status) {
              this.setState({ error: "", show: false });
            }
          } else {
            console.log(error);
            this.setState({ error: error, show: true });
            console.log(this.state);

           
          }
          return Promise.reject(error);

        }
      );
    }

    componentWillUnmount() {
      axios.interceptors.request.eject(this.reqInterceptor);
      axios.interceptors.response.eject(this.resInterceptor);
    }
    errorConfirmed = () => {
      this.setState({ error: null, show: false });
    };
    render() {
      return (
        <div>
          <Modal show={this.state.show} clicked={this.errorConfirmed}>
            {this.state.show ? this.state.error.message : null}
          </Modal>
          <WrappedComponent {...this.props}></WrappedComponent>
        </div>
      );
    }
  };
};

export default ErrorHandler;
