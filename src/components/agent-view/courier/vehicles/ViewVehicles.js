import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import {APILINK} from '../../../../Endpoint'
const axiosApiInstance = axios.create();

class ViewVehicles extends Component {
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
              <Link to={`/edit_vehicle/${row.id}`}>
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

  getVehicles = async () => {
    // Request interceptor for API calls
    axiosApiInstance.interceptors.request.use(
      async (config) => {
        config.headers = {
          Authorization: localStorage.getItem("accessToken"),
        };
        return config;
      },
      (error) => {
        Promise.reject(error);
      }
    );

    // Response interceptor for API calls
    axiosApiInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async function (error) {
        console.log(error);
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
          console.log("here1");
          originalRequest._retry = true;
          let x = axios
            .post(APILINK +`/auth/jwt/refresh`, {
              refresh: localStorage.getItem("refreshToken"),
            })
            .then((response) => {
              console.log(response.data.access);
              return response.data.access;
            });
          // await this.refreshAccessToken();
          let access_token = await x;
          console.log("here2");
          console.log(access_token);
          axios.defaults.headers.common["Authorization"] =
            "Bearer " + access_token;
          localStorage.setItem("accessToken", "Bearer " + access_token);

          return axiosApiInstance(originalRequest);
        }
        return Promise.reject(error);
      }
    );
    // console.log(newID);
    const result = await axiosApiInstance.get(
      APILINK +`/vehicle_types/`
    );
    console.log(result);
    this.setState({ tableData: result.data });
  };

  componentDidMount() {
    this.getVehicles();
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
                <i class="fas fa-building pr-2"></i>Vehicles
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_Vehicle">
                {" "}
                <Button className="headBtn"> Add Vehicle</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
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
                    >
                      {" "}
                      Show{" "}
                      <select
                        onChange={this.handleOption}
                        className="js-select2 px-2 mx-1"
                        name="Action"
                      >
                        <option selected="selected">10</option>
                        <option selected="selected">30</option>
                        <option selected="selected">60</option>
                      </select>
                      entries
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

export default connect(mapStateToProps, null)(ViewVehicles);
