import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import { APILINK } from "../../Endpoint";
import { Spin } from "antd";
import img from "../../imgs/no-img.png";

const axiosApiInstance = axios.create();
class ViewRequestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      details: "",
      loading: false,
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
      let result = ""
      if(this.props.user.user_type == 2){
        result = await axiosApiInstance.get(
          APILINK + `/requests/?supplier=${newID}&request_type__in=1__2&limit=10`
        );
      }
      else{
        result = await axiosApiInstance.get(
          APILINK + `/requests/?agent=${newID}&request_type__in=1__2&limit=10`
        );
      }
    
    if (result) {
      if(result.data.results){
        this.setState({ data: result.data.results, loading: false }, () => {
          let details = this.state.data.find(
            (data) => data.id === this.props.match.params.id
          );
          console.log(details);
          if(details){
            this.setState({ details: details, loading: false });

          }
        });
        console.log(result.data.results);
      }
     
    }
  };

  componentDidMount() {
    this.getRequests();
  }

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
                <i class="fas fa-clipboard-list pr-2"></i> Request Details
              </h2>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "center" }} sm="12">
              {this.state.loading ? <Spin tip="...loading" /> : null}
            </Col>
          </Row>

          {this.state.loading === false && this.state.details !== "" ? (
            <Row>
              <Col sm="6">
                <Row className="mb-4">
                  <Col sm={9}>
                    <p style={{ color: "grey", fontSize: "16px" }}>
                      {this.state.details.pre_request.name}{" "}
                    </p>
                  </Col>
                </Row>

                <Row className="my-4">
                  <Col sm={12} md={6}>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Supplier Name :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.supplier.name}
                      </span>
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Order Code :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.pre_request.order_code}
                      </span>
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Product Name :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.pre_request.name}
                      </span>
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Product Price :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.yanzo_price}
                      </span>
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Product Quantity :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.pre_request.product_quantity}
                      </span>{" "}
                    </p>

                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Expected Deliever Date:{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.pre_request.expected_delivery_date}
                      </span>{" "}
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Client Address :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.state.details.pre_request.client_address}
                      </span>{" "}
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Order Delivery Status :{" "}
                      {this.state.details.orders.order_status === "2" ? (
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                          }}
                        >
                          Ready for delivery
                        </span>
                      ) : this.state.details.orders.order_status === "3" ? (
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                          }}
                        >
                          Out for delivery
                        </span>
                      ) : this.state.details.orders.order_status === "4" ? (
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                          }}
                        >
                          Delivered{" "}
                        </span>
                      ) : null}{" "}
                    </p>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Is Deliver?
                      {this.state.details.is_deliver === false ||
                      this.state.details.is_deliver === null ? (
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                            paddingLeft: "10px",
                          }}
                        >
                          No{" "}
                        </span>
                      ) : (
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                          }}
                        >
                          Yes{" "}
                        </span>
                      )}
                    </p>
                  </Col>
                </Row>
              </Col>
              <Col sm={12} md={4}>
                {this.state.details.pre_request.image === "" ? (
                  <img className="img-fluid" src={img} alt="product" />
                ) : (
                  <img
                    className="img-fluid"
                    src={APILINK + `${this.state.details.pre_request.image}`}
                    alt="product"
                  />
                )}
              </Col>
            </Row>
          ) : null}
        </Container>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(ViewRequestDetails);
