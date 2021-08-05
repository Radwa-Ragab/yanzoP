import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import {APILINK} from '../../../../Endpoint'
const axiosApiInstance = axios.create();
class AddVehicle extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };

  }

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  };
  addVehicle = async () => {
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
        // console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if(error.response)
        {
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
        }
        return Promise.reject(error);
      }
    );
    let data = {
      name: this.state.name,
    };
    const result = await axiosApiInstance.post(
      APILINK +`/vehicle`,
      data
    );
    if (result) {
      console.log(result);
      if (result.data.data) {
        setTimeout(() => {
          toast.info(`Vehicle was created successfully`);
        }, 500);
      }
    }
  };

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container style={{ marginTop: "120px",marginLeft:'320px' }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-search-plus pr-3"></i> Add Vehicle
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.handleChange}
                />
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.errName}
                </p>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "end" }} sm={12} md={6}>
                <Button className="addBtn1">Cancel</Button>
                <Button
                  disabled={this.state.disable}
                  onClick={this.addVehicle}
                  className="addBtn2"
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
          {/* <ToastContainer position="bottom-right" /> */}
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
)(AddVehicle);
