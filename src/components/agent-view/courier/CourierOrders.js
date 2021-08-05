import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../../style-sheets/products.css";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { bindActionCreators } from "redux";
import {
  courierType,
  quickUpTypes,
} from "../../../global-state/actions/checkCourierType";
import { APILINK } from "../../../Endpoint";
import ErrorHandler from "../../../ErrorHandler/ErrorHandler";
import { Spin } from "antd";

const axiosApiInstance = axios.create();
class CourierOrders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading : false,
      tableData: [],
      tableData2: [],

      keyWord: "",
      nextUrl: null,
      prevUrl: null,
      dis1: true,
      dis2: false,
      columns: [
        {
          name: "Ticket Number",
          selector: "order_id",
          sortable: true,
          right: true,
        },
        {
          name: "Order Name",
          selector: "order_name",
          sortable: true,
          right: true,
        },
        {
          name: "Courier Name",
          selector: "courier.name",
          sortable: true,
          right: true,
        },
        {
          name: "Order Status",
          selector: "order_status",
          sortable: true,
          right: true,
        },
        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              {row.courier.name === "Quiqup" ? (
                <Link to={`/courier_order_details/${row.courier_order_id}`}>
                  <button
                    onClick={() => {
                      this.props.courierType(true);
                      this.props.quickUpTypes(row.order_id);
                    }}
                    className="actionBtn"
                  >
                    <i id={row.courier_order_id} class="fas fa-eye"></i>{" "}
                  </button>
                </Link>
              ) : (
                <Link to={`/courier_order_details/${row.order_id}`}>
                  <button className="actionBtn">
                    <i id={row.order_id} class="fas fa-eye"></i>{" "}
                  </button>
                </Link>
              )}
            </div>
          ),
        },
      ],

      columns2: [
        {
          name: "Ticket Number",
          selector: "pre_request.ticket_code",
          sortable: true,
          right: true,
        },
        {
          name: "Order Name",
          selector: "pre_request.name",
          sortable: true,
          right: true,
        },
        {
          name: "Courier Name",
          selector: "orders.courier_order.courier.name",
          sortable: true,
          right: true,
        },
        {
          name: "Order Status",
          selector: "orders.courier_order.order_status",
          sortable: true,
          right: true,
        },

        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              {/* <Link
                to={`/courier_order_details/${row.orders.courier_order.order_id}`}
              >
                <button className="actionBtn">
                  <i
                    id={row.orders.courier_order.order_id}
                    class="fas fa-eye"
                  ></i>{" "}
                </button>
              </Link> */}

              {row.orders.courier_order.courier.name === "Quiqup" ? (
                <Link
                  to={`/courier_order_details/${row.orders.courier_order.courier_order_id}`}
                >
                  <button
                    onClick={() => {
                      this.props.courierType(true);
                      this.props.quickUpTypes(
                        row.orders.courier_order.order_id
                      );
                    }}
                    className="actionBtn"
                  >
                    <i
                      id={row.orders.courier_order.courier_order_id}
                      class="fas fa-eye"
                    ></i>{" "}
                  </button>
                </Link>
              ) : (
                <Link
                  to={`/courier_order_details/${row.orders.courier_order.order_id}`}
                >
                  <button className="actionBtn">
                    <i
                      id={row.orders.courier_order.order_id}
                      class="fas fa-eye"
                    ></i>{" "}
                  </button>
                </Link>
              )}
            </div>
          ),
        },
      ],

      is_stand_alone: false,
    };
  }
  handleFilter = (e) => {
    if (e.target.value === "2") {
      this.setState({
        is_stand_alone: true,
      });
    } else {
      this.setState({
        is_stand_alone: false,
      });
    }
  };
  getOrders = async () => {
    this.setState({loading:true})
  
    if (this.state.is_stand_alone === true) {
      const result = await axiosApiInstance.get(
        APILINK + `/courier_orders/?order_type=2&limit=10`
      );
      // console.log(result);
      if (result) {
        console.log(result);
        // let data = result.data.results.filter(
        //   (type) => type.order_type === "2"
        // );
        this.setState({ tableData: result.data.results ,loading:false});
        if (result.data.next !== null) {
          this.setState({
            nextUrl: result.data.next,
          });
        }

        if (result.data.previous !== null) {
          this.setState({
            prevUrl: result.data.previous,
          });
        }
        if (result.data.next === null) {
          this.setState({ dis2: true });
        }
      }
    } else {
      const result = await axiosApiInstance.get(
        APILINK + `/requests/?courier_order__exists=true&limit=10`
      );
      if (result) {
        console.log(result);
        this.setState({ tableData2: result.data.results });
        if (result.data.next !== null) {
          this.setState({
            nextUrl: result.data.next,
          });
        }

        if (result.data.previous !== null) {
          this.setState({
            prevUrl: result.data.previous,
          });
        }
        if (result.data.next === null) {
          this.setState({ dis2: true });
        }
      }
    }
  };

  componentDidMount() {
    this.getOrders();
    this.props.courierType(false);
    this.props.quickUpTypes("");
  }

  onSearch = (e) => {
    console.log(e.target);
    this.setState({ keyWord: e.target.value });
    let x = this.state.tableData.filter(
      (item) =>
        item.pre_request.name &&
        item.pre_request.name
          .toLowerCase()
          .includes(e.target.value.toLowerCase())
    );
    console.log(x);
    this.setState({ tableData: x });
    if (e.target.value === "") {
      this.getOrders();
    }
  };

  getNext = async () => {
 
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);

    console.log("orderssss");
    if (result) {
      console.log(result.data);
      this.setState({
        tableData: result.data.results,
        // nextUrl: result.data.next,
        // prevUrl: result.data.previous,
      });
      if (result.data.next !== null) {
        this.setState({
          nextUrl: result.data.next,
          // prevUrl: result.data.previous,
        });
      }
      if (result.data.previous !== null) {
        this.setState({
          prevUrl: result.data.previous,
          dis1: false,
        });
      }
      if (result.data.next === null) {
        this.setState({ dis2: true, dis1: false });
      }
    }
  };

  getPrev = async () => {
  
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
    const result = await axiosApiInstance.get(`${this.state.prevUrl}`);
    if (result) {
      console.log("orderssss");
      console.log(result.data);
      this.setState({
        tableData: result.data.results,
        // nextUrl: result.data.next,
        // prevUrl: result.data.previous,
      });
      if (result.data.next !== null) {
        this.setState({
          nextUrl: result.data.next,
          dis2: false,

          // prevUrl: result.data.previous,
        });
      }
      if (result.data.previous !== null) {
        this.setState({
          prevUrl: result.data.previous,
        });
      }
      if (result.data.previous === null) {
        this.setState({ dis1: true, dis2: false });
      }
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.is_stand_alone !== this.state.is_stand_alone) {
      this.getOrders();
    }
  }

  handleSelected = (state) => {
    console.log(state.selectedRows);
    this.setState({ selectedRows: state.selectedRows });
  };

  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "350px" }}
          className="py-3"
        >
          <Row>
            <Col className="mb-4" style={{ textAlign: "initial" }} sm={6}>
              <h2>
                <i className="fas fa-shopping-cart pr-2"></i>Courier Orders
              </h2>
            </Col>
            <Col sm={6}>
              <select
                onChange={this.handleFilter}
                style={{ marginLeft: "10px" }}
                id="cars"
              >
                <option value="1"> Other Orders</option>
                <option value="2">Stand Alone Orders</option>
              </select>
            </Col>
          </Row>

          <Row>
            <Col className="m-auto" sm={8}>
              {this.state.is_stand_alone === true ? (
                this.state.tableData.length !== 0 ? (
                  <DataTable
                    columns={this.state.columns}
                    data={this.state.tableData}
                    onSelectedRowsChange={this.handleSelected}
                    subHeader
                    subHeaderComponent={
                      <React.Fragment>
                        <Col
                          style={{ textAlign: "initial", color: "#7c8798" }}
                          sm={12}
                          md={6}
                        ></Col>
                        <Col style={{ textAlign: "right" }} sm={12} md={6}>
                          <label style={{ color: "#7c8798" }}>Search:</label>
                          <input
                            id="search"
                            type="text"
                            placeholder=""
                            aria-label="Search Input"
                            className="seachInput"
                            value={this.state.keyWord}
                            onChange={this.onSearch}
                          />
                        </Col>
                      </React.Fragment>
                    }
                  />
                ) : (
                  <Col className="text-center" sm={12}>
                    {this.state.loading ? <Spin tip="Loading..."></Spin> : "No data to be displayed" }
                  </Col>
                )
              ) : this.state.tableData2.length !== 0 ? (
                <DataTable
                  columns={this.state.columns2}
                  data={this.state.tableData2}
                  onSelectedRowsChange={this.handleSelected}
                />
              ) : null}
            </Col>
          </Row>
          <Row>
            {/* <Col className="text-center" sm={12}>
              <Spin tip="Loading..."></Spin>
            </Col> */}
          </Row>
          <Row>
            <Col style={{ textAlign: "center" }} sm={12}>
              {this.state.tableData.length === 0 ? null : (
                <div className="p-3">
                  {" "}
                  <Button
                    disabled={this.state.dis1}
                    onClick={this.getPrev}
                    className="nextBtn"
                  >
                    <i class="fas fa-angle-double-left"></i> Previous
                  </Button>
                  <Button
                    disabled={this.state.dis2}
                    onClick={this.getNext}
                    className="nextBtn"
                  >
                    Next<i class="fas fa-angle-double-right pl-1"></i>
                  </Button>
                </div>
              )}
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

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ courierType, quickUpTypes }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler(CourierOrders,axiosApiInstance));
