import React, { Component } from "react";

import { Container, Row, Col, Form, Button, Modal } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Select from "react-dropdown-select";
import "antd/dist/antd.css";
import { Select } from "antd";
import { connect } from "react-redux";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";
import isEqual from "lodash/isEqual";

const axiosApiInstance = axios.create();

class Add_product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      category: [],
      words: "",
      keywords: [],
      selectedFile: null,
      categId: "",
      selectedCat: [],
      selectedKeys: [],
      selectedKeysID: [],
      selectedCatID: [],
      FEError: "",
      showCategory: false,
      keyname: "",
    };
  }

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  createProduct = async () => {
    this.setState({ FEError: "" });

    let data = {
      name: this.state.name,
      price: this.state.price,
      code: this.state.code,
      quantity: this.state.quantity,
      keyword: this.state.selectedKeysID,
      category: [this.state.selectedCatID],
      image: null,
    };

    if (this.state.selectedFile !== null) {
      const eventdata = new FormData();
      let x = [];
      x.push(this.state.selectedCatID);
      eventdata.append("image", this.state.selectedFile);
      eventdata.append("name", this.state.name);
      eventdata.append("price", this.state.price);
      eventdata.append("code", this.state.code);
      eventdata.append("quantity", this.state.quantity);

      for (var i = 0; i < this.state.selectedKeys.length; i++) {
        eventdata.append("keyword", this.state.selectedKeysID[i]);
      }
      for (var i = 0; i < x.length; i++) {
        eventdata.append("category", x[i]);
      }

      const result = await axiosApiInstance.post(
        APILINK + `/product`,
        eventdata
      );
      if (result) {
        if (result.data.data.id) {
          setTimeout(() => {
            toast.info(`Product was created successfully`);
          }, 500);
          setTimeout(() => {
            this.props.history.push("/products");
          }, 3500);
        }
      }
    } else {
      console.log(data);
      const result = await axiosApiInstance
        .post(APILINK + `/product`, data)
        .catch((err) => {
          console.log(err.response);
        });
      if (result) {
        if (result.data.data.id) {
          setTimeout(() => {
            toast.info(`Product was created successfully`);
          }, 500);
          setTimeout(() => {
            this.props.history.push("/products");
          }, 3500);
        }
      }
    }
    // }
  };

  onFileUpload = (e) => {
    e.preventDefault();
    this.setState({ selectedFile: e.target.files[0] });
  };

  getCategories = async () => {
    // Request interceptor for API calls
    axiosApiInstance.interceptors.request.use(
      async (config) => {
        config.headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Response interceptor for API calls
    axiosApiInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
              });
            let access_token = await x;
            console.log("here2");
            console.log(access_token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + access_token;
            localStorage.setItem("accessToken", "Bearer " + access_token);

            return axiosApiInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    const result = await axiosApiInstance
      .get(APILINK + "/categories/?limit=10000")
      .then((res) => {
        // console.log(res);
        this.setState({ category: res.data.results });
      });
  };
  getKeys = async () => {
    var newID = this.props.user.id.replace(/-/g, "");

    // Request interceptor for API calls
    axiosApiInstance.interceptors.request.use(
      async (config) => {
        config.headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Response interceptor for API calls
    axiosApiInstance.interceptors.response.use(
      (response) => {
        console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
              });
            let access_token = await x;
            console.log("here2");
            console.log(access_token);
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + access_token;
            localStorage.setItem("accessToken", "Bearer " + access_token);

            return axiosApiInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );
    var newID = this.props.user.id.replace(/-/g, "");
    const result = await axiosApiInstance
      .get(APILINK + `/keywords/?supplier=${newID}&limit=10000`)
      .then((result) => this.setState({ keywords: result.data.results }));
  };

  handleChange = (e) => {
    this.setState({
      selectedKeys: e,
      selectedKeysID: e,
    });
    // console.log(e);
  };

  handleCate = (v, e) => {
    this.setState({
      selectedCat: e.value,
      selectedCatID: e.id,
    });
  };

  handleSubmit = (e) => {
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      this.createProduct();
    }
    this.setState({ validated: true });
    e.preventDefault();
  };
  openModelCategory = () => {
    this.setState({ showCategory: true });
  };
  close1 = () => {
    this.setState({ showCategory: false });
  };
  handleKeyInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.value.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
      this.setState({ keyname: e.target.value });

      this.setState({ errName: "", disable: false });
    }
    // this.setState({ name: e.target.value });
    else {
      this.setState({
        errName: "no special characters or space allowed",
        disable: true,
      });
    }
  };
  addKeyword = async () => {
    let data = {
      name: this.state.keyname,
    };
    const result = await axiosApiInstance.post(APILINK + `/keyword`, data);
    // console.log(result)
    if (result) {
      this.setState({ showCategory: false, keyname: "" });
      this.getCategories();
    }
  };
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "130px", marginLeft: "300px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket"></i> Add Products
              </h2>
            </Col>
          </Row>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={this.handleSubmit}
          >
            {" "}
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationUsername">
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
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationcode">
                  <Form.Label>Code</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Code"
                    value={this.state.code}
                    name="code"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Group controlId="validationprice">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Price"
                    value={this.state.price}
                    name="price"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col sm={12} md={6}>
                <Form.Group controlId="validationquantity">
                  <Form.Label>Quantity</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Quantity"
                    value={this.state.quantity}
                    name="quantity"
                    onChange={this.onHandleInput}
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    this field is require
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Row>
                  <Col md="6">
                    {" "}
                    <Form.Label>KeyWords</Form.Label>
                  </Col>
                  <Col style={{ textAlign: "right" }} md={6}>
                    {" "}
                    <p onClick={this.openModelCategory}>
                      <i class="fas fa-plus-circle"></i>Add Keyword
                    </p>
                  </Col>
                </Row>
                <Select
                  mode="multiple"
                  placeholder="Select keywords"
                  value={this.state.selectedKeys}
                  onChange={this.handleChange}
                  style={{ width: "100%" }}
                  onClick={this.getKeys}
                  showSearch
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

                <Select
                  // mode="multiple"
                  placeholder="select category"
                  value={this.state.selectedCat}
                  onChange={this.handleCate}
                  style={{ width: "100%" }}
                  onClick={this.getCategories}
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
              <Col sm={12} md={12}>
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
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button onClick={this.handleSubmit} className="addBtn2">
                  Submit
                </Button>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center" }} sm={12} md={12}>
                <p style={{ fontWeight: "bold", color: "red" }}>
                  {this.state.FEError}
                </p>
              </Col>
            </Row>
          </Form>
          <ToastContainer position="bottom-right" />
          <Modal size="lg" show={this.state.showCategory} onHide={this.close1}>
            <Container className="p-4 modal2">
              <Row>
                <Col sm={12}>
                  <h2> Add Keyword</h2>{" "}
                </Col>
              </Row>
              <Form>
                <Row className="mb-3">
                  <Col sm={12} md={12}>
                    <Form.Label>Keyword</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Keyword"
                      value={this.state.keyname}
                      name="keyname"
                      onChange={this.handleKeyInput}
                    />
                  </Col>
                  <p style={{ color: "red", fontWeight: "bold" }}>
                    {this.state.errName}
                  </p>
                </Row>

                <Row>
                  <Col sm={12} md={6}></Col>
                  <Col style={{ textAlign: "end" }} sm={12} md={6}>
                    <Button onClick={this.close1} className="addBtn1">
                      Cancel
                    </Button>
                    <Button onClick={this.addKeyword} className="addBtn2">
                      Add
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Container>
          </Modal>
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(
  mapStateToProps,
  null
)(ErrorHandler(Add_product, axiosApiInstance));
