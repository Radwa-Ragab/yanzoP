import React, { Component } from "react";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "../../style-sheets/products.css";
import { APILINK } from "../../Endpoint";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import { TimePicker, Checkbox, Select } from "antd";
import moment from "moment";
const axiosApiInstance = axios.create();
class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: "",

      BEerr: [],
    };
  }

  createAgent = async () => {
    let data;

    data = {
      password: this.state.password,
      user_name: this.state.username,
      email: this.state.email,
    };

    const result = await axiosApiInstance
      .post(APILINK + `/agent_registration`, data)
      .catch((err) => {
        if (err.response.data) {
          for (let x in err.response.data.error) {
            err.response.data.error[x].map((r) => {
              let y = [];
              y.push(r);
              this.setState({ BEerr: y, disable: false });
            });
          }
        }
      });
    if (result) {
      if (result.data.status === "success") {
        setTimeout(() => {
          toast.info(`Agent has been created successfully`);
        }, 200);
        setTimeout(() => {
          this.props.history.push("/all_agents");
        }, 3500);
      }
    }
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.createAgent();
    }
    this.setState({ validated: true });
    e.preventDefault();
  };
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "320px" }}
          className="addP px-4"
        >
          <Row>
            <Col className="p-2 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="far fa-user pr-3"></i>Add Agent
              </h2>
            </Col>
          </Row>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            <Row className="mb-3">
              <Col sm={12} md={6}>
              <Form.Group controlId="validationuname">
                  <Form.Label>
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    User Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="User Name"
                    value={this.state.username}
                    name="username"
                    onChange={this.onHandleInput}
                    required
                  />
          
                <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                  </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationname">
                  <Form.Label>
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
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationpassword">
                  <Form.Label>
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Password
                  </Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    name="password"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              {/* <Col sm={12} md={6}></Col> */}
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <Button onClick={this.handleSubmit} className="addBtn2">
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
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(Profile, axiosApiInstance));
