import React, { Component } from "react";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import "../../style-sheets/home.css";
import img from "../../imgs/no-img.png";
import SupplierConfirmModal from "../yanzo-Modals/SupplierConfirmModal";
import CreateOfferModal from "../yanzo-Modals/CreateOfferModal";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewMap from "../ViewMap";
import { APILINK } from "../../Endpoint";
import { connect } from "react-redux";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();
class OrderDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openConfirm: false,
      opencreate: false,
      showRej: false,
    };
  }
  confirm = (e) => {
    this.setState({ openConfirm: true });
  };
  closeConfirm = (e) => {
    this.setState({ openConfirm: e });
  };

  create = (e) => {
    this.setState({ opencreate: true });
  };
  closeCreate = (e) => {
    this.setState({ opencreate: e });
  };

  openRej = (e) => {
    this.setState({ showRej: true });
  };
  closeRej = (e) => {
    this.setState({ showRej: false });
  };

  Rejectoffer = async () => {
    let data = {
      request: {
        request_type: this.props.details.request_type,
        request_status: "2",
      },
    };

    console.log(data);
    const result = await axiosApiInstance
      .put(APILINK + `/status_request/${this.props.details.id}`, data)
      .then((res) => {
        console.log(res.data);
        if (res.data.data.id) {
          this.setState({ showmsg: true, msg: "order has been rejected" });

          setTimeout(() => {
            this.setState({
              showmsg: false,
              cost: "",
              time: "",
              price: "",
              notes: "",
            });
            this.closeRej();
          }, 1500);
        }
      });
  };

  secConfirm = async () => {
    let data = {
      request: {
        offer_status: "1",
      },
    };

    console.log(data);
    const result = await axiosApiInstance.put(
      APILINK + `/status_offer/${this.props.details.id}`,
      data
    );
    if (result) {
      if (result.data.data.id) {
        this.props.changeOffer(true);
        setTimeout(() => {
          toast.info(`Offer Confirmed successfully`);
        }, 500);
      }
    }

    console.log(result);
  };

  secReject = async () => {
    let data = {
      request: {
        offer_status: "2",
      },
    };

    console.log(data);
    const result = await axiosApiInstance.put(
      APILINK + `/status_offer/${this.props.details.id}`,
      data
    );
    console.log(result);
    if (result) {
      if (result.data.data.id) {
        setTimeout(() => {
          toast.dark(`Offer has been Rejected`);
        }, 500);
      }
    }
  };

  checkValidity = async () => {
    const result = await axiosApiInstance.get(
      APILINK + `/create_validate/${this.props.details.id}`
    );
    console.log(result);
    if (result) {
      if (result.data.data.id) {
        setTimeout(() => {
          toast.info(`Your request has been sent`);
        }, 500);
      }
    }
  };
  onConversationsAPIReady = () => {
    var _hsq = (window._hsq = window._hsq || []);
    _hsq.push([
      "identify",
      {
        email: this.props.email,
        id: this.props.details.id,
      },
    ]);
    _hsq.push(["trackPageView"]);
    window.HubSpotConversations.widget.refresh();
  };
  sendIdenify = () => {
    window.HubSpotConversations.on("conversationClosed", (payload) => {
      console.log(
        `Started conversation with id ${payload.conversation.conversationId}`
      );
    });
  };
  componentDidMount() {
    window.HubSpotConversations.widget.load();
    if (window.HubSpotConversations) {
      this.onConversationsAPIReady();
      this.sendIdenify();
    } else {
      window.hsConversationsOnReady = [
        this.onConversationsAPIReady,
        this.sendIdenify,
      ];
    }
  }
  componentWillUnmount() {
    window.HubSpotConversations.widget.remove();
  }
  render() {
    console.log(this.props);
    let nowDate = new Date();
    let utcDate = nowDate.toISOString();
    let last_element;
    if (this.props.details.RequestsValidate.length !== 0) {
      last_element =
        this.props.details.RequestsValidate[
          this.props.details.RequestsValidate.length - 1
        ];

      console.log(last_element);
    }

    if (this.props.details.Validate_date > utcDate) {
      console.log("validity check : lsa valid");
    } else {
      console.log("validity check : mch valid");
    }

    return (
      <div style={{ borderLeft: "solid 1px yellow" }}>
        <Container className="pt-3">
          <Row>
            <Col sm={12}>
              <h4>Order Details</h4>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col sm={12}>
              <p style={{ color: "grey" }}>
                {this.props.details.pre_request.name}
              </p>
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
              {this.props.details.request_status === "2" ? (
                <p>(Rejected)</p>
              ) : null}
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

          <Row className="mb-3">
            <Col sm={12} md={12}>
              {/* <iframe
                src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d2965.0824050173574!2d-93.63905729999999!3d41.998507000000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sWebFilings%2C+University+Boulevard%2C+Ames%2C+IA!5e0!3m2!1sen!2sus!4v1390839289319"
                width="100%"
                height="200"
                frameBorder="0"
                title="order location"
              ></iframe> */}
              <ViewMap location={this.props.details.pre_request.location} />
            </Col>
          </Row>

          {this.props.details.request_type === "2" &&
          (this.props.details.offer_status === "3" ||
            this.props.details.offer_status === "4") ? (
            this.props.details.Validate_date > utcDate ? (
              <Row className="my-3">
                <Col sm={12}>
                  <Button onClick={this.secConfirm} className="btn1 px-4">
                    Confirm
                  </Button>
                  <Button onClick={this.secReject} className="btn2 px-4">
                    Reject
                  </Button>
                </Col>
              </Row>
            ) : (
              <Row className="my-3">
                <Col sm={12}>
                  {this.props.details.RequestsValidate.length === 0 ? (
                    <Button onClick={this.checkValidity} className="btn3 px-4">
                      Still Valid?
                    </Button>
                  ) : null}
                </Col>
              </Row>
            )
          ) : null}

          {this.props.details.request_status === null &&
          this.props.details.request_type === "1" ? (
            this.props.details.Validate_date > utcDate ? (
              <Row className="my-3">
                <Col sm={12}>
                  <Button onClick={this.confirm} className="btn1 px-4">
                    Confirm
                  </Button>
                  <Button onClick={this.openRej} className="btn2 px-4">
                    Reject
                  </Button>
                  <Button onClick={this.create} className="btn4 px-4">
                    Create offer
                  </Button>
                  {/* <Button onClick={this.checkValidity} className="btn3 px-4">
                    Still Valid
                  </Button> */}
                </Col>
              </Row>
            ) : (
              <Row className="my-3">
                <Col sm={12}>
                  {this.props.details.RequestsValidate.length !== 0 ? (
                    last_element.validate_status === "1" ? (
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        Check Availability Status:{" "}
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                          }}
                        >
                          Waiting for agent's response...
                        </span>{" "}
                      </p>
                    ) : last_element.validate_status === "3" ? (
                      <p
                        style={{
                          fontWeight: "bold",
                          fontSize: "13px",
                          color: "grey",
                        }}
                      >
                        Check Availability Status:{" "}
                        <span
                          style={{
                            fontWeight: "400",
                            fontSize: "13px",
                            color: "grey",
                          }}
                        >
                          Rejected
                        </span>{" "}
                      </p>
                    ) : null
                  ) : null}

                  {this.props.details.RequestsValidate.length === 0 ? (
                    <Button onClick={this.checkValidity} className="btn3 px-4">
                      Still Valid?
                    </Button>
                  ) : null}
                </Col>
              </Row>
            )
          ) : null}

          <SupplierConfirmModal
            id={this.props.details.id}
            show={this.state.openConfirm}
            type={this.props.details.request_type}
            closeForm={this.closeConfirm}
          />
          <CreateOfferModal
            show={this.state.opencreate}
            closeForm={this.closeCreate}
            id={this.props.details.id}
            type={this.props.details.request_type}
          />
          <Modal show={this.state.showRej} onHide={this.closeRej}>
            <Container className="p-4">
              <Row>
                <Col sm={12}>
                  <p>Are you sure you want to reject this request?</p>
                </Col>
              </Row>
              <Row>
                <Col sm={6}>
                  <Button
                    className="btn5"
                    variant="secondary"
                    onClick={this.closeRej}
                  >
                    Close
                  </Button>
                  <Button
                    className="btn3"
                    variant="primary"
                    onClick={this.Rejectoffer}
                  >
                    Sure
                  </Button>
                </Col>
                <Col sm={6}></Col>
              </Row>
            </Container>
          </Modal>
          <ToastContainer position="bottom-right" />
        </Container>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  email: state.auth.user.email,
});
export default connect(
  mapStateToProps,
  null
)(ErrorHandler(OrderDetails, axiosApiInstance));
