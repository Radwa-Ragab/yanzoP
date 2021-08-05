import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
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
      new: "",
      username: "",
      old: "",
      BEerr: [],
    };
  }

  componentDidMount() {
    this.getDetails();
  }

  getDetails = async () => {
    // Request interceptor for API calls
    
    // this.setState({ disable: true });
    if (this.props.user.user_type === "2") {
      var newID = this.props.user.id.replace(/-/g, "");
      const result = await axiosApiInstance.get(
        APILINK + `/suppliers/?supplier=${newID}`
      );
      if (result) {
        console.log(result);
        result.data.map((x) => {
          this.setState({
            name: x.name,
            email: x.user.email,
            username: this.props.user.user_name,
          });
        });
      }
    } else {
      this.setState({
        email: this.props.user.email,
        username: this.props.user.user_name,
      });
    }
  };

  updateInfo = async () => {
    // Request interceptor for API calls
    
    if (this.props.user.user_type === "2") {
    }
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
      .put(APILINK + `/agent_registration`, data)
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
          toast.info(`Credentails was updated successfully`);
        }, 500);
      }
    }
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
                <i class="far fa-user pr-3"></i>Account
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>User Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="User Name"
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
              <Col style={{ textAlign: "center" }} sm={12} >
                <Button onClick={this.updateInfo} className="addBtn2">
                  Save Changes
                </Button>
              </Col>
            </Row>
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

export default connect(mapStateToProps, null)(ErrorHandler(Profile,axiosApiInstance));
