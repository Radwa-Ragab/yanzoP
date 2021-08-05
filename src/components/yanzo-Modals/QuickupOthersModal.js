import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "../../style-sheets/home.css";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { bindActionCreators } from "redux";
import { APILINK } from "../../Endpoint";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Checkbox } from "antd";
import ViewMap from "../ViewMap";
import { Radio, Select, Checkbox } from "antd";

import Geocode from "react-geocode";
const axiosApiInstance = axios.create();

class QuickupOthersModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location2: {},
      location: {},
      serviceType: ["Same day"],
      paymentMode: ["pre_paid"],
      shareTrack: false,
      Snotes: "",
      Bnotes: "",
    };
  }
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onClose = (e) => {
    this.props.closeQuickupOthers(false);
  };
  handleAddress1 = (e) => {
    this.setState({ Baddress: e.target.value });
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

        this.setState({ Buyerlat: lat, Buyerlon: lng });
        // console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  handleAddress2 = (e) => {
    this.setState({ Saddress: e.target.value });
    // Get latitude & longitude from address.
    Geocode.fromAddress(e.target.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState((prevState) => ({
          location2: {
            lat: lat,
            lon: lng,
          },
        }));
        this.setState({ Sellerlat: lat, Sellerlon: lng });
        // console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  };

  handleKind = (e) => {
    this.setState({ selectedKind: e });
  };
  handleMode = (e) => {
    this.setState({ selectedMode: e });
  };
  handleTrack = (e) => {
    console.log(`checked = ${e.target.checked}`);
    this.setState({ shareTrack: e.target.checked });
  };

  createReqQuickup = async (e) => {
    // Request interceptor for API calls
    
    this.setState({ disable: true });

    let data = {
      order_type: this.props.type,
      order_name: this.state.name,
      order_id: this.state.code,
      courier: this.props.selectedCourier,
      kind: this.state.selectedKind,
      notes: "",
      payment_amount: 0,
      payment_mode: this.state.selectedMode,
      billing_identifier: null,
      scheduled_for: null,
      metadata: null,
      partner_order_id: this.state.code,
      origin: {
        contact_name: this.state.Sname,
        contact_phone: "+971599999999",
        partner_order_id: this.state.code,
        notes: this.state.Snotes,
        address: {
          address1: this.state.Saddress,
          coords: [this.state.Sellerlon, this.state.Sellerlat],
          country: this.state.Scountry,
          town: this.state.Stown,
        },
      },
      destination: {
        contact_name: this.state.Bname,
        contact_phone: "+971599999999",
        partner_order_id: this.state.code,
        share_tracking: this.state.shareTrack,
        notes: this.state.Bnotes,
        address: {
          address1: this.state.Baddress,
          coords: [this.state.Buyerlon, this.state.Buyerlat],
          country: this.state.Bcountry,
          town: this.state.Btown,
        },
      },
      items: [
        {
          name: this.state.name,
          quantity: this.state.Quantity,
          parcel_barcode: this.state.code,
        },
      ],
    };
    console.log(data);

    const result = await axiosApiInstance
      .post(APILINK + `/courier_quick_ecommerce_order`, data)
      .catch((err) => {
        console.log(err.response);
      });
    console.log(result);
    if (result) {
      if (result.data.data.id) {
        this.setState({ openOrder: false });
        setTimeout(() => {
          toast.info(`Request has been sent successfully`);
        }, 200);
        setTimeout(() => {
          this.props.history.push("/courier_orders");
        }, 3500);
      }
    }
  };

  render() {
    return (
      <Modal size="lg" show={this.props.showOther} onHide={this.onClose}>
        <Container className="p-3">
          <Row>
            <Col sm={12}>
              <h6>Create Order for Quick up courier (other services)</h6>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="name"
                value={this.state.name}
                name="name"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Form.Label>Product Quantity</Form.Label>
              <Form.Control
                type="number"
                placeholder="Quantity"
                value={this.state.Quantity}
                name="Quantity"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={12}>
              <Form.Label>Order Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="code"
                value={this.state.code}
                name="code"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Service Type</Form.Label>

              <Select
                placeholder="Service Type"
                value={this.state.selectedKind}
                onChange={this.handleKind}
                style={{ width: "100%" }}
              >
                {this.state.serviceType.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>

            <Col sm={6}>
              <Form.Label>Payment Mode</Form.Label>

              <Select
                placeholder="Service Type"
                value={this.state.selectedMode}
                onChange={this.handleMode}
                style={{ width: "100%" }}
              >
                {this.state.paymentMode.map((item) => (
                  <Select.Option key={item} value={item}>
                    {item}
                  </Select.Option>
                ))}
              </Select>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Drop off Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Drop off Name"
                value={this.state.Bname}
                name="Bname"
                onChange={this.onHandleInput}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Pickup Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pickup Name"
                value={this.state.Sname}
                name="Sname"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>{" "}
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Drop off Phone</Form.Label>
              <Form.Control
                type="number"
                placeholder="Drop off Phone"
                value={this.state.Bphone}
                name="Bphone"
                onChange={this.onHandleInput}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Pickup Phone</Form.Label>
              <Form.Control
                type="number"
                placeholder="Pickup Phone"
                value={this.state.Sphone}
                name="Sphone"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Drop off Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Drop off Country"
                value={this.state.Bcountry}
                name="Bcountry"
                onChange={this.onHandleInput}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Pickup Country</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pickup Country"
                value={this.state.Scountry}
                name="Scountry"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Drop off Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="Drop off Town"
                value={this.state.Btown}
                name="Btown"
                onChange={this.onHandleInput}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Pickup Town</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pickup Town"
                value={this.state.Stown}
                name="Stown"
                onChange={this.onHandleInput}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Drop off Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Drop off Address"
                value={this.state.Baddress}
                name="Baddress"
                onChange={this.handleAddress1}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Pickup Address</Form.Label>
              <Form.Control
                type="text"
                placeholder="Pickup Address"
                value={this.state.Saddress}
                name="Saddress"
                onChange={this.handleAddress2}
              />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col className="" sm={6}>
              <ViewMap location={this.state.location} />
            </Col>
            <Col className="" sm={6}>
              <ViewMap location={this.state.location2} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={6}>
              <Form.Label>Drop off Notes</Form.Label>
              <Form.Control
                value={this.state.Bnotes}
                name="Bnotes"
                onChange={this.onHandleInput}
                as="textarea"
                rows={3}
              />
            </Col>
            <Col sm={6}>
              <Form.Label>Pickup Notes</Form.Label>
              <Form.Control
                value={this.state.Snotes}
                name="Snotes"
                onChange={this.onHandleInput}
                as="textarea"
                rows={3}
              />
            </Col>
          </Row>
          <Row>
            {/* <Col sm={6}>
              <Form.Label>Drop off payment amount</Form.Label>
              <Form.Control
                type="number"
                placeholder="Drop off payment amount"
                value={this.state.amount}
                name="amount"
                onChange={this.onHandleInput}
              />
            </Col> */}
            <Col sm={12} md={6}>
              <Checkbox onChange={this.handleTrack}>Share Tracking</Checkbox>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "right" }} sm={12} md={12}>
              <Button onClick={this.createReqQuickup} className="supplierBtn">
                Create
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal>
    );
  }
}

export default ErrorHandler(QuickupOthersModal,axiosApiInstance) ;
