import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../../../Endpoint";
const axiosApiInstance = axios.create();

class ViewCourierServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tableData: [],
      keyWord: "",
      columns: [
        {
          name: "Vehicle",
          selector: "vehicle.name",
          sortable: true,
          right: true,
        },
        {
          name: "Delievery",
          selector: "delivery.name",
          sortable: true,
          right: true,
        },

        {
          name: "Delivery Time",
          selector: "last_time_submit",
          sortable: true,
          right: true,
        },
        {
          name: "Price",
          selector: "price",
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
                  <Tooltip id={`tooltip-${"top"}`}>Edit service</Tooltip>
                }
              >
                <Link to={`/edit_service/${row.id}`}>
                  <Button className="actionBtn">
                    {" "}
                    <i class="fas fa-edit"></i>
                  </Button>
                </Link>
              </OverlayTrigger>
            </div>
          ),
        },
      ],
    };
  }

  getAllServices = async () => {
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
        console.log(error);
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
    // console.log(newID);
    const result = await axiosApiInstance.get(APILINK + `/courier_services/`);
    if (result) {
      console.log(result);
      let obj = result.data.find(
        (o) => o.courier.id === this.props.match.params.id
      );
      console.log(obj);
      if (obj !== undefined) {
        this.setState({ name: obj.courier.name });
        this.getService(obj.courier.id);
      }
    }
  };

  componentDidMount() {
    this.getAllServices();
  }
  getService = async (id) => {
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
        console.log(error);
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
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/courier_services/?courier=${id}`
    );
    if (result) {
      console.log(result);
      this.setState({ tableData: result.data });
    }
  };
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "350px" }}
          className="pt-3"
        >
          <Row className="my-4">
            <Col className="" style={{ textAlign: "initial" }} sm={6}>
              <h2>
                {" "}
                <i className="fas fa-truck pr-2"></i>
                {this.state.name} services
              </h2>
            </Col>
            <Col style={{ textAlign: "end" }} sm={6}>
              <Link to={`/add_service/${this.props.match.params.id}`}>
                <Button onClick={this.downLoadCatalog} className="headBtn">
                  Add new service
                </Button>
              </Link>
            </Col>{" "}
          </Row>

          <Row>
            <Col sm={12}>
              <DataTable
                columns={this.state.columns}
                data={this.state.tableData}
                onSelectedRowsChange={this.handleSelected}
              />
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
)(ErrorHandler(ViewCourierServices, axiosApiInstance));
