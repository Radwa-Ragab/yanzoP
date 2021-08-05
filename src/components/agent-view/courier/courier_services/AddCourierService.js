import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form, Modal } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { TimePicker, Checkbox } from "antd";
import moment from "moment";
import "antd/dist/antd.css";
import { Select } from "antd";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../../../Endpoint";

const axiosApiInstance = axios.create();
class AddCourierService extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      allVehicles: [],
      allServices: [],
      nextUrl: null,
      provide_wallet: false,
      approval_need: false,
      selectedData: "1",
      details: {},
      BEerr: "",
      loading: false,
      disable: false,
      validated: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
    if (result && this.state.allVehicles.length == 0) {
      console.log(result);
      this.setState({ allVehicles: result.data.results });
    }
    if (result.data.next !== null) {
      this.setState({ nextUrl: result.data.next });
    }
    console.log(this.state.nextUrl);
    console.log(this.state.allVehicles);
  };
  getNext = async (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);
    if (result) {
      console.log(result);

      this.setState((prevState) => ({
        allVehicles: prevState.allVehicles.concat(result.data.results),
      }));
    }
    console.log(this.state.allVehicles);
  };
  getService = async () => {
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
    // this.getVehicles();
    // this.getService();
    this.getDetails();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.allVehicles !== this.state.allVehicles) {
      console.log("vehicles state has changed.");
    }
  }

  Add = async () => {
    this.setState({ disable: true });

    let data = {
      services: [
        {
          price: this.state.price,
          approval_need: this.state.approval_need,
          provide_wallet: this.state.provide_wallet,
          last_time_submit: this.state.selectedTime,
          vehicle: this.state.selectedVehiclesId.toString(),
          delivery: this.state.selectedServicesId.toString(),
        },
      ],
    };

    console.log(data);
    const result = await axiosApiInstance
      .put(APILINK + `/add_courier_service/${this.state.courierId}`, data)
      .catch((err) => {
        console.log(err.response.data.error);
        if (err.response) {
          this.setState({ disable: false });
          err.response.data.error.map((err) => {
            console.log(err);
            for (let x in err) {
              err[x].map((r) => {
                console.log(r);
                let y = [];
                y.push(r);
                this.setState({ BEerr: y });
              });
            }
          });
        }
      });
    if (result) {
      console.log(result);
      if (result.data.data === "added new services successful") {
        setTimeout(() => {
          toast.info(`Courier service was added successfully`);
        }, 500);
        setTimeout(() => {
          this.props.history.push(`/view_service/${this.props.match.params.id}`);
        }, 2500);
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
    console.log(e.value);
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
      if (obj !== undefined) {
        this.setState({
          // name: obj.courier.name,
          // price: obj.price,
          // approval_need: obj.approval_need,
          // provide_wallet: obj.provide_wallet,
          // selectedServices: obj.delivery.name,
          // selectedServicesId: obj.delivery.id,
          // selectedVehicles: obj.vehicle.name,
          // selectedVehiclesId: obj.vehicle.id,
          // selectedTime: obj.last_time_submit,
          courierId: obj.courier.id,
        });
      } else {
        this.setState({
          courierId: this.props.match.params.id,
        });
      }
    }
  };
  handleVname = (e) => {
    this.setState({ Vname: e.target.value });
  };
  addVehicle = async () => {
    let data = {
      name: this.state.Vname,
    };
    // for (let i = 0; i < 1000; i++) {
    //   const result = await axiosApiInstance.post(
    //     APILINK + `/vehicle`,
    //     { name: "test4" + i }
    //   );
    // }
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
      console.log(result);
      if (result.data.data.id) {
        this.setState({ Dname: "", show2: false });
        this.getService();
      }
    }
  };

  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.setState({ validated: true });
  };

  render() {
    // console.log(this.state);
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
                <i className="fas fa-truck pr-2"></i> Add Courier Service
              </h2>
            </Col>
          </Row>
          <Form noValidate  validated={this.state.validated} onSubmit={this.handleSubmit}>
            <Row className="my-2">
              <Col sm={12} md={6}>
              <Form.Group  controlId="validationCustomPrice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Price"
                    value={this.state.price}
                    name="price"
                    onChange={this.handleChange}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    enter price please.
                  </Form.Control.Feedback>
                  </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Last time to recieve order</Form.Label>

                <TimePicker
                  onChange={this.handleTime}
                  defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                  // value={moment(this.state.selectedTime, "HH:mm:ss")}
                />
              </Col>
            </Row>

            <Row className="my-3">
              <Col sm={12} md={6}>
                <Row>
                  <Col md={6}>
                    {" "}
                    <Form.Label>Select Vehicles</Form.Label>
                  </Col>
                  <Col style={{ textAlign: "right" }} md={6}>
                    {" "}
                    <p onClick={this.showModal1}>
                      <i class="fas fa-plus-circle"></i>Add Vehicle
                    </p>
                  </Col>
                </Row>
                <Select
                  // mode="multiple"
                  placeholder="Select Vehicles"
                  value={this.state.selectedVehicles}
                  onChange={this.handleVehicles}
                  style={{ width: "100%" }}
                  onClick={this.getVehicles}
                  showSearch
                >
                  {this.state.allVehicles.map((item) => (
                    <Select.Option key={item.id} id={item.id} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}

                </Select>
              </Col>
              <Col sm={12} md={6}>
                <Row>
                  <Col md={6}>
                    {" "}
                    <Form.Label>Select delivery Service</Form.Label>
                  </Col>
                  <Col style={{ textAlign: "right" }} md={6}>
                    {" "}
                    <p onClick={this.showModal2}>
                      <i class="fas fa-plus-circle"></i>Add delivery service
                    </p>
                  </Col>
                </Row>
                <Select
                  //   mode="multiple"
                  allowClear
                  placeholder="Select Services"
                  value={this.state.selectedServices}
                  onChange={this.handleServices}
                  style={{ width: "100%" }}
                  onClick={this.getService}
                  showSearch
                  onSearch
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
                <Checkbox
                  checked={this.state.provide_wallet}
                  onChange={this.handleWallet}
                >
                  Provide Wallet
                </Checkbox>
              </Col>
              <Col sm={12} md={6}>
                <Checkbox
                  checked={this.state.approval_need}
                  onChange={this.handleApproval}
                >
                  Approval Need
                </Checkbox>
              </Col>
            </Row>
            <Row className='mt-5'>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                {/* <Button className="addBtn1">Cancel</Button> */}
                <Button
                  disabled={this.state.disable}
                  onClick={this.Add}
                  className="addBtn2"
                  type="submit"
                >
                  Add service
                </Button>
              </Col>
            </Row>
          </Form>
          {this.state.BEerr.length !== 0
              ? this.state.BEerr.map((x) => {
                  return (
                    <Row>
                      <Col className="" style={{ textAlign: "center" }} sm={12}>
                        <p style={{ color: "red", fontWeight: "bold" }}>{x}</p>
                      </Col>
                    </Row>
                  );
                })
              : null}
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
)(ErrorHandler(AddCourierService, axiosApiInstance));
