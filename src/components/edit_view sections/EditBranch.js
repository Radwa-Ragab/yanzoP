import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { connect } from "react-redux";
import GetCoordinates from "../GetCoordinates";
import { ToastContainer, toast } from "react-toastify";
import { TimePicker } from "antd";
import moment from "moment";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();
class EditBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
      lat: "",
      lng: "",
    };
  }
  getCoor = (e, d) => {
    console.log(e, d);
    this.setState({ lat: e, lng: d });
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  editBranch = async () => {
    var newID = this.props.user.id.replace(/-/g, "");

    let data = {
      name: this.state.name,
      city: this.state.city,
      phone: this.state.phone,
      whatsapp: this.state.whatsapp,
      address: this.state.address,
      latitude: this.state.lat,
      longitude: this.state.lng,
      working_hours_from: this.state.workingFrom,
      working_hours_to: this.state.workingTo,
      delivery_hours_from: this.state.deliveryFrom,
      delivery_hours_to: this.state.deliveryTo,
      supplier: this.props.user.id,
    };
    const result = await axiosApiInstance.put(
      APILINK + `/Branch/${this.props.match.params.id}`,
      data
    );
    console.log(result);
    if (result.data === "") {
      setTimeout(() => {
        toast.info(`Branch was updated successfully`);
      }, 500);
    }
  };

  getBranches = async () => {
    var newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/suppliers/?supplier=${newID}`
    );
    result.data.map((res) => {
      let obj = res.branches.find((o) => o.id === this.props.match.params.id);
      this.setState({
        details: obj,
        name: obj.name,
        city: obj.city,
        address: obj.address,
        phone: obj.phone,
        whatsapp: obj.whatsapp,
        workingFrom: obj.working_hours_from,
        workingTo: obj.working_hours_to,
        deliveryFrom: obj.delivery_hours_from,
        deliveryTo: obj.delivery_hours_to,
        lat: obj.location.lat,
        lng: obj.location.lon,
      });
      console.log(obj);
    });
  };

  componentDidMount() {
    this.getBranches();
  }

  handleWorkingFrom = (time, timeString) => {
    console.log(timeString);
    this.setState({ workingFrom: timeString });
  };

  handleWorkingTo = (time, timeString) => {
    // console.log(timeString);
    this.setState({ workingTo: timeString });
  };

  handleDelieveryFrom = (time, timeString) => {
    this.setState({ deliveryFrom: timeString });
  };
  handleDelieveryTo = (time, timeString) => {
    this.setState({ deliveryTo: timeString });
  };

  render() {
    return (
      <div>
        <Container style={{ marginTop: "100px" }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-building pr-2"></i> Edit Branch
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
                  onChange={this.onHandleInput}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={this.state.city}
                  name="city"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  value={this.state.phone}
                  name="phone"
                  onChange={this.onHandleInput}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={this.state.address}
                  name="address"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Working Hours from</Form.Label>

                <TimePicker
                  onChange={this.handleWorkingFrom}
                  value={moment(this.state.workingFrom, "HH:mm:ss")}
                  use12Hours
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Working Hours to</Form.Label>
                <TimePicker
                  value={moment(this.state.workingTo, "HH:mm:ss")}
                  use12Hours
                  onChange={this.handleWorkingTo}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours from</Form.Label>
                <TimePicker
                  value={moment(this.state.deliveryFrom, "HH:mm:ss")}
                  onChange={this.handleDelieveryFrom}
                  use12Hours
                  // value={this.state.workingFrom}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours to</Form.Label>
                <TimePicker
                  value={moment(this.state.deliveryTo, "HH:mm:ss")}
                  onChange={this.handleDelieveryTo}
                  use12Hours
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Whats-App Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Whats-App Number"
                  value={this.state.whatsapp}
                  name="whatsapp"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <p>Google Map Location </p>
                <GetCoordinates getCoor={this.getCoor} />
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button className="addBtn1">Cancel</Button>
                <Button onClick={this.editBranch} className="addBtn2">
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

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(EditBranch, axiosApiInstance));
