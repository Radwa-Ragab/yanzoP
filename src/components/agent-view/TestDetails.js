import React, { Component } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import "../../style-sheets/home.css";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewMap from "../ViewMap";
import { ProgressBar, Step } from "react-step-progress-bar";
import {
  searchResultSuppliers,
  clearRes,
  agentRequestData,
  getRequestData,
} from "../../global-state/actions/agentRequestAction";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
// import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import AddMoreSuppliers from "../yanzo-Modals/AddMoreSuppliers";
import SearchCouriers from "../yanzo-Modals/SearchCouriers";
import img from "../../imgs/no-img.png";
import { APILINK } from "../../Endpoint";
const axiosApiInstance = axios.create();
class TestDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openConfirm: false,
      opencreate: false,
      showRej: false,
      lastElement: "",
      currentValidate: "",
      currentValidateSupp: {},
      showOffer: false,
      showSuppliers: false,
      suppliers: [],
      prereqData: {},
      is_offer: false,
      percent: 0,
      openCourierModal: false,
    };
  }
  showCourierModal = (e) => {
    this.setState({ openCourierModal: true });
    this.props.getRequestData(this.props.details);
  };
  closeCourier = (e) => {
    this.setState({ openCourierModal: e });
  };
  showOffer = (e) => {
    this.setState({ showOffer: true });
  };
  closeOffer = (e) => {
    this.setState({ showOffer: false });
  };

  closeSuppliers = (e) => {
    this.setState({ showSuppliers: e });
  };
  createOffer = async (e) => {
    const result = await axiosApiInstance.get(
      APILINK + `/create_offer/${e.target.id}`
    );
    // console.log(result);
    if (result) {
      if (result.data.data.id) {
        this.setState({ is_offer: true });
        setTimeout(() => {
          toast.info(`Offer has been accepted`);
        }, 500);
      }
    }
  };

  getRequestsValidate = async (e) => {
    if (this.props.details.RequestsValidate.length !== 0) {
      let req = this.props.details.RequestsValidate.find(
        (item) => item.validate_status === "1"
      );
      console.log(req);
      if (req) {
        this.setState({ lastElement: req });
      }
    } else {
      this.setState({ lastElement: "" });
    }
    // this.setState({ validateData: current_validate });
  };

  componentDidMount() {
    this.getRequestsValidate();
    if (this.props.details) {
      if (this.props.details.request_type === "1") {
        this.setState({ percent: 0 });
      } else if (this.props.details.request_type === "2") {
        this.setState({ percent: 50 });
      } else {
        this.setState({ percent: 100 });
      }
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.details.id !== this.props.details.id) {
      console.log("changeeeeee");
      this.getRequestsValidate();

      if (this.props.details.request_type === "1") {
        this.setState({ percent: 0 });
      } else if (this.props.details.request_type === "2") {
        this.setState({ percent: 50 });
      } else {
        this.setState({ percent: 100 });
      }
    }

    if (prevState.is_offer !== this.state.is_offer) {
      this.setState({ percent: 50 });
    }
  }

  confirmAvail = async (e) => {
    let data = {
      request: {
        validate_status: "2",
      },
    };

    const result = await axiosApiInstance.put(
      APILINK + `/status_validate/${e.target.id}`,
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
    let data = {
      request: {
        validate_status: "3",
      },
    };

    const result = await axiosApiInstance.put(
      APILINK + `/status_validate/${e.target.id}`,
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
    const result = await axiosApiInstance.get(
      APILINK + `/prerequests/?id=${this.props.details.pre_request.id}`
    );
    if (result.data) {
      console.log(result.data[0]);
      let PreData = result.data[0];
      this.setState({ prereqData: result.data[0] });
      let cat = PreData.category.map((c) => c.name);
      let keys = PreData.keyword.map((k) => k.name);

      // let catID = this.props.details.category.map((c) => c.id);
      // let keysID = this.props.details.keyword.map((k) => k.id);
      let link;
      let x = cat.toString();
      var res = x.replace(/,/g, "__");
      let y = keys.toString();
      var res2 = y.replace(/,/g, "__");

      link = APILINK + `/suppliers/?categories__in=${res}&keywords__in=${res2}`;
      console.log(link);
      const suppliers = await axiosApiInstance.get(`${link}`).then((res) => {
        this.setState({ showSuppliers: true });
        console.log(res.data);
        this.setState({ suppliers: res.data });
      });
      // console.log(suppliers.data);
    }
  };

  render() {
    console.log(this.props.details);
    // console.log(this.state.is_offer);

    return (
      <div style={{ borderLeft: "solid 1px yellow" }}>
        <Container className="pt-3">
          <Row>
            <Col sm={6}>
              <h4>Order Details</h4>
            </Col>
            <Col sm={6}>
              {this.props.details.request_type === "1" ? (
                // <Link to={"/view_suppliers"}>
                <Button
                  // id={this.state.lastElement.id}
                  onClick={this.getPreReqData}
                  className="addBtn px-4"
                >
                  <i class="fas fa-plus-circle"></i> Add New Suppliers
                </Button>
              ) : // </Link>
              null}
            </Col>
          </Row>

          <Row className="mb-4">
            <Col sm={9}>
              <p style={{ color: "grey", fontSize: "16px" }}>
                {this.props.details.pre_request.name} -{" "}
                {this.props.details.supplier.name}
              </p>
            </Col>
            <Col sm={3}>
              {" "}
              {this.props.details.offer_status === "2" ||
              this.props.details.request_status === "2" ? (
                <p style={{ color: "red" }}>Rejected</p>
              ) : null}
            </Col>
          </Row>

          <Row>
            <Col style={{ background: "#993b78", color: "white" }} sm={12}>
              <p style={{ marginBottom: "0rem" }}>
                Ticket Number {this.props.details.pre_request.ticket_code}
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
                  {this.props.details.pre_request.name}
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
                  {this.props.details.yanzo_price}
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
                  {this.props.details.pre_request.product_quantity}
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
                  {this.props.details.pre_request.expected_delivery_date}
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
                  {this.props.details.pre_request.client_address}
                </span>{" "}
              </p>
              <p
                style={{ fontWeight: "bold", fontSize: "13px", color: "grey" }}
              >
                Order Delivery Status :{" "}
                {this.props.details.orders.order_status === "1" ? (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "13px",
                      color: "grey",
                    }}
                  >
                   Not stated yet
                  </span>
                ) : this.props.details.orders.order_status === "2" ? (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "13px",
                      color: "grey",
                    }}
                  >
                    Ready for delivery
                  </span>
                ) : this.props.details.orders.order_status === "3" ? (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "13px",
                      color: "grey",
                    }}
                  >
                    Out for delivery
                  </span>
                ) : this.props.details.orders.order_status === "4" ? (
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
                {this.props.details.is_deliver === false ||
                this.props.details.is_deliver === null ? (
                  <span
                    style={{
                      fontWeight: "400",
                      fontSize: "13px",
                      color: "grey",
                      paddingLeft: "10px",
                    }}
                  >
                    No{" "}
                    {this.props.details.request_type === "3" &&
                    (this.props.details.is_deliver === false ||
                      this.props.details.is_deliver === null) ? (
                      this.props.details.orders.courier_order.id  ? null : (
                        <Button
                          onClick={this.showCourierModal}
                          className="addBtn"
                        >
                          Order Courier
                        </Button>
                      )
                    ) : null}
                  </span>
                ) : (
                  <React.Fragment>
                    <span
                      style={{
                        fontWeight: "400",
                        fontSize: "13px",
                        color: "grey",
                        marginLeft: "5px",
                      }}
                    >
                      Yes
                    </span>
                    <p
                      style={{
                        fontWeight: "bold",
                        fontSize: "13px",
                        color: "grey",
                      }}
                    >
                      Delivery Cost :{" "}
                      <span
                        style={{
                          fontWeight: "400",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        {this.props.details.deliver_cost}
                      </span>{" "}
                    </p>
                  </React.Fragment>
                )}
              </p>
            </Col>
            <Col sm={12} md={6}>
              {this.props.details.pre_request.image === "" ? (
                <img className="img-fluid" src={img} alt="product" />
              ) : (
                <img
                  className="img-fluid"
                  src={APILINK + `${this.props.details.pre_request.image}`}
                  alt="product"
                />
              )}
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

          {/* {this.props.details.request_type === "1" ? (
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
          ) : this.props.details.request_type === "2" || this.state.is_offer===true ? (
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
          ) : this.props.details.request_type === "3" ? (
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
          ) : null} */}

          <Row style={{ paddingLeft: "20px" }}>
            <Col className="mb-5" style={{ textAlign: "initial" }} sm={12}>
              <ProgressBar className="bar1" percent={this.state.percent}>
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

          <Row className="mb-3">
            <Col sm={12} md={12}>
              <ViewMap location={this.props.details.pre_request.location} />
            </Col>
          </Row>

          {this.props.details.request_type !== "3" &&
          this.state.lastElement !== "" ? (
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
          {/* {this.props.details.offer_status !== null ||
          this.props.details.offer_status ===
            null ? null : ((
              this.props.details.request_status === "1" ||
              this.props.details.request_status === "3") &&
              this.props.details.request_type === "1") ||
            this.props.details.request_type === "2" ? (
            <Button
              id={this.props.details.id}
              onClick={this.createOffer}
              className="btn1 px-4"
            >
              Create Offer
            </Button>
          ) : null} */}
          {(this.props.details.request_status === "1" ||
            this.props.details.request_status === "3") &&
          (this.props.details.request_type === "2" ||
            this.props.details.request_type === "1") &&
          this.props.details.offer_status !== "2" ? (
            <React.Fragment>
              {this.props.details.offers &&
              Object.keys(this.props.details.offers).length === 0 &&
              this.props.details.offers.constructor === Object ? null : (
                <Button onClick={this.showOffer} className="addBtn px-1">
                  Check the offer
                </Button>
              )}

              <Button
                id={this.props.details.id}
                onClick={this.createOffer}
                className="btn1 px-4"
              >
                Accept Offer
              </Button>
            </React.Fragment>
          ) : null}
          <ToastContainer position="bottom-right" />
        </Container>
        {this.props.details.offers &&
        Object.keys(this.props.details.offers).length === 0 &&
        this.props.details.offers.constructor === Object ? null : (
          <Modal show={this.state.showOffer} onHide={this.closeOffer}>
            <Container className="p-3">
              <Row>
                <Col sm={12}>
                  <p>
                    Product code :{" "}
                    <strong>{this.props.details.offers.product.code}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <p>
                    Product Name :{" "}
                    <strong>{this.props.details.offers.product.name}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <p>
                    Yanzo Price :{" "}
                    <strong>{this.props.details.yanzo_price}</strong>
                  </p>
                </Col>
              </Row>
              <Row>
                <Col sm={12}>
                  <p>
                    Is Deliver? :{" "}
                    {this.props.details.is_deliver === true ? (
                      <strong>Yes</strong>
                    ) : (
                      <strong>No</strong>
                    )}
                  </p>
                </Col>
              </Row>
            </Container>
          </Modal>
        )}
        {this.props.details.request_type === "1" ? (
          <AddMoreSuppliers
            suppliers={this.state.suppliers}
            show={this.state.showSuppliers}
            closeSuppliers={this.closeSuppliers}
            prereqData={this.state.prereqData}
          />
        ) : null}

        <SearchCouriers
          show={this.state.openCourierModal}
          hideCourier={this.closeCourier}
        />
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
    { searchResultSuppliers, clearRes, agentRequestData, getRequestData },
    dispatch
  );
};
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorHandler(TestDetails, axiosApiInstance));
