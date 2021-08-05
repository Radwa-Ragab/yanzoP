import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { ToastContainer, toast } from "react-toastify";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();
class EditCategory extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  Edit = async () => {
   
    let data = {
      name: this.state.name,
      code: this.state.code,
      type: this.state.type,
      yanzo_rate: this.state.rate,
    };
    const result = await axiosApiInstance.put(
      APILINK + `/category/${this.props.match.params.id}`,
      data
    );
    console.log(result);
    if(result)
    {
      if (result.data === "") {
        setTimeout(() => {
          toast.info(`Category was updated successfully`);
        }, 500);
      }
    }
    
  };

  getAll = async () => {
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
            // await this.refreshAccessToken();
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

    const result = await axiosApiInstance.get(APILINK + "/categories/");
    console.log(result.data);
    let details = result.data.find((x) => x.id === this.props.match.params.id);
    console.log(details);
    this.setState({
      name: details.name,
      rate: details.yanzo_rate,
      code: details.code,
      type: details.type,
    });
  };

  componentDidMount() {
    this.getAll();
  }
  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "320px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-sitemap pr-2"></i>Edit Category
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
            {/* <Row className="mb-3">
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
            </Row> */}

            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button className="addBtn1">Cancel</Button>
                <Button onClick={this.Edit} className="addBtn2">
                  Save Changes
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
        <ToastContainer position="bottom-right" />
      </div>
    );
  }
}

export default ErrorHandler(EditCategory, axiosApiInstance);
