import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal, Form } from "react-bootstrap";
import "../../style-sheets/home.css";
import TestList from "./TestList";
import "antd/dist/antd.css";
import { DatePicker, Checkbox, Select, TimePicker, Spin } from "antd";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
// import { Link } from "react-router-dom";
import ViewMap from "../ViewMap";
import isEqual from "lodash/isEqual";
import Geocode from "react-geocode";
import moment from "moment";
import { APILINK } from "../../Endpoint";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import {
  agentRequestData,
  searchResultSuppliers,
  clearRes,
  agentCoRequest,
} from "../../global-state/actions/agentRequestAction";

import { changeOrderType } from "../../global-state/actions/changeTypeAction";

const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");
class AgentHome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      keywords: [],
      category: [],
      selectedKeys: [],
      selectedCat: [],
      keysID: [],
      keysNames: [],
      catNames: [],
      catID: [],
      lat: "",
      lng: "",
      selectedDate: "",
      whichModal: 0,
      show: false,
      allVehicles: [],
      allServices: [],
      approval_need: "",
      provide_wallet: "",
      price: "",
      selectedData: "",
      selectedVehiclesId: [],
      selectedServicesId: [],
      selectedFile: null,
      location: {},
      FEError: "",
      showSpinner: false,
      showSpinner2: false,
      code: "",
      validated: false,
      errorHandel: "",
      showWarning: false,
      selectedTime:""
    };
  }
  handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.onCoSearch();
    }
    this.setState({ validated: true });
    e.preventDefault();
  };
  handleKeys = (e) => {
    this.setState({
      selectedKeys: e,
    });

    let x = e.map((val) => {
      return val.value;
    });

    let y = e.map((val) => {
      return val.label;
    });
    this.setState({
      keysID: x,
      keysNames: y,
    });
  };
  handleCate = (e) => {
    this.setState({
      selectedCat: e,
    });

    let x = e.map((val) => {
      return val.value;
    });

    let y = e.map((val) => {
      return val.label;
    });
    this.setState({
      catID: x,
      catNames: y,
    });
  };

  getCoor = (e, d) => {
    this.setState({ lat: e, lng: d });
  };

  getCategories = async () => {
    const result = await axiosApiInstance.get(
      APILINK + "/categories/?limit=10000"
    );

    // console.log(result);
    if (result) {
      this.setState({ category: result.data.results });
    }
  };
  getKeys = async () => {
    const result = await axiosApiInstance.get(
      APILINK + `/keywords/?limit=10000`
    );
    if (result) {
      this.setState({ keywords: result.data.results });
    }
  };
  componentDidMount() {
    this.props.clearRes();
    this.props.agentCoRequest({});

  }
  openModal1 = (e) => {
    this.setState({ show: true, whichModal: 1 });
  };
  openModal2 = (e) => {
    this.setState({ show: true, whichModal: 2 });
  };

  close = (e) => {
    this.setState({ show: false });
  };

  handleTime1 = (time, timeString) => {
    this.setState({ selectedDate: timeString });
  };

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSearch = (e) => {
    this.setState({ showSpinner2: true });
    if (this.state.selectedFile !== null) {
      let data = {
        PreRequest: {
          name: this.state.name,
          product_quantity: this.state.quantity,
          client_name: "test",
          client_phone: "011458888963",
          client_address: this.state.address,
          latitude: this.state.location.lat,
          longitude: this.state.location.lon,
          expected_delivery_date: this.state.selectedDate,
          keyword: this.state.keysID,
          category: this.state.catID,
          image: this.state.selectedFile,
          ticket_code: this.state.ticket,
        },
      };
      this.props.agentRequestData(data);
      this.searchForSuppliers();
    } else {
      let data = {
        PreRequest: {
          name: this.state.name,
          product_quantity: this.state.quantity,
          client_name: "test",
          client_phone: "011458888963",
          client_address: this.state.address,
          latitude: this.state.location.lat,
          longitude: this.state.location.lon,
          expected_delivery_date: this.state.selectedDate,
          keyword: this.state.keysID,
          category: this.state.catID,
          ticket_code: this.state.ticket,

          // image: '',
        },
      };
      this.props.agentRequestData(data);
      this.searchForSuppliers();
    }
  };

  searchForSuppliers = async (e) => {
    if (
      this.state.name === "" ||
      this.state.quantity === "" ||
      this.state.address === "" ||
      this.state.selectedDate === "" ||
      this.state.keysID.length === 0 ||
      this.state.catID.length === 0
    ) {
      this.setState({
        FEError: "Fill out all fields first",
        showSpinner2: false,
      });
    } else {
      console.log("ay haga");
      this.setState({ FEError: "" });
      let link;
      if (
        this.state.catNames.length === 1 &&
        this.state.keysNames.length === 1
      ) {
        let x = this.state.catNames.toString();
        let y = this.state.keysNames.toString();

        link = APILINK + `/suppliers/?categories=${x}&keywords=${y}`;
      } else if (
        this.state.catNames.length === 1 &&
        this.state.keysNames.length !== 1
      ) {
        let x = this.state.keysNames.toString();
        var res = x.replace(/,/g, "__");
        // console.log(res);
        let y = this.state.catNames.toString();

        link = APILINK + `/suppliers/?categories=${y}&keywords__in=${res}`;
      } else if (
        this.state.catNames.length !== 1 &&
        this.state.keysNames.length === 1
      ) {
        let x = this.state.catNames.toString();
        var res = x.replace(/,/g, "__");
        // console.log(res);
        let y = this.state.keysNames.toString();
        link = APILINK + `/suppliers/?categories__in=${res}&keywords=${y}`;
      } else {
        //to take selected values lw hya aktr mn haga f array , make them string and seperate between them with __ to send it inside request params
        let x = this.state.catNames.toString();
        var res = x.replace(/,/g, "__");
        // console.log(res);

        let y = this.state.keysNames.toString();
        var res2 = y.replace(/,/g, "__");
        // console.log(y);
        // console.log(res2);
        link =
          APILINK + `/suppliers/?categories__in=${res}&keywords__in=${res2}`;
      }

      //hna call search ll back w el res ab3tha le redux to store it and view in supplier list

      const result = await axiosApiInstance.get(`${link}`);
      if (result) {
        if (result.data) {
          this.props.searchResultSuppliers(result.data);
          this.props.history.push("/view_suppliers");
          this.setState({ showSpinner2: false });
        }
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState, this.state)) {
      if (
        this.state.name !== "" &&
        this.state.quantity !== "" &&
        this.state.address !== "" &&
        (this.state.selectedDate !== "") === "" &&
        this.state.keysID.length !== 0 &&
        this.state.catID.length !== 0
      ) {
        this.setState({ FEError: "" });
      }

      if (
        this.state.selectedServicesId.length !== 0 ||
        this.state.selectedVehiclesId.length !== 0 ||
        this.state.price !== "" ||
        this.state.selectedTime !== ""
      ) {
        this.setState({ showWarning: false });
      }
    }
  }

  getVehicles = async () => {
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/vehicle_types/?limit=10000`
    );
    if (result) {
      this.setState({ allVehicles: result.data.results });
    }
  };

  getService = async () => {
    const result = await axiosApiInstance.get(
      APILINK + `/delivery_service?limit=10000`
    );
    if (result) {
      this.setState({ allServices: result.data.data });
    }
  };

  handleTime = (time, timeString) => {
    this.setState({ selectedTime: timeString });
  };

  handleVehicles = (e) => {
    this.setState({
      selectedVehicles: e,
      selectedVehiclesId: e,
    });
    console.log(e);
  };
  handleServices = (e) => {
    this.setState({
      selectedServices: e,
      selectedServicesId: e,
    });
    console.log(e);
  };
  handleSubmitData = (e) => {
    this.setState({
      selectedData: e,
    });
  };
  handleWallet = (e) => {
    this.setState({ provide_wallet: e.target.checked });
  };
  handleApproval = (e) => {
    this.setState({ approval_need: e.target.checked });
  };

  onCoSearch = async (e) => {
    if (
      this.state.selectedServicesId.length === 0 &&
      this.state.selectedVehiclesId.length === 0 &&
      this.state.price == "" &&
      this.state.selectedTime == ""
    ) {
      this.setState({ showSpinner: false, showWarning: true });
    } else {
      this.setState({ showSpinner: true});

      let link;
      if (
        this.state.selectedVehiclesId.length === 1 &&
        this.state.selectedServicesId.length === 1
      ) {
        let x = this.state.selectedVehiclesId.toString();
        let y = this.state.selectedServicesId.toString();
        let z = y.replace(/-/g, "");
        link =
          APILINK +
          `/courier_services/?vehicle=${x}&delivery=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else if (
        this.state.selectedVehiclesId.length === 1 &&
        this.state.selectedServicesId.length !== 1
      ) {
        let x = this.state.selectedServicesId.toString();
        var res = x.replace(/,/g, "__");
        let z = res.replace(/-/g, "");
        let y = this.state.selectedVehiclesId.toString();

        link =
          APILINK +
          `/courier_services/?vehicle=${y}&delivery__in=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else if (
        this.state.selectedVehiclesId.length !== 1 &&
        this.state.selectedServicesId.length === 1
      ) {
        let x = this.state.selectedVehiclesId.toString();
        var res = x.replace(/,/g, "__");

        let y = this.state.selectedServicesId.toString();
        let z = y.replace(/-/g, "");

        link =
          APILINK +
          `/courier_services/?vehicle__in=${res}&delivery=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else if (
        this.state.selectedVehiclesId.length === 0 ||
        this.state.selectedServicesId.length === 0
      ) {
        link =
          APILINK +
          `/courier_services/?price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      } else {
        //to take selected values lw hya aktr mn haga f array , make them string and seperate between them with __ to send it inside request params
        let x = this.state.selectedVehiclesId.toString();
        var res = x.replace(/,/g, "__");
        // console.log(res);

        let y = this.state.selectedServicesId.toString();
        var res2 = y.replace(/,/g, "__");
        let z = res2.replace(/-/g, "");

        link =
          APILINK +
          `/courier_services/?vehicle__in=${res}&delivery__in=${z}&price=${this.state.price}&provide_wallet=${this.state.provide_wallet}`;
      }

      const result = await axiosApiInstance.get(`${link}`);

      if (result) {
        console.log(result);
        this.props.agentCoRequest(result.data);
        this.props.changeOrderType("2");
        setTimeout(() => {
          this.props.history.push("/view_couriers");
        }, 6000);
      }
    }
  };

  onFileUpload = (e) => {
    e.preventDefault();
    // this.setState({ selectedFile: e.target.files[0] });
    let reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = (e) => {
      console.log(e.target.result);
      this.setState({ selectedFile: e.target.result });

      // var block = e.target.result.split(";");
      // // Get the content type of the image
      // var contentType = block[0].split(":")[1]; // In this case "image/gif"
      // // get the real base64 content of the file
      // var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."

      // // Convert it to a blob to upload
      // var x = this.base64toBlob(realData, contentType);
      // console.log(x);
    };
    // console.log(e.target.files[0]);
  };

  // base64toBlob = (base64Data, contentType) => {
  //   contentType = contentType || "";
  //   var sliceSize = 1024;
  //   var byteCharacters = atob(base64Data);
  //   var bytesLength = byteCharacters.length;
  //   var slicesCount = Math.ceil(bytesLength / sliceSize);
  //   var byteArrays = new Array(slicesCount);

  //   for (var sliceIndex = 0; sliceIndex < slicesCount; ++sliceIndex) {
  //     var begin = sliceIndex * sliceSize;
  //     var end = Math.min(begin + sliceSize, bytesLength);

  //     var bytes = new Array(end - begin);
  //     for (var offset = begin, i = 0; offset < end; ++i, ++offset) {
  //       bytes[i] = byteCharacters[offset].charCodeAt(0);
  //     }
  //     byteArrays[sliceIndex] = new Uint8Array(bytes);
  //   }
  //   return new Blob(byteArrays, { type: contentType });
  // };

  handleAddress = (e) => {
    this.setState({ address: e.target.value });
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
      },
      (error) => {
        console.error(error);
      }
    );
  };

  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "80px", marginLeft: "250px" }}
          className="pt-3"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={4}>
              <h2>
                {" "}
                <i class="fas fa-home pr-2"></i> Home
              </h2>
            </Col>
            <Col className="p-4 mb-4" style={{ textAlign: "right" }} sm={8}>
              <Button onClick={this.openModal1} className="headBtn">
                + Submit Supplier Request
              </Button>
              <Button onClick={this.openModal2} className="headBtn">
                + Submit Courier Request
              </Button>
            </Col>
          </Row>

          <Row>
            <Col sm={12} md={12}>
              <TestList />
            </Col>
          </Row>
        </Container>
        {this.state.whichModal === 1 ? (
          <Modal show={this.state.show} onHide={this.close}>
            <Container className="p-3">
              <Row>
                <Col sm={12}>
                  <h6>Create New Order</h6>
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
                    required
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
                    Order Quantity
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Quantity"
                    value={this.state.quantity}
                    name="quantity"
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
                    KeyWords
                  </Form.Label>
                  <Select
                    mode="multiple"
                    showSearch
                    onClick={this.getKeys}
                    placeholder="Select keywords"
                    value={this.state.selectedKeys}
                    labelInValue
                    onChange={this.handleKeys}
                    style={{ width: "100%" }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.keywords.map((item) => (
                      <Select.Option
                        key={item.id}
                        name={item.name}
                        value={item.id}
                      >
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>
                    {" "}
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Category
                  </Form.Label>

                  <Select
                    mode="multiple"
                    showSearch
                    labelInValue
                    onClick={this.getCategories}
                    placeholder="select category"
                    value={this.state.selectedCat}
                    onChange={this.handleCate}
                    style={{ width: "100%" }}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {this.state.category.map((item) => (
                      <Select.Option
                        name={item.name}
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>

              <Row className="mb-1">
                <Col sm={12} md={12}>
                  <Form.Label>
                    {" "}
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Address
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Address"
                    value={this.state.address}
                    name="address"
                    onChange={this.handleAddress}
                  />
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <Form.Label>Attach Image</Form.Label>
                  <form>
                    <input
                      onChange={this.onFileUpload}
                      type="file"
                      id="myFile"
                      name="filename"
                      className="custom"
                    />
                  </form>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col className="" sm={12} md={12}>
                  <ViewMap location={this.state.location} />
                </Col>
              </Row>
              <Row className="mb-1">
                <Col sm={12} md={12}>
                  <Form.Label>
                    {" "}
                    <strong style={{ color: "red", paddingRight: "5px" }}>
                      *
                    </strong>
                    Delievery Time
                  </Form.Label>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={12}>
                  <DatePicker
                    // showTime={{ format: "HH:mm" }}
                    format="YYYY-MM-DD"
                    onChange={this.handleTime1}
                  />
                </Col>
              </Row>
              <Row>
                <Col style={{ textAlign: "right" }} sm={12} md={12}>
                  {this.state.showSpinner2 ? (
                    <Spin tip="Loading..."></Spin>
                  ) : null}
                  <Button onClick={this.onSearch} className="supplierBtn">
                    Search
                  </Button>
                </Col>
                <Col style={{ textAlign: "center" }} sm={12} md={12}>
                  <p style={{ fontWeight: "bold", color: "red" }}>
                    {this.state.FEError}
                  </p>
                </Col>
              </Row>
            </Container>{" "}
          </Modal>
        ) : (
          <Modal show={this.state.show} onHide={this.close}>
            <Container className="p-3">
              <Row>
                <Col sm={12}>
                  <h6>Search For Couriers</h6>
                </Col>
              </Row>
              <Form
              // noValidate
              // validated={this.state.validated}
              // onSubmit={this.handleSubmit}
              >
                <Row className="mb-3">
                  <Col sm={12} md={12}>
                    <Form.Group controlId="validatePrice">
                      <Form.Label>Purchase Price</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Purchase Price"
                        value={this.state.price}
                        name="price"
                        onChange={this.onHandleInput}
                        // required
                      />
                      {/* <Form.Control.Feedback type="invalid">
                        Required field
                      </Form.Control.Feedback> */}
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={12} md={12}>
                    <Form.Label>Vehicles</Form.Label>
                    <Select
                      mode="multiple"
                      required
                      showSearch
                      onClick={this.getVehicles}
                      placeholder="Select Vehicles"
                      value={this.state.selectedVehicles}
                      // labelInValue
                      onChange={this.handleVehicles}
                      style={{ width: "100%" }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.allVehicles.map((item) => (
                        <Select.Option
                          key={item.id}
                          name={item.name}
                          value={item.id}
                        >
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* {this.state.selectedVehiclesId.length == 0 &&
                    this.state.errorHandel !== "" ? (
                      <p className="errorHandel">{this.state.errorHandel}</p>
                    ) : null} */}
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={12} md={12}>
                    <Form.Label>Delivery Services</Form.Label>

                    <Select
                      mode="multiple"
                      required
                      showSearch
                      onClick={this.getService}
                      placeholder="select services"
                      value={this.state.selectedServices}
                      onChange={this.handleServices}
                      style={{ width: "100%" }}
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {this.state.allServices.map((item) => (
                        <Select.Option
                          name={item.name}
                          key={item.id}
                          value={item.id}
                        >
                          {item.name}
                        </Select.Option>
                      ))}
                    </Select>
                    {/* {this.state.selectedServicesId.length == 0 &&
                    this.state.errorHandel !== "" ? (
                      <p className="errorHandel">{this.state.errorHandel}</p>
                    ) : null} */}
                  </Col>
                </Row>

                <Row className="mb-1">
                  <Col sm={12} md={12}>
                    <Form.Label>Delivery Time</Form.Label>
                  </Col>
                </Row>
                <Row className="mb-3">
                  <Col sm={12} md={12}>
                    <TimePicker
                      onChange={this.handleTime1}
                      defaultOpenValue={moment("00:00:00", "HH:mm:ss")}
                      required
                    />
                    {/* {this.state.selectedDate == "" &&
                    this.state.errorHandel !== "" ? (
                      <p className="errorHandel">{this.state.errorHandel}</p>
                    ) : null} */}
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col sm={12} md={6}>
                    <Checkbox onChange={this.handleWallet}>
                      Provide Wallet
                    </Checkbox>
                  </Col>
                </Row>
                <Row>
                  <Col style={{ textAlign: "right" }} sm={12} md={12}>
                    {this.state.showSpinner ? (
                      <Spin tip="Loading..."></Spin>
                    ) : null}
                    <Button
                      onClick={this.onCoSearch}
                      // type="submit"
                      className="supplierBtn"
                    >
                      Search
                    </Button>
                  </Col>
                </Row>
                {this.state.showWarning ? (
                  <p className="errorHandel text-center">
                    You need to enter one field at least
                  </p>
                ) : null}
              </Form>
            </Container>{" "}
          </Modal>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      agentRequestData,
      searchResultSuppliers,
      clearRes,
      agentCoRequest,
      changeOrderType,
    },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorHandler(AgentHome, axiosApiInstance));
