import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { connect } from "react-redux";
import ViewBranchMap from "../ViewBranchMap";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();
class ViewBranch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: {},
    };
  }

  getBranches = async () => {
    var newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/suppliers/?supplier=${newID}`
    );
    if (result) {
      result.data.map((res) => {
        let obj = res.branches.find((o) => o.id === this.props.match.params.id);
        this.setState({ details: obj });
        console.log(obj);
      });
    }
  };

  componentDidMount() {
    this.getBranches();
  }

  render() {
    return (
      <div>
        <Container style={{ marginTop: "100px" }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-building pr-2"></i> View Branch
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
                  value={this.state.details.name}
                  name="name"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="City"
                  value={this.state.details.city}
                  name="city"
                  disabled
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Phone</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Phone"
                  value={this.state.details.phone}
                  name="phone"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Address</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={this.state.details.address}
                  name="address"
                  disabled
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Working Hours from</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={this.state.details.working_hours_from}
                  name="address"
                  disabled
                />
                {/* <TimePicker defaultValue={moment(this.state.details.working_hours_to)}   />, */}
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Working Hours to</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Address"
                  value={this.state.details.working_hours_to}
                  name="address"
                  disabled
                />
                {/* <TimePicker defaultValue={moment(this.state.details.working_hours_to)}   />, */}
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours from</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Working Hours"
                  value={this.state.details.delivery_hours_from}
                  name="Whours"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours to</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Delievery Hours"
                  value={this.state.details.delivery_hours_to}
                  name="Dhours"
                  disabled
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Whats-App Number</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Whats-App Number"
                  value={this.state.details.whatsapp}
                  name="number"
                  disabled
                />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <p>Google Map Location </p>
                <ViewBranchMap location={this.state.details.location} />
              </Col>
            </Row>
          </Form>
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
)(ErrorHandler(ViewBranch, axiosApiInstance));
