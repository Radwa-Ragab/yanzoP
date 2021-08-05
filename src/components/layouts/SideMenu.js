import React, { Component } from "react";
import "../../style-sheets/sideMenu.css";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <aside className="my-menu">
        {this.props.user.user_type === "2" ? (
          <ul className="side-list">
            <li style={{ paddingBottom: "50px" }}>
              {" "}
              <NavLink
                to="/home"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-home pr-2"></i>Home
              </NavLink>
            </li>
            <li>
              {" "}
              <NavLink
                to="/employees"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-shopping-basket pr-2"></i>Employees
              </NavLink>
            </li>
            <li>
              {" "}
              <NavLink
                to="/products"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-shopping-basket pr-2"></i>Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/key"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-search-plus pr-2"></i>Keyword
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/requests"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-clipboard-list pr-2"></i>Requests
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-cart-arrow-down pr-2"></i>Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/branches"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-building pr-2"></i>Branches
              </NavLink>
            </li>
            {/* <li>
              <NavLink
                to="/categories"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i class="fas fa-sitemap pr-2"></i>Categories
              </NavLink>
            </li> */}
          </ul>
        ) : this.props.user.is_staff === true ? (
          <ul className="side-list">
            <li style={{ paddingBottom: "50px" }}>
              {" "}
              <NavLink
                to="/agent_home"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-home pr-2"></i>Home
              </NavLink>
            </li>
            <li>
              {" "}
              <NavLink
                to="/all_agents"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-users pr-2"></i>All Agents
              </NavLink>
            </li>
            <li>
              {" "}
              <NavLink
                to="/suppliers"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-shopping-basket pr-2"></i>All Suppliers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/view_all_courier"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                 <i className="fas fa-truck pr-2"></i>All Couriers
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/requests"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-clipboard-list pr-2"></i>Requests
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-cart-arrow-down pr-2"></i>Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/categories"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-sitemap pr-2"></i>Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/key"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-search-plus pr-2"></i>Keyword
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/courier_orders"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
               <i className="fas fa-shopping-cart pr-2"></i>Courier Orders
              </NavLink>
            </li>
          </ul>
        ) : (
          <ul className="side-list">
            <li style={{ paddingBottom: "50px" }}>
              {" "}
              <NavLink
                to="/agent_home"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-home pr-2"></i>Home
              </NavLink>
            </li>
           
            <li>
              {" "}
              <NavLink
                to="/suppliers"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-shopping-basket pr-2"></i>All Suppliers
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/view_all_courier"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
               <i className="fas fa-truck pr-2"></i>All Couriers
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/requests"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-clipboard-list pr-2"></i>Requests
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/orders"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-cart-arrow-down pr-2"></i>Orders
              </NavLink>
            </li>

            <li>
              <NavLink
                to="/categories"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-sitemap pr-2"></i>Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/key"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
                <i className="fas fa-search-plus pr-2"></i>Keyword
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/courier_orders"
                exact
                //   className="navitem mynavitem"
                activeClassName="navitem-active"
              >
               <i className="fas fa-shopping-cart pr-2"></i>Courier Orders
              </NavLink>
            </li>
          </ul>
        )}
      </aside>
    );
  }
}

const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
  user: state.auth.user,
});

export default connect(mapStateToProps, null)(Header);
