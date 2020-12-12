/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import { Line } from "react-chartjs-2";
import { observer } from "mobx-react";

import { callApi } from "../../utils/callAPI";
import { Moment } from "../../common/Moment";
import { setPerent, setLabels, setData, setTotal, setColorLine } from "../../common/Handler";
import { userStore } from "./userStore";
import myClickParam from "./components/myUserParam";
import ShowPercent from "../components/ShowPercent";
import { commonStore } from "../../common/commonStore";
import { numberWithCommas } from "../../common/BaseFunction";

// const { allowedMaxDays, afterToday, combine } = DateRangePicker;

interface ClickProps {
  history: { push: (path: string) => any };
  location: { search: string };
}

@observer
export default class Click extends Component<ClickProps, any> {

  componentDidMount() {
    commonStore.setNamePage("Users Register")
    this.requestAPI();
  }

  componentDidUpdate(prevProps: Readonly<ClickProps>, prevState: Readonly<any>, snapshot?: any) {
    if(prevProps.location.search !== this.props.location.search){
      this.requestAPI()
    }
  }
  requestAPI = async () => {
    if(this.props.location.search){
      const params = new myClickParam(this.props.location.search)
      userStore.startDate = params.getStartDate;
      userStore.endDate = params.getEndDate;
      userStore.startDate2 = userStore.setMinusTime();
      const resultApi = await callApi(
        `/v1/logs/statistics/user-registries?start_date=${userStore.startDate}&end_date=${userStore.endDate}`,
        // `/v1/logs/statistics/user-registries?start_date=2020-09-03&end_date=2020-09-10`,
        "GET",
        {},
        false
      );
      // console.log("resultapi : ", resultApi);
      const resultApi2 = await callApi(
        `/v1/logs/statistics/user-registries?start_date=${userStore.startDate2}&end_date=${userStore.startDate}`,
        // `/v1/logs/statistics/user-registries?start_date=2020-09-03&end_date=2020-09-10`,
        "GET",
        {},
        false
      );  
      
      if (resultApi.result.status === 200 && resultApi2.result.status === 200) {
        userStore.data = resultApi.result.data.data;
        userStore.data2 = resultApi2.result.data.data;
        userStore.labels = setLabels(userStore.data);
        userStore.percentAll = setPerent(setTotal(userStore.data, 'total'),setTotal(userStore.data2, 'total'));
        userStore.percentBuyer = setPerent(setTotal(userStore.data, 'buyers'),setTotal(userStore.data2, 'buyers'));
        userStore.percentSeller = setPerent(setTotal(userStore.data, 'sellers'),setTotal(userStore.data2, 'sellers'));
      }
    
    };
  }
  getDateSelect = (e: any) => {
    userStore.startDate = Moment.getDate(e[0].getTime(), "yyyy-mm-dd");
    userStore.endDate = Moment.getDate(e[1].getTime(), "yyyy-mm-dd");
    this.props.history.push(`/users?start_date=${userStore.startDate}&end_date=${userStore.endDate}`)
  };

  render() {
    return (
      <React.Fragment>
  
        <div className="content">
          <div className="container-fluid">
            <div className="filter-main">
                          
              <div className="dropdown show-dropdown option-main">
                <span data-toggle="dropdown" aria-expanded="false" >
                  <a>{userStore.option.toUpperCase()} &nbsp;
                  <i className="fas fa-angle-down"></i>    
                  </a>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#" onClick={()=> userStore.optionClick("showAll")}>All USERS</a>
                  </li>
                  <li>
                    <a href="#" onClick={()=> userStore.optionClick("buyers")}>BUYERS</a>
                  </li>
                  <li>
                    <a href="#" onClick={()=> userStore.optionClick("sellers")}>SELLERS</a>
                  </li>
                </ul>
              </div>
              
              <DateRangePicker
                format="MMM D, YYYY"
                value={[
                  new Date(`${userStore.startDate}`),
                  new Date(`${userStore.endDate}`),
                ]}
                // disabledDate={combine(allowedMaxDays(7), afterToday())}
                onOk={(e) => this.getDateSelect(e)}
              />

            </div>
            {userStore.data.length > 0 && (
              <React.Fragment>
                <div className="row">
                  
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-warning">
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total All</p>
                        <h3 className="card-title">
                          <i className="fas fa-user"  style={{color: "#f54b24"}}></i>
                          {numberWithCommas(setTotal(userStore.data, 'total'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={userStore.percentAll} />
                          {/* {this.showPercent(userStore.percentAll)} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-warning">
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total Buyers</p>
                        <h3 className="card-title">
                          <i className="fas fa-user"  style={{color: "#1cf92d"}}></i>
                          {numberWithCommas(setTotal(userStore.data, 'buyers'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={userStore.percentBuyer} />
                          {/* {this.showPercent(userStore.percentBuyer)} */}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-rose">
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total Sellers</p>
                        <h3 className="card-title">
                        <i className="fas fa-user"  style={{color: "#f4427d"}}></i>
                        {numberWithCommas(setTotal(userStore.data, 'sellers'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={userStore.percentSeller} />
                          {/* {this.showPercent(userStore.percentSeller)}  */}
                        </div>
                      </div>
                    </div>
                  </div>
                
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12" style={{marginBottom: "15px", marginTop:"15px"}}>
                        { userStore.showOnlyLine ? 
                          <React.Fragment>
                            <h5> Users</h5>
                            <Line 
                              data={{
                                labels: userStore.labels,
                                datasets: [
                                  {...setColorLine(setData(userStore.data, `${userStore.option}`), `${userStore.option.toUpperCase()}`, "#f54b24" )},
                                ],
                              }}
                              options={{
                                title: {
                                  display: true,
                                },
                                legend: {
                                  display: true,
                                  position: "bottom",
                                },
                                scales: {
                                  yAxes: [{
                                    ticks: {
                                      beginAtZero: true,
                                      callback: function(value: any) {
                                        if (value % 1 === 0) return numberWithCommas(value);
                                      }
                                    }
                                  }],
                                  xAxes: [
                                    {
                                      gridLines: {
                                        color: "#fff"
                                      },
                                    },
                                  ],
                                },
                                tooltips: {
                                  bodyFontSize: 15,
                                  bodySpacing: 10,
                                  caretSize: 3,
                                  caretPadding: 5
                                }
                              }}
                            />
                          </React.Fragment>
                        : 
                          <React.Fragment>
                            <h5> Users</h5>
                            <Line
                              data={{
                                labels: userStore.labels,
                                datasets: [
                                  {...setColorLine(setData(userStore.data, "total"), "ALL","#f54b24")},
                                  {...setColorLine(setData(userStore.data, "buyers"), "BUYER", "#1cf92d")},
                                  {...setColorLine(setData(userStore.data, "sellers"), "SELLER", "#f4427d")},
                                ],
                              }}
  
                              options={{
                                title: {
                                  display: true,
                                },
                                legend: {
                                  display: true,
                                  position: "bottom",
                                },
                                scales: {
                                  yAxes: [{
                                    ticks: {
                                      beginAtZero: true,
                                      callback: function(value: any) {
                                        if (value % 1 === 0) return numberWithCommas(value);
                                      }
                                    }
                                  }],
                                  xAxes: [
                                    {
                                      gridLines: {
                                        color: "#fff"
                                      },
                                    },
                                  ],
                                },
                                tooltips: {
                                  bodyFontSize: 15,
                                  bodySpacing: 10,
                                  caretSize: 3,
                                  caretPadding: 5
                                }
                              }}
                            />
                          </React.Fragment>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
            {userStore.data.length === 0 && (
              <React.Fragment>
                <div className="loading" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                  <img src="/assets/img/giphy.gif" style={{width: "30%"}} alt="loading"/>
                </div>
              </React.Fragment>
            )}
          </div>
        </div>

      </React.Fragment>
    );
  }
}
