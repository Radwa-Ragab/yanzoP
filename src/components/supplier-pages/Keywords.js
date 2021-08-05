import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/keys.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import isEqual from "lodash/isEqual";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { Spin } from "antd";

const axiosApiInstance = axios.create();
class Keywords extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      keywords: [],
      show: true,
    };
  }

  getKeys = async () => {
    this.setState({ loading: true });
    // Request interceptor for API calls

    if (this.props.user.user_type === "2") {
      var newID = this.props.user.id.replace(/-/g, "");
      console.log(newID);
      const result = await axiosApiInstance.get(
        APILINK + `/keywords/?supplier=${newID}&limit=10000`
      );
      if (result) {
        this.setState({ keywords: result.data.results, loading: false });
      }
    } else {
      const result = await axiosApiInstance.get(APILINK + `/keywords/`);
      if (result) {
        this.setState({ keywords: result.data, loading: false });
      }
    }
  };
  componentDidMount() {
    this.getKeys();
  }

  toggleShow = (e) => {
    this.setState({ show: !this.state.show });
  };

  hideme = (e) => {
    console.log(e.target.id);
  };
  deleteKeyword = async (e) => {
    this.setState({ keyId: e.target.id });

    const res = await axiosApiInstance
      .delete(APILINK + `/keyword/${this.state.keyId}`)
      .catch((err) => console.log(err));
    console.log(res);
  };

  componentDidUpdate(prevProps, prevState) {
    if (!isEqual(prevState.keywords, this.state.keywords)) {
      this.getKeys();
    }
  }
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "350px" }}
          className="addP px-4"
        >
          <Row>
            <Col className="p-2 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-search-plus pr-3"></i>Keywords
              </h2>
            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "initial" }} sm={8}></Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to={"/add_key"}>
                {" "}
                <Button className="headBtn"> Add Keyword</Button>
              </Link>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col sm={12}>
              <div className="keysHolder pt-2">
                {(this.state.keywords.length !== 0) &
                (this.state.loading === false) ? (
                  this.state.keywords.map((key) => {
                    console.log(key);
                    return (
                      <Button className="keysBtn ml-1">
                        {key.name}
                        <i
                          id={key.id}
                          onClick={this.deleteKeyword}
                          className="fas fa-times px-2"
                        ></i>
                      </Button>
                    );
                  })
                ) : (
                  <Col className="text-center" sm={12}>
                    {this.state.loading ? (
                      <Spin tip="Loading..."></Spin>
                    ) : (
                      "No data to be displayed"
                    )}
                  </Col>
                )}
              </div>
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
)(ErrorHandler(Keywords, axiosApiInstance));
