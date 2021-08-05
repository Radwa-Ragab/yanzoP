import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import { APILINK } from '../../Endpoint'
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { Spin } from "antd";

const axiosApiInstance = axios.create();
class Orders extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      keyWord: "",
      columns: [
        {
          name: "Order Name",
          selector: "pre_request.name",
          sortable: true,
          right: true,
        },
        {
          name: "Quantity",
          selector: "pre_request.product_quantity",
          sortable: true,
          right: true,
        },
        {
          name: "Supplier",
          selector: "supplier.name",
          sortable: true,
          right: true,
        },
      ],
      nextUrl: "",
      prevUrl: "",
      dis1: true,
      dis2: false,
    };
  }

  getOrders = async () => {
    this.setState({ loading: true })
    var newID = this.props.user.id.replace(/-/g, "");
   
    var newID = this.props.user.id.replace(/-/g, "");
    console.log(newID);
    if (this.props.user.user_type === "2") {
      const result = await axiosApiInstance.get(
        APILINK + `/requests/?supplier=${newID}&request_type=3&limit=10`
      );

      if (result) {
        this.setState({ tableData: result.data.results, loading: false });

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
        APILINK + `/requests/?agent=${newID}&request_type=3&limit=10`
      );

      if (result) {
        this.setState({ tableData: result.data.results, loading: false });

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
 
    const result = await axiosApiInstance.get(`${this.state.nextUrl}`);

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
  };

  getPrev = async () => {
 
    const result = await axiosApiInstance.get(`${this.state.prevUrl}`);

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
  };
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "350px" }}
          className="py-3"
        >
          <Row>
            <Col className="mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                <i className="fas fa-cart-arrow-down pr-2"></i> Orders
              </h2>
            </Col>
          </Row>

          <Row>
            <Col sm={12}>
              {this.state.loading === false ? <DataTable
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
                    >
                    </Col>
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
              /> : <Col className="text-center" sm={12}>
                  {this.state.loading ? <Spin tip="Loading..."></Spin> : "No data to be displayed"}
                </Col>}

            </Col>
          </Row>
          <Row>
            <Col style={{ textAlign: "initial" }} sm={12}>
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

export default connect(mapStateToProps, null)(ErrorHandler(Orders,axiosApiInstance));
