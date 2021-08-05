import React, { Component } from "react";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Form,
  Table,
} from "react-bootstrap";
import "../../style-sheets/home.css";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Checkbox } from "antd";
import ViewMap from "../ViewMap";
import { APILINK } from "../../Endpoint";
import Geocode from "react-geocode";
import isEqual from "lodash/isEqual";

const axiosApiInstance = axios.create();

class StandAloneCourierOrder extends Component {
  state = {
    location2: {},
    location: {},
    BEerr: "",
    name: "",
    price: "",
    ticket: "",
    Bname: "",
    Baddress: "",
    Bphone: "",
    Sname: "",
    Sphone: "",
    Saddress: "",
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
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
            BEerr: "",
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

  createRequest = async () => {
    if (
      this.state.name == "" &&
      this.state.ticket == "" &&
      this.state.price == "" &&
      this.state.Bname == "" &&
      this.state.Baddress == "" &&
      this.state.Bphone == "" &&
      this.state.Sname == "" &&
      this.state.Saddress == "" &&
      this.state.Sphone == ""
    ) {
      this.setState({ showWarning: true });
    } else {
      this.setState({ disable: true });

      let data;

      data = {
        orders: [
          {
            id: parseInt(this.state.ticket),
            product: {
              id: Math.floor(Math.random() * (1000000000 - 0 + 1)) + 0,
              name: this.state.name,
              purchasing_price: this.state.price,
              weight: 0,
              volume: 0,
              sku: "0",
            },
            order_number: parseInt(this.state.ticket),
            quantity: 1,
            status: 1,
            payment_method: 0,
            cash_amount: 0,
            shipping_fees: 0,
          },
        ],
        buyer: {
          full_name_buyer: this.state.Bname,
          address_buyer: this.state.Baddress,
          phone_buyer: this.state.Bphone,
          position: `0,0`,
        },
        seller: {
          full_name_seller: this.state.Sname,
          address_seller: this.state.Saddress,
          phone_seller: this.state.Sphone,
          position: `0,0`,
        },
        ecommerce: {
          e_commerce_domain: "http://127.0.0.1:8000/",
        },
        shipper: {
          email_shipper: this.props.selectedCourierEmail,
          id: this.props.selectedCourier,
        },
        order_type: "2",
      };

      console.log(data);
      const result = await axiosApiInstance
        .post(APILINK + `/courier_order`, data)
        .catch((err) => {
          console.log(err.response);

          for (let x in err.response.data.error) {
            // err.response.data.error[x].map((r) => {
            // let y = [];
            // y.push(r);
            if (err.response.data.error == "this order_id already exists") {
              this.setState({ BEerr: "This Ticket number already exists" });
            } else {
              this.setState({ BEerr: err.response.data.error, disable: false });
            }
            // });
          }
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
    }
  };

  onCancel = (e) => {
    this.setState({
      name: "",
      price: "",
      Sname: "",
      Bname: "",
      Baddress: "",
      Bphone: "",
      Sphone: "",
      Saddress: "",
      code: "",
      BEerr: "",
    });
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState, this.state)) {
      if (
        this.state.name !== "" &&
        this.state.ticket !== "" &&
        this.state.price !== "" &&
        this.state.Bname !== "" &&
        this.state.Baddress !== "" &&
        this.state.Bphone !== "" &&
        this.state.Sname !== "" &&
        this.state.Saddress !== "" &&
        this.state.Sphone !== ""
      ) {
        this.setState({ showWarning: false });
      }
    }
  }

  render() {
    return (
      <div>
        <ToastContainer position="bottom-right" />

        <Modal
          dialogClassName="my-modal"
          show={this.props.showorder}
          onHide={this.props.closeorder}
        >
          <Container className="p-3">
            <Row>
              <Col sm={12}>
                <h6>Create Order for courierr</h6>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={12}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Order Name
                </Form.Label>
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
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Ticket Number
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Ticket Number"
                  value={this.state.ticket}
                  name="ticket"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={12}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Order Price
                </Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Price"
                  value={this.state.price}
                  name="price"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            {/* <Row className="mb-3">
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
            </Row> */}
            <Row>
              <Col sm={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Drop off Name
                </Form.Label>
                <Form.Control
                  type="text"
                  className="mb-2"
                  placeholder="Drop off Name"
                  value={this.state.Bname}
                  name="Bname"
                  onChange={this.onHandleInput}
                />

                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Drop off Phone
                </Form.Label>
                <Form.Control
                  type="number"
                  className="mb-2"
                  placeholder="Drop off Phone"
                  value={this.state.Bphone}
                  name="Bphone"
                  onChange={this.onHandleInput}
                />
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Drop off Address
                </Form.Label>
                <Form.Control
                  type="text"
                  className="mb-3"
                  placeholder="Drop off Address"
                  value={this.state.Baddress}
                  name="Baddress"
                  onChange={this.handleAddress1}
                />
                <ViewMap location={this.state.location} />
              </Col>
              <Col sm={6}>
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Pickup Name
                </Form.Label>
                <Form.Control
                  type="text"
                  className="mb-2"
                  placeholder="Pickup Name"
                  value={this.state.Sname}
                  name="Sname"
                  onChange={this.onHandleInput}
                />
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Pickup Phone
                </Form.Label>
                <Form.Control
                  type="number"
                  className="mb-2"
                  placeholder="Pickup Phone"
                  value={this.state.Sphone}
                  name="Sphone"
                  onChange={this.onHandleInput}
                />
                <Form.Label>
                  {" "}
                  <strong style={{ color: "red", paddingRight: "5px" }}>
                    *
                  </strong>
                  Pickup Address
                </Form.Label>
                <Form.Control
                  type="text"
                  className="mb-3"
                  placeholder="Pickup Address"
                  value={this.state.Saddress}
                  name="Saddress"
                  onChange={this.handleAddress2}
                />
                <ViewMap location={this.state.location2} />
              </Col>
            </Row>

            <Row>
              <Col style={{ textAlign: "right" }} sm={12} md={12}>
                <Button onClick={this.props.closeorder} className="supplierBtn">
                  Cancel
                </Button>
                <Button onClick={this.createRequest} className="supplierBtn">
                  Create
                </Button>
              </Col>
            </Row>
            {this.state.showWarning ? (
              <p className="errorHandel text-center">
                *Fill out all fields first
              </p>
            ) : null}
            {/* {this.state.BEerr.length !== 0
              ? this.state.BEerr.map((x) => {
                  return ( */}
            <Row>
              <Col className="" style={{ textAlign: "center" }} sm={12}>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.BEerr}
                </p>
              </Col>
            </Row>
            {/* );
                })
              : null} */}
          </Container>{" "}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
  requestData: state.requestData.requestData,
  type: state.type.type,
});
export default connect(mapStateToProps)(
  ErrorHandler(StandAloneCourierOrder, axiosApiInstance)
);
