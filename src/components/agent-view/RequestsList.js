import React, { Component } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style-sheets/home.css";
import "react-step-progress-bar/styles.css";
import RequestsDetails from "./RequestsDetails";
import axios from "axios";
import { connect } from "react-redux";
import { Collapse } from "antd";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const { Panel } = Collapse;
const axiosApiInstance = axios.create();
class RequestsList extends Component {
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
    };
  }

  getRequests = async () => {
    // console.log(newID);

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
        console.log(error.toJSON());
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
    let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK +`/prerequests/?agent=${newID}&limit=10`
    );

    console.log("orderssss");
    console.log(result.data);
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
    // window.HubSpotConversations.widget.load();
  }

  getDetails = (e) => {
    console.log(e.target.getAttribute("value"));
    let obj = this.state.orderData.find((o) => o.id === e.target.id);
    this.setState({
      details: obj,
      showDetails: true,
      chosenSupplier: e.target.getAttribute("value"),
    });
    // console.log(obj);
  };

  callback = (e) => {
    // console.log(e);
  };

  getNext = async () => {
    console.log(this.state.nextUrl);
    // console.log(newID);

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
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);

    console.log("orderssss");

    if (result) {
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
    }
  };

  getPrev = async () => {
    // console.log(this.state.prevUrl);
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
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(`${this.state.prevUrl}`);

    console.log("orderssss");
    if (result) {
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
    }
  };



  render() {
    return (
      <div id="chat">
        <Container className="pt-3">
          {/* <Row>
            <Col sm={12}>
              <Button className="headBtn">All</Button>{" "}
              <Button onClick={this.getOnlyRequests} className="headBtn">
                Requests
              </Button>{" "}
              <Button className="headBtn">Check Validation Requests</Button>
            </Col>
          </Row> */}
          <Row>
            <Col className="px-5" sm={12} md={6}>
              <Collapse
                className="site-collapse-custom-collapse"
                accordion
                onChange={this.callback}
              >
                {this.state.orderData.map((info) => {
                  return (
                    <React.Fragment>
                      <Panel header={`${info.name}`} key={info.id}>
                        {info.requests.map((req) => {
                          return (
                            <p
                              onClick={this.getDetails}
                              id={info.id}
                              value={req.supplier.id}
                              style={{ cursor: "pointer" }}
                            >
                              {req.supplier.name}
                            </p>
                          );
                        })}
                      </Panel>
                    </React.Fragment>
                  );
                })}
              </Collapse>
              {this.state.orderData.length === 0 ? null : (
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
                <RequestsDetails
                  chosenSupplier={this.state.chosenSupplier}
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

export default connect(mapStateToProps, null)(RequestsList);
