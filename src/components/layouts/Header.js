import React, { Component } from "react";
import {
  Navbar,
  Form,
  Nav,
  FormControl,
  NavDropdown,
  Dropdown,
} from "react-bootstrap";
import "../../style-sheets/header.css";
import logo from "../../imgs/logo.png";
//redux
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { LogOut } from "../../global-state/actions/authActions";
class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onLogout = (e) => {
    this.props.LogOut();
  };

  render() {
    return (
      <div>
        <Navbar fixed="top" className="myNav" bg="light" expand="lg">
          <Navbar.Brand href="/">
            <img className="img-fluid logo" src={logo} alt="logo" />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav style={{ paddingLeft: "5%" }} className="mr-auto"></Nav>

            <NavDropdown
              className="adminDrop"
              title={
                this.props.user.email
                  ? this.props.user.email.split("@")[0]
                  : "Admin"
              }
              id="basic-nav-dropdown"
            >
              {this.props.user.user_type === "2" ? (
                <React.Fragment>
                  <NavDropdown.Item href="/profile">
                    <i class="far fa-user pr-2"></i>Profile
                  </NavDropdown.Item>
                  <NavDropdown.Item href="/update_credentials">
                    <i class="fas fa-cog pr-2"></i>Credentials
                  </NavDropdown.Item>
                  <NavDropdown.Item onClick={this.onLogout} href="/">
                    <i class="fas fa-sign-out-alt pr-2"></i>Log out
                  </NavDropdown.Item>
                </React.Fragment>
              ) : (
                <React.Fragment>
                  {/* <NavDropdown.Item href="/profile">
                    <i class="far fa-user pr-2"></i>Profile
                  </NavDropdown.Item> */}
                  <NavDropdown.Item href="/update_credentials">
                    <i class="fas fa-cog pr-2"></i>Credentials
                  </NavDropdown.Item>

                  <NavDropdown.Item onClick={this.onLogout} href="/">
                    <i class="fas fa-sign-out-alt pr-2"></i>Log out
                  </NavDropdown.Item>
                </React.Fragment>
              )}
            </NavDropdown>
          </Navbar.Collapse>
        </Navbar>
      </div>
    );
  }
}
const mapStateToProps = (state) => ({
  user: state.auth.user,
});
const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({ LogOut }, dispatch);
};
export default connect(mapStateToProps, mapDispatchToProps)(Header);
