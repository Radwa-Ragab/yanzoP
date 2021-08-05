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
import "../../../style-sheets/home.css";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import { Checkbox } from "antd";
import ViewMap from "../../ViewMap";
import { Radio, Select, Empty } from "antd";
import Geocode from "react-geocode";
import ErrorHandler from "../../../ErrorHandler/ErrorHandler";
// import QuickupOthersModal from "../../yanzo-Modals/QuickupOthersModal";
import StandAloneCourierOrder from "../../yanzo-Modals/StandAlonecourierOrderModal";
import { APILINK } from "../../../Endpoint";

const axiosApiInstance = axios.create();

class ViewCouriers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      keywords: [],
      category: [],
      startDate: new Date(),
      tableData: [],
      selectedID: [],
      showModal: false,
      courierId: "",
      BEerr: "",
      location2: {},
      location: {},
      disable: false,
      selectedOne: "",
      notes: "",
      columns: [
        {
          name: "Courier Name",
          selector: "courier.name",
          sortable: true,
          right: true,
        },
      ],
      selectedProduct: "",
      selectedRows: [],
      selectedCourier: "",
      showOrder: false,
      openQuickup: false,
      transport: ["any", "car", "scooter", "van", "bicycle"],
      selectedCourierName: "",
      selectedCourierEmail: "",
      showOther: false,
    };
  }
  closeModal = (e, f) => {
    this.setState({
      showModal: false,
    });
  };
  openQuickUp = (e) => {
    this.setState({ openQuickup: true });
  };
  closeQuick = (e) => {
    this.setState({ openQuickup: false });
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  openOrder = (e) => {
    this.setState({ showOrder: true });
  };
  closeOrder = (e) => {
    this.setState({ showOrder: false });
  };

  showOther = (e) => {
    this.setState({ showOther: true });
  };
  closeQuickupOthers = (e) => {
    this.setState({ showOther: false });
  };
  getID = (e) => {
    // console.log(e);
    this.setState({ selectedProduct: e });
  };
  handleSelected = (state) => {
    console.log("Selected Rows: ", state.selectedRows);
    if ((state.selectedRows.length = 1)) {
    }
    let selected = state.selectedRows.map((x) => {
      return x;
    });
    // console.log(selectedID);
    this.setState({ selectedCourier: selected[0] });
  };

  createRequest = async () => {
    this.setState({ disable: true });

    let data;
    // if (this.props.type === "1") {
    data = {
      orders: [
        {
          product: {
            id: Math.floor(Math.random() * (1000000000 - 0 + 1)) + 0,
            name: this.props.requestData.pre_request.name,
            purchasing_price: this.props.requestData.yanzo_price,
            weight: 0,
            volume: 0,
            sku: "0",
          },
          order_number: parseInt(
            this.props.requestData.pre_request.ticket_code
          ),
          quantity: 1,
          status: 1,
          payment_method: 0,
          cash_amount: 0,
          shipping_fees: 0,
        },
      ],
      buyer: {
        full_name_buyer: this.props.requestData.pre_request.client_name,
        address_buyer: this.props.requestData.pre_request.client_address,
        phone_buyer: this.props.requestData.pre_request.client_phone,
        position: `${this.props.requestData.pre_request.location.lat},${this.props.requestData.pre_request.location.lon}`,
      },
      seller: {
        full_name_seller: this.props.requestData.supplier.name,
        address_seller: this.props.requestData.supplier.address,
        phone_seller: this.props.requestData.supplier.phone,
        position: `${this.props.requestData.supplier.location.lat},${this.props.requestData.supplier.location.lon}`,
      },
      ecommerce: {
        e_commerce_domain: "http://127.0.0.1:8000/",
      },
      shipper: {
        email_shipper: this.state.selectedCourierEmail,
        id: this.state.selectedCourier,
      },
      order: this.props.requestData.orders.id,
      order_type: "1",
    };

    console.log(data);
    const result = await axiosApiInstance
      .post(APILINK + `/courier_order`, data)
      .catch((err) => {
        console.log(err.response);
        if (err.response.data) {
          for (let x in err.response.data.error) {
            err.response.data.error[x].map((r) => {
              console.log(r);
              let y = [];
              y.push(r);
              this.setState({ BEerr: y, disable: false });
            });
          }
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
  onChange = (e) => {
    console.log(e.target.name, e.target.id);
    this.setState({
      selectedCourier: e.target.value,
      selectedCourierName: e.target.name,
      selectedCourierEmail: e.target.id,
    });
  };

  handleMode = (e) => {
    this.setState({ selectedMode: e });
  };

  createReqQuickup = async (e) => {
    let data;
    if (this.props.type === "1") {
      data = {
        order_type: this.props.type,
        order_name: this.props.requestData.pre_request.name,
        order: this.props.requestData.orders.id,
        courier: this.state.selectedCourier,
        transport_mode: this.state.selectedMode,
        pickups: [
          {
            contact_name: this.props.requestData.supplier.name,
            contact_phone: "971599999999",
            partner_order_id: this.props.requestData.pre_request.ticket_code,
            notes: this.state.notes,
            location: {
              address1: this.state.Saddress,
              coords: [this.state.Sellerlon, this.state.Sellerlat],
              country: this.state.Scountry,
              town: this.state.Stown,
            },
            items: [
              {
                name: this.props.requestData.pre_request.name,
                quantity: this.props.requestData.pre_request.product_quantity,
              },
            ],
          },
        ],
        dropoffs: [
          {
            contact_name: this.props.requestData.pre_request.client_name,
            contact_phone: "971599999988",
            payment_amount: this.state.amount,
            location: {
              address1: this.state.Baddress,
              coords: [this.state.Buyerlon, this.state.Buyerlat],
              country: this.state.Bcountry,
              town: this.state.Btown,
            },
          },
        ],
      };

      console.log(data);
    } else {
      data = {
        order_type: this.props.type,
        order_name: this.state.name,
        order: null,
        courier: this.state.selectedCourier,
        transport_mode: this.state.selectedMode,
        pickups: [
          {
            contact_name: this.state.Sname,
            contact_phone: this.state.Sphone,
            partner_order_id: this.state.ticket,
            notes: this.state.notes,
            location: {
              address1: this.state.Saddress,
              coords: ["0", "0"],
              country: this.state.Scountry,
              town: this.state.Stown,
            },
            items: [
              {
                name: this.state.name,
                quantity: this.state.Quantity,
              },
            ],
          },
        ],
        dropoffs: [
          {
            contact_name: this.state.Bname,
            contact_phone: this.state.Bphone,
            payment_amount: this.state.amount,
            location: {
              address1: this.state.Baddress,
              coords: ["0", "0"],
              country: this.state.Bcountry,
              town: this.state.Btown,
            },
          },
        ],
      };

      console.log(data);
    }
    const result = await axiosApiInstance
      .post(APILINK + `/courier_quick_order`, data)
      .catch((err) => {
        console.log(err.response);
      });
    console.log(result);
    if (result) {
      if (result.data.data.id) {
        this.setState({ openQuickup: false });
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
    console.log(this.props.courierSearchResult);
    return (
      <div>
        <Container
          style={{ marginTop: "80px", marginLeft: "250px" }}
          className="pt-3 viewSupp"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "center" }} sm={4}>
              <h3> Couriers</h3>
            </Col>
            <Col className="p-4 mb-4" sm={4}></Col>
            <Col
              className="p-4 mb-4"
              style={{ textAlign: "left" }}
              sm={4}
            ></Col>
          </Row>
          <Row>
            <Col style={{ margin: "auto" }} sm={12} md={8}>
              {this.props.courierSearchResult.length !== 0 ? (
                <React.Fragment>
                  <Table striped bordered>
                    <thead>
                      <tr>
                        <th>Courier Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.props.courierSearchResult.map((x) => {
                        return (
                          <tr>
                            <td>{x.courier.name}</td>
                            <td>
                              <Radio.Group
                                onChange={this.onChange}
                                value={this.state.selectedCourier}
                                name={x.courier.name}
                              >
                                <Radio
                                  id={x.courier.email}
                                  value={x.courier.id}
                                ></Radio>
                              </Radio.Group>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </Table>
                  <Row>
                    <Col className="p-4 mb-4" sm={8}></Col>
                    {this.props.type === "1" ? (
                      <Col
                        className="p-4 mb-4"
                        style={{ textAlign: "left" }}
                        sm={4}
                      >
                        {this.props.courierSearchResult.length === 0 ||
                        this.state.selectedCourier === "" ? (
                          <Button
                            disabled
                            onClick={this.createRequest}
                            className="suppBtn px-3"
                          >
                            Send Request
                          </Button>
                        ) : this.state.selectedCourierName === "Quiqup" ? (
                          <Button
                            onClick={this.openQuickUp}
                            className="suppBtn px-3"
                          >
                            Order Quiqup
                          </Button>
                        ) : (
                          <Button
                            disabled={this.state.disable}
                            onClick={this.createRequest}
                            className="suppBtn px-3"
                          >
                            Send Request
                          </Button>
                        )}
                      </Col>
                    ) : (
                      <Col
                        className="p-4 mb-4"
                        style={{ textAlign: "left" }}
                        sm={4}
                      >
                        {this.props.courierSearchResult.length === 0 ||
                        this.state.selectedCourier === "" ? (
                          <Button
                            disabled
                            onClick={this.openOrder}
                            className="suppBtn px-3"
                          >
                            Create Order
                          </Button>
                        ) : this.state.selectedCourierName === "Quiqup" ? (
                          <React.Fragment>
                            {" "}
                            <Button
                              className="suppBtn px-3"
                              onClick={this.openQuickUp}
                            >
                              Order Quiqup
                            </Button>
                          </React.Fragment>
                        ) : (
                          <Button
                            disabled={this.state.disable}
                            onClick={this.openOrder}
                            className="suppBtn px-3"
                          >
                            Create Order
                          </Button>
                        )}
                      </Col>
                    )}
                  </Row>
                </React.Fragment>
              ) : (
                <Empty />
              )}
            </Col>
          </Row>
        </Container>
        <StandAloneCourierOrder
          showorder={this.state.showOrder}
          closeorder={this.closeOrder}
          selectedCourier={this.state.selectedCourier}
          selectedCourierEmail={this.state.selectedCourierEmail}
          {...this.props}
        ></StandAloneCourierOrder>

        {this.props.type === "2" ? (
          <Modal
            dialogClassName="my-modal"
            show={this.state.openQuickup}
            onHide={this.closeQuick}
          >
            <Container className="p-3">
              <Row>
                <Col sm={12}>
                  <h6>Create Order for Quick up courier</h6>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12}>
                  <Form.Label>
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Transport Mode
                  </Form.Label>

                  <Select
                    placeholder="Transport mode"
                    value={this.state.selectedMode}
                    onChange={this.handleMode}
                    style={{ width: "100%" }}
                  >
                    {this.state.transport.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>
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
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Order Quantity
                  </Form.Label>
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
                  <Form.Label>
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Ticket Number
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Ticket Number"
                    value={this.state.ticket}
                    name="ticket"
                    onChange={this.onHandleInput}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={6} md={6}>
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
                    Drop off Country
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="mb-2"
                    placeholder="Drop off Country"
                    value={this.state.Bcountry}
                    name="Bcountry"
                    onChange={this.onHandleInput}
                  />
                  <Form.Label>
                    {" "}
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Drop off Town
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="mb-2"
                    placeholder="Drop off Town"
                    value={this.state.Btown}
                    name="Btown"
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
                    className="mb-2"
                    type="text"
                    placeholder="Drop off Address"
                    value={this.state.Baddress}
                    name="Baddress"
                    onChange={this.handleAddress1}
                  />
                  <ViewMap
                    style={{ position: "relative" }}
                    location={this.state.location}
                  />
                  <Form.Label>Drop off payment amount</Form.Label>
                  <Form.Control
                    type="number"
                    className="mb-2"
                    placeholder="Drop off payment amount"
                    value={this.state.amount}
                    name="amount"
                    onChange={this.onHandleInput}
                  />
                </Col>
                <Col sm={6} md={6}>
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
                    Pickup Country
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="mb-2"
                    placeholder="Pickup Country"
                    value={this.state.Scountry}
                    name="Scountry"
                    onChange={this.onHandleInput}
                  />
                  <Form.Label>
                    {" "}
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Pickup Town
                  </Form.Label>
                  <Form.Control
                    type="text"
                    className="mb-2"
                    placeholder="Pickup Town"
                    value={this.state.Stown}
                    name="Stown"
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
                    className="mb-2"
                    type="text"
                    placeholder="Pickup Address"
                    value={this.state.Saddress}
                    name="Saddress"
                    onChange={this.handleAddress2}
                  />
                  <ViewMap location={this.state.location2} />
                  <Form.Label>Pickup Notes</Form.Label>
                  <Form.Control
                    value={this.state.notes}
                    className="mb-2"
                    name="notes"
                    onChange={this.onHandleInput}
                    as="textarea"
                    rows={3}
                  />
                </Col>
              </Row>

              <Row>
                <Col style={{ textAlign: "right" }} sm={12} md={12}>
                  <Button
                    onClick={this.createReqQuickup}
                    className="supplierBtn"
                  >
                    Create
                  </Button>
                </Col>
              </Row>
            </Container>{" "}
          </Modal>
        ) : (
          <Modal
            dialogClassName="my-modal"
            show={this.state.openQuickup}
            onHide={this.closeQuick}
          >
            <Container className="p-3">
              <Row>
                <Col sm={12}>
                  <h6>Create Order for Quick up courier</h6>
                  <p>*Please Fill missing data </p>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12}>
                  <Form.Label>Transport Mode</Form.Label>

                  <Select
                    placeholder="Transport mode "
                    value={this.state.selectedMode}
                    onChange={this.handleMode}
                    style={{ width: "100%" }}
                  >
                    {this.state.transport.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>Order Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="name"
                    value={this.props.requestData.pre_request.name}
                    name="name"
                    // onChange={this.onHandleInput}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>Product Quantity</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Quantity"
                    value={this.props.requestData.pre_request.product_quantity}
                    name="Quantity"
                    // onChange={this.onHandleInput}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={6} md={6}>
                  <Form.Label>Drop off Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Drop off Name"
                    value={this.props.requestData.pre_request.client_name}
                    name="Bname"
                    // onChange={this.onHandleInput}
                  />
                  <Form.Label>Drop off Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Drop off Country"
                    value={this.state.Bcountry}
                    name="Bcountry"
                    onChange={this.onHandleInput}
                  />
                  <Form.Label>Drop off Town</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Drop off Town"
                    value={this.state.Btown}
                    name="Btown"
                    onChange={this.onHandleInput}
                  />
                  <Form.Label>Drop off Phone</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Drop off Phone"
                    value={this.props.requestData.pre_request.client_phone}
                    name="Bphone"
                    // onChange={this.onHandleInput}
                  />

                  <Form.Label>Drop off Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Drop off Address"
                    value={this.state.Baddress}
                    name="Baddress"
                    onChange={this.handleAddress1}
                  />
                  <ViewMap location={this.state.location} />
                  <Form.Label>Drop off payment amount</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Drop off payment amount"
                    value={this.state.amount}
                    name="amount"
                    onChange={this.onHandleInput}
                  />
                </Col>
                <Col sm={6} md={6}>
                  <Form.Label>Pickup Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pickup Name"
                    value={this.props.requestData.supplier.name}
                    name="Sname"
                    // onChange={this.onHandleInput}
                  />
                  <Form.Label>Pickup Country</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pickup Country"
                    value={this.state.Scountry}
                    name="Scountry"
                    onChange={this.onHandleInput}
                  />
                  <Form.Label>Pickup Town</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pickup Town"
                    value={this.state.Stown}
                    name="Stown"
                    onChange={this.onHandleInput}
                  />
                  <Form.Label>Pickup Phone</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Pickup Phone"
                    value={this.props.requestData.supplier.phone}
                    name="Sphone"
                    // onChange={this.onHandleInput}
                  />

                  <Form.Label>Pickup Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Pickup Address"
                    value={this.state.Saddress}
                    name="Saddress"
                    onChange={this.handleAddress2}
                  />
                  <ViewMap location={this.state.location2} />
                  <Form.Label>Pickup Notes</Form.Label>
                  <Form.Control
                    value={this.state.notes}
                    name="notes"
                    onChange={this.onHandleInput}
                    as="textarea"
                    rows={3}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "right" }} sm={12} md={12}>
                  <Button
                    onClick={this.createReqQuickup}
                    className="supplierBtn"
                  >
                    Create
                  </Button>
                </Col>
              </Row>
            </Container>{" "}
          </Modal>
        )}

        {/* <QuickupOthersModal
          closeQuickupOthers={this.closeQuickupOthers}
          showOther={this.state.showOther}
          selectedCourier={this.state.selectedCourier}
          type={this.props.type}
          {...this.props}
        /> */}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
  requestData: state.requestData.requestData,
  courierSearchResult: state.courierSearchResult.courierSearchResult,
  type: state.type.type,
});

export default connect(mapStateToProps)(
  ErrorHandler(ViewCouriers, axiosApiInstance)
);
