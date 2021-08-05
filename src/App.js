import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import Products from "./components/supplier-pages/Products";
import Home from "./components/supplier-pages/Home";

import Profile from "./components/supplier-pages/Profile";
import Keywords from "./components/supplier-pages/Keywords";
import Requests from "./components/supplier-pages/Requests";
import Orders from "./components/supplier-pages/Orders";
import Branches from "./components/supplier-pages/Branches";
import Categories from "./components/supplier-pages/Categories";
import Credentials from "./components/supplier-pages/Credentials";

import Add_product from "./components/supplier-pages/Add_product";
import Add_category from "./components/supplier-pages/Add_category";
import Add_branch from "./components/supplier-pages/Add_branch";
import ViewProduct from "./components/edit_view sections/ViewProduct";
import EditProduct from "./components/edit_view sections/EditProduct";
import ViewBranch from "./components/edit_view sections/ViewBranch";
import EditBranch from "./components/edit_view sections/EditBranch";
import Login from "./components/Login";
import Header from "./components/layouts/Header";
import SideMenu from "./components/layouts/SideMenu";
import Footer from "./components/layouts/Footer";
import AgentHome from "./components/agent-view/AgentHome";
import ViewSuppliers from "./components/agent-view/ViewSuppliers";
import Add_KeyWord from "./components/edit_view sections/Add_KeyWord";
// import ViewMap from './components/ViewMap'
// import GetCoordinates from './components/GetCoordinates'
import AddVehicle from "./components/agent-view/courier/vehicles/AddVehicle";
import { connect } from "react-redux";
import ViewVehicles from "./components/agent-view/courier/vehicles/ViewVehicles";
import EditVehicle from "./components/agent-view/courier/vehicles/EditVehicle";
import ViewDeliveryServices from "./components/agent-view/courier/delivery_services/ViewDeliveryServices";
import EditDeliveryServices from "./components/agent-view/courier/delivery_services/EditDeliveryServices";
import AddDelieveryServices from "./components/agent-view/courier/delivery_services/AddDelieveryServices";
import AddCourier from "./components/agent-view/courier/courier_services/AddCourier";
import axios from "axios";
import AllCouriers from "./components/agent-view/courier/AllCouriers";
import EditCourier from "./components/agent-view/courier/courier_services/EditCourier";
import AddCourierService from "./components/agent-view/courier/courier_services/AddCourierService";
import ViewCourierServices from "./components/agent-view/courier/courier_services/ViewCourierServices";
import EditCourierService from "./components/agent-view/courier/courier_services/EditCourierService";
import AddSupplier from "./components/agent-view/AddSupplier";
import EditCategory from "./components/edit_view sections/EditCategory";
import ViewCouriers from "./components/agent-view/courier/ViewCouriers";
import AllSuppliers from "./components/agent-view/AllSuppliers";
import EditSupplier from "./components/agent-view/EditSupplier";
import TestList from "./components/agent-view/TestList";
import TestDetails from "./components/agent-view/TestDetails";
import CourierOrders from "./components/agent-view/courier/CourierOrders";
import CourierOrderDetails from "./components/agent-view/courier/CourierOrderDetails";
import CreateAgent from "./components/agent-view/CreateAgent";
import AllAgents from "./components/agent-view/AllAgents";
import EditAgent from "./components/agent-view/EditAgent";
import ViewRequestDetails from "./components/agent-view/ViewRequestDetails";
import CreateEmployee from "./components/supplier-pages/CreateEmployee";
import AllEmployees from "./components/supplier-pages/AllEmployees";
import EditEmployee from "./components/supplier-pages/EditEmployee";

class App extends Component {
  componentDidMount() {
    // this.setInterceptors();
  }
  setInterceptors = () => {
    axios.defaults.headers.common["Authorization"] = localStorage.getItem(
      "accessToken"
    );
  };

  render() {
    return (
      <Router>
        <div className="App">
          {/* <h1>hello</h1> */}
          {this.props.isAuth === true ? (
            <React.Fragment>
              <Header />
              <SideMenu />
              <Route exact path="/home" component={Home} />
          <Route exact path="/products" component={Products} />
          <Route exact path="/add_supplier" component={AddSupplier} />
          <Route exact path="/edit_category/:id" component={EditCategory} />
          <Route exact path="/view_couriers" component={ViewCouriers} />
          <Route exact path="/suppliers" component={AllSuppliers} />
          <Route exact path="/edit_supplier/:id" component={EditSupplier} />
          <Route exact path="/test" component={TestList} />
          <Route exact path="/details_test" component={TestDetails} />
          <Route exact path="/update_credentials" component={Credentials} />
          <Route exact path="/add_agent" component={CreateAgent} />
          <Route exact path="/all_agents" component={AllAgents} />
          <Route exact path="/add_product" component={Add_product} />
          <Route exact path="/view_product/:id" component={ViewProduct} />
          <Route exact path="/view_branch/:id" component={ViewBranch} />
          <Route exact path="/edit_branch/:id" component={EditBranch} />
          <Route exact path="/edit_product/:id" component={EditProduct} />
          <Route exact path="/agent_home" component={AgentHome} />
          <Route exact path="/view_suppliers" component={ViewSuppliers} />
          <Route exact path="/add_key" component={Add_KeyWord} />
          <Route exact path="/add_courier" component={AddCourier} />
          <Route exact path="/view_all_courier" component={AllCouriers} />
          <Route exact path="/edit_courier/:id" component={EditCourier} />
          <Route exact path="/edit_agent/:id" component={EditAgent} />

          <Route exact path="/add_service/:id" component={AddCourierService} />
          <Route
            exact
            path="/edit_service/:id"
            component={EditCourierService}
          />
          <Route exact path="/courier_orders" component={CourierOrders} />
          <Route
            exact
            path="/courier_order_details/:id"
            component={CourierOrderDetails}
          />

          <Route
            exact
            path="/view_service/:id"
            component={ViewCourierServices}
          />

          <Route exact path="/add_Vehicle" component={AddVehicle} />
          <Route exact path="/view_Vehicle" component={ViewVehicles} />
          <Route exact path="/edit_vehicle/:id" component={EditVehicle} />
          <Route
            exact
            path="/view_delivery_service"
            component={ViewDeliveryServices}
          />
          <Route exact path="/add_service" component={AddDelieveryServices} />

          <Route
            exact
            path="/edit_delivery_service/:id"
            component={EditDeliveryServices}
          />

          <Route exact path="/edit_category" component={EditCategory} />


          <Route exact path="/add_category" component={Add_category} />
          <Route exact path="/add_branch" component={Add_branch} />

          <Route exact path="/profile" component={Profile} />
          <Route exact path="/key" component={Keywords} />
          <Route exact path="/requests" component={Requests} />
          <Route exact path="/orders" component={Orders} />
          <Route exact path="/branches" component={Branches} />
          <Route exact path="/categories" component={Categories} />
          <Route exact path="/view_request_details/:id" component={ViewRequestDetails} />
          <Route exact path="/add_employee" component={CreateEmployee} />
          <Route exact path="/employees" component={AllEmployees} />
          <Route exact path="/edit_employee/:id" component={EditEmployee} />

          
          <Footer />
            </React.Fragment>
          ) : null}

          <Route exact path="/" component={Login} />
         
        </div>
      </Router>
    );
  }
}
const mapStateToProps = (state) => ({
  isAuth: state.auth.isAuth,
});

export default connect(mapStateToProps, null)(App);
