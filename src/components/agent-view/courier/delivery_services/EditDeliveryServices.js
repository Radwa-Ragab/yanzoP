import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../../../Endpoint";
const axiosApiInstance = axios.create();
class EditDeliveryServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  onHandleInput = (e) => {
    this.setState({ name: e.target.value });
  };
  editService = async () => {
    let name = this.state.name.replace(/ /g, "-");
    let data = {
      name: name,
    };
    console.log(name);
    const result = await axiosApiInstance.put(
      APILINK + `/delivery_service/${this.props.match.params.id}`,
      data
    );
    console.log(result);
    if (result.data === "") {
      setTimeout(() => {
        toast.info(`Service name was updated successfully`);
      }, 500);
    }
  };

  getService = async () => {
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/delivery_service/${this.props.match.params.id}`
    );
    console.log(result);
    this.setState({ name: result.data.data.name });
  };

  componentDidMount() {
    this.getService();
  }

  render() {
    return (
      <div>
        <Container style={{ marginTop: "100px" }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-building pr-2"></i> Edit Service
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={12}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "end" }} sm={12} md={6}>
                <Button className="addBtn1">Cancel</Button>
                <Button onClick={this.editService} className="addBtn2">
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
)(ErrorHandler(EditDeliveryServices, axiosApiInstance));
