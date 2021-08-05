import React, { Component } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";
const axiosApiInstance = axios.create();
class Add_category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disable: false,
      code: "",
    };
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  create = async () => {
    // Request interceptor for API calls
    let data = {
      name: this.state.name,
      code: this.state.code,
      type: this.state.type,
      yanzo_rate: this.state.rate,
      description: this.state.desc,
    };
    const result = await axiosApiInstance.post(APILINK + `/category`, data);
    if (result) {
      console.log(result);
      setTimeout(() => {
        toast.info(`Category was created successfully`);
      }, 500);
      setTimeout(() => {
        this.props.history.push("/categories");
      }, 3500);
    }
    console.log(result);
  };
  handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.create();
    }
    this.setState({ validated: true });
    e.preventDefault();
  };

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "320px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-sitemap pr-2"></i>Add Category
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
                <Form.Group controlId="validationUsername">
                  <Form.Label>
                    {" "}
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Name
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.name}
                    name="name"
                    onChange={this.handleChange}
                    required
                  />

                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col sm={12} md={6}>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Description"
                  value={this.state.desc}
                  name="desc"
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Type</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Type"
                  value={this.state.type}
                  name="type"
                  onChange={this.handleChange}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Yanzo Rate</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Yanzo Rate"
                  value={this.state.rate}
                  name="rate"
                  onChange={this.handleChange}
                />
              </Col>
            </Row>
            <Row className="mb-3"></Row>

            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button onClick={this.handleSubmit} className="addBtn2">
                  Submit
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

export default ErrorHandler(Add_category, axiosApiInstance);
