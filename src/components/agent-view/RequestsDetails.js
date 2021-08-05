import React, { Component } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import "../../style-sheets/home.css";

import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewMap from "../ViewMap";
import { ProgressBar, Step } from "react-step-progress-bar";
import {
  searchResultSuppliers,
  clearRes,
  agentRequestData,
} from "../../global-state/actions/agentRequestAction";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Link } from "react-router-dom";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import {APILINK} from '../../Endpoint'
const axiosApiInstance = axios.create();
class RequestsDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openConfirm: false,
      opencreate: false,
      showRej: false,
      lastElement: "",
      currentValidate: "",
      currentValidateSupp: {},
    };
  }

  createOffer = async (e) => {
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
              .post(APILINK +`/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
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

    const result = await axiosApiInstance.get(
      APILINK +`/create_offer/${e.target.id}`
    );
    // console.log(result);
    if (result) {
      if (result.data.data.id) {
        setTimeout(() => {
          toast.info(`Offer has been created`);
        }, 500);
      }
    }
  };

  getRequestsValidate = async (e) => {
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
              .post(APILINK +`/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
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

    const result = await axiosApiInstance.get(
      APILINK +`/requests/?request_Validate=1`
    );
    if (result) {
      console.log("hna fl requestat");
      console.log(result.data);
      result.data.map((x) => {
        console.log(x.supplier);
        this.setState({ currentValidateSupp: result.data.supplier });
      });
      let current_validate = result.data.find(
        (x) => x.pre_request.id === this.props.details.id
      );
      console.log("current_validate");
      console.log(current_validate);
      this.setState({ currentValidate: current_validate });
      let last_element;
      if (current_validate !== undefined) {
        if (current_validate.RequestsValidate.length !== 0) {
          last_element =
            current_validate.RequestsValidate[
              current_validate.RequestsValidate.length - 1
            ];

          console.log(last_element);
          this.setState({ lastElement: last_element });
        }
      }
    }

    // this.setState({ validateData: current_validate });
  };

  componentDidMount() {
    this.getRequestsValidate();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.details.id !== this.props.details.id) {
      console.log("changeeeeee");
      this.getRequestsValidate();
    }
  }

  confirmAvail = async (e) => {
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
              .post(APILINK +`/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
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
    let data = {
      request: {
        validate_status: "2",
      },
    };

    const result = await axiosApiInstance.put(
      APILINK +`/status_validate/${e.target.id}`,
      data
    );
    if (result) {
      console.log(result);
      if (result.data.data.id) {
        setTimeout(() => {
          toast.info(`confirmed successfully`);
        }, 500);
      }
    }
  };

  rejectAvail = async (e) => {
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
              .post(APILINK +`/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
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
    let data = {
      request: {
        validate_status: "3",
      },
    };

    const result = await axiosApiInstance.put(
      APILINK +`/status_validate/${e.target.id}`,
      data
    );
    if (result) {
      console.log(result);
      if (result.data.data.id) {
        setTimeout(() => {
          toast.dark(`Rejected successfully`);
        }, 500);
      }
    }
  };

  getPreReqData = async () => {
    console.log(this.props.details);

    let cat = this.props.details.category.map((c) => c.name);
    let keys = this.props.details.keyword.map((k) => k.name);

    let catID = this.props.details.category.map((c) => c.id);
    let keysID = this.props.details.keyword.map((k) => k.id);
    let link;
    let x = cat.toString();
    var res = x.replace(/,/g, "__");
    let y = keys.toString();
    var res2 = y.replace(/,/g, "__");

    let data = {
      PreRequest: {
        name: this.props.details.name,
        product_quantity: this.props.details.product_quantity,
        client_address: this.props.details.client_address,
        latitude: this.props.details.location.lat,
        longitude: this.props.details.location.lon,
        order_code: this.props.details.order_code,
        expected_delivery_date: this.props.details.expected_delivery_date,
        keyword: keysID,
        category: catID,
      },
    };
    console.log(data);

    link = APILINK +`/suppliers/?categories__in=${res}&keywords__in=${res2}`;
    console.log(link);

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
        // console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK +`/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
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
    const result = await axiosApiInstance.get(`${link}`);
    if (result) {
      console.log(result);
      if (result.data) {
        this.props.searchResultSuppliers(result.data);
        this.props.agentRequestData(data);
      }
    }
  };

  render() {
    let chosensupplier = this.props.details.requests.find(
      (o) => o.supplier.id === this.props.chosenSupplier
    );
    console.log(this.props.details);
    console.log(chosensupplier);
    return (
      <div style={{ borderLeft: "solid 1px yellow" }}>
        <Container className="pt-3">
          <Row>
            <Col sm={6}>
              <h4>Order Details</h4>
            </Col>
            <Col sm={6}>
              {chosensupplier.request_type === "1" ? (
                <Link to={"/view_suppliers"}>
                  <Button
                    id={this.state.lastElement.id}
                    onClick={this.getPreReqData}
                    className="addBtn px-4"
                  >
                    <i class="fas fa-plus-circle"></i> Add New Suppliers
                  </Button>
                </Link>
              ) : null}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={9}>
              <p style={{ color: "grey", fontSize: "16px" }}>
                {this.props.details.name} - {chosensupplier.supplier.name}
              </p>
            </Col>
            <Col sm={3}>
              {" "}
              {chosensupplier.offer_status === "2" ||
              chosensupplier.request_status === "2" ? (
                <p style={{ color: "red" }}>Rejected</p>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col style={{ background: "#993b78", color: "white" }} sm={12}>
              <p style={{ marginBottom: "0rem" }}>
                Order Code {this.props.details.order_code}
              </p>
            </Col>
          </Row>
          <Row className="my-4">
            <Col sm={12} md={6}>
              <p
                style={{ fontWeight: "bold", fontSize: "13px", color: "grey" }}
              >
                Product Name :{" "}
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "13px",
                    color: "grey",
                  }}
                >
                  {this.props.details.name}
                </span>
              </p>
              <p
                style={{ fontWeight: "bold", fontSize: "13px", color: "grey" }}
              >
                Product Price :{" "}
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "13px",
                    color: "grey",
                  }}
                >
                  {chosensupplier.yanzo_price}
                </span>
              </p>
              <p
                style={{ fontWeight: "bold", fontSize: "13px", color: "grey" }}
              >
                Product Quantity :{" "}
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "13px",
                    color: "grey",
                  }}
                >
                  {this.props.details.product_quantity}
                </span>{" "}
              </p>

              <p
                style={{ fontWeight: "bold", fontSize: "13px", color: "grey" }}
              >
                Expected Deliever Date:{" "}
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "13px",
                    color: "grey",
                  }}
                >
                  {this.props.details.expected_delivery_date}
                </span>{" "}
              </p>
              <p
                style={{ fontWeight: "bold", fontSize: "13px", color: "grey" }}
              >
                Client Address :{" "}
                <span
                  style={{
                    fontWeight: "400",
                    fontSize: "13px",
                    color: "grey",
                  }}
                >
                  {this.props.details.client_address}
                </span>{" "}
              </p>
              {/* {chosensupplier.request_status === "2" ? (
                <p>(Rejected)</p>
              ) : null} */}
            </Col>
            <Col sm={12} md={6}>
              <img
                className="img-fluid"
                src={APILINK +`${this.props.details.image}`}
                alt="product"
              />
            </Col>
          </Row>

          <Row style={{ paddingLeft: "20px" }}>
            <Col className="mb-2" style={{ textAlign: "initial" }} sm={12}>
              <Row>
                <Col
                  style={{
                    marginLeft: "-15px",
                    color: "#993b78",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  sm={4}
                >
                  <p>Requested</p>
                </Col>
                <Col
                  style={{
                    textAlign: "right",
                    color: "#993b78",
                    fontSize: "14px",
                    fontWeight: "500",
                  }}
                  sm={4}
                >
                  <p style={{ marginRight: "18px" }}>Offered</p>
                </Col>

                <Col style={{ textAlign: "right" }} sm={4}>
                  <p
                    style={{
                      marginRight: "-41px",
                      color: "#993b78",
                      fontSize: "14px",
                      fontWeight: "500",
                    }}
                  >
                    Ordered
                  </p>
                </Col>
              </Row>
            </Col>
          </Row>

          {chosensupplier.request_type === "1" ? (
            <Row style={{ paddingLeft: "20px" }}>
              <Col className="mb-5" style={{ textAlign: "initial" }} sm={12}>
                <ProgressBar className="bar1" percent={0}>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                </ProgressBar>
              </Col>
            </Row>
          ) : chosensupplier.request_type === "2" ? (
            <Row style={{ paddingLeft: "20px" }}>
              <Col className="mb-5" style={{ textAlign: "initial" }} sm={12}>
                <ProgressBar className="bar1" percent={50}>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                </ProgressBar>
              </Col>
            </Row>
          ) : chosensupplier.request_type === "3" ? (
            <Row style={{ paddingLeft: "20px" }}>
              <Col className="mb-5" style={{ textAlign: "initial" }} sm={12}>
                <ProgressBar className="bar1" percent={100}>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                  <Step>
                    {({ accomplished, index }) => (
                      <div
                        className={`indexedStep ${
                          accomplished ? "accomplished" : null
                        }`}
                      ></div>
                    )}
                  </Step>
                </ProgressBar>
              </Col>
            </Row>
          ) : null}

          <Row className="mb-3">
            <Col sm={12} md={12}>
              <ViewMap location={this.props.details.location} />
            </Col>
          </Row>

          {chosensupplier.request_type !== "3" &&
          this.state.currentValidate !== undefined ? (
            <React.Fragment>
              <Row>
                <Col sm={12}>
                  <p>Is it still available?</p>
                </Col>
              </Row>
              <Row className="my-3">
                <Col sm={12}>
                  <Button
                    id={this.state.lastElement.id}
                    onClick={this.confirmAvail}
                    className="btn1 px-4"
                  >
                    Confirm
                  </Button>
                  <Button
                    id={this.state.lastElement.id}
                    onClick={this.rejectAvail}
                    className="btn2 px-4"
                  >
                    Reject
                  </Button>
                </Col>
              </Row>
            </React.Fragment>
          ) : null}
          {/* {chosensupplier.offer_status !== null ||
          chosensupplier.offer_status ===
            null ? null : ((
              chosensupplier.request_status === "1" ||
              chosensupplier.request_status === "3") &&
              chosensupplier.request_type === "1") ||
            chosensupplier.request_type === "2" ? (
            <Button
              id={chosensupplier.id}
              onClick={this.createOffer}
              className="btn1 px-4"
            >
              Create Offer
            </Button>
          ) : null} */}
          {(chosensupplier.request_status === "1" ||
            chosensupplier.request_status === "3") &&
          (chosensupplier.request_type === "2" ||
            chosensupplier.request_type === "1") &&
          chosensupplier.offer_status !== "2" ? (
            <Button
              id={chosensupplier.id}
              onClick={this.createOffer}
              className="btn1 px-4"
            >
              Accept Offer
            </Button>
          ) : null}
          <ToastContainer position="bottom-right" />
        </Container>
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
    { searchResultSuppliers, clearRes, agentRequestData },
    dispatch
  );
};
export default connect(mapStateToProps, mapDispatchToProps)(RequestsDetails);
