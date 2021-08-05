import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style-sheets/home.css";
import "react-step-progress-bar/styles.css";
import TestDetails from "./TestDetails";
import axios from "axios";
import { connect } from "react-redux";
import { Collapse } from "antd";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";
import { Spin } from "antd";
import sora1 from "../../imgs/no-orders.png";

const { Panel } = Collapse;
const axiosApiInstance = axios.create();
class TestList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      ordernum: "",
      customer: "",
      orderData: [],
      details: {},
      chosenSupplier: "",
      nextUrl: null,
      prevUrl: null,
      dis1: true,
      dis2: false,
      newData: {},
      link: APILINK + `/requests/?limit=10`,
      loading: false,
    };
  }

  handleFilter = (e) => {
    if (e.target.value === "1") {
      this.setState({
        link: APILINK + `/requests/?limit=10`,
      });
    } else {
      this.setState({
        link: APILINK + `/requests/?request_Validate=1&limit=10`,
        showDetails: false,
      });
    }
  };
  getRequests = async () => {
    this.setState({ loading: true });

    // console.log(newID);
    const result = await axiosApiInstance.get(this.state.link);
    if (result) {
      this.setState({ loading: false });
      if (result.data.results.length === 0) {
        this.setState({ newData: result.data.results });
      } else {
        this.setState({ orderData: result.data.results });

        let obj = {};
        let data = result.data.results.map((order) => {
          let arr = [];
          obj[order.pre_request.name] = result.data.results.filter(
            (req) => req.pre_request.name === order.pre_request.name
          );
          return obj;
        });

        let obj2 = data[0];
        console.log(obj2);

        this.setState({ newData: obj2 });
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
    }
  };
  componentWillUnmount(){
    window.HubSpotConversations.widget.remove();
  
  }
  componentDidMount() {
    this.getRequests();

  }

  getDetails = (e) => {
    console.log(e.target.getAttribute("value"));
    Object.entries(this.state.newData).map(([key, value]) => {
      for (let i = 0; i < value.length; i++) {
        if (
          value[i].supplier.id == e.target.getAttribute("value") &&
          e.target.id == value[i].pre_request.id
        ) {
          console.log(value[i]);
          this.setState({
            details: value[i],
          });
        }
      }
    });
    this.setState({ showDetails: true });
  };

  getNext = async () => {
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);
    if (result) {
      this.setState({
        orderData: result.data.results,
        // nextUrl: result.data.next,
        // prevUrl: result.data.previous,
      });

      let obj = {};
      let data = result.data.results.map((order) => {
        let arr = [];
        obj[order.pre_request.name] = result.data.results.filter(
          (req) => req.pre_request.name === order.pre_request.name
        );
        return obj;
      });

      let obj2 = data[0];

      this.setState({ newData: obj2 });

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
    }
  };

  getPrev = async () => {
    const result = await axiosApiInstance.get(`${this.state.prevUrl}`);

    if (result) {
      this.setState({
        orderData: result.data.results,
        // nextUrl: result.data.next,
        // prevUrl: result.data.previous,
      });

      let obj = {};
      let data = result.data.results.map((order) => {
        let arr = [];
        obj[order.pre_request.name] = result.data.results.filter(
          (req) => req.pre_request.name === order.pre_request.name
        );
        return obj;
      });

      let obj2 = data[0];
      this.setState({ newData: obj2 });

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
    }
  };
  componentDidUpdate(PrevProps, PrevState) {
    if (PrevState.link !== this.state.link) {
      this.getRequests();
    }
  }
  render() {
    return (
      <div>
        <Container className="pt-3">
          <Row>
            <Col className="px-5" sm={12} md={6}>
              <label for="cars">Filter by : </label>

              <select
                onChange={this.handleFilter}
                style={{ marginLeft: "10px" }}
                id="cars"
              >
                <option value="1">All Requests</option>
                <option value="2">Valid Requests</option>
              </select>
              {/* <Collapse
                className="site-collapse-custom-collapse"
                accordion
                onChange={this.callback}
              >
                {this.state.orderData.map((info) => {
                  return (
                    <React.Fragment>
                      <Panel
                        header={`${info.pre_request.name}`}
                        key={info.pre_request.id}
                      >
                        <p
                          onClick={this.getDetails}
                          id={info.pre_request.id}
                          value={info.supplier.id}
                          style={{ cursor: "pointer" }}
                        >
                          {info.supplier.name}
                        </p>
                      </Panel>
                    </React.Fragment>
                  );
                })}
              </Collapse> */}
              {(Object.keys(this.state.newData).length !== 0) &
              (this.state.loading == false) ? (
                Object.entries(this.state.newData).map(([key, value]) => {
                  return (
                    <React.Fragment>
                      <Collapse
                        className="site-collapse-custom-collapse"
                        accordion
                        onChange={this.callback}
                      >
                        <React.Fragment>
                          <Panel
                            header={`${key}`}
                            // key={info.pre_request.id}
                          >
                            {value.map((name) => {
                              return (
                                <p
                                  onClick={this.getDetails}
                                  id={name.pre_request.id}
                                  value={name.supplier.id}
                                  style={{ cursor: "pointer" }}
                                >
                                  {name.supplier.name}
                                </p>
                              );
                            })}
                          </Panel>
                        </React.Fragment>
                      </Collapse>
                      <hr style={{ backgroundColor: "#e2d9d9" }} />
                    </React.Fragment>
                  );
                })
              ) : (
                <Col className="text-center" sm={12}>
                  {this.state.loading ? (
                    <Spin tip="Loading..."></Spin>
                  ) : (
                    <img
                      style={{ height: "400px" }}
                      className="img-fluid"
                      src={sora1}
                    />
                  )}
                </Col>
              )}

              {Object.keys(this.state.newData).length === 0 ? null : (
                <div className="p-3">
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
                </div>
              )}
            </Col>
            <Col sm={6}>
              {this.state.showDetails === true ? (
                <TestDetails
                  //   chosenSupplier={this.state.chosenSupplier}
                  details={this.state.details}
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
)(ErrorHandler(TestList, axiosApiInstance));
