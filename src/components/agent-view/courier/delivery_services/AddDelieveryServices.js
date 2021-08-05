import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../../../Endpoint";
const axiosApiInstance = axios.create();
class AddDelieveryServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
    };
  }

  handleChange = (e) => {
    this.setState({ name: e.target.value });
  };
  addService = async () => {
    let name = this.state.name.replace(/ /g, "-");
    let data = {
      name: name,
    };
    const result = await axiosApiInstance.post(
      APILINK + `/delivery_service`,
      data
    );
    console.log(result);
    if (result.data.data.id) {
      setTimeout(() => {
        toast.info(`Service was created successfully`);
      }, 500);
    }
  };

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container style={{ marginTop: "120px" }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-truck pr-3"></i> Add Delivery Service
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
                  onChange={this.handleChange}
                />
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.errName}
                </p>
              </Col>
            </Row>

            <Row>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "end" }} sm={12} md={6}>
                <Button className="addBtn1">Cancel</Button>
                <Button
                  disabled={this.state.disable}
                  onClick={this.addService}
                  className="addBtn2"
                >
                  Add
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
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(AddDelieveryServices, axiosApiInstance));
