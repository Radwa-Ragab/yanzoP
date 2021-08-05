import React, { Component } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import axios from "axios";
import "antd/dist/antd.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();

class Add_KeyWord extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      disable: true,
    };
  }

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });

    if (e.target.value.match(/^[a-zA-Z][a-zA-Z0-9]*$/)) {
      this.setState({ name: e.target.value });

      this.setState({ errName: "", disable: false });
    }
    // this.setState({ name: e.target.value });
    else {
      this.setState({
        errName: "no special characters or space allowed",
        disable: true,
      });
    }
  };

  addKey = async () => {
    this.setState({ disable: true });
    let data = {
      name: this.state.name,
    };
    const result = await axiosApiInstance.post(APILINK + `/keyword`, data);
    // console.log(result)
    if (result.data.data) {
      setTimeout(() => {
        toast.info(`Keyword was created successfully`);
      }, 500);
      setTimeout(() => {
        this.props.history.push("/key");
      }, 3000);
    }
  };
  componentDidMount() {}

  render() {
    return (
      <div>
        <Container style={{ marginTop: "120px",marginLeft:'300px' }} className="addP">
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-search-plus pr-3"></i> Add New Keyword
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.onHandleInput}
                />
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.errName}
                </p>
              </Col>
            </Row>

            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Link to={"/key"}>
                  <Button className="addBtn1">Cancel</Button>
                </Link>
                <Button
                  disabled={this.state.disable}
                  onClick={this.addKey}
                  className="addBtn2"
                >
                  Add
                </Button>
              </Col>
            </Row>
          </Form>
          <ToastContainer position="bottom-right" />
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
)(ErrorHandler(Add_KeyWord, axiosApiInstance));
