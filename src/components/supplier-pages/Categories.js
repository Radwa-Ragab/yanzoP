import React, { Component } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  Button,
  Tooltip,
  OverlayTrigger,
  Modal,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";
import { APILINK } from '../../Endpoint'
import { Spin } from "antd";

const axiosApiInstance = axios.create();

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showMsg: false,
      tableData: [],
      keyWord: "",
      nextUrl: null,
      prevUrl: null,
      dis1: true,
      dis2: true,
      columns: [
        {
          name: "Name",
          selector: "name",
          sortable: true,
          right: true,
        },
        {
          name: "Code",
          selector: "code",
          sortable: true,
          right: true,
        },
        {
          name: "Description",
          selector: "description",
          sortable: true,
          right: true,
        },
        {
          name: "Rate",
          selector: "yanzo_rate",
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
                overlay={
                  <Tooltip id={`tooltip-${"top"}`}>Edit category</Tooltip>
                }
              >
                <Link to={`/edit_category/${row.id}`}>
                  <Button className="actionBtn">
                    {" "}
                    <i class="fas fa-edit"></i>
                  </Button>
                </Link>
              </OverlayTrigger>
              <button id={row.id} onClick={this.show} className="actionBtn">
                <i id={row.id} class="fas fa-trash"></i>{" "}
              </button>
            </div>
          ),
        },
      ],
    };
  }

  getCategories = async () => {
    this.setState({ loading: true })
    // Request interceptor for API calls
    // axiosApiInstance.interceptors.request.use(
    //   async (config) => {
    //     config.headers = {
    //       Authorization: localStorage.getItem("accessToken"),
    //     };
    //     return config;
    //   },
    //   (error) => {
    //     Promise.reject(error);
    //   }
    // );

    // // Response interceptor for API calls
    // axiosApiInstance.interceptors.response.use(
    //   (response) => {
    //     console.log(response);
    //     return response;
    //   }
    // async function (error) {
    //   const originalRequest = error.config;
    //   // console.log(error.response)
    //   if(error.response)
    //   {
    //     if (error.response.status === 401 && !originalRequest._retry) {
    //       console.log("here1");
    //       originalRequest._retry = true;
    //       let x = axios
    //         .post(APILINK +`/auth/jwt/refresh`, {
    //           refresh: localStorage.getItem("refreshToken"),
    //         })
    //         .then((response) => {
    //           console.log(response.data.access);
    //           return response.data.access;
    //         });
    //       // await this.refreshAccessToken();
    //       let access_token = await x;
    //       console.log("here2");
    //       console.log(access_token);
    //       axios.defaults.headers.common["Authorization"] =
    //         "Bearer " + access_token;
    //       localStorage.setItem("accessToken", "Bearer " + access_token);

    //       return axiosApiInstance(originalRequest);
    //     }
    //   }

    //   return Promise.reject(error);
    // }
    // );

    const result = await axiosApiInstance.get(
      APILINK + "/categories/?limit=10"
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
    this.getCategories();
  }

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
  onSearch = (e) => {
    console.log(e.target);
    this.setState({ keyWord: e.target.value });
    let x = this.state.tableData.filter(
      (item) =>
        (item.name &&
          item.name.toLowerCase().includes(e.target.value.toLowerCase())) ||
        (item.username &&
          item.username.toLowerCase().includes(e.target.value.toLowerCase()))
    );
    console.log(x);
    this.setState({ tableData: x });
    if (e.target.value === "") {
      this.getCategories();
    }
  };
  show = (e) => {
    this.setState({ showMsg: true, proId: e.target.id });
    console.log(e.target.id);
  };
  hide = (e) => {
    this.setState({ showMsg: false });
  };

  deleteCategory = async (e) => {
    console.log("deleted");
    // var newID = this.props.user.id.replace(/-/g, "");
    const res = await axiosApiInstance
      .delete(APILINK + `/category/${this.state.proId}`)
      .then((res) =>
        this.setState((state, props) => {
          return { showMsg: false };
        })
      )
      .catch((err) => console.log(err));
    console.log(res);
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevState.showMsg !== this.state.showMsg) {
      this.getCategories();
    }
  }
  render() {
    return (
      <div>
        <Container
          style={{ marginTop: "100px", marginLeft: "350px" }}
          className="pt-3"
        >
          <Row>
            <Col className="mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-sitemap pr-2"></i>Categories{" "}
              </h2>
            </Col>
          </Row>
          <Row>
            <Col sm={8}></Col>
            <Col style={{ textAlign: "end" }} sm={4}>
              <Link to="/add_category">
                {" "}
                <Button className="headBtn"> Add Category</Button>
              </Link>
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
        <Modal show={this.state.showMsg} onHide={this.hide}>
          <Container className="p-4">
            <Row>
              <Col className="text-center" sm={12}>
                {" "}
                <h6>Are u sure u want to delete this product?</h6>
              </Col>
              <Row style={{ margin: "auto" }}>
                <Col md={12}>
                  <Button onClick={this.deleteCategory} className="headBtn">
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

export default ErrorHandler(Categories, axiosApiInstance);
// export default Categories
