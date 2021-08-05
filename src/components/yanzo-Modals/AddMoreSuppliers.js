import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import "../../style-sheets/home.css";
import DataTable from "react-data-table-component";
import { connect } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ViewSupplierProducts from "../yanzo-Modals/ViewSupplierProducts";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import {APILINK} from '../../Endpoint'
const axiosApiInstance = axios.create();

class AddMoreSuppliers extends Component {
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
      notify: "",
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
    // Request interceptor for API calls
    
    let data;
    if (this.state.selectedID.length === 1) {
      data = {
        requests: [
          {
            request_type: "1",
            product: this.state.selectedProduct,
            supplier: this.state.selectedID.toString(),
          },
        ],
      };

      // }
    } else {
      let requestData = this.state.selectedID.map((x) => {
        return {
          request_type: "1",
          product: this.state.selectedProduct,
          supplier: x,
        };
      });
      data = {
        requests: requestData,
      };
    }
    console.log(data);
    const result = await axiosApiInstance
      .put(
        APILINK +`/add_request/${this.props.prereqData.id}`,
        data
      )
      .catch((err) => {
        console.log(err.response);
      });
    console.log(result);
    if (result) {
      if (result.data.data === "added new requests successful") {
        this.setState({ notify: "Added new requests successfully" });
      }
    }
  };

  onClose = (e) => {
    this.props.closeSuppliers(false);
  };

  render() {
    console.log(this.props);
    return (
      <Modal size="lg" show={this.props.show} onHide={this.onClose}>
        <div>
          <Container className="pt-3 viewSupp">
            <Row>
              <Col className="p-4 mb-4" style={{ textAlign: "right" }} sm={4}>
                <h3> Suppliers</h3>
              </Col>
              <Col className="p-4 mb-4" sm={4}></Col>
              <Col
                className="p-4 mb-4"
                style={{ textAlign: "left" }}
                sm={4}
              ></Col>
            </Row>
            <Row>
              <Col style={{ margin: "auto" }} sm={12} md={8}>
                <DataTable
                  columns={this.state.columns}
                  data={this.props.suppliers}
                  selectableRows
                  onSelectedRowsChange={this.handleSelected}
                />
              </Col>
            </Row>
            <Row>
              <Col className="p-4 mb-4" sm={8}></Col>
              <Col className="p-4 mb-4" style={{ textAlign: "left" }} sm={4}>
                {this.props.suppliers.length === 0 ||
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
                    onClick={this.createRequests}
                    className="headBtn px-3"
                  >
                    Send Request
                  </Button>
                )}
              </Col>
            </Row>
            {this.state.notify !== "" ? (
              <Row>
                <Col className="" style={{ textAlign: "center" }} sm={12}>
                  <p style={{ color: "green", fontWeight: "bold" }}>
                    {this.state.notify}
                  </p>
                </Col>
              </Row>
            ) : null}
          </Container>
          <ViewSupplierProducts
            show={this.state.showModal}
            getID={this.getID}
            close={this.closeModal}
            id={this.state.supplierId}
          />
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => ({
  supplierRes: state.supplierRes.supplierRes,
  searchData: state.searchData.searchData,
});



export default connect(mapStateToProps)(ErrorHandler(AddMoreSuppliers,axiosApiInstance));
