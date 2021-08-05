import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Modal,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { Spin } from "antd";

const axiosApiInstance = axios.create();

class AllAgents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      keyWord: "",
      showMsg: false,
      columns: [
        {
          name: "Agent name",
          selector: "user_name",
          sortable: true,
          right: true,
        },

        {
          name: "Agent email",
          selector: "email",
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
                overlay={<Tooltip id={`tooltip-${"top"}`}>Edit Agent</Tooltip>}
              >
                <Link to={`/edit_agent/${row.id}`}>
                  <Button className="actionBtn">
                    {" "}
                    <i class="fas fa-edit"></i>
                  </Button>
                </Link>
              </OverlayTrigger>
              <OverlayTrigger
                key={"top"}
                placement={"top"}
                overlay={
                  <Tooltip id={`tooltip-${"top"}`}>Delete Agent</Tooltip>
                }
              >
                <Button
                  id={row.id}
                  onClick={this.openModel}
                  className="actionBtn"
                >
                  {" "}
                  <i
                    id={row.id}
                    onClick={this.openModel}
                    class="fas fa-trash"
                  ></i>
                </Button>
              </OverlayTrigger>
            </div>
          ),
        },
      ],
      showDeleteModel: false,
    };
  }

  getAll = async () => {
    this.setState({ loading: true });

    const result = await axiosApiInstance
      .get(APILINK + `/agent_registration`)
      .then((result) =>
        this.setState({ tableData: result.data.data, loading: false })
      );
  };

  componentDidMount() {
    this.getAll();
  }

  onSearch = (e) => {
    this.setState({ keyWord: e.target.value });
    let x = this.state.tableData.filter(
      (item) =>
        item.name &&
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    this.setState({ tableData: x });
    if (e.target.value === "") {
      this.getAll();
    }
  };

  openModel = (e) => {
    this.setState({ showDeleteModel: true, agentID: e.target.id });
  };
  close = () => {
    this.setState({ showDeleteModel: false });
  };

  deleteAgent = async () => {
    console.log(this.state.agentID);

    let result = await axiosApiInstance.delete(
      APILINK + `/edit_agent?id=${this.state.agentID}`
    );
    console.log(result);
    if (result) {
      this.setState({ showDeleteModel: false });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showDeleteModel !== this.state.showDeleteModel) {
      this.getAll();
    }
  }

  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "80px", marginLeft: "300px" }}
          className="py-3"
        >
          <Row>
            <Col className="p-4 mb-1" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-users pr-2"></i> Agents
              </h2>
            </Col>
          </Row>
          <Row className="my-1">
            <Col style={{ textAlign: "initial" }} sm={8}></Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_agent">
                {" "}
                <Button className="headBtn">Add Agent</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            {this.state.loading === false ? (
              <Col sm={12}>
                <DataTable
                  columns={this.state.columns}
                  data={this.state.tableData}
                />
              </Col>
            ) : (
              <Col className="text-center" sm={12}>
                {this.state.loading ? (
                  <Spin tip="Loading..."></Spin>
                ) : (
                  "No data to be displayed"
                )}
              </Col>
            )}
          </Row>
        </Container>
        <Modal show={this.state.showDeleteModel} onHide={this.close}>
          <Container className="p-4">
            <Row>
              <Col className="text-center" sm={12}>
                {" "}
                <h6>Are u sure u want to delete this agent?</h6>
              </Col>
              <Row style={{ margin: "auto" }}>
                <Col md={12}>
                  <Button onClick={this.deleteAgent} className="headBtn">
                    Delete
                  </Button>
                  <Button className="headBtn" onClick={this.close}>
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
)(ErrorHandler(AllAgents, axiosApiInstance));
