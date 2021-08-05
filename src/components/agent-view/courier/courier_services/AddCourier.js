import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Collapse,
} from "react-bootstrap";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import { TimePicker, Checkbox } from "antd";
import moment from "moment";
import "antd/dist/antd.css";
import { Select } from "antd";
import Geocode from "react-geocode";
import ViewMap from "../../../ViewMap";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../../../Endpoint";
// import { Collapse } from 'antd';

const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");
// const { Panel } = Collapse;
// const text = `
//   A dog is a type of domesticated animal.
//   Known for its loyalty and faithfulness,
//   it can be found as a welcome guest in many households across the world.
// `;
class AddCourier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password1: "",
      password2: "",
      name: "",
      phone: "",
      address: "",
      location: {
        lat: "",
        lon: "",
      },
      allVehicles: [],
      allServices: [],
      provide_wallet: false,
      approval_need: false,
      selectedData: "1",
      count: "1",
      show1: false,
      show2: false,
      email: "",
      selectedVehicles: "",
      selectedServices: "",
      selectedVehiclesId: "",
      selectedServicesId: "",
      price: "",
      last_time_submit: "",
      disable: false,
      pwError: "",
      BEerr: "",
      openCollapse: false,
    };
  }
  callback = () => {
    console.log(this.state.openCollapse);

    this.setState((prevState) => {
      return { openCollapse: !prevState.openCollapse };
    });
  };
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handlePassword1 = (e) => {
    this.setState({ password1: e.target.value }, () => {
      if (this.state.password1.length < 8) {
        this.setState({
          pwError: "The password must be 8 characters at least",
          disable: true,
        });
      } else {
        this.setState({ pwError: "", disable: false });
      }
    });
  };
  handlePassword2 = (e) => {
    this.setState({ password2: e.target.value }, () => {
      if (this.state.password1 !== this.state.password2) {
        this.setState({
          pwError: "The password confirmation does not match",
          disable: true,
        });
      } else {
        this.setState({ pwError: "", disable: false });
      }
    });

    console.log(this.state.disable);
  };
  handleAddress = (e) => {
    this.setState({ address: e.target.value });
    // Get latitude & longitude from address.
    Geocode.fromAddress(this.state.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState((prevState) => ({
          location: {
            lat: lat,
            lon: lng,
          },
        }));
        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  };
  showModal1 = (e) => {
    this.setState((state, props) => ({ show1: !state.show1 }));
  };
  showModal2 = (e) => {
    this.setState((state, props) => ({ show2: !state.show2 }));
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
    const result = await axiosApiInstance.get(
      APILINK + `/vehicle_types/?limit=10000`
    );
    if (result) {
      // console.log(result);
      this.setState({ allVehicles: result.data.results });
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
    const result = await axiosApiInstance.get(
      APILINK + `/delivery_service?limit=10000`
    );
    if (result) {
      console.log(result);
      this.setState({ allServices: result.data.data });
    }
  };

  componentDidMount() {
    console.log(this.state);
  }

  addCourier = async () => {
    this.setState({ disable: true });
    let data;
    if (
      this.state.selectedVehicles === "" &&
      this.state.selectedServices === "" &&
      this.state.price === "" &&
      this.state.last_time_submit === ""
    ) {
      // alert('hna fl if')

      data = {
        courier: {
          username: this.state.userName,
          name: this.state.name,
          email: this.state.email,
          new_password1: this.state.password1,
          new_password2: this.state.password2,
          phone: this.state.phone,
          address: this.state.address,
          submit_data: this.state.selectedData,
        },
        services: [],
      };
      console.log(data);
    } else {
      // alert('hna fl else')
      data = {
        courier: {
          username: this.state.userName,
          name: this.state.name,
          email: this.state.email,
          new_password1: this.state.password1,
          new_password2: this.state.password2,
          phone: this.state.phone,
          address: this.state.address,
          submit_data: this.state.selectedData,
        },
        services: [
          {
            price: this.state.price,
            approval_need: this.state.approval_need,
            provide_wallet: this.state.provide_wallet,
            last_time_submit: this.state.selectedTime,
            vehicle: this.state.selectedVehiclesId,
            delivery: this.state.selectedServicesId,
          },
        ],
      };
    }

    console.log(data);
    const result = await axiosApiInstance
      .post(APILINK + `/courier`, data)
      .catch((err) => {
        console.log(err.response);
        if (err.response) {
          for (let x in err.response.data.error) {
            err.response.data.error[x].map((r) => {
              console.log(r);
              let y = [];
              y.push(r);
              this.setState({ BEerr: y, disable: false });
            });
          }
        }
      });
    if (result) {
      console.log(result);
      if (result.data.data.id) {
        setTimeout(() => {
          toast.info(`Courier was created successfully`);
        }, 500);
        setTimeout(() => {
          this.props.history.push("/view_all_courier");
        }, 3500);
      }
    }
  };

  handleTime = (time, timeString) => {
    this.setState({ selectedTime: timeString });
  };

  handleVehicles = async (v, e) => {
    this.getVehicles();
    console.log(this.state.allVehicles);
    this.setState({
      selectedVehicles: e.value,
      selectedVehiclesId: e.id,
    });
    console.log(e);
  };
  handleServices = (v, e) => {
    this.setState({
      selectedServices: e.value,
      selectedServicesId: e.id,
    });
    console.log(e);
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

  onCount = (e) => {};
  handleVname = (e) => {
    this.setState({ Vname: e.target.value });
  };
  addVehicle = async () => {
    let data = {
      name: this.state.Vname,
    };
    const result = await axiosApiInstance.post(APILINK + `/vehicle`, data);
    if (result) {
      console.log(result);
      if (result.data.data) {
        this.setState({ show1: false, Vname: "" });
        this.getVehicles();
      }
    }
  };

  handledelivery = (e) => {
    this.setState({ Dname: e.target.value });
  };
  addService = async () => {
    let name = this.state.Dname.replace(/ /g, "-");
    let data = {
      name: name,
    };
    const result = await axiosApiInstance.post(
      APILINK + `/delivery_service`,
      data
    );
    if (result) {
      if (result.data.data.id) {
        this.setState({ Dname: "", show2: false });
        this.getService();
      }
    }
  };

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "320px" }}
          className=""
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i className="fas fa-truck pr-2"></i> Add Courier
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.handleChange}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  User Name
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="User Name"
                  value={this.state.userName}
                  name="userName"
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Email
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={this.state.email}
                  name="email"
                  onChange={this.handleChange}
                />
              </Col>

              <Col sm={12} md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  value={this.state.phone}
                  name="phone"
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={this.state.password1}
                  name="password1"
                  onChange={this.handlePassword1}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={this.state.password2}
                  name="password2"
                  onChange={this.handlePassword2}
                />
              </Col>
            </Row>
            <Row>
              <Col className="text-center" sm={12}>
                <p
                  style={{
                    textAlign: "center",
                    color: "red",
                    fontWeight: "bold",
                  }}
                >
                  {this.state.pwError}
                </p>
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={this.state.address}
                  name="address"
                  onChange={this.handleAddress}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>How to submit order</Form.Label>
                <Select
                  placeholder="How to submit order"
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
            <Row>
              <Col sm={12} md={6}>
                <p>Google Map Location </p>

                <ViewMap location={this.state.location} />
              </Col>
            </Row>
            {this.state.BEerr.length !== 0
              ? this.state.BEerr.map((x) => {
                  return (
                    <Row>
                      <Col
                        className="mt-3"
                        style={{ textAlign: "center" }}
                        sm={12}
                      >
                        <p style={{ color: "red", fontWeight: "bold" }}>{x}</p>
                      </Col>
                    </Row>
                  );
                })
              : null}
            <hr style={{ backgroundColor: "#e2d9d9" }} />

            <Row>
              <Button
                style={{ float: "right" }}
                onClick={this.callback}
                aria-controls="example-collapse-text"
                aria-expanded={this.state.openCollapse}
              >
                Add more details
              </Button>
            </Row>

            <Collapse in={this.state.openCollapse}>
              <Row className="mt-3">
                <Col sm={6}>
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={this.state.price}
                    name="price"
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>Last time to recieve order</Form.Label>

                  <TimePicker
                    onChange={this.handleTime}
                    defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Row className="mt-3">
                    <Col md={6}>
                      {" "}
                      <Form.Label>Select Vehicles</Form.Label>
                    </Col>
                    <Col style={{ textAlign: "right" }} md={6}>
                      {" "}
                      <p onClick={this.showModal1}>
                        <i className="fas fa-plus-circle"></i>Add Vehicle
                      </p>
                    </Col>
                    <Col md={12}>
                      <Select
                        // mode="multiple"
                        placeholder="Select Vehicles"
                        value={this.state.selectedVehicles}
                        onClick={this.getVehicles}
                        onChange={this.handleVehicles}
                        style={{ width: "100%" }}
                        showSearch
                      >
                        {this.state.allVehicles.map((item) => (
                          <Select.Option
                            key={item.id}
                            id={item.id}
                            value={item.name}
                          >
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                </Col>
                <Col sm={12} md={6}>
                  <Row className="mt-3">
                    <Col md={6}>
                      {" "}
                      <Form.Label>Select Services</Form.Label>
                    </Col>
                    <Col style={{ textAlign: "right" }} md={6}>
                      {" "}
                      <p onClick={this.showModal2}>
                        <i className="fas fa-plus-circle"></i>Add Delivery
                        Service
                      </p>
                    </Col>
                    <Col md={12}>
                      <Select
                        //   mode="multiple"

                        placeholder="Select Services"
                        value={this.state.selectedServices}
                        onChange={this.handleServices}
                        onClick={this.getService}
                        style={{ width: "100%" }}
                        showSearch
                      >
                        {this.state.allServices.map((item) => (
                          <Select.Option
                            key={item.id}
                            id={item.id}
                            value={item.name}
                          >
                            {item.name}
                          </Select.Option>
                        ))}
                      </Select>
                    </Col>
                  </Row>
                </Col>{" "}
                <Col sm={12} md={6}>
                  <Checkbox onChange={this.handleWallet}>
                    Provide Wallet
                  </Checkbox>
                </Col>
                <Col sm={12} md={6}>
                  <Checkbox onChange={this.handleApproval}>
                    Approval Need
                  </Checkbox>
                </Col>
              </Row>
            </Collapse>

            <Row className="mb-3"></Row>
            <Row style={{ marginTop: "50px" }}>
              <Col lg={12}>
                {/* <h3 style={{ textAlign: "center", color: "red" }}>
                  {this.state.pwError}
                </h3> */}
              </Col>
            </Row>
            <Row>
              {/* <Col sm={12} md={6}></Col> */}
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button
                  disabled={this.state.disable}
                  onClick={this.addCourier}
                  className="addBtn2"
                >
                  Add Courier
                </Button>
              </Col>
            </Row>
          </Form>
          <ToastContainer position="bottom-right" />
        </Container>

        <Modal size="lg" show={this.state.show1} onHide={this.showModal1}>
          <Container className="p-4 modal2">
            <Row>
              <Col sm={12}>
                <h2> Add Vehicle</h2>{" "}
              </Col>
            </Row>
            <Form>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.Vname}
                    name="name"
                    onChange={this.handleVname}
                  />
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {this.state.errName}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col sm={12} md={6}></Col>
                <Col style={{ textAlign: "end" }} sm={12} md={6}>
                  <Button onClick={this.showModal1} className="addBtn1">
                    Cancel
                  </Button>
                  <Button onClick={this.addVehicle} className="addBtn2">
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal>

        <Modal size="lg" show={this.state.show2} onHide={this.showModal2}>
          <Container className="p-4 modal2">
            <Row>
              <Col sm={12}>
                <h2> Add Delivery service</h2>{" "}
              </Col>
            </Row>
            <Form>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.Dname}
                    name="name"
                    onChange={this.handledelivery}
                  />
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {this.state.errName}
                  </p>
                </Col>
              </Row>

              <Row>
                <Col sm={12} md={6}></Col>
                <Col style={{ textAlign: "end" }} sm={12} md={6}>
                  <Button onClick={this.showModal2} className="addBtn1">
                    Cancel
                  </Button>
                  <Button onClick={this.addService} className="addBtn2">
                    Add
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal>
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
)(ErrorHandler(AddCourier, axiosApiInstance));
