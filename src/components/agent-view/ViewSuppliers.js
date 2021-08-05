import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import "../../style-sheets/home.css";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewSupplierProducts from "../yanzo-Modals/ViewSupplierProducts";
import { bindActionCreators } from "redux";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import {APILINK} from '../../Endpoint'
const axiosApiInstance = axios.create();

class ViewSuppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      keywords: [],
      category: [],
      startDate: new Date(),
      tableData: [],
      selectedID: [],
      showModal: false,
      supplierId: "",
      BEerr: [],
      disable: false,
      columns: [
        {
          name: "Supplier Name",
          selector: "name",
          sortable: true,
          right: true,
        },
        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              <button
                onClick={() => {
                  this.setState({
                    showModal: true,
                    supplierId: row.id,
                  });
                }}
                className="actionBtn3"
              >
                <i class="fas fa-desktop"></i>
              </button>
            </div>
          ),
        },
      ],
      selectedProduct: "",
      selectedRows: [],
    };
  }
  closeModal = (e, f) => {
    // console.log(e, f);
    this.setState({
      showModal: false,
    });
  };

  getID = (e) => {
    console.log(e);
    this.setState({ selectedProduct: e });
  };
  handleSelected = (state) => {
    console.log("Selected Rows: ", state.selectedRows);
    let selectedID = state.selectedRows.map((x) => {
      return x.id;
    });
    // console.log(selectedID);
    this.setState({ selectedID: selectedID });
  };

  createRequests = async () => {
   
    this.setState({ disable: true });

    let data;
    let eventdata = new FormData();
    let test = new FormData();

    let formData = new FormData();
    if (this.state.selectedID.length === 1) {
      data = {
        PreRequest: this.props.searchData.PreRequest,
        requests: [
          {
            request_type: "1",
            product: this.state.selectedProduct,
            supplier: this.state.selectedID.toString(),
          },
        ],
      };
    
    } else {
      let requestData = this.state.selectedID.map((x) => {
        return {
          request_type: "1",
          product: this.state.selectedProduct,
          supplier: x,
        };
      });
      // console.log(requestData);
      data = {
        PreRequest: this.props.searchData.PreRequest,
        requests: requestData,
      };
    }

    const result = await axiosApiInstance
      .post(APILINK +`/create_request`, data)
      .catch((err) => {
        console.log(err.response);
        if (err.response) {
          if (err.response.status === 400) {
            // this.setState({ BEerr: err.response.data.error });
            this.setState({ disable: false });

            for (let x in err.response.data.error) {
              console.log(err.response.data.error[x]);
              err.response.data.error[x].map((err) => {
                console.log(err);
                let y = [];
                y.push(err);
                this.setState({ BEerr: y });
              });
            }
          }
        }
      });
    console.log(result);
    if (result) {
      if (result.data.data.id) {
        setTimeout(() => {
          toast.info(`Request has been sent successfully`);
        }, 200);
        setTimeout(() => {
          this.props.history.push("/agent_home");
        }, 3500);
      }
    }
  };

  componentDidMount()
  {
  // console.log(this.props)
  console.log('hereeeeee')
  }

  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "80px", marginLeft: "250px" }}
          className="pt-3 viewSupp"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "right" }} sm={4}>
              <h3> Suppliers</h3>
            </Col>
            <Col className="p-4 mb-4" sm={4}></Col>
            <Col className="p-4 mb-4" style={{ textAlign: "left" }} sm={4}>
           
            </Col>
          </Row>
          <Row>
            <Col style={{ margin: "auto" }} sm={12} md={8}>
              <DataTable
                columns={this.state.columns}
                data={this.props.supplierRes}
                selectableRows
                onSelectedRowsChange={this.handleSelected}
              />
            </Col>
          </Row>
          <Row>
            <Col className="p-4 mb-4" sm={8}></Col>
            <Col className="p-4 mb-4" style={{ textAlign: "left" }} sm={4}>
              {this.props.supplierRes.length === 0 ||
              this.state.selectedID.length === 0 ? (
                <Button
                  disabled
                  onClick={this.createRequests}
                  className="headBtn px-3"
                >
                  Send Request
                </Button>
              ) : (
                <Button
                  disabled={this.state.disable}
                  onClick={this.createRequests}
                  className="headBtn px-3"
                >
                  Send Request
                </Button>
              )}
            </Col>
          </Row>
          {this.state.BEerr.length !== 0
            ? this.state.BEerr.map((x) => {
                return (
                  <Row>
                    <Col className="" style={{ textAlign: "center" }} sm={12}>
                      <p style={{ color: "red", fontWeight: "bold" }}>{x}</p>
                    </Col>
                  </Row>
                );
              })
            : null}
        </Container>
        <ToastContainer position="bottom-right" />
        <ViewSupplierProducts
          show={this.state.showModal}
          getID={this.getID}
          close={this.closeModal}
          id={this.state.supplierId}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  supplierRes: state.supplierRes.supplierRes,
  searchData: state.searchData.searchData,
});


export default connect(mapStateToProps)(ErrorHandler(ViewSuppliers,axiosApiInstance));
