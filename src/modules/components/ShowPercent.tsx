/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable eqeqeq */
import React, { Component } from 'react';

interface showPercent {
  num: number | String
}

class ShowPercent extends Component<showPercent> {

  showPercent = (a: number | String) => {
    if( a == 0){
      return (
        <React.Fragment>
            <span style={{color: "#FFBE02"}}> {a}% &nbsp;</span>
            <div className="dropdown show-dropdown">
              <a href="#" data-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-angle-double-right" style={{color: "#FFBE02", marginRight: "7px"}}></i>
              </a>
              <ul className="dropdown-menu percent-o">
                <li className="header-title"> Không thay đổi </li>
              </ul>
           </div>
        </React.Fragment>
      )
    }
    else if (a > 0){
      return (
        <React.Fragment>
          <span style={{color: "#09f219"}}> + {a}% &nbsp;</span>
          <div className="dropdown show-dropdown">
              <a href="#" data-toggle="dropdown" aria-expanded="false">
                <i className="fas fa-angle-double-up" style={{color: "#09f219", marginRight: "7px"}}></i>
              </a>
              <ul className="dropdown-menu percent-o">
                <li className="header-title" > Tăng {a}% </li>
              </ul>
           </div>
        </React.Fragment>
      )
    }
    return (
      <React.Fragment>
        <span style={{color: "#ff0000"}}> {a}% &nbsp;</span>
        <div className="dropdown show-dropdown">
          <a href="#" data-toggle="dropdown" aria-expanded="false">
            <i className="fas fa-angle-double-down" style={{color: "#ff0000", marginRight: "7px"}}></i>
          </a>
          <ul className="dropdown-menu percent-o">
            <li className="header-title" > Giảm {-a}% </li>
          </ul>
        </div>
      </React.Fragment>
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.showPercent(this.props.num)}
      </React.Fragment>
    );
  }
}

export default ShowPercent;