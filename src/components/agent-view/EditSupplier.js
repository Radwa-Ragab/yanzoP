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
import {APILINK} from '../../Endpoint'

const axiosApiInstance = axios.create();
Geocode.setApiKey("AIzaSyDGLV2zbFZNvPOeFtuePcisgwAbmVIsSH0");

class EditSupplier extends Component {
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
      delivery_hours_from : ""
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
    this.setState({ workingFrom: timeString });
  };

  handleWorkingTo = (time, timeString) => {
    // console.log(timeString);
    this.setState({ workingTo: timeString });
  };

  handleDelieveryFrom = (time, timeString) => {
    this.setState({ delivery_hours_from: timeString },()=>{
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
      .get(APILINK +"/categories/")
      .then((res) => {
        // console.log(res);
        this.setState({ category: res.data });
      });
  };
  getKeys = async () => {
  
    const result = await axiosApiInstance
      .get(APILINK +`/keywords/`)
      if(result){

        this.setState({ keywords: result.data })

      }

  };
  componentDidMount() {
    this.getCategories();
    this.getKeys();
    this.getDetails();
    // let x = await this.refreshAccessToken();
    // console.log(x);
  }
  handleChange = (v,e) => {
    let keyID = this.state.keywords.filter((key) =>
      v.find((x) => {
        return x == key.name;
      })
    );
    const selectedkeyIds = keyID.map((key) => key.id);
    this.setState({
      selectedKeys:v,
      selectedKeysId: selectedkeyIds,
    },()=>{
    });
  
  };

  handleCate = (v,e) => {
    let catID = this.state.category.filter((cat) =>
      v.find((x) => {
        return x == cat.name;
      })
    );
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
  onEdit = async () => {
  
    this.setState({ disable: true });
    let data = {
      name: this.state.name,
      city: this.state.city,
      phone: this.state.phone,
      whatsapp: this.state.whats,
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
    };

    if (this.state.selectedFile !== null) {
      const eventdata = new FormData();
      let x = [];
      x.push(this.state.selectedCat);
      eventdata.append("image", this.state.selectedFile);
      eventdata.append("name", this.state.name);
      eventdata.append("city", this.state.city);
      eventdata.append("address", this.state.address);
      eventdata.append("is_deliver", this.state.is_deliver);
      eventdata.append("working_hours_from", this.state.working_hours_from);
      eventdata.append("working_hours_to", this.state.working_hours_to);
      eventdata.append("delivery_hours_from", this.state.delivery_hours_from);
      eventdata.append("delivery_hours_to", this.state.delivery_hours_to);
      eventdata.append("latitude", this.state.location.lat);
      eventdata.append("longitude", this.state.location.lon);
      eventdata.append("website", this.state.website);
      eventdata.append("phone", this.state.phone);
      eventdata.append("whatsapp", this.state.whats);
      if (this.state.selectedKeysId.length !== 0) {
        for (var i = 0; i < this.state.selectedKeysId.length; i++) {
          eventdata.append("keyword", this.state.selectedKeysId[i]);
        }
      }
      if (this.state.selectedCategoryId.length !== 0) {
        for (var i = 0; i < this.state.selectedCategoryId.length; i++) {
          eventdata.append("category", this.state.selectedCategoryId[i]);
        }
      }
      for (var pair of eventdata.entries()) {
      }
      const result = await axiosApiInstance.put(
        APILINK +`/supplier/${this.props.match.params.id}`,
        eventdata
      );
    } else {
      const result = await axiosApiInstance
        .put(
          APILINK +`/supplier/${this.props.match.params.id}`,
          data
        )
        .catch((err) => {

          this.setState({ BEerr: err.response.data.error.email });
        });
      if (result) {
        if (result.data == "") {
          setTimeout(() => {
            toast.info(`Supplier was updated successfully`);
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

  getDetails = async () => {
 
    // console.log(newID);

    const result = await axiosApiInstance.get(
      APILINK +`/suppliers/`
    );
    if (result.data) {
      let obj = result.data.find((o) => o.id === this.props.match.params.id);
      console.log(obj);
      const selectedkeywords = obj.keyword
      const selectedCate = obj.category
      //   console.log(this.state.keywords)
    //   if (
    //     this.state.keywords.length !== 0 &&
    //     this.state.category.length !== 0
    //   ) {
        // alert("here");
        let selectedkeys = this.state.keywords.filter((key) =>
          selectedkeywords.includes(key.name)
        );
        const selectedKeysNames = selectedkeys.map((key) => key.name);
        const selectedKeysIds = selectedkeys.map((key) => key.id);

        let selectedCates = this.state.category.filter((cate) =>
          selectedCate.includes(cate.name)
        );
        const selectedCatesNames = selectedCates.map((cate) => cate.name);

        const selectedCatesIds = selectedCates.map((cate) => cate.id);

        this.setState({
          name: obj.name,
          address: obj.address,
          website: obj.website,
          whats: obj.whatsapp,
          delivery_hours_from: obj.delivery_hours_from,
          delivery_hours_to: obj.delivery_hours_to,
          working_hours_from: obj.working_hours_from,
          working_hours_to: obj.working_hours_to,
          selectedKeys: selectedKeysNames,
          selectedKeysId: selectedKeysIds,
          selectedCates: selectedCatesNames,
          selectedCategoryId: selectedCatesIds,
          location: {
            lat: obj.latitude,
            lon: obj.longitude,
          },
          create_date: obj.create_date,
          phone: obj.phone,
          city: obj.city,
          image: obj.image,
          modified_date: obj.modified_date,
          is_deliver: obj.is_deliver,
          supplierId: obj.id,
        });
    //   }
    }
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
                <i class="fas fa-shopping-basket pr-2"></i>Edit Supplier
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
                  value={this.state.whats}
                  name="whats"
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
                    <Select.Option key={item.id} id={item.id} value={item.name}>
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
                    <Select.Option key={item.id} id={item.id} value={item.name}>
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
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Image</Form.Label>
                <form>
                  <input
                    // value={this.state.image}
                    onChange={this.onFileUpload}
                    type="file"
                    id="myFile"
                    name="filename"
                  />
                </form>
                {this.state.image ? (
                  <img
                    width="250px"
                    height="250px"
                    src={`APILINK +${this.state.image}`}
                  ></img>
                ) : (
                  <p>No image selected</p>
                )}
              </Col>
              <Col sm={12} md={6}>
                <Checkbox
                  value={this.state.is_deliver}
                  onChange={this.handleIsDeliver}
                >
                  Is Deliver?
                </Checkbox>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <p>Google Map Location </p>
                <ViewMap location={this.state.location} />
              </Col>
            </Row>
            <Row>
              <Col sm={12} md={6}></Col>
              <Col style={{ textAlign: "center" }} sm={12} md={6}>
                <Button className="addBtn1">Cancel</Button>
                <Button
                  disabled={this.state.disable}
                  onClick={this.onEdit}
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
        </Container>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

export default connect(null, null)(ErrorHandler(EditSupplier,axiosApiInstance));
