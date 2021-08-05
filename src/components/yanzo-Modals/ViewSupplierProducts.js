import React, { Component } from "react";
import axios from "axios";
import { Container, Row, Col, Modal, Button } from "react-bootstrap";
import "../../style-sheets/home.css";
import DataTable from "react-data-table-component";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import {APILINK} from '../../Endpoint'
const axiosApiInstance = axios.create();
class ViewSupplierProducts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      option: "",
      checked: "",
      showStatus: false,
      time: "",
      msg: "",
      showmsg: false,
      products: [],
      columns: [
        {
          name: "Product Name",
          selector: "name",
          sortable: true,
          right: true,
        },
        {
          name: "Product Price",
          selector: "price",
          sortable: true,
          right: true,
        },
        {
          name: "Product Quantity",
          selector: "quantity",
          sortable: true,
          right: true,
        },
      ],
      selectedID: "",
    };
  }

  onClose = (e) => {
    this.props.close(false);
    this.setState({ products: [] });
  };

  getProducts = async () => {
    //   alert('called')
    const result = await axiosApiInstance.get(
      APILINK +`/products/?supplier=${this.props.id}`
    );
    // console.log(result);
    if (this.props.id !== "") {
      this.setState({ products: result.data });
    }
  };

  componentDidMount() {
    this.getProducts();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      // console.log("changeeeeee");
      this.getProducts();
    }
  }

  onConfirm = () => {
    this.props.getID(this.state.selectedID);
    this.props.close(false);
  };

  handleSelected = (state) => {
    // console.log("Selected Rows: ", state.selectedRows);
    let selectedID = state.selectedRows.map((x) => {
      return x.id;
    });
    this.setState({ selectedID: selectedID.toString() });
  };

  render() {
    // console.log(this.props);
    return (
      <Modal size="lg" show={this.props.show} onHide={this.onClose}>
        <Container className="p-4 modal2">
          <Row>
            <Col sm={12}>
              <p>Select Product</p>
            </Col>
          </Row>
          <DataTable
            columns={this.state.columns}
            data={this.state.products}
            selectableRows
            onSelectedRowsChange={this.handleSelected}
          />
          <Row>
            <Col sm={12} md={6}></Col>
            {this.state.products.length === 0 ? (
              <Col style={{ textAlign: "end" }} sm={12} md={6}>
                <Button onClick={this.onClose} className="addBtn1">
                  Cancel
                </Button>
              </Col>
            ) : (
              <Col style={{ textAlign: "end" }} sm={12} md={6}>
                <Button onClick={this.onClose} className="addBtn1">
                  Cancel
                </Button>
                <Button onClick={this.onConfirm} className="addBtn2">
                  Confirm
                </Button>
              </Col>
            )}
          </Row>
        </Container>
      </Modal>
    );
  }
}

export default ErrorHandler(ViewSupplierProducts,axiosApiInstance) ;
