import React, { Component } from "react";

import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Select from "react-dropdown-select";
import "antd/dist/antd.css";
import { Select } from "antd";
import { connect } from "react-redux";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";
import isEqual from "lodash/isEqual";

const axiosApiInstance = axios.create();

class EditEmployee extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      email: "",
      password: "",
    };
  }

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  edit = async () => {
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
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
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
            let access_token = await x;
            console.log("here2");
            console.log(access_token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + access_token;
            localStorage.setItem("accessToken", "Bearer " + access_token);

            return axiosApiInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    let data;
    if (this.state.password === "") {
      data = {
        user_name: this.state.name,
        email: this.state.email,
      };
    } else {
      data = {
        user_name: this.state.name,
        email: this.state.email,
        password: this.state.password,
      };
    }
    console.log(data);

    const result = await axiosApiInstance.put(
      APILINK + `/create_employee?id=${this.props.match.params.id}`,
      data
    );
    if (result) {
      console.log(result);
      setTimeout(() => {
        toast.info(` Employee was updated successfully`);
      }, 500);
      setTimeout(() => {
        this.props.history.push("/employees");
      }, 3500);
    }
  };

  getDetails = async () => {
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
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
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
            let access_token = await x;
            console.log("here2");
            console.log(access_token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + access_token;
            localStorage.setItem("accessToken", "Bearer " + access_token);

            return axiosApiInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    const result = await axiosApiInstance.get(
      APILINK + `/create_employee?id=${this.props.match.params.id}`
    );
    console.log(result);
    if (result) {
      if (result.data) {
        this.setState({
          email: result.data.data.email,
          name: result.data.data.user_name,
        });
      }
    }
  };

  componentDidMount() {
    this.getDetails();
  }

  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "130px", marginLeft: "300px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket"></i> Add Employee
              </h2>
            </Col>
          </Row>
          <Form>
            {" "}
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User Name"
                    value={this.state.name}
                    name="name"
                    onChange={this.onHandleInput}
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    value={this.state.email}
                    name="email"
                    onChange={this.onHandleInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group>
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    name="password"
                    onChange={this.onHandleInput}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button onClick={this.edit} className="addBtn2">
                  Submit
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <p style={{ fontWeight: "bold", color: "red" }}>
                  {this.state.FEError}
                </p>
              </Col>
            </Row>
          </Form>
          <ToastContainer position="bottom-right" />
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(EditEmployee, axiosApiInstance));
