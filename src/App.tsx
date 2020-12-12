import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { observer } from "mobx-react";

import "./css/bootstrap.min.css";
import 'rsuite/dist/styles/rsuite-default.css'
import "./css/demo.css";
import "./css/turbo.css";
import "./App.css";
// san trong may
import Analytic from "./modules/analytic/Analytic"
import Impression from "./modules/impression/Impression";
import Click from "./modules/click/Click";
import Product from "./modules/product/Product"
import NotFound from "./modules/NotFound/NotFound"
import User from "./modules/User/User";
import Order from "./modules/order/Order"
import {commonStore} from "./common/commonStore";

@observer
export default class App extends Component {
  
  urlProduct = `/products?start_date&end_date`;
  urlImpression = `/impressions?start_date&end_date`;
  urlClick = `/clicks?start_date&end_date`;
  urlUser = `/users?start_date&end_date`;
  urlOrder = `/orders?start_date&end_date`;

  render() {
    window.scroll(0,0);
    return (
      <div>
        <Router>
          <div className="wrapper">
            <div className="sidebar slidebar-fix">
              <div className="logo" style={{background: "#383D41"}}>
                <Link to="#" className="simple-text" style={{color: "#fff"}}>
                  <img src="/assets/img/logo.png" alt="logo" style={{width: "50px"}} />
                  &nbsp; Analytic
                </Link>
              </div>
              <div className="logo logo-mini" style={{background: "#383D41"}}>
                <Link to="#" className="simple-text">
                  <img src="/assets/img/logo.png" alt="logo" style={{width: "50px"}} />
                </Link>
              </div>
              <div className="sidebar-wrapper">
                <ul className="nav">
                  <li>
                    <Link to="/" onClick={()=> commonStore.setNamePage("Home")}>
                      <i className="fas fa-home"></i>
                      <p>Home</p>
                    </Link>
                  </li>
                  <li>
                    <Link to={this.urlImpression}  onClick={()=> commonStore.setNamePage("Impressions")}>
                      <i className="fas fa-eye"></i>
                      <p>Impressions</p>
                    </Link>
                  </li>
                  <li>
                    <Link to={this.urlClick}  onClick={()=> commonStore.setNamePage("Clicks")}>
                      <i className="fas fa-mouse"></i>
                      <p>Clicks</p>
                    </Link>
                  </li>
                  <li>
                    <Link to={this.urlUser}  onClick={()=> commonStore.setNamePage("User Register")}>
                      <i className="fas fa-user"></i>
                      <p>Users Register</p>
                    </Link>
                  </li>
                  <li>
                    <Link to={this.urlProduct}  onClick={()=> commonStore.setNamePage("Products")}>
                      <i>
                        <img src="/assets/icon/product.png" alt="products" style={{width: "32px"}} />
                      </i>
                      <p>Products</p>
                    </Link>
                  </li>
                  <li>
                    <Link to={this.urlOrder}  onClick={()=> commonStore.setNamePage("Orders")}>
                      <i className="fas fa-shopping-cart"></i>
                      <p>Orders</p>
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="main-panel">
              <nav
                className="navbar navbar-default navbar-absolute"
                data-topbar-color="blue"
                id="nav-main"
              >
                <div className="container-fluid">
                  <div className="navbar-minimize">
                    <button
                      id="minimizeSidebar"
                      className="btn btn-round btn-white btn-fill btn-just-icon"
                    >
                      <i className="material-icons visible-on-sidebar-regular f-26">
                        keyboard_arrow_left
                      </i>
                      <i className="material-icons visible-on-sidebar-mini f-26">
                        keyboard_arrow_right
                      </i>
                    </button>
                  </div>
                  <div className="navbar-header">
                    <button
                      type="button"
                      className="navbar-toggle"
                      data-toggle="collapse"
                    >
                      <span className="sr-only">Toggle navigation</span>
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                      <span className="icon-bar" />
                    </button>
                    <Link className="navbar-brand" to="#">
                      {/* {this.title} */}
                      {commonStore.namePage}
                    </Link>
                  </div>
                  <div className="collapse navbar-collapse">
                    <ul className="nav navbar-nav navbar-right">
                      <li className="dropdown">
                        <Link
                          to="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          <i className="material-icons">notifications</i>
                          <span className="notification">1</span>
                          <p className="hidden-lg hidden-md">
                            Notifications
                            <b className="caret" />
                          </p>
                        </Link>
                        <ul className="dropdown-menu">
                          <li>
                            <Link to="#">You have 1 new messages</Link>
                          </li>
                        </ul>
                      </li>
                      <li>
                        <Link
                          to="#pablo"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          <i className="material-icons">apps</i>
                          <p className="hidden-lg hidden-md">Apps</p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          <i className="material-icons">person</i>
                          <p className="hidden-lg hidden-md">Profile</p>
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="#"
                          className="dropdown-toggle"
                          data-toggle="dropdown"
                        >
                          <i className="material-icons">settings</i>
                          <p className="hidden-lg hidden-md">Settings</p>
                        </Link>
                      </li>
                      <li className="separator hidden-lg hidden-md" />
                    </ul>
                  </div>
                </div>
              </nav>

              <Switch>
                <Route exact path="/" component={Analytic} />
                <Route exact path="/impressions" component={Impression} />
                <Route exact path="/clicks" component={Click} />
                <Route exact path="/users" component={User} />
                <Route exact path="/orders" component={Order} />
                <Route exact path="/products" component={Product} />
                <Route exac path="/404.html" component={NotFound} />
                <Redirect to="/404.html" />
              </Switch>

            </div>
          </div>
        </Router>
        </div>
    );
  }
}
