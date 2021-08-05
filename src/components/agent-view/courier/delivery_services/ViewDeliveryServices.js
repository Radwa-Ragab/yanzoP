import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { APILINK } from "../../../../Endpoint";
import ErrorHandler from "../../../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();

class ViewDeliveryServices extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              <Link to={`/edit_delivery_service/${row.id}`}>
                <button className="actionBtn">
                  <i class="fas fa-edit"></i>
                </button>
              </Link>
            </div>
          ),
        },
      ],
    };
  }

  getServices = async () => {
   
    // console.log(newID);
    const result = await axiosApiInstance.get(APILINK + `/delivery_service`);
    console.log(result);
    this.setState({ tableData: result.data.data });
  };

  componentDidMount() {
    this.getServices();
  }

  getDetails = (e) => {
    console.log(e.target.id);
  };

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
                <i class="fas fa-building pr-2"></i>Delievery Services
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_service">
                {" "}
                <Button className="headBtn"> Add Service</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              <DataTable
                columns={this.state.columns}
                data={this.state.tableData}
                onSelectedRowsChange={this.handleSelected}
              />
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
)(ErrorHandler(ViewDeliveryServices, axiosApiInstance));
