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

class AllSuppliers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      keyWord: "",
      showMsg: false,
      columns: [
        {
          name: "supplier name",
          selector: "name",
          sortable: true,
          right: true,
        },
        {
          name: "supplier phone",
          selector: "phone",
          sortable: true,
          right: true,
        },
        {
          name: "Working hours from",
          selector: "working_hours_from",
          sortable: true,
          right: true,
        },
        {
          name: "Working hours to",
          selector: "working_hours_to",
          sortable: true,
          right: true,
        },
        {
          name: "supplier city",
          selector: "city",
          sortable: true,
          right: true,
        },

        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              <Link to={`/edit_supplier/${row.id}`}>
                {" "}
                <button className="actionBtn">
                  <i class="fas fa-edit"></i>
                </button>
              </Link>

              <button id={row.id} onClick={this.show} className="actionBtn">
                <i id={row.id} class="fas fa-trash"></i>{" "}
              </button>
            </div>
          ),
        },
      ],
      proId: "",
      fileData: [],
      showSpinner: false,
      check: false,
      nextUrl: "",
      prevUrl: "",
      dis1: true,
      dis2: false,
      suppID: "",
    };
  }

  getAll = async () => {
    this.setState({ loading: true });

    const result = await axiosApiInstance.get(APILINK + `/suppliers/?limit=10`);
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
  };

  componentDidMount() {
    this.getAll();

    let x = [
      {
        email: "",
        password: "",
        name: "",
        user_name: "",
        city: "",
        address: "",
        phone: "",
        whatsapp: "",
        is_deliver: "",
        working_hours_from: "",
        working_hours_to: "",
        delivery_hours_from: "",
        delivery_hours_to: "",
      },
    ];
    this.setState({ fileData: x });
  }

  downLoadCatalog = (e) => {
    this.downloadCSV2(this.state.fileData);
  };

  convertArrayOfObjectsToCSV2 = (array) => {
    let result;

    const columnDelimiter = ",";
    const lineDelimiter = "\n";
    const keys = Object.keys(this.state.fileData[0]);

    result = "";
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
      let ctr = 0;
      keys.forEach((key) => {
        if (ctr > 0) result += columnDelimiter;

        result += item[key];

        ctr++;
      });
      result += lineDelimiter;
    });

    return result;
  };

  downloadCSV2 = (array) => {
    const link = document.createElement("a");
    let csv = this.convertArrayOfObjectsToCSV2(array);
    if (csv == null) return;

    const filename = "export.csv";

    if (!csv.match(/^data:text\/csv/i)) {
      this.state.fileData = this.state.fileData;
      csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute("href", encodeURI(csv));
    link.setAttribute("download", filename);
    link.click();
  };

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

  handleSelected = (state) => {
    this.setState({ selectedRows: state.selectedRows });
  };

  onUpload = async (event) => {
    this.setState({ showSpinner: true });
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
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
              });
            // await this.refreshAccessToken();
            let access_token = await x;

            axios.defaults.headers.common["Authorization"] =
              "Bearer " + access_token;
            localStorage.setItem("accessToken", "Bearer " + access_token);

            return axiosApiInstance(originalRequest);
          }
        }
        return Promise.reject(error);
      }
    );

    this.setState({ selectedFile: event.target.files[0] });

    const eventdata = new FormData();
    if (event.target.files[0]) {
      eventdata.append("file", event.target.files[0]);
    }

    const result = await axiosApiInstance.post(
      APILINK + `/supplier_upload_file`,
      eventdata
    );
    if (result.data.data === "done") {
      this.setState({ showSpinner: false, check: true });
      setTimeout(() => {
        this.setState({ showSpinner: false, check: false });
        this.getAll();
      }, 2000);
    }
  };

  getNext = async () => {
    console.log(this.state.nextUrl);
    // console.log(newID);

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
        console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
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
        }
        return Promise.reject(error);
      }
    );
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
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
    // console.log(this.state.prevUrl);
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
        console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
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
        }
        return Promise.reject(error);
      }
    );
    // let newID = this.props.user.id.replace(/-/g, "");
    // console.log(newID);
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

  show = (e) => {
    this.setState({ showMsg: true, suppID: e.target.id });
  };
  hide = (e) => {
    this.setState({ showMsg: false });
  };

  deleteSupplier = async () => {
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
        console.log(response);
        return response;
      },
      async function (error) {
        const originalRequest = error.config;
        if (error.response) {
          if (error.response.status === 401 && !originalRequest._retry) {
            console.log("here1");
            originalRequest._retry = true;
            let x = axios
              .post(APILINK + `/auth/jwt/refresh`, {
                refresh: localStorage.getItem("refreshToken"),
              })
              .then((response) => {
                console.log(response.data.access);
                return response.data.access;
              })
              .catch((err) => {
                console.log(err.response);
                if (err.response.status === 401) {
                  window.location.pathname = "/";
                }
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
        }
        return Promise.reject(error);
      }
    );
    const result = await axiosApiInstance
      .delete(APILINK + `/supplier/${this.state.suppID}`)
      .then((res) =>
        this.setState((state, props) => {
          return { showMsg: false };
        })
      )
      .catch((err) => console.log(err));
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevState.showMsg !== this.state.showMsg) {
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
                <i class="fas fa-shopping-basket"></i> Suppliers
              </h2>
            </Col>
          </Row>
          <Row className="my-1">
            <Col style={{ textAlign: "initial" }} sm={8}>
              <Button onClick={this.downLoadCatalog} className="headBtn">
                Download supplier template
              </Button>
              <input
                onChange={this.onUpload}
                type="file"
                className="customBtn"
              />

              {this.state.showSpinner === true ? (
                <Spin tip="Loading..."></Spin>
              ) : null}
              {this.state.check === true ? (
                <i className="fas fa-check-circle checkk"></i>
              ) : null}
              {/* </form> */}
            </Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_supplier">
                {" "}
                <Button className="headBtn">Add Supplier</Button>
              </Link>
            </Col>
          </Row>
          <Row>
            <Col sm={12}>
              {this.state.loading === false ? (
                <DataTable
                  columns={this.state.columns}
                  data={this.state.tableData}
                  // selectableRows
                  onSelectedRowsChange={this.handleSelected}
                  subHeader
                  subHeaderComponent={
                    <React.Fragment>
                      <Col
                        style={{ textAlign: "initial", color: "#7c8798" }}
                        sm={12}
                        md={6}
                      >
                        {/* {" "}
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
                      entries */}
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
        <Modal show={this.state.showMsg} onHide={this.hide}>
          <Container className="p-4">
            <Row>
              <Col className="text-center" sm={12}>
                {" "}
                <h6>Are you sure you want to delete this supplier?</h6>
              </Col>
              <Row style={{ margin: "auto" }}>
                <Col md={12}>
                  <Button onClick={this.deleteSupplier} className="headBtn">
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
)(ErrorHandler(AllSuppliers, axiosApiInstance));
