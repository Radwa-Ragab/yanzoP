import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style-sheets/home.css";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";
import OrderDetails from "./OrderDetails";
import axios from "axios";
import { connect } from "react-redux";
// import { Pagination } from "antd";
import isEqual from "lodash/isEqual";
import sora1 from "../../imgs/no-orders.png";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();
class ProgressSupplier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      ordernum: "",
      customer: "",
      orderData: [],
      details: {},
      nextUrl: "",
      prevUrl: "",
      count: 1,
      current: 1,
      dis1: true,
      dis2: false,
      percent: 100,
      is_order: false,
    };
  }

  stateHandler = async (e) => {
    console.log(e.target.value);
    console.log(e.target.id);
    let orderId = e.target.id;

    let data = {
      order_status: e.target.value,
    };
    let link = APILINK + `/order/${orderId}`;
    const result = await axiosApiInstance.put(link, data);
    console.log(result);
  };
  getRequests = async () => {
    let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/requests/?supplier=${newID}&limit=10`
    );

    console.log("orderssss");
    if (result) {
      this.setState({ orderData: result.data.results });

      if (result.data.next !== null) {
        this.setState({
          nextUrl: result.data.next,
        });
      }

      if (result.data.previous !== null) {
        this.setState({
          prevUrl: result.data.previous,
        });
      }
      if (result.data.next === null) {
        this.setState({ dis2: true });
      }
    }
  };

  componentDidMount() {
    this.getRequests();
  }
  changeOffer = (e) => {
    this.setState((prevState) => ({
      is_order: !prevState.is_order,
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.orderData, this.state.orderData)) {
      console.log(prevState.orderData);
      console.log(this.state.orderData);

      console.log("change");
    }

    if (prevState.is_order !== this.state.is_order) {
      this.getRequests();
    }
  }

  getNext = async () => {
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);

    console.log("orderssss");

    console.log(result.data);
    this.setState({
      orderData: result.data.results,
      // nextUrl: result.data.next,
      // prevUrl: result.data.previous,
    });
    if (result.data.next !== null) {
      this.setState({
        nextUrl: result.data.next,
        // prevUrl: result.data.previous,
      });
    }
    if (result.data.previous !== null) {
      this.setState({
        prevUrl: result.data.previous,
        dis1: false,
      });
    }
    if (result.data.next === null) {
      this.setState({ dis2: true, dis1: false });
    }
  };

  getPrev = async () => {
    const result = await axiosApiInstance.get(`${this.state.prevUrl}`);

    console.log("orderssss");
    console.log(result.data);
    this.setState({
      orderData: result.data.results,
      // nextUrl: result.data.next,
      // prevUrl: result.data.previous,
    });
    if (result.data.next !== null) {
      this.setState({
        nextUrl: result.data.next,
        dis2: false,

        // prevUrl: result.data.previous,
      });
    }
    if (result.data.previous !== null) {
      this.setState({
        prevUrl: result.data.previous,
      });
    }
    if (result.data.previous === null) {
      this.setState({ dis1: true, dis2: false });
    }
  };

  getDetails = (e) => {
    console.log(e.target.id);

    let obj = this.state.orderData.find((o) => o.id === e.target.id);
    this.setState({ details: obj, showDetails: true });
    console.log(obj);
  };

  goo = (pageNumber) => {
    console.log("Page: ", pageNumber);
    console.log("current: ", this.state.current);
    // if (this.state.current < pageNumber) {
    //   this.getNext();
    // } else {
    //   this.getPrev();
    // }
    this.setState({
      current: pageNumber,
    });
  };

  render() {
    return (
      <div>
        <Container className="pt-3">
          <Row>
            <Col className="px-5" sm={12} md={6}>
              {this.state.orderData.length !== 0
                ? this.state.orderData.map((info) => {
                    return (
                      <React.Fragment>
                        <Row>
                          <Col sm={6}>
                            <p
                              style={{
                                color: "#993b78",
                                fontSize: "20px",
                                fontWeight: "bold",
                                marginBottom: "1rem",
                                cursor: "pointer",
                                borderBottom:"solid",
                                display:"inline-block"
                              }}
                              onClick={this.getDetails}
                              name={"Smart TV"}
                              id={info.id}
                            >
                              {info.pre_request.name}
                              {/* {info.request_status === "2" ? (
                            <span>(Rejected)</span>
                          ) : null} */}
                            </p>
                            {/* <p
                          style={{
                            color: "#993b78",
                            fontSize: "14px",
                            fontWeight: "bold",
                          }}
                        >
                          David John
                        </p> */}
                          </Col>
                          {info.is_deliver && info.request_type === "3" ? (
                            <Col sm={6}>
                              {/* <Dropdown style={{float:"right"}} arrow={false} overlay={this.menu} trigger={['click']}>
                            <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                              Current State<DownOutlined />
                            </a>
                          </Dropdown> */}

                              <select
                                style={{
                                  float: "right",
                                  backgroundColor: "#993b78",
                                  color: "white",
                                  borderRadius: "5px",
                                  height: "35px",
                                  fontWeight: "bold",
                                  border: "none",
                                  letterSpacing: "1px",
                                }}
                                onChange={this.stateHandler}
                                name="state"
                                id={info.orders.id}
                              >
                                <option value="1">In Progress</option>
                                <option value="2">Ready For Delivery</option>
                                <option value="3">Out For Delivery</option>
                                <option value="4">Delivered</option>
                                <option
                                  style={{ display: "none" }}
                                  selected="selected"
                                >
                                  {info.orders.order_status === "4"
                                    ? "Delivered"
                                    : info.orders.order_status === "3"
                                    ? "Out For Delivery"
                                    : info.orders.order_status === "2"
                                    ? "Ready For Delivery"
                                    : "In Progress"}
                                </option>
                              </select>
                            </Col>
                          ) : null}
                        </Row>
                        <Row style={{ paddingLeft: "20px" }}>
                          <Col
                            className="mb-2"
                            style={{ textAlign: "initial" }}
                            sm={12}
                          >
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

                        {info.request_type === "1" ? (
                          <Row style={{ paddingLeft: "20px" }}>
                            <Col
                              className="mb-5"
                              style={{ textAlign: "initial" }}
                              sm={12}
                            >
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
                        ) : info.request_type === "2" ? (
                          <Row style={{ paddingLeft: "20px" }}>
                            <Col
                              className="mb-5"
                              style={{ textAlign: "initial" }}
                              sm={12}
                            >
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
                        ) : info.request_type === "3" ? (
                          <Row style={{ paddingLeft: "20px" }}>
                            <Col
                              className="mb-5"
                              style={{ textAlign: "initial" }}
                              sm={12}
                            >
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

                        {/* <Row style={{ paddingLeft: "20px" }}>
                          <Col
                            className="mb-5"
                            style={{ textAlign: "initial" }}
                            sm={12}
                          >
                            <ProgressBar
                              className="bar1"
                              percent={this.state.percent}
                            >
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
                        </Row> */}
                      </React.Fragment>
                    );
                  })
                : null}
              {this.state.orderData.length === 0 ? null : (
                <div>
                  {" "}
                  <Button
                    disabled={this.state.dis1}
                    onClick={this.getPrev}
                    className="nextBtn"
                  >
                    <i class="fas fa-angle-double-left"></i> Previous
                  </Button>
                  <Button
                    disabled={this.state.dis2}
                    onClick={this.getNext}
                    className="nextBtn"
                  >
                    Next<i class="fas fa-angle-double-right pl-1"></i>
                  </Button>
                  {/* <Pagination
                  onChange={this.goo}
                  // defaultCurrent={1}
                  total={this.state.count}
                  current={this.state.current}
                /> */}
                </div>
              )}
            </Col>
            <Col sm={6}>
              {this.state.showDetails === true ? (
                <OrderDetails
                  changeOffer={this.changeOffer}
                  details={this.state.details}
                />
              ) : null}
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "center" }} sm={12}>
              {this.state.orderData.length === 0 ? (
                <img
                  style={{ height: "400px" }}
                  className="img-fluid"
                  src={sora1}
                />
              ) : null}
            </Col>
          </Row>
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
)(ErrorHandler(ProgressSupplier, axiosApiInstance));
