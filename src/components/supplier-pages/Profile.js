import React, { Component } from "react";

import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { TimePicker, Checkbox, Select } from "antd";
import moment from "moment";
// import GetCoordinates from "../GetCoordinates";
import ViewMap from "../ViewMap";
import { connect } from "react-redux";
import Geocode from "react-geocode";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";
import {Spin} from 'antd'
const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: {
        lat: "",
        lon: "",
      },
      disable: false,
      category: [],
      keywords: [],
      selectedFile: null,
      errName: "",
      selectedCat: [],
      selectedKeys: [],
      selectedKeysId: [],
      selectedCatesIds: [],
      BEerr: "",
      errName2: "",
      delivery_hours_from: "",
      category: [],
      keywords: [],
      loading:false
    };
  }

  // getCoor = (e, d) => {
  //     console.log(e, d);
  //     this.setState({ lat: e, lng: d });
  // };

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  handlePassword = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.value.match(/^(?=.*\d)(?=.*[a-z])[0-9a-z]{8,}$/)) {
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
    this.setState({ working_hours_from: timeString });
  };

  handleWorkingTo = (time, timeString) => {
    // console.log(timeString);
    this.setState({ working_hours_to: timeString });
  };

  handleDelieveryFrom = (time, timeString) => {
    this.setState({ delivery_hours_from: timeString }, () => {
      console.log(this.state.delivery_hours_from);
    });
  };
  handleDelieveryTo = (time, timeString) => {
    this.setState({ delivery_hours_to: timeString });
  };
  handleIsDeliver = (e) => {
    this.setState({ is_deliver: e.target.checked });
  };
  getCategories = async () => {
    const result = await axiosApiInstance
      .get(APILINK + "/categories/")
      .then((res) => {
        // console.log(res);
        this.setState({ category: res.data });
      });
  };
  getKeys = async () => {
    const result = await axiosApiInstance.get(APILINK + `/keywords/`);
    if (result) {
      console.log(result);

      this.setState({ keywords: result.data });
    }
  };
  componentDidMount() {
    this.getCategories();
    this.getKeys();
    this.getDetails();
    // let x = await this.refreshAccessToken();
    // console.log(x);
  }
  handleChange = (v, e) => {
    let keyID = this.state.keywords.filter((key) =>
      v.find((x) => {
        return x == key.name;
      })
    );
    console.log(keyID);
    const selectedkeyIds = keyID.map((key) => key.id);
    this.setState(
      {
        selectedKeys: v,
        selectedKeysId: selectedkeyIds,
      },
      () => {
        console.log(this.state.selectedKeysId + " " + this.state.selectedKeys);
      }
    );
    console.log(e);
    console.log(v);
  };

  handleCate = (v, e) => {
    let catID = this.state.category.filter((cat) =>
      v.find((x) => {
        return x == cat.name;
      })
    );
    console.log(catID);
    const selectedCatIds = catID.map((cat) => cat.id);
    this.setState({
      selectedCates: v,
      selectedCatesIds: selectedCatIds,
    });
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
      },
      (error) => {
        console.error(error);
      }
    );
  };
  onFileUpload = (e) => {
    e.preventDefault();
    this.setState({ selectedFile: e.target.files[0] });
  };
  updateInfo = async () => {
    // Request interceptor for API calls

    let data = {
      name: this.state.name,
      city: this.state.city,
      phone: this.state.phone,
      whatsapp: this.state.whatsapp,
      address: this.state.address,
      website: this.state.website,
      image: null,
      is_deliver: this.state.is_deliver,
      working_hours_from: this.state.working_hours_from,
      working_hours_to: this.state.working_hours_to,
      delivery_hours_from: this.state.delivery_hours_from,
      delivery_hours_to: this.state.delivery_hours_to,
      latitude: this.state.location.lat,
      longitude: this.state.location.lon,
      keyword: this.state.selectedKeysId,
      category: this.state.selectedCatesIds,
      // email:this.state.email
    };
    console.log(data);
    var newID = this.props.user.id.replace(/-/g, "");
    const result = await axiosApiInstance.put(
      APILINK + `/supplier/${newID}`,
      data
    );
    console.log(result);
    if (result.data === "") {
      setTimeout(() => {
        toast.info(`Profile was updated successfully`);
      }, 500);
      setTimeout(() => {
        this.props.history.push("/home");
      }, 3500);
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

  getDetails = async () => {
    this.setState({ loading: true });

    var newID = this.props.user.id.replace(/-/g, "");
    const result = await axiosApiInstance.get(
      APILINK + `/suppliers/?supplier=${newID}`
    );
    if (result) {
      console.log(result);
      result.data.map((x) => {
        let selectedkeys = this.state.keywords.filter((key) =>
          x.keyword.includes(key.name)
        );
        const selectedKeysNames = x.keyword.map((key) => key);
        const selectedKeysIds = selectedkeys.map((key) => key.id);

        let selectedCates = this.state.category.filter((cate) =>
          x.category.includes(cate.name)
        );
        const selectedCatesNames = x.category.map((cate) => cate);
        const selectedCatesIds = selectedCates.map((cate) => cate.id);

        this.setState({
          name: x.name,
          city: x.city,
          phone: x.phone,
          website: x.website,
          whatsapp: x.whatsapp,
          email: x.user.email,
          selectedKeys: selectedKeysNames,
          selectedKeysId: selectedKeysIds,
          selectedCates: selectedCatesNames,
          selectedCatesIds: selectedCatesIds,
          delivery_hours_from: x.delivery_hours_from,
          delivery_hours_to: x.delivery_hours_to,
          working_hours_from: x.working_hours_from,
          working_hours_to: x.working_hours_to,
          location: x.location,
          address: x.address,
          loading: false,
        });
      });
    }
  };
  render() {
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
                <i class="fas fa-shopping-basket pr-2"></i>Edit Profile
              </h2>
            </Col>
          </Row>
          {this.state.loading ? (
            <Spin tip='...loading' />
          ) : (
            <Form>
              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Name"
                    value={this.state.name}
                    name="name"
                    onChange={this.onHandleInput}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="City"
                    value={this.state.city}
                    name="city"
                    onChange={this.onHandleInput}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Label>Phone</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Phone"
                    value={this.state.phone}
                    name="phone"
                    onChange={this.onHandleInput}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>Whats app</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Whats app"
                    value={this.state.whatsapp}
                    name="whatsapp"
                    onChange={this.onHandleInput}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
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
                  <Form.Label>KeyWords</Form.Label>
                  {/* <Form.Control
                  type="text"
                  placeholder="Key Words"
                  value={this.state.words}
                  name="words"
                  onChange={this.handleWords}
                /> */}

                  <Select
                    mode="multiple"
                    placeholder="Select keywords"
                    value={this.state.selectedKeys}
                    onChange={this.handleChange}
                    style={{ width: "100%" }}
                    showSearch
                  >
                    {this.state.keywords.map((item) => (
                      <Select.Option
                        key={item.id}
                        id={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>Category</Form.Label>

                  <Select
                    mode="multiple"
                    placeholder="select category"
                    value={this.state.selectedCates}
                    onChange={this.handleCate}
                    style={{ width: "100%" }}
                    showSearch
                  >
                    {this.state.category.map((item) => (
                      <Select.Option
                        key={item.id}
                        id={item.id}
                        value={item.name}
                      >
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Col>
              </Row>
              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Label>Working Hours from</Form.Label>
                  <TimePicker
                    value={moment(this.state.working_hours_from, "HH:mm:ss")}
                    onChange={this.handleWorkingFrom}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>Working Hours to</Form.Label>
                  <TimePicker
                    value={moment(this.state.working_hours_to, "HH:mm:ss")}
                    onChange={this.handleWorkingTo}
                  />
                </Col>
              </Row>

              <Row className="mb-3">
                <Col sm={12} md={6}>
                  <Form.Label>Delivery Hours from</Form.Label>
                  <TimePicker
                    value={moment(this.state.delivery_hours_from, "HH:mm:ss a")}
                    onChange={this.handleDelieveryFrom}
                  />
                </Col>
                <Col sm={12} md={6}>
                  <Form.Label>Delivery Hours to</Form.Label>
                  <TimePicker
                    value={moment(this.state.delivery_hours_to, "HH:mm:ss")}
                    onChange={this.handleDelieveryTo}
                  />
                </Col>
              </Row>
             
              <Row>
                <Col style={{ textAlign: "center" }} sm={12} >
                  <Button
                    disabled={this.state.disable}
                    onClick={this.updateInfo}
                    className="addBtn2"
                  >
                    Save changes
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
          )}
        </Container>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(Profile, axiosApiInstance));
