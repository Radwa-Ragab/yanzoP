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

class CreateEmployee extends Component {
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

  create = async () => {
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
  

    let data = {
      user_name: this.state.name,
      email: this.state.email,
      password: this.state.password,
    };
    console.log(data);

    const result = await axiosApiInstance.post(APILINK + `/create_employee`, data);
    if (result) {
      console.log(result);
      setTimeout(() => {
        toast.info(`New Employee was created successfully`);
      }, 500);
      setTimeout(() => {
        this.props.history.push("/employees");
      }, 3500);
    }
  };

  handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.create();
    }
    this.setState({ validated: true });
    e.preventDefault();
  };

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
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            {" "}
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationUsername">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User Name"
                    value={this.state.name}
                    name="name"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationcode">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    value={this.state.email}
                    name="email"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationprice">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    name="password"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button onClick={this.handleSubmit} className="addBtn2">
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
)(ErrorHandler(CreateEmployee, axiosApiInstance));
