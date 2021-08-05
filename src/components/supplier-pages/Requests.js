import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import { APILINK } from "../../Endpoint";
import { Spin } from "antd";
import { Link } from "react-router-dom";
const axiosApiInstance = axios.create();
class Requests extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      keyWord: "",
      columns: [
        {
          name: "Request Name",
          selector: "pre_request.name",
          sortable: true,
          right: true,
        },
        {
          name: "Quantity",
          selector: "pre_request.product_quantity",
          sortable: true,
          right: true,
        },
        {
          name: "To Supplier",
          selector: "supplier.name",
          sortable: true,
          right: true,
        },
        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              <OverlayTrigger
                key={"top"}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"top"}`}>View Details</Tooltip>
                }
              >
                <Link to={`/view_request_details/${row.id}`}>
                  <button className="actionBtn">
                    <i class="fas fa-eye"></i>{" "}
                  </button>
                </Link>
              </OverlayTrigger>
            </div>
          ),
        },
      ],
      nextUrl: "",
      prevUrl: "",
      dis1: true,
      dis2: false,
    };
  }

  getRequests = async () => {
    this.setState({ loading: true });
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
    var newID = this.props.user.id.replace(/-/g, "");
    console.log(newID);
    if (this.props.user.user_type === "2") {
      const result = await axiosApiInstance.get(
        APILINK + `/requests/?supplier=${newID}&request_type__in=1__2&limit=10`
      );
      if (result) {
        this.setState({ tableData: result.data.results, loading: false });

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
    } else {
      const result = await axiosApiInstance.get(
        APILINK + `/requests/?agent=${newID}&request_type__in=1__2&limit=10`
      );
      if (result) {
        this.setState({ tableData: result.data.results, loading: false });

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

  componentDidMount() {
    this.getRequests();
  }

  onSearch = (e) => {
    console.log(e.target);
    this.setState({ keyWord: e.target.value });
    let x = this.state.tableData.filter(
      (item) =>
        item.pre_request.name &&
        item.pre_request.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
    );
    console.log(x);
    this.setState({ tableData: x });
    if (e.target.value === "") {
      this.getRequests();
    }
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
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);

    console.log("orderssss");

    console.log(result.data);
    this.setState({
      tableData: result.data.results,
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
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(`${this.state.prevUrl}`);

    console.log("orderssss");
    console.log(result.data);
    this.setState({
      tableData: result.data.results,
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

  render() {
    // console.log(this.state.startDate,this.state.endDate)
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "350px" }}
          className="py-3"
        >
          <Row>
            <Col className="mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                <i class="fas fa-clipboard-list pr-2"></i> Requests
              </h2>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              {this.state.loading === false ? (
                <DataTable
                  columns={this.state.columns}
                  data={this.state.tableData}
                  onSelectedRowsChange={this.handleSelected}
                />
              ) : (
                <Col className="text-center" sm={12}>
                  {this.state.loading ? (
                    <Spin tip="Loading..."></Spin>
                  ) : (
                    "No data to be displayed"
                  )}
                </Col>
              )}
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "initial" }} sm={12}>
              {this.state.tableData.length === 0 ? null : (
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

export default connect(mapStateToProps, null)(Requests);
