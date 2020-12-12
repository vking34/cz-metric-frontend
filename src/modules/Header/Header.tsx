import React, { Component } from 'react'
import { Link } from 'react-router-dom'

export default class Header extends Component {
  render() {
    return (
      <div className="wrapper">
      <div className="sidebar">
        <div className="logo">
          <Link to="#" className="simple-text">
            CZ_Analytic
          </Link>
        </div>
        <div className="logo logo-mini">
          <Link to="#" className="simple-text">
            CZ
          </Link>
        </div>
        <div className="sidebar-wrapper">
          <ul className="nav">
            <li>
              <Link to="/">
                <i className="material-icons">dashboard</i>
                <p>Thông báo</p>
              </Link>
            </li>
            <li>
              <Link
                data-toggle="collapse"
                to="#layouts"
                className="collapsed"
                aria-expanded="false"
              >
                <i className="material-icons">aspect_ratio</i>
                <p>
                  Chỉ số 
                  <b className="caret" />
                </p>
              </Link>
              <div
                className="collapse"
                id="layouts"
                aria-expanded="false"
                style={{ height: "0px" }}
              >
                <ul className="nav">
                  <li>
                    <Link to="/impression">Impressions</Link>
                  </li>
                  <li>
                    <Link to="/clicks">Clicks </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div className="main-panel">
        <nav
          className="navbar navbar-default navbar-absolute"
          data-topbar-color="blue"
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
                Flot Charts
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
                    to="#pablo"
                    className="dropdown-toggle"
                    data-toggle="dropdown"
                  >
                    <i className="material-icons">person</i>
                    <p className="hidden-lg hidden-md">Profile</p>
                  </Link>
                </li>
                <li>
                  <Link
                    to="#pablo"
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
          
        <footer className="footer">
          <div className="container-fluid">
            <nav className="pull-left">
              <ul>
                <li>
                  <Link to="#">Home</Link>
                </li>
                <li>
                  <Link to="#">Documentation</Link>
                </li>
                <li>
                  <Link to="#">Contact</Link>
                </li>
                <li>
                  <Link to="#">Support</Link>
                </li>
              </ul>
            </nav>
            <p className="copyright pull-right">
              ©<Link to="#">CZ</Link>
            </p>
          </div>
        </footer>
      
        </div>
      </div>
    )
  }
}
