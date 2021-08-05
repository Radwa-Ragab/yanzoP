import React, { Component } from "react";
import { Container } from "react-bootstrap";
import { Form, Input, Button, Row, Col } from "antd";

//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { userLogin, LogOut } from "../global-state/actions/authActions";
import logo from '../imgs/logo.png'
class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      BeErr: "",
    };
  }

  handleName = (e) => {
    this.setState({ email: e.target.value });
  };
  handlepass = (e) => {
    this.setState({ password: e.target.value });
  };

  onLogin = async (e) => {
    let loginrequest = {};
    loginrequest.email = this.state.email;
    loginrequest.password = this.state.password;

    const userData = await this.props.userLogin(
      loginrequest,
      this.props.history
    );
    // console.log(userData);
    if (userData) {
      this.setState({ BeErr: userData });
    }
  };

  componentDidMount() {
    this.props.LogOut();
  }

  onFinish = (values) => {
    // console.log("Success:", values);
  };

  onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  render() {
    return (
      <div>
        <Container
          className="py-3"
        >
          {/* <h3>Login page</h3> */}
          <Form
            name="basic"
            initialValues={{ remember: true }}
            onFinish={this.onFinish}
            onFinishFailed={this.onFinishFailed}
            style={{background:'white',margin:'30px auto 0px auto',padding:'50px 100px',borderRadius:'20px',width:'50%' }}

          >
            <img style={{width:'100px',height:'50px',marginBottom:'20px'}} src={logo} />
            <h1 style={{fontFamily: "Poppins, sansSerif"}}>Login to Yanzo</h1>
            <Form.Item
             
              name="Email"
              rules={[{ required: true, message: "Please input your User name or Email!" }]}
            >
              <Input className="loginInput"  placeholder="User name or Email" onChange={this.handleName} type="text" />
            </Form.Item>

            <Form.Item
              // label="Password"
              name="password"
              rules={[
                { required: true, message: "Please input your password!" },
              ]}
            >
              <Input.Password
                value={this.state.password}
                onChange={this.handlepass}
                placeholder="password"
                className="loginInput"
              />
            </Form.Item>
            {/* 
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Remember me</Checkbox>
            </Form.Item> */}

            <Form.Item>
              <Button className="loginBtn" onClick={this.onLogin} type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Row>
            <Col style={{ margin: "auto",textAlign:'center' }} sm={12}>
              {this.state.BeErr !== "" ? (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  {this.state.BeErr}
                </p>
              ) : null}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ userLogin, LogOut }, dispatch);
};
export default connect(null, mapDispatchToProps)(Login);
