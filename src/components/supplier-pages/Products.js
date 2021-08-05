import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import { Container, Row, Col, Button, Modal } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import { connect } from "react-redux";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from "../../Endpoint";
import { Spin } from "antd";

const axiosApiInstance = axios.create();

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableData: [],
      keyWord: "",
      showMsg: false,
      columns: [
        {
          name: "Product name",
          selector: "name",
          sortable: true,
          right: true,
        },
        {
          name: "Product code",
          selector: "code",
          sortable: true,
          right: true,
        },
        {
          name: "Price",
          selector: "price",
          sortable: true,
          right: true,
        },

        {
          name: "Quantity",
          selector: "quantity",
          sortable: true,
          right: true,
        },

        {
          name: "Actions",
          button: true,
          cell: (row) => (
            <div className="table-data-feature">
              <Link to={`/view_product/${row.id}`}>
                <button className="actionBtn">
                  <i class="fas fa-eye"></i>{" "}
                </button>
              </Link>
              <Link to={`/edit_product/${row.id}`}>
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

      nextUrl: "",
      prevUrl: "",
      dis1: true,
      dis2: false,
    };
  }

  refreshAccessToken = () => {
    axios
      .post(APILINK + `/auth/jwt/refresh`, {
        refresh: localStorage.getItem("refreshToken"),
      })
      .then(
        (response) => {
          return response;
        }

        // this.setState({ tableData: response.data })
      );
  };

  getAll = async () => {
    this.setState({ loading: true });
    var newID = this.props.user.id.replace(/-/g, "");
    console.log(newID);

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

    const result = await axiosApiInstance.get(
      APILINK + `/products/?supplier=${newID}&limit=10`
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
  };

  componentDidMount() {
    this.getAll();
    let x = [
      {
        name: "",
        price: "",
        code: "",
        quantity: "",
      },
    ];
    this.setState({ fileData: x });
  }

  onSearch = (e) => {
    console.log(e.target);
    this.setState({ keyWord: e.target.value });
    let x = this.state.tableData.filter(
      (item) =>
        item.name &&
        item.name.toLowerCase().includes(e.target.value.toLowerCase())
    );
    console.log(x);
    this.setState({ tableData: x });
    if (e.target.value === "") {
      this.getAll();
    }
  };

  handleSelected = (state) => {
    console.log("Selected Rows: ", state.selectedRows);
    this.setState({ selectedRows: state.selectedRows });
  };

  show = (e) => {
    this.setState({ showMsg: true, proId: e.target.id });
    console.log(e.target.id);
  };
  hide = (e) => {
    this.setState({ showMsg: false });
  };

  deleteProduct = async (e) => {
    var newID = this.props.user.id.replace(/-/g, "");
    const res = await axiosApiInstance
      .delete(APILINK + `/product/${this.state.proId}`)
      .then((res) =>
        this.setState((state, props) => {
          return { showMsg: false };
        })
      )
      .catch((err) => console.log(err));
    console.log(res);
    // this.setState((state, props) => {
    //   return { showMsg : false}

    // });
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showMsg !== this.state.showMsg) {
      this.getAll();
    }
  }

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
      APILINK + `/product_upload_file`,
      eventdata
    );
    if (result.data.data === "done") {
      this.setState({ showSpinner: false, check: true });
      setTimeout(() => {
        this.setState({ showSpinner: false, check: false });
        this.getAll();
      }, 3000);
    }
  };
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "80px", marginLeft: "300px" }}
          className="py-3"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket"></i> Products
              </h2>
            </Col>
          </Row>
          <Row className="my-2">
            <Col style={{ textAlign: "initial" }} sm={8}>
              <Button onClick={this.downLoadCatalog} className="headBtn">
                Download Product Catalog
              </Button>
              <input
                onChange={this.onUpload}
                type="file"
                className="customBtn3"
              />

              {this.state.showSpinner === true ? (
                <Spin tip="Loading..."></Spin>
              ) : null}
              {this.state.check === true ? (
                <i className="fas fa-check-circle checkk"></i>
              ) : null}
            </Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_product">
                {" "}
                <Button className="headBtn">Add Product</Button>
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
                <h6>Are u sure u want to delete this product?</h6>
              </Col>
              <Row style={{ margin: "auto" }}>
                <Col md={12}>
                  <Button onClick={this.deleteProduct} className="headBtn">
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
)(ErrorHandler(Products, axiosApiInstance));
