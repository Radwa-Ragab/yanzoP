import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TimePicker } from "antd";
import { connect } from "react-redux";
// import GetCoordinates from "../GetCoordinates";
import ViewMap from "../ViewMap";
import Geocode from "react-geocode";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");

class Add_branch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: { lat: "", lon: "" },
    };
  }

  getCoor = (e, d) => {
    console.log(e, d);
    this.setState({ lat: e, lng: d });
  };

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleAddress = (e) => {
    this.setState({ address: e.target.value });
    // Get latitude & longitude from address.
    Geocode.fromAddress(e.target.value).then(
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
  addBranch = async () => {
    // Request interceptor for API calls

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
    const result = await axiosApiInstance.post(APILINK + `/Branch`, data);
    console.log(result);
    if (result.data.data) {
      setTimeout(() => {
        toast.info(`Branch was created successfully`);
      }, 500);
      setTimeout(() => {
        this.props.history.push("/branches");
      }, 3500);
    }
  };

  handleWorkingFrom = (time, timeString) => {
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
        <Container
          style={{ marginTop: "100px", marginLeft: "350px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-building pr-2"></i> Add Branch
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
                  onChange={this.handleAddress}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Working Hours from</Form.Label>
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  onChange={this.handleWorkingFrom}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Working Hours to</Form.Label>
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  onChange={this.handleWorkingTo}
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours from</Form.Label>
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  onChange={this.handleDelieveryFrom}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours to</Form.Label>
                <TimePicker
                  use12Hours
                  format="h:mm a"
                  onChange={this.handleDelieveryTo}
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
                <ViewMap location={this.state.location} />
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button className="addBtn1">Cancel</Button>
                <Button onClick={this.addBranch} className="addBtn2">
                  Create Branch
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
)(ErrorHandler(Add_branch, axiosApiInstance));
