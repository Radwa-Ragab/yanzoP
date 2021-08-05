import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TimePicker, Checkbox, Select } from "antd";
import moment from "moment";
// import GetCoordinates from "../GetCoordinates";
import ViewMap from "../ViewMap";
import { connect } from "react-redux";
import Geocode from "react-geocode";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";

const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");

class EditAgent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  componentDidMount() {
    this.getDetails();
  }

  getDetails = async () => {
    let result = await axiosApiInstance.get(
      APILINK + `/edit_agent?id=${this.props.match.params.id}`
    );
    console.log(result);
    this.setState({
      email: result.data.data.email,
      username: result.data.data.user_name,
    });
  };
  onEdit = async () => {
    let data;
    if (this.state.old === "") {
      data = {
        user_name: this.state.username,
        email: this.state.email,
      };
    } else {
      data = {
        old_password: this.state.old,
        new_password: this.state.new,
        user_name: this.state.username,
        email: this.state.email,
      };
    }

    console.log(data);
    const result = await axiosApiInstance
      .put(
        APILINK + `/agent_registration?user_id=${this.props.match.params.id}`,
        data
      )
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          for (let x in err.response.data) {
            err.response.data[x].map((r) => {
              console.log(r);
              let y = [];
              y.push(r);
              console.log(y);
              this.setState({ BEerr: y, disable: false });
            });
          }
        }
      });
    console.log(result);
    if (result) {
      if (result.data === "") {
        setTimeout(() => {
          toast.info(`Agent Information was updated successfully`);
        }, 500);
        setTimeout(() => {
          this.props.history.push("/all_agents");
        }, 3500);
      }
    }
  };
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "300px" }}
          className=""
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket pr-2"></i>Edit Agent
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.username}
                  name="username"
                  onChange={this.onHandleInput}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  value={this.state.email}
                  name="email"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Old Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Old Password"
                  value={this.state.old}
                  name="old"
                  onChange={this.onHandleInput}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="New Password"
                  value={this.state.new}
                  name="new"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <Button
                  disabled={this.state.disable}
                  onClick={this.onEdit}
                  className="addBtn2"
                >
                  Save changes
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.BEerr}
                </p>
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
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(EditAgent, axiosApiInstance));
