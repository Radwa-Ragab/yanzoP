import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { TimePicker, Checkbox } from "antd";
import moment from "moment";
import "antd/dist/antd.css";
import { Select } from "antd";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../../../Endpoint";
const axiosApiInstance = axios.create();
class EditCourierService extends Component {
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

  getVehicles = async () => {
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
    const result = await axiosApiInstance.get(APILINK + `/vehicle`);
    if (result) {
      console.log(result);
      this.setState({ allVehicles: result.data.data });
    }
  };

  getService = async () => {
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
    const result = await axiosApiInstance.get(APILINK + `/delivery_service`);
    if (result) {
      console.log(result);
      this.setState({ allServices: result.data.data });
    }
  };

  componentDidMount() {
    this.getVehicles();
    this.getService();
    this.getDetails();
  }

  edit = async () => {
    // let vehicles;
    // let services;
    // console.log(this.state.selectedVehicles.length);
    // if (this.state.selectedVehicles.length === 1) {
    //   vehicles = this.state.selectedVehicles.toString();
    // } else {
    //   let x = this.state.selectedVehicles.map((s) => ({ vehicle: s }));
    //   vehicles = x;
    // }

    // if (this.state.selectedServices.length === 1) {
    //   services = this.state.selectedServices.toString();
    // } else {
    // //   let x = this.state.selectedServices.map((s) => ({ name: s }));
    //   services = this.state.selectedServices;
    // }

    let data = {
      price: this.state.price,
      submit_data: this.state.selectedData,
      approval_need: this.state.approval_need,
      provide_wallet: this.state.provide_wallet,
      last_time_submit: this.state.selectedTime,
      vehicle: this.state.selectedVehiclesId.toString(),
      delivery: this.state.selectedServicesId.toString(),
    };

    console.log(data);
    const result = await axiosApiInstance.put(
      APILINK + `/courier_service/${this.props.match.params.id}`,
      data
    );
    if (result) {
      console.log(result);
      if (result.data === "") {
        setTimeout(() => {
          toast.info(`Courier service was edited successfully`);
        }, 500);
        setTimeout(() => {
          this.props.history.push(`/view_all_courier`);
        }, 3500);
      }
    }
  };

  handleTime = (time, timeString) => {
    this.setState({ selectedTime: timeString });
  };

  handleVehicles = (v, e) => {
    this.setState({
      selectedVehicles: e.value,
      selectedVehiclesId: e.id,
    });
    console.log(e);
  };
  handleServices = (v, e) => {
    this.setState({
      selectedServicesId: e.id,
      selectedServices: e.value,
    });
    // console.log(e);
  };
  handleSubmitData = (e) => {
    this.setState({
      selectedData: e,
    });
    console.log(e);
  };
  handleWallet = (e) => {
    console.log(`checked = ${e.target.checked}`);
    this.setState({ provide_wallet: e.target.checked });
  };
  handleApproval = (e) => {
    console.log(`checked = ${e.target.checked}`);
    this.setState({ approval_need: e.target.checked });
  };

  getDetails = async () => {
    // console.log(newID);
    const result = await axiosApiInstance.get(APILINK + `/courier_services/`);
    if (result) {
      // console.log(result);
      let obj = result.data.find((o) => o.id === this.props.match.params.id);
      console.log(obj);
      this.setState({
        name: obj.courier.name,
        price: obj.price,
        approval_need: obj.approval_need,
        provide_wallet: obj.provide_wallet,
        selectedServices: obj.delivery.name,
        selectedServicesId: obj.delivery.id,
        selectedVehicles: obj.vehicle.name,
        selectedVehiclesId: obj.vehicle.id,
        selectedTime: obj.last_time_submit,
        courierId: obj.courier.id,
      });
    }
  };

  render() {
    console.log(this.state);
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "320px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i className="fas fa-truck pr-2"></i> Edit Courier Service
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="my-2">
              <Col sm={12} md={6}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  value={this.state.price}
                  name="price"
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className="my-3">
              <Col sm={12} md={6}>
                <Form.Label>Last time to recieve order</Form.Label>

                <TimePicker
                  onChange={this.handleTime}
                  // defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                  value={moment(this.state.selectedTime, "HH:mm:ss")}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Submit Data</Form.Label>

                <Select
                  placeholder="Select submit data"
                  value={this.state.selectedData}
                  onChange={this.handleSubmitData}
                  style={{ width: "100%" }}
                >
                  <Select.Option key={1} value={"1"}>
                    API
                  </Select.Option>
                  <Select.Option key={2} value={"2"}>
                    Dashboard
                  </Select.Option>
                </Select>
              </Col>
            </Row>
            <Row className="my-3">
              <Col sm={12} md={6}>
                <Form.Label>Selected vehicles</Form.Label>

                <Select
                  // mode="multiple"
                  placeholder="Select Vehicles"
                  value={this.state.selectedVehicles}
                  onChange={this.handleVehicles}
                  style={{ width: "100%" }}
                >
                  {this.state.allVehicles.map((item) => (
                    <Select.Option key={item.id} id={item.id} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>selected services</Form.Label>

                <Select
                  //   mode="multiple"
                  allowClear
                  placeholder="Select Services"
                  value={this.state.selectedServices}
                  onChange={this.handleServices}
                  style={{ width: "100%" }}
                  showSearch
                >
                  {this.state.allServices.map((item) => (
                    <Select.Option key={item.id} id={item.id} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>{" "}
            </Row>
            <Row>
              <Col sm={12} md={6}>
                <Form.Label>provide wallet?</Form.Label>
                <br />
                <Checkbox
                  checked={this.state.provide_wallet}
                  onChange={this.handleWallet}
                >
                  Provide Wallet
                </Checkbox>
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Approval needed?</Form.Label>
                <br />
                <Checkbox
                  checked={this.state.approval_need}
                  onChange={this.handleApproval}
                >
                  Approval Need
                </Checkbox>
              </Col>
            </Row>
            <Row className="mt-5">
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                {/* <Button className="addBtn1">Cancel</Button> */}
                <Button onClick={this.edit} className="addBtn2">
                  Save changes
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

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(EditCourierService, axiosApiInstance));
