import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import "../../style-sheets/home.css";
import moment from "moment";
import { Checkbox, Select, TimePicker,Spin } from "antd";
import { Link } from "react-router-dom";
import { agentCoRequest } from "../../global-state/actions/agentRequestAction";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeOrderType } from "../../global-state/actions/changeTypeAction";
import { APILINK } from "../../Endpoint";
import isEqual from "lodash/isEqual";

const axiosApiInstance = axios.create();
class SearchCouriers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allVehicles: [],
      allServices: [],
      approval_need: "",
      provide_wallet: "",
      price: "",
      selectedData: "",
      selectedVehiclesId: [],
      selectedServicesId: [],
      selectedTime: "",
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState, this.state)) {
      if (
        this.state.selectedServicesId.length !== 0 ||
        this.state.selectedVehiclesId.length !== 0 ||
        this.state.price !== "" ||
        this.state.selectedTime !== ""
      ) {
        this.setState({ showWarning: false });
      }
    }
  }

  onClose = (e) => {
    this.props.hideCourier(false);
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  getVehicles = async () => {
    // Request interceptor for API calls

    // console.log(newID);
    const result = await axiosApiInstance.get(APILINK + `/vehicle_types/`);
    if (result) {
      this.setState({ allVehicles: result.data });
    }
  };

  getService = async () => {
    // Request interceptor for API calls

    // console.log(newID);
    const result = await axiosApiInstance.get(APILINK + `/delivery_service`);
    if (result) {
      this.setState({ allServices: result.data.data });
    }
  };

  handleTime = (time, timeString) => {
    this.setState({ selectedTime: timeString });
  };

  handleVehicles = (e) => {
    this.setState({
      selectedVehicles: e,
      selectedVehiclesId: e,
    });
    // console.log(e);
  };
  handleServices = (e) => {
    this.setState({
      selectedServices: e,
      selectedServicesId: e,
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

  onCoSearch = async (e) => {
    if (
      this.state.selectedServicesId.length === 0 &&
      this.state.selectedVehiclesId.length === 0 &&
      this.state.price == "" &&
      this.state.selectedTime == ""
    ) {
      this.setState({ showSpinner: false, showWarning: true });
    } else {
      this.setState({ showSpinner: true});

      let link;
      if (
        this.state.selectedVehiclesId.length === 1 &&
        this.state.selectedServicesId.length === 1
      ) {
        let x = this.state.selectedVehiclesId.toString();
        let y = this.state.selectedServicesId.toString();
        let z = y.replace(/-/g, "");
        link =
          APILINK +
          `/courier_services/?vehicle=${x}&delivery=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else if (
        this.state.selectedVehiclesId.length === 1 &&
        this.state.selectedServicesId.length !== 1
      ) {
        let x = this.state.selectedServicesId.toString();
        var res = x.replace(/,/g, "__");
        console.log(res);
        let z = res.replace(/-/g, "");
        console.log(z);
        let y = this.state.selectedVehiclesId.toString();

        link =
          APILINK +
          `/courier_services/?vehicle=${y}&delivery__in=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else if (
        this.state.selectedVehiclesId.length !== 1 &&
        this.state.selectedServicesId.length === 1
      ) {
        let x = this.state.selectedVehiclesId.toString();
        var res = x.replace(/,/g, "__");

        // console.log(res);
        let y = this.state.selectedServicesId.toString();
        let z = y.replace(/-/g, "");

        link =
          APILINK +
          `/courier_services/?vehicle__in=${res}&delivery=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else if (
        this.state.selectedVehiclesId.length === 0 ||
        this.state.selectedServicesId.length === 0
      ) {
        link =
          APILINK +
          `/courier_services/?price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else {
        //to take selected values lw hya aktr mn haga f array , make them string and seperate between them with __ to send it inside request params
        let x = this.state.selectedVehiclesId.toString();
        var res = x.replace(/,/g, "__");
        // console.log(res);

        let y = this.state.selectedServicesId.toString();
        var res2 = y.replace(/,/g, "__");
        let z = res2.replace(/-/g, "");

        link =
          APILINK +
          `/courier_services/?vehicle__in=${res}&delivery__in=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      }
      console.log(link);

      // Request interceptor for API calls

      const result = await axiosApiInstance.get(`${link}`);
      if (result) {
        console.log(result);
        this.props.changeOrderType("1");
        this.props.agentCoRequest(result.data);
        setTimeout(() => {
          window.location.assign("/view_couriers");
        }, 5000);
      }
    }
  };

  componentDidMount() {
    this.getVehicles();
    this.getService();
  }
  render() {
    // console.log(this.props);
    return (
      <Modal show={this.props.show} onHide={this.onClose}>
        <Container className="p-3">
          <Row>
            <Col sm={12}>
              <h6>Search For Couriers</h6>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="text"
                placeholder="Price"
                value={this.state.price}
                name="price"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>

          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Form.Label>Vehicles</Form.Label>
              <Select
                mode="multiple"
                showSearch
                placeholder="Select Vehicles"
                value={this.state.selectedVehicles}
                // labelInValue
                onChange={this.handleVehicles}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.allVehicles.map((item) => (
                  <Select.Option key={item.id} name={item.name} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Form.Label>Delivery Services</Form.Label>

              <Select
                mode="multiple"
                showSearch
                // labelInValue
                placeholder="select services"
                value={this.state.selectedServices}
                onChange={this.handleServices}
                style={{ width: "100%" }}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                  0
                }
              >
                {this.state.allServices.map((item) => (
                  <Select.Option name={item.name} key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>

          <Row className="mb-1">
            <Col sm={12} md={12}>
              <Form.Label>Delivery Time</Form.Label>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <TimePicker
                onChange={this.handleTime}
                defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
              />
            </Col>
          </Row>
          <Row className="my-2">
            <Col sm={12} md={6}>
              <Checkbox onChange={this.handleWallet}>Provide Wallet</Checkbox>
            </Col>
            {/* <Col sm={12} md={6}>
              <Checkbox onChange={this.handleApproval}>
                Approval Need
              </Checkbox>
            </Col> */}
          </Row>
          <Row>
            <Col style={{ textAlign: "right" }} sm={12} md={12}>
              {/* <Link to={"/view_couriers"}> */}
              {this.state.showSpinner ? (
                      <Spin tip="Loading..."></Spin>
                    ) : null}
              <Button onClick={this.onCoSearch} className="supplierBtn">
                Search
              </Button>
              {/* </Link> */}
            </Col>
          </Row>
          {this.state.showWarning ? (
            <p className="errorHandel text-center">
              You need to enter one field at least
            </p>
          ) : null}
        </Container>{" "}
      </Modal>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ agentCoRequest, changeOrderType }, dispatch);
};
export default connect(
  null,
  mapDispatchToProps
)(ErrorHandler(SearchCouriers, axiosApiInstance));
