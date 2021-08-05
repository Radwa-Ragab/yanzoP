import React, { Component } from "react";
import { Container, Row, Col, Form, Button } from "react-bootstrap";
// import { Link } from "react-router-dom";
import "../../style-sheets/products.css";
import axios from "axios";
import "antd/dist/antd.css";
import { Select } from "antd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { connect } from "react-redux";
import { APILINK } from "../../Endpoint";
import ErrorHandler from "../../ErrorHandler/ErrorHandler";

const axiosApiInstance = axios.create();

class EditProduct extends Component {
  constructor() {
    super();
    this.state = {
      name: "",
      price: "",
      code: "",
      quantity: "",
      supplier: "",
      category: [],
      selectedKeys: [],
      selectedCat: [],
      selectedKeysID: [],
      selectedCatID: [],
      keywords: [],
      selectedFile: null,
      imgsrc: "",
    };
  }

  onHandleInput = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };
  getCategories = async () => {
    const result = await axiosApiInstance
      .get(APILINK + `/categories/`)

      .then((res) => {
        // console.log(res);

        this.setState({ category: res.data });
      });
  };
  getKeys = async () => {
    var newID = this.props.user.id.replace(/-/g, "");
    const result = await axiosApiInstance
      .get(APILINK + `/keywords/?supplier=${newID}`)
      .then((result) =>
        // console.log(result)
        this.setState({ keywords: result.data })
      );
  };
  async componentDidMount() {
    this.getCategories();
    this.getKeys();

    const result = await axiosApiInstance
      .get(APILINK + `/products/?id=${this.props.match.params.id}`)
      .then((res) => {
        console.log(res.data);
        res.data.map((d) => {
          this.setState({
            name: d.name,
            code: d.code,
            price: d.price,
            quantity: d.quantity,
            selectedCat: d.category,
            selectedKeys: d.keyword,
          });
          d.category.map((cat) => {
            this.state.category.map((c) => {
              if (cat === c.name) {
                let test = [];
                test.push(c.id);
                this.setState({ selectedCatID: test });
                // console.log(test)
              }
            });
          });
          if (d.image !== "") {
            this.setState({ imgsrc: d.image });
          }
          d.keyword.map((key) => {
            this.state.keywords.map((k) => {
              if (key === k.name) {
                let test = [];
                test.push(k.id);
                console.log(k.id);
                console.log(test);
                this.setState({ selectedKeysID: test });
              }
            });
          });
        });
      });
  }

  editProduct = async () => {
    let data;
    if (this.state.selectedKeysID.length !== 0) {
      data = {
        name: this.state.name,
        price: this.state.price,
        code: this.state.code,
        quantity: this.state.quantity,
        keyword: this.state.selectedKeysID,
        category: this.state.selectedCatID,
        // image: null,
      };
    } else {
      data = {
        name: this.state.name,
        price: this.state.price,
        code: this.state.code,
        quantity: this.state.quantity,
        // keyword: this.state.selectedKeys,
        category: this.state.selectedCatID,
        // image: null,
      };
    }

    if (this.state.selectedFile !== null) {
      const eventdata = new FormData();
      // let x = [];
      // x.push(this.state.selectedCat);
      // console.log(x);
      eventdata.append("image", this.state.selectedFile);
      eventdata.append("name", this.state.name);
      eventdata.append("price", this.state.price);
      eventdata.append("code", this.state.code);
      eventdata.append("quantity", this.state.quantity);
      if (this.state.selectedKeysID.length !== 0) {
        for (var i = 0; i < this.state.selectedKeys.length; i++) {
          eventdata.append("keyword", this.state.selectedKeys[i]);
        }
      }
      for (var i = 0; i < this.state.selectedCatID.length; i++) {
        eventdata.append("category", this.state.selectedCatID[i]);
      }

      const result = await axiosApiInstance.put(
        APILINK + `/product/${this.props.match.params.id}`,
        eventdata
      );
      if (result) {
        if (result.data === "") {
          setTimeout(() => {
            toast.info(`Product was updated successfully`);
          }, 500);
        }
      }
    } else {
      const result = await axiosApiInstance.put(
        APILINK + `/product/${this.props.match.params.id}`,
        data
      );
      if (result) {
        if (result.data === "") {
          setTimeout(() => {
            toast.info(`Product was updated successfully`);
          }, 500);
        }
      }
    }
  };

  handleChange = (v, e) => {
    console.log(e);
    let keysID = [];
    let keysName = [];

    e.map((key) => {
      keysID.push(key.id);
      keysName.push(key.value);
    });
    this.setState({selectedKeys:keysName,selectedKeysID:keysID})
  };

  handleCate = (v, e) => {
    this.setState({
      selectedCat: [e.value],
      selectedCatID: [e.id],
    });
    // console.log(e);
  };

  onFileUpload = (e) => {
    e.preventDefault();
    this.setState({ selectedFile: e.target.files[0] });
  };

  onSearch = (val) => {
    console.log("search:", val);
  };
  render() {
    console.log(this.state.selectedKeysID);
    return (
      <div>
        <Container
          style={{ marginTop: "120px", marginLeft: "300px" }}
          className="addP"
        >
          <Row>
            <Col className="p-4 mb-4" style={{ textAlign: "initial" }} sm={12}>
              <h2>
                {" "}
                <i class="fas fa-shopping-basket"></i> Edit Products
              </h2>
            </Col>
          </Row>
          <Form>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Name"
                  value={this.state.name}
                  name="name"
                  onChange={this.onHandleInput}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Code"
                  value={this.state.code}
                  name="code"
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Category</Form.Label>
                <Select
                  // mode="multiple"
                  showSearch
                  placeholder="select category"
                  value={this.state.selectedCat}
                  onChange={this.handleCate}
                  style={{ width: "100%" }}
                  onSearch={this.onSearch}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.category.map((item) => (
                    <Select.Option key={item.id} id={item.id} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>KeyWords</Form.Label>
                <Select
                  showSearch
                  mode="multiple"
                  placeholder="Select keywords"
                  value={this.state.selectedKeys}
                  onChange={this.handleChange}
                  style={{ width: "100%" }}
                  onSearch={this.onSearch}
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {this.state.keywords.map((item) => (
                    <Select.Option key={item.id} id={item.id} value={item.name}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={6}>
                <Form.Label>Price</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Price"
                  value={this.state.price}
                  name="price"
                  onChange={this.onHandleInput}
                />
              </Col>
              <Col sm={12} md={6}>
                <Form.Label>Quantity</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Quantity"
                  value={this.state.quantity}
                  name="quantity"
                  onChange={this.onHandleInput}
                />
              </Col>
            </Row>
            <Row className="mb-3">
              <Col sm={12} md={12}>
                <Form.Label>Image</Form.Label>
                <form>
                  <input
                    onChange={this.onFileUpload}
                    type="file"
                    id="myFile"
                    name="filename"
                  />
                </form>
              </Col>
            </Row>
            {/* <img src={require('/media/Product_images/test-img_SubyurH.png')} /> */}
            <Row>
              <Col style={{ textAlign: "center" }} sm={12}>
                <Button className="addBtn1">Cancel</Button>
                <Button onClick={this.editProduct} className="addBtn2">
                  Edit
                </Button>
              </Col>
            </Row>
          </Form>
          <ToastContainer position="bottom-right" />
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
)(ErrorHandler(EditProduct, axiosApiInstance));
