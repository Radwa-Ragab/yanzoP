import React, { Component } from "react";

import { Container, Row, Col, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import axios from "axios";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();

class ViewProduct extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      price: "",
      code: "",
      quantity: "",
      supplier: "",
      category: "",
      image: "",
    };
  }

  viewProduct = async () => {
   
    const result = await axiosApiInstance
      .get(APILINK + `/products/?id=${this.props.match.params.id}`)
      .then((result) => {
        console.log(result.data);
        result.data.map((d) => {
          this.setState({
            name: d.name,
            code: d.code,
            price: d.price,
            quantity: d.quantity,
            supplier: d.supplier.name,
            image: d.image,
          });
          d.category.map((c) => {
            this.setState({ category: c });
          });
        });
      });
  };

  componentDidMount() {
    this.viewProduct();
  }

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container style={{ marginTop: "120px" ,marginLeft:'300px'}} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket"></i> View Product details
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Product name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Product code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Code"
                  value={this.state.code}
                  name="code"
                  disabled
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Product Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Price"
                  value={this.state.price}
                  name="price"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Product supplier</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Specifications"
                  value={this.state.supplier}
                  name="Specifications"
                  disabled
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Product Category</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Time"
                  value={this.state.category}
                  name="time"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Product Quantity</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Brand"
                  value={this.state.quantity}
                  name="brand"
                  disabled
                />
              </Col>
            </Row>
            <Row>
              {this.state.image ? (
                <img
                  width="250px"
                  height="250px"
                  src={APILINK + `${this.state.image}`}
                ></img>
              ) : (
                <p>No image selected</p>
              )}
            </Row>
            {/* <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Keywords</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Keywords"
                  value="Keywords"
                  name="key"
                  disabled
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Notes</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Notes"
                  value="Notes"
                  name="notes"
                  disabled
                />
              </Col>
            </Row> */}
          </Form>
        </Container>
      </div>
    );
  }
}

export default ErrorHandler(ViewProduct, axiosApiInstance);
