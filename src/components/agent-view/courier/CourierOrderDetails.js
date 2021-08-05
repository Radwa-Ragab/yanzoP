import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../../style-sheets/products.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ErrorHandler from "../../../ErrorHandler/ErrorHandler";
import { connect } from "react-redux";
import { APILINK } from "../../../Endpoint";
import { Spin } from "antd";
const axiosApiInstance = axios.create();
class CourierOrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      details: "",
      loading: false,
    };
  }

  getDetails = async () => {
    this.setState({ loading: true });
    if (this.props.courierType) {
      const result = await axiosApiInstance.get(
        APILINK + `/get_order_detail_quick/${this.props.match.params.id}`
      );
      console.log(result);
      this.setState({ details: result.data.data, loading: false });
    } else {
      let data = {
        order_number: this.props.match.params.id,
      };
      const result = await axiosApiInstance.post(
        APILINK + `/get_order_detail`,
        data
      );
      if (result) {
        console.log(result);
        console.log(result.data.data[0]);
        if (result.data.length !== 0) {
          if (result.data.data.length !== 0) {
            this.setState({ details: result.data.data[0], loading: false });
          }
        }
      }
    }
  };

  componentDidMount() {
    console.log(this.props.courierType);
    this.getDetails();
  }

  render() {
    // console.log(this.state.details.orders[0])
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "300px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i className="fas fa-shopping-cart pr-2"></i> View order Details
              </h2>
            </Col>
          </Row>
          {this.props.courierType ? (
            <Row>
              <Col sm={12}>
                {" "}
                {Object.keys(this.state.details).length !== 0 ? (
                  <Form>
                    <Row className="mb-3">
                      <Col sm={12} md={6}>
                        <Form.Label>Order Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Name"
                          value={this.state.details.orders[0].items[0].name}
                          name="name"
                          disabled
                        />
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Label>Order Price</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="price"
                          value={this.state.details.orders[0].items[0].price}
                          name="price"
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={12} md={6}>
                        <Form.Label>Drop Off Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Drop off name"
                          value={
                            this.state.details.orders[0].dropoff.contact_name
                          }
                          name="name"
                          disabled
                        />
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Label>Pick Up Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="pickup name"
                          value={
                            this.state.details.orders[0].pickup.contact_name
                          }
                          name="pickup name"
                          disabled
                        />
                      </Col>
                    </Row>
                    <Row className="mb-3">
                      <Col sm={12} md={6}>
                        <Form.Label>Courier Name</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="Courier Name"
                          value={this.state.details.courier.name}
                          name="Courier Name"
                          disabled
                        />
                      </Col>
                      <Col sm={12} md={6}>
                        <Form.Label>Order State</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="status"
                          value={this.state.details.state}
                          name="status"
                          disabled
                        />
                      </Col>
                    </Row>
                  </Form>
                ) : (
                  <div style={{ margin: "50px", textAlign: "center" }}>
                    {/* <p>No details to preview</p> */}
                  </div>
                )}
              </Col>
            </Row>
          ) : (
            <Row>
              <Col sm={12}>
                {" "}
                {Object.keys(this.state.details).length !== 0 ? (
                  this.state.details.product ? (
                    <Form>
                      <Row className="mb-3">
                        <Col sm={12} md={6}>
                          <Form.Label>Product Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Name"
                            value={this.state.details.product.name}
                            name="name"
                            disabled
                          />
                        </Col>
                        <Col sm={12} md={6}>
                          <Form.Label>Product Price</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Price"
                            value={this.state.details.product.price}
                            name="Price"
                            disabled
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12} md={6}>
                          <Form.Label>Courier</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Courier"
                            value={this.state.details.shipper.name}
                            name="Courier"
                            disabled
                          />
                        </Col>
                        <Col sm={12} md={6}>
                          <Form.Label>Status</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="status"
                            value={this.state.details.status.value}
                            name="status"
                            disabled
                          />
                        </Col>
                      </Row>
                      <Row className="mb-3">
                        <Col sm={12} md={6}>
                          <Form.Label>Seller Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Seller Name"
                            value={this.state.details.seller.full_name}
                            name="Seller Name"
                            disabled
                          />
                        </Col>
                        <Col sm={12} md={6}>
                          <Form.Label>Buyer Name</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="name"
                            value={this.state.details.buyer.full_name}
                            name="name"
                            disabled
                          />
                        </Col>
                      </Row>
                    </Form>
                  ) : null
                ) : (
                  <div style={{ margin: "50px", textAlign: "center" }}>
                    {/* <p>No details to preview</p> */}
                  </div>
                )}
              </Col>
            </Row>
          )}
          <Row>
            <Col style={{ textAlign: "center" }} sm={12}>
              {this.state.loading ? (
                <Spin tip="...loading" />
              ) : Object.keys(this.state.details).length === 0 &&
                this.state.loading === false ? (
                <div style={{ margin: "50px", textAlign: "center" }}>
                  <p>No details to preview</p>
                </div>
              ) : null}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  courierType: state.courierType.isQuick,
  quickupTypes: state.quickupTypes.isdemand,
});
export default connect(mapStateToProps)(
  ErrorHandler(CourierOrderDetails, axiosApiInstance)
);
