import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { connect } from "react-redux";
import "../../style-sheets/home.css";
import { DatePicker, Space } from "antd";
import {APILINK} from '../../Endpoint'
const axiosApiInstance = axios.create();
class SupplierConfirmModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: "",
      checked: "",
      showStatus: false,
      time: "",
      msg: "",
      showmsg: false,
      cost:"",
      notes:""
    };
  }

  componentDidMount() {}

  onClose = (e) => {
    this.props.closeForm(false);
  };

  handleOptionChange = (e) => {
    this.setState({ checked: !this.state.checked });
    if (e.target.checked === true) {
      console.log(e.target.checked);
      this.setState({ showStatus: true });
    } else {
      this.setState({ showStatus: false });
    }
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChange = (value, dateString) => {
    // console.log("Selected Time: ", value);
    // console.log("Formatted Selected Time: ", dateString);
    this.setState({ time: dateString });
  };

  onOk = (value) => {
    // console.log("onOk: ", value);
  };

  onConfirm = async () => {
   
    let data;
    if (this.state.cost !== "") {
      data = {
        request: {
          request_type: this.props.type,
          request_status: "1",
          is_deliver: true,
          deliver_time: this.state.time,
          deliver_cost: this.state.cost,
          yanzo_price: this.state.price,
          note: this.state.notes,
        },
      };
    } else {
      data = {
        request: {
          request_type: this.props.type,
          request_status: "1",
          // is_deliver: true,
          // deliver_time: "2020-12-23T15:08:10Z",
          // deliver_cost: "30.30",
          yanzo_price: this.state.price,
          note: this.state.notes,
        },
      };
    }

    console.log(data);
    const result = await axiosApiInstance
      .put(APILINK +`/status_request/${this.props.id}`, data)
      .then((res) => {
        console.log(res.data);
        if (res.data.data.id) {
          this.setState({ showmsg: true, msg: "order has been confirmed" });

          setTimeout(() => {
            this.setState({showmsg:false,cost:'',time:'',price:'',notes:''})
            this.onClose()
          }, 1500);
        }
      });
  };

  render() {
    // console.log(this.state);
    return (
      <Modal size="lg" show={this.props.show} onHide={this.onClose}>
        <Container className="p-4 modal2">
          <Row>
            <Col sm={12}>
              <h4>Confirm Request</h4>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Price for Yanzo</Form.Label>
                  <Form.Control
                    value={this.state.price}
                    name="price"
                    onChange={this.handleInput}
                    type="text"
                    placeholder="Enter price"
                  />
                </Form.Group>
                Delievery :{" "}
                <input
                  type="checkbox"
                  onChange={this.handleOptionChange}
                  defaultChecked={this.state.checked}
                  className="mx-5"
                />
                {this.state.showStatus === true ? (
                  <React.Fragment>
                    <Row className="my-3">
                      <Col sm={6}>
                        {" "}
                        {/* <Form.Group controlId="formBasicEmail">
                          <Form.Control  type="text" placeholder="Enter Time" />
                        </Form.Group>{" "} */}
                        <Space style={{ width: "100%" }} direction="vertical">
                          <DatePicker
                            onChange={this.onChange}
                            onOk={this.onOk}
                            style={{ width: "100%" }}
                            showTime={{ format: "HH:mm" }}
                          />
                        </Space>
                      </Col>
                      <Col sm={6}>
                        <Form.Group controlId="formBasicEmail">
                          <Form.Control
                            value={this.state.cost}
                            name="cost"
                            onChange={this.handleInput}
                            type="text"
                            placeholder="Enter Cost"
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </React.Fragment>
                ) : null}
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Notes</Form.Label>
                  <Form.Control
                    value={this.state.notes}
                    name="notes"
                    onChange={this.handleInput}
                    as="textarea"
                    rows={3}
                  />
                </Form.Group>
              </Form>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "right" }} sm={12}>
              {" "}
              <Button
                className="btn5"
                variant="secondary"
                onClick={this.onClose}
              >
                Close
              </Button>
              <Button
                onClick={this.onConfirm}
                className="btn3"
                variant="primary"
              >
                Confirm Request
              </Button>
            </Col>
          </Row>
          {this.state.showmsg === true ? (
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <p
                  style={{
                    color: "green",
                    fontWeight: "bold",
                    fontSize: "18px",
                  }}
                >
                  {" "}
                  <i class="fas fa-check-circle px-2"></i>
                  {this.state.msg}
                </p>
              </Col>
            </Row>
          ) : null}
        </Container>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(ErrorHandler(SupplierConfirmModal,axiosApiInstance));
