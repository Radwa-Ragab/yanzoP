import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { Spin } from "antd";

const axiosApiInstance = axios.create();

class Branches extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showMsg: false,
      tableData: [],
      keyWord: "",
      columns: [
        {
          name: "Name",
          selector: "name",
          sortable: true,
          right: true,
        },
        {
          name: "City",
          selector: "city",
          sortable: true,
          right: true,
        },
        {
          name: "Address",
          selector: "address",
          sortable: true,
          right: true,
        },
        {
          name: "Phone",
          selector: "phone",
          sortable: true,
          right: true,
        },
        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              <Link to={`/view_branch/${row.id}`}>
                <button onClick={this.getDetails} className="actionBtn">
                  <i id={row.id} class="fas fa-eye"></i>{" "}
                </button>
              </Link>
              <Link to={`/edit_branch/${row.id}`}>
                <button className="actionBtn">
                  <i class="fas fa-edit"></i>
                </button>
              </Link>
              <button id={row.id} onClick={this.show} className="actionBtn">
                <i id={row.id} class="fas fa-trash"></i>{" "}
              </button>
            </div>
            // <p>{row.id}</p>
          ),
        },
      ],
    };
  }

  getBranches = async () => {
    this.setState({ loading: true });
    var newID = this.props.user.id.replace(/-/g, "");

    // Request interceptor for API calls

    var newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK + `/suppliers/?supplier=${newID}`
    );
    result.data.map((res) => {
      this.setState({ tableData: res.branches, loading: false });
    });
  };

  componentDidMount() {
    this.getBranches();
  }

  onSearch = (e) => {
    console.log(e.target);
    this.setState({ keyWord: e.target.value });
    let x = this.state.tableData.filter(
      (item) =>
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.username &&
          item.username.toLowerCase().includes(e.target.value.toLowerCase()))
    );
    this.setState({ tableData: x });
    if (e.target.value === "") {
      this.getBranches();
    }
  };

  getDetails = (e) => {
    console.log(e.target.id);
    // let obj = this.state.tableData.find((o) => o.id === e.target.id);
    // this.setState({ details: obj });
    // console.log(obj);
  };

  show = (e) => {
    this.setState({ showMsg: true, branchId: e.target.id });
    console.log(e.target.id);
  };
  hide = (e) => {
    this.setState({ showMsg: false });
  };

  deleteBranch = async (e) => {
    var newID = this.props.user.id.replace(/-/g, "");
    const res = await axiosApiInstance
      .delete(APILINK + `/Branch/${this.state.branchId}`)
      .then((res) =>
        this.setState((state, props) => {
          return { showMsg: false };
        })
      )
      .catch((err) => console.log(err));
    console.log(res);
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showMsg !== this.state.showMsg) {
      this.getBranches();
    }
  }

  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "350px" }}
          className="pt-3"
        >
          <Row>
            <Col className=" mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-building pr-2"></i>Branches
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_branch">
                {" "}
                <Button className="headBtn"> Add Branch</Button>
              </Link>
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
        </Container>
        <Modal show={this.state.showMsg} onHide={this.hide}>
          <Container className="p-4">
            <Row>
              <Col className="text-center" sm={12}>
                {" "}
                <h6>Are u sure u want to delete this product?</h6>
              </Col>
              <Row style={{ margin: "auto" }}>
                <Col md={12}>
                  <Button onClick={this.deleteBranch} className="headBtn">
                    Delete
                  </Button>
                  <Button className="headBtn" onClick={this.hide}>
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Row>
          </Container>
        </Modal>
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
)(ErrorHandler(Branches, axiosApiInstance));
