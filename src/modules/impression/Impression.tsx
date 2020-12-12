/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { DateRangePicker} from "rsuite"
import { Line } from "react-chartjs-2";
import { observer } from "mobx-react";

import { callApi } from "../../utils/callAPI";
import { Moment } from "../../common/Moment";
import {setLabels, setPerent, setData, setTotal, setColorLine} from "../../common/Handler";
import myImpressionParam from "./components/myImpressionParam";
import ShowPercent from "../components/ShowPercent";

// import "./style.css";
import { impressionStore } from "./impressionStore";
import { commonStore } from "../../common/commonStore";
import { numberWithCommas } from "../../common/BaseFunction";

// const { allowedMaxDays, afterToday, combine } = DateRangePicker;

interface ImpressionProps {
  history: { push: (path: String) => any };
  location: { search: String };
}

@observer
export default class Impression extends Component<ImpressionProps, any> {
  componentDidMount() {
    commonStore.setNamePage("Impressions");
    this.requestAPI();
  }

  componentDidUpdate(prevProps: Readonly<ImpressionProps>, prevState: Readonly<any>, snapshot?: any) {
    if(prevProps.location.search !== this.props.location.search){
      this.requestAPI()
    }
  }
  requestAPI = async () => {
    if(this.props.location.search){
      const params = new myImpressionParam(this.props.location.search)
      impressionStore.startDate = params.getStartDate;
      impressionStore.endDate = params.getEndDate;
      impressionStore.startDate2 = impressionStore.setMinusTime();
      const resultApi = await callApi(
        `/v1/logs/statistics/impressions?start_date=${impressionStore.startDate}&end_date=${impressionStore.endDate}`,
        "GET",
        {},
        false
      );
      const resultApi2 = await callApi(
        `/v1/logs/statistics/impressions?start_date=${impressionStore.startDate2}&end_date=${impressionStore.startDate}`,
        "GET",
        {},
        false
      );    
  
      if (resultApi.result.status === 200 && resultApi2.result.status === 200) {
        impressionStore.data = resultApi.result.data.data;
        impressionStore.data2 = resultApi2.result.data.data;
        impressionStore.labels = setLabels(impressionStore.data.common);
        impressionStore.percentImpression = setPerent(setTotal(impressionStore.data?.common, 'total'),setTotal(impressionStore.data2?.common, 'total'));
        impressionStore.percentVisitor = setPerent(setTotal(impressionStore.data?.unique_users, 'total'),setTotal(impressionStore.data2?.unique_users, 'total'));
      }
    }
  };

  getDateSelect = (e: any) => {
    impressionStore.startDate = Moment.getDate(e[0].getTime(), "yyyy-mm-dd");
    impressionStore.endDate = Moment.getDate(e[1].getTime(), "yyyy-mm-dd");
    this.props.history.push(`/impressions?start_date=${impressionStore.startDate}&end_date=${impressionStore.endDate}`)
  };

  render() {
    window.scroll(0,0);
    return (
      <React.Fragment>
  
        <div className="content">
          <div className="container-fluid">
            <div className="filter-main">
                        
              <div className="dropdown show-dropdown option-main">
                  <span data-toggle="dropdown" aria-expanded="false" >
                    <a>{impressionStore.option.toUpperCase()} &nbsp;
                    <i className="fas fa-angle-down"></i>    
                    </a>
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#"  onClick={()=> impressionStore.optionClick("showAll")}>PLATFORM</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> impressionStore.optionClick("android")}>ANDROID</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> impressionStore.optionClick("ios")}>IOS</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> impressionStore.optionClick("web")}>WEB</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> impressionStore.optionClick("wap")}>WAP</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> impressionStore.optionClick("unknown")}>UNKNOWN</a>
                    </li>
                  </ul>
                </div>
                  
              <DateRangePicker
                format="DD-MM-YYYY"
                // format="MMM D, YYYY"
                value={[
                  new Date(`${impressionStore.startDate}`),
                  new Date(`${impressionStore.endDate}`),
                ]}
                // disabledDate={combine(allowedMaxDays(7), afterToday())}
                onOk={(e) => this.getDateSelect(e)}
              />

            </div>
            {Object.keys(impressionStore.data).length > 0 && (
              <React.Fragment>

                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-warning">
                          <i className="zmdi zmdi-equalizer" />
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total Impressions</p>
                        <h3 className="card-title">
                          <i className="fas fa-user"  style={{color: "#f54b24"}}></i>
                          {numberWithCommas(setTotal(impressionStore.data.common, 'total'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={impressionStore.percentImpression} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-rose">
                          <i className="zmdi zmdi-shopping-cart" />
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total Visitors</p>
                        <h3 className="card-title"><i className="fas fa-user"  style={{color: "#4CAF50"}}></i>
                        {numberWithCommas(setTotal(impressionStore.data.unique_users, 'total'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={impressionStore.percentVisitor} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12" style={{marginBottom: "15px", marginTop:"15px"}}>
                        { impressionStore.showOnlyLine ? 
                          <React.Fragment>
                            <h5>Impressions</h5>
                            <Line 
                              data={{
                                labels: impressionStore.labels,
                                datasets: [
                                  {...setColorLine(setData(impressionStore.data.common, `${impressionStore.option}`),`${impressionStore.option.toUpperCase()}`, "#f54b24" )},
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
                            <h5>Impressions</h5>
                            <Line
                              data={{
                                labels: impressionStore.labels,
                                datasets: [
                                  {...setColorLine(setData(impressionStore.data.common, "total"), "ALL", "#3e95cd")},
                                  {...setColorLine(setData(impressionStore.data.common, "android"), "ANDROID", "#8e5ea2")},
                                  {...setColorLine(setData(impressionStore.data.common, "ios"), "IOS", "#3cba9f")},
                                  {...setColorLine(setData(impressionStore.data.common, "web"), "WEB", "#70B746")},
                                  {...setColorLine(setData(impressionStore.data.common, "wap"), "WAP", "#CA2D4D")},
                                  {...setColorLine(setData(impressionStore.data.common, "unknown"), "UNKNOWN", "red")},
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
                                  xAxes: [{
                                    gridLines: {
                                      color: "#fff"
                                    },
                                    color: "red"
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
                      <div className="col-md-12" style={{marginBottom: "15px", marginTop:"15px"}}>
                        { impressionStore.showOnlyLine ? 
                          <React.Fragment>
                            <h5>Visitors</h5>
                            <Line 
                              data={{
                                labels: impressionStore.labels,
                                datasets: [
                                  {...setColorLine(setData(impressionStore.data.unique_users, `${impressionStore.option}`), `${impressionStore.option.toUpperCase()}`, "#f54b24")},
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
                                      display: false, // this will hide vertical lines
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
                            <h5>Visitors</h5>
                            <Line
                              data={{
                                labels: impressionStore.labels,
                                datasets: [
                                  {...setColorLine(setData(impressionStore.data.unique_users, "total"), "ALL", "#3e95cd")},
                                  {...setColorLine(setData(impressionStore.data.unique_users, "android"), "ANDROID", "#8e5ea2")},
                                  {...setColorLine(setData(impressionStore.data.unique_users, "ios"), "IOS", "#3cba9f")},
                                  {...setColorLine(setData(impressionStore.data.unique_users, "web"), "WEB", "#70B746")},
                                  {...setColorLine(setData(impressionStore.data.unique_users, "wap"), "WAP", "#CA2D4D")},
                                  {...setColorLine(setData(impressionStore.data.unique_users, "unknown"), "UNKNOWN", "red")},
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
            {Object.keys(impressionStore.data).length === 0 && (
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
