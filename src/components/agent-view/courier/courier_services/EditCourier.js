import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import {APILINK} from '../../../../Endpoint';
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();
class EditCourier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      allVehicles: [],
      allServices: [],
      provide_wallet: false,
      approval_need: false,
      selectedData: "1",
      details: {},
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.getDetails();
  }

  editName = async () => {
  
    let data = {
      courier: {
        name: this.state.name,
      },
    };
    console.log(data);
    const result = await axiosApiInstance.put(
      APILINK +`/courier/${this.state.courierId}`,
      data
    );
    if (result) {
      console.log(result);
      if (result.data === "") {
        setTimeout(() => {
          toast.info(`Courier Name was edited successfully`);
        }, 500);
      }
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
        console.log(error);
        const originalRequest = error.config;
        if (error.response) {
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
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK +`/courier_details/`
    );
    if (result) {
      // console.log(result);
      let obj = result.data.find((o) => o.id === this.props.match.params.id);
      console.log(obj);
      this.setState({
        name: obj.name,
      });
    }
  };

  render() {
    // console.log(this.state);
    return (
      <div>
        <Container style={{ marginTop: "120px",marginLeft:'320px' }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i className="fas fa-truck pr-2"></i> Edit Courier
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={8}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.handleChange}
                />
              </Col>
              <Col sm={12} md={4}>
                <Button
                  onClick={this.editName}
                  className="addBtn2"
                  style={{ marginTop: "30px" }}
                >
                  Save Changes
                </Button>
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

export default connect(mapStateToProps, null)(ErrorHandler(EditCourier, axiosApiInstance));
