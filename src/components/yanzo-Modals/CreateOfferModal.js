import React, { Component } from "react";
import { Container, Row, Col, Modal, Button, Form } from "react-bootstrap";
import { connect } from "react-redux";
import "../../style-sheets/home.css";
import { DatePicker, Space } from "antd";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
// import Select from "react-dropdown-select";
import "antd/dist/antd.css";
import { Select } from "antd";
import axios from "axios";
import {APILINK} from '../../Endpoint'
const axiosApiInstance = axios.create();
class CreateOfferModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: "",
      checked: "",
      showStatus: false,
      selectedCat: [],
      selectedKeys: [],
      category: [],
      keywords: [],
      time:'',
      cost:"",
      notes:""
    };
  }

  getCategories = async () => {
    // Request interceptor for API calls
    
    const result = await axiosApiInstance
      .get(APILINK +"/categories/")
      .then((res) => {
        // console.log(res);
        this.setState({ category: res.data });
      });
  };
  getKeys = async () => {
 

    // Request interceptor for API calls
    
    var newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance
      .get(APILINK +`/keywords/?supplier=${newID}`)
      .then((result) =>
        // console.log(result)
        this.setState({ keywords: result.data })
      );
  };
  componentDidMount() {
    this.getCategories();
    this.getKeys();
    // let x = await this.refreshAccessToken();
    // console.log(x);
  }

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

  handleChange = (e) => {
    this.setState({
      selectedKeys: e,
    });
    // console.log(e);
  };

  handleCate = (e) => {
    this.setState({
      selectedCat: [e],
    });
  };

  handleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleTime = (value, dateString) => {
 
    this.setState({ time: dateString });
  };

  createOffer = async () => {
    // Request interceptor for API calls
    
    let data;
    if (this.state.cost !== "") {
      console.log('hna fl if')

      data = {
        request: {
          request_type: this.props.type,
          request_status: "3",
          is_deliver: true,
          deliver_time: this.state.time,
          deliver_cost: this.state.cost,
          yanzo_price: this.state.price,
          note: this.state.notes,
        },
        product: {
          name: this.state.name,
          code: this.state.code,
          quantity: this.state.quantity,
          price: this.state.pprice,
          supplier: this.props.user.id,
          keyword: this.state.selectedKeys,
          category: this.state.selectedCat,
        },
      };
    } else {
      console.log('hna fl else')
      data = {
        request: {
          request_type: this.props.type,
          request_status: "3",
          is_deliver: false,
          // deliver_time: "2020-12-23T15:08:10Z",
          // deliver_cost: "30.30",
          yanzo_price: this.state.price,
          note: this.state.notes,
        },
        product: {
          name: this.state.name,
          code: this.state.code,
          quantity: this.state.quantity,
          price: this.state.pprice,
          supplier: this.props.user.id,
          keyword: this.state.selectedKeys,
          category: this.state.selectedCat,
        },
      };
    }

    console.log(data);
    const result = await axiosApiInstance
      .put(APILINK +`/status_request/${this.props.id}`, data)
      .then((res) => {
        console.log(res.data);
        if (res.data.data.id) {
          this.setState({ showmsg: true, msg: "offer has been sent" });

          setTimeout(() => {
            this.setState({
              showmsg: false,
              cost: "",
              time: "",
              price: "",
              notes: "",
            });
            this.onClose();
          }, 1500);
        }
      });
  };

  render() {
    return (
      <Modal size="lg" show={this.props.show} onHide={this.onClose}>
        <Container  className="p-4 modal2">
          <Row>
            <Col sm={12}>
              <p style={{color:'#7c8798',fontSize:'20px'}}>Create Offer</p>
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
                            
                            onChange={this.handleTime}
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
            <Col sm={12}>
              <Form>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    value={this.state.name}
                    name="name"
                    onChange={this.handleInput}
                    type="text"
                    placeholder="Name"
                  />
                </Form.Group>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Product Code</Form.Label>
                  <Form.Control
                    value={this.state.code}
                    name="code"
                    onChange={this.handleInput}
                    type="text"
                    placeholder="Name"
                  />
                </Form.Group>
                <Row className="my-3">
                  <Col sm={6}>
                    {" "}
                    <Form.Group controlId="formBasicEmail">
                      <Form.Label> Price</Form.Label>

                      <Form.Control
                        value={this.state.pprice}
                        name="pprice"
                        onChange={this.handleInput}
                        type="text"
                        placeholder="Price"
                      />
                    </Form.Group>{" "}
                  </Col>
                  <Col sm={6}>
                    <Form.Label>Quantity</Form.Label>

                    <Form.Group controlId="formBasicEmail">
                      <Form.Control
                        value={this.state.quantity}
                        name="quantity"
                        onChange={this.handleInput}
                        type="text"
                        placeholder="Quantity"
                      />{" "}
                    </Form.Group>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12} md={6}>
              <Form.Label>KeyWords</Form.Label>
              <Select
                mode="multiple"
                placeholder="Select keywords"
                value={this.state.selectedKeys}
                onChange={this.handleChange}
                style={{ width: "100%" }}
              >
                {this.state.keywords.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
            </Col>
            <Col sm={12} md={6}>
              <Form.Label>Category</Form.Label>

              <Select
                // mode="multiple"
                placeholder="select category"
                value={this.state.selectedCat}
                onChange={this.handleCate}
                style={{ width: "100%" }}
              >
                {this.state.category.map((item) => (
                  <Select.Option key={item.id} value={item.id}>
                    {item.name}
                  </Select.Option>
                ))}
              </Select>
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
                className="btn3"
                variant="primary"
                onClick={this.createOffer}
              >
                Create Offer
              </Button>
            </Col>
          </Row>
        </Container>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(ErrorHandler(CreateOfferModal,axiosApiInstance));
