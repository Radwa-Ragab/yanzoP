import React, { Component } from "react";

import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import ViewMap from "../ViewMap";
import { TimePicker, Checkbox, Select } from "antd";
import GetCoordinates from "../GetCoordinates";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { connect } from "react-redux";
import Geocode from "react-geocode";
import { APILINK } from "../../Endpoint";

const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");

class AddSupplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: "",
        lon: "",
      },
      category: [],
      keywords: [],
      selectedFile: null,
      errName: "",
      selectedCat: [],
      selectedKeys: [],
      BEerr: "",
      errName2: "",
      selectedKeysId: [],
      selectedCatId: [],
      showCatModel: false,
      showKeyModel: false,
    };
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  getCoor = (e, d) => {
    // console.log(e, d);
    this.setState({ lat: e, lng: d });
  };
  handleAddress = (e) => {
    this.setState({ address: e.target.value });
    // Get latitude & longitude from address.
    Geocode.fromAddress(this.state.address).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;
        this.setState((prevState) => ({
          location: {
            lat: lat,
            lon: lng,
          },
        }));
        console.log(lat, lng);
      },
      (error) => {
        console.error(error);
      }
    );
  };
  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handlePassword = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.value.match(/^(?=.*[a-z])(?=.*\d)[a-zA-Z\d]{8,}$/)) {
      this.setState({ password: e.target.value });

      this.setState({ errName: "", disable: false });
    } else {
      this.setState({
        errName:
          "password minimum 8 characters combination of letters and numbers",
        disable: true,
      });
    }
  };
  handleWorkingFrom = (time, timeString) => {
    this.setState({ workingFrom: timeString });
  };

  handleWorkingTo = (time, timeString) => {
    // console.log(timeString);
    this.setState({ workingTo: timeString });
  };

  handleDelieveryFrom = (time, timeString) => {
    this.setState({ deliveryFrom: timeString });
  };
  handleDelieveryTo = (time, timeString) => {
    this.setState({ deliveryTo: timeString });
  };
  handleIsDeliver = (e) => {
    this.setState({ is_deliver: e.target.checked });
  };
  getCategories = async () => {
    const result = await axiosApiInstance
      .get(APILINK + "/categories/?limit=10000")
      .then((res) => {
        // console.log(res);
        this.setState({ category: res.data.results });
      });
  };
  getKeys = async () => {
    const result = await axiosApiInstance.get(
      APILINK + `/keywords/?limit=10000`
    );
    if (result) {
      this.setState({ keywords: result.data.results });
    }
  };

  handleKeys = (e) => {
    this.setState({
      selectedKeys: e,
      selectedKeysId: e,
    });
    console.log(e);
  };

  handleCate = (e) => {
    this.setState({
      selectedCat: e,
      selectedCatId: e,
    });
  };
  onFileUpload = (e) => {
    e.preventDefault();
    this.setState({ selectedFile: e.target.files[0] });
  };
  onCreate = async () => {
    let data = {
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      city: this.state.city,
      phone: this.state.phone,
      whatsapp: this.state.whats,
      address: this.state.address,
      website: this.state.website,
      image: null,
      is_deliver: this.state.is_deliver,
      working_hours_from: this.state.workingFrom,
      working_hours_to: this.state.workingTo,
      delivery_hours_from: this.state.deliveryFrom,
      delivery_hours_to: this.state.deliveryTo,
      latitude: this.state.lat,
      longitude: this.state.lng,
      keyword: this.state.selectedKeysId,
      category: this.state.selectedCatId,
      user_name: this.state.username,
    };

    if (this.state.selectedFile !== null) {
      const eventdata = new FormData();
      let x = [];
      x.push(this.state.selectedCat);
      eventdata.append("image", this.state.selectedFile);
      eventdata.append("name", this.state.name);
      eventdata.append("email", this.state.email);
      eventdata.append("city", this.state.city);
      eventdata.append("password", this.state.password);
      eventdata.append("address", this.state.address);
      eventdata.append("is_deliver", this.state.is_deliver);
      eventdata.append("working_hours_from", this.state.workingFrom);
      eventdata.append("working_hours_to", this.state.workingTo);
      eventdata.append("delivery_hours_from", this.state.deliveryFrom);
      eventdata.append("delivery_hours_to", this.state.deliveryTo);
      eventdata.append("latitude", this.state.lat);
      eventdata.append("longitude", this.state.lng);
      eventdata.append("website", this.state.website);
      eventdata.append("phone", this.state.phone);
      eventdata.append("whatsapp", this.state.whats);
      eventdata.append("user_name", this.state.username);

      if (this.state.selectedKeys.length !== 0) {
        for (var i = 0; i < this.state.selectedKeys.length; i++) {
          eventdata.append("keyword", this.state.selectedKeys[i]);
        }
      }
      if (this.state.selectedCat.length !== 0) {
        for (var i = 0; i < this.state.selectedCat.length; i++) {
          eventdata.append("category", this.state.selectedCat[i]);
        }
      }

      const result = await axiosApiInstance.post(
        APILINK + `/supplier`,
        eventdata
      );
      if (result) {
        console.log(result);
        if (result.data.data.email) {
          setTimeout(() => {
            toast.info(`Supplier was created successfully`);
          }, 500);
        }
      }
    } else {
      console.log(data);
      const result = await axiosApiInstance
        .post(APILINK + `/supplier`, data)
        .catch((err) => {
          console.log(err.response);
          for (const error in err.response.data.error) {
            console.log(err.response.data.error);

            setTimeout(() => {
              toast.error(
                `${
                  err.response.data.error[error][0].charAt(0).toUpperCase() +
                  err.response.data.error[error][0].slice(1)
                }`
              );
            }, 500);
          }
        });
      if (result) {
        console.log(result);
        if (result.data.data.email) {
          setTimeout(() => {
            toast.info(`Supplier was created successfully`);
          }, 500);
          setTimeout(() => {
            this.props.history.push("/suppliers");
          }, 3500);
        }
      }
    }
  };
  onHandlStie = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (
      e.target.value.match(
        /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/
      )
    ) {
      this.setState({ website: e.target.value });

      this.setState({ errName2: "", disable: false });
    } else {
      this.setState({
        errName2: "Enter valid URL!",
        disable: true,
      });
    }
  };

  showModal1 = async () => {
    this.setState((state, props) => ({ showCatModel: !state.showCatModel }));
  };
  showModal2 = async () => {
    this.setState((state, props) => ({ showKeyModel: !state.showKeyModel }));
  };
  createCategory = async () => {
    this.setState({ disable: true });

    let data = {
      name: this.state.catName,
      code: this.state.code,
      type: this.state.type,
      yanzo_rate: this.state.rate,
      description: this.state.desc,
    };
    const result = await axiosApiInstance.post(APILINK + `/category`, data);
    if (result) {
      if (result.data.data.id) {
        this.setState({
          catName: "",
          code: "",
          type: "",
          rate: "",
          desc: "",
          showCatModel: false,
        });
      }
    }
  };

  createKeyword = async () => {
    this.setState({ disable: true });

    let data = {
      name: this.state.keyName,
    };
    const result = await axiosApiInstance.post(APILINK + `/keyword`, data);
    if (result) {
      if (result.data.data.id) {
        this.setState({
          keyName: "",
          showKeyModel: false,
        });
      }
    }
  };

  handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.onCreate();
    }
    this.setState({ validated: true });
    e.preventDefault();
  };
  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "300px" }}
          className=""
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket pr-2"></i>Add Supplier
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
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.username}
                    name="username"
                    onChange={this.onHandleInput}
                    required
                  />
                </Form.Group>
                <Form.Control.Feedback type="invalid">
                  Field must be added
                </Form.Control.Feedback>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationname">
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.name}
                    name="name"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationemail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Email"
                    value={this.state.email}
                    name="email"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationpassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={this.state.password}
                    name="password"
                    onChange={this.handlePassword}
                    required
                  />
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {this.state.errName}
                  </p>
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationphone">
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    value={this.state.phone}
                    name="phone"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationwhats">
                  <Form.Label>Whats app</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Whats app"
                    value={this.state.whats}
                    name="whats"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationcity">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    value={this.state.city}
                    name="city"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Field must be added
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Website</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Website"
                  value={this.state.website}
                  name="website"
                  onChange={this.onHandlStie}
                />
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.errName2}
                </p>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>KeyWords </Form.Label>
                <span style={{ marginLeft: "350px" }} onClick={this.showModal2}>
                  <i className="fas fa-plus-circle"></i>Add Keyword
                </span>
                <Select
                  mode="multiple"
                  placeholder="Select keywords"
                  value={this.state.selectedKeys}
                  onChange={this.handleKeys}
                  style={{ width: "100%" }}
                  onClick={this.getKeys}
                >
                  {this.state.keywords.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Category</Form.Label>
                <span style={{ marginLeft: "350px" }} onClick={this.showModal1}>
                  <i className="fas fa-plus-circle"></i>Add Category
                </span>
                <Select
                  mode="multiple"
                  placeholder="select category"
                  value={this.state.selectedCat}
                  onChange={this.handleCate}
                  style={{ width: "100%" }}
                  onClick={this.getCategories}
                >
                  {this.state.category.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Working Hours from</Form.Label>
                <TimePicker format="h:mm a" onChange={this.handleWorkingFrom} />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Working Hours to</Form.Label>
                <TimePicker format="h:mm a" onChange={this.handleWorkingTo} />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours from</Form.Label>
                <TimePicker
                  format="h:mm a"
                  onChange={this.handleDelieveryFrom}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Delivery Hours to</Form.Label>
                <TimePicker format="h:mm a" onChange={this.handleDelieveryTo} />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Image</Form.Label>
                <form>
                  <input
                    onChange={this.onFileUpload}
                    type="file"
                    id="myFile"
                    name="filename"
                  />
                </form>
              </Col>

              <Col sm={12} md={6}>
                <Form.Label>Address</Form.Label>
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
              <Col sm={12} md={6}>
                <Checkbox onChange={this.handleIsDeliver}>Is Deliver?</Checkbox>
              </Col>
              <Col sm={12} md={6}>
                <p>Google Map Location </p>

                <ViewMap location={this.state.location} />
              </Col>
            </Row>
            <Row>
              {/* <Col sm={12} md={6}></Col> */}
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <Button onClick={this.handleSubmit} className="addBtn2">
                  Add Supplier
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.BEerr}
                </p>
              </Col>
            </Row>
          </Form>
        </Container>

        <Modal
          size="lg"
          show={this.state.showCatModel}
          onHide={this.showModal1}
        >
          <Container className="p-4 modal2">
            <Row>
              <Col sm={12}>
                <h2> Add New Category</h2>{" "}
              </Col>
            </Row>
            <Form>
              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.catName}
                    name="catName"
                    onChange={this.handleChange}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Code"
                    value={this.state.code}
                    name="code"
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
              <Row className="mb-3">
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

              <Row>
                <Col sm={12} md={6}></Col>
                <Col style={{ textAlign: "end" }} sm={12} md={6}>
                  <Button className="addBtn1">Cancel</Button>
                  <Button
                    onClick={this.createCategory}
                    className="addBtn2"
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal>

        <Modal
          size="lg"
          show={this.state.showKeyModel}
          onHide={this.showModal2}
        >
          <Container className="p-4 modal2">
            <Row>
              <Col sm={12}>
                <h2> Add New Keyword</h2>{" "}
              </Col>
            </Row>
            <Form>
              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Label>Key word</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.keyName}
                    name="keyName"
                    onChange={this.handleChange}
                  />
                </Col>
              </Row>

              <Row>
                <Col sm={12} md={6}></Col>
                <Col style={{ textAlign: "end" }} sm={12} md={6}>
                  <Button className="addBtn1">Cancel</Button>
                  <Button
                    disabled={this.state.disable}
                    onClick={this.createKeyword}
                    className="addBtn2"
                  >
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </Modal>

        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

export default connect(null, null)(ErrorHandler(AddSupplier, axiosApiInstance));
