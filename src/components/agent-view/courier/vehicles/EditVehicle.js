import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { TimePicker } from "antd";
import moment from "moment";
import {APILINK} from '../../../../Endpoint'
const axiosApiInstance = axios.create();
class EditVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
      lat: "",
      lng: "",
    };
  }
 
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  editVehicle = async () => {
    var newID = this.props.user.id.replace(/-/g, "");
    console.log(newID);

    // Request interceptor for API calls
    axiosApiInstance.interceptors.request.use(
      async (config) => {
        config.headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Response interceptor for API calls
    axiosApiInstance.interceptors.response.use(
      (response) => {
        console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          console.log("here1");
          originalRequest._retry = true;
          let x = axios
            .post(APILINK +`/auth/jwt/refresh`, {
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
          // await this.refreshAccessToken();
          let access_token = await x;
          console.log("here2");
          console.log(access_token);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + access_token;
          localStorage.setItem("accessToken", "Bearer " + access_token);

          return axiosApiInstance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    var newID = this.props.user.id.replace(/-/g, "");

    let data = {
      name: this.state.name,
      
    };
    const result = await axiosApiInstance.put(
      APILINK +`/vehicle/${this.props.match.params.id}`,
      data
    );
    console.log(result);
    if (result.data === "") {
      setTimeout(() => {
        toast.info(`Vehicle name was updated successfully`);
      }, 500);
    }
  };

  getVehicle = async () => {

    // Request interceptor for API calls
    axiosApiInstance.interceptors.request.use(
      async (config) => {
        config.headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Response interceptor for API calls
    axiosApiInstance.interceptors.response.use(
      (response) => {
        console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          console.log("here1");
          originalRequest._retry = true;
          let x = axios
            .post(APILINK +`/auth/jwt/refresh`, {
              refresh: localStorage.getItem("refreshToken"),
            })
            .then((response) => {
              console.log(response.data.access);
              return response.data.access;
            });
          // await this.refreshAccessToken();
          let access_token = await x;
          console.log("here2");
          console.log(access_token);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + access_token;
          localStorage.setItem("accessToken", "Bearer " + access_token);

          return axiosApiInstance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK +`/vehicle/${this.props.match.params.id}`
    );
    console.log(result)
  this.setState({name:result.data.data.name})
  };

  componentDidMount() {
    this.getVehicle();
  }



  render() {
    return (
      <div>
        <Container style={{ marginTop: "100px",marginLeft:'320px' }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-building pr-2"></i> Edit Vehicle
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={12}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.onHandleInput}
                />
              </Col>
             
            </Row>
           

           
            <Row>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "end" }} sm={12} md={6}>
                <Button className="addBtn1">Cancel</Button>
                <Button onClick={this.editVehicle} className="addBtn2">
                  Save changes
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(EditVehicle);
