/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
import { DateRangePicker} from "rsuite"
import { Line } from "react-chartjs-2";
import { observer } from "mobx-react";

import { callApi } from "../../utils/callAPI";
import { Moment } from "../../common/Moment";
import {setLabels, setPerent, setData, setTotal, setColorLine} from "../../common/Handler";
import myClickParam from "./components/myClickParam";
import ShowPercent from "../components/ShowPercent";

// import "./style.css";
import { clickStore } from "./clickStore";
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
    commonStore.setNamePage("Clicks");
    this.requestAPI();
  }

  componentDidUpdate(prevProps: Readonly<ImpressionProps>, prevState: Readonly<any>, snapshot?: any) {
    if(prevProps.location.search !== this.props.location.search){
      this.requestAPI()
    }
  }
  requestAPI = async () => {
    if(this.props.location.search){
      const params = new myClickParam(this.props.location.search)
      clickStore.startDate = params.getStartDate;
      clickStore.endDate = params.getEndDate;
      clickStore.startDate2 = clickStore.setMinusTime();
      const resultApi = await callApi(
        `/v1/logs/statistics/impressions?start_date=${clickStore.startDate}&end_date=${clickStore.endDate}`,
        "GET",
        {},
        false
      );
      const resultApi2 = await callApi(
        `/v1/logs/statistics/impressions?start_date=${clickStore.startDate2}&end_date=${clickStore.startDate}`,
        "GET",
        {},
        false
      );    
  
      if (resultApi.result.status === 200 && resultApi2.result.status === 200) {
        clickStore.data = resultApi.result.data.data;
        clickStore.data2 = resultApi2.result.data.data;
        clickStore.labels = setLabels(clickStore.data.common);
        clickStore.percentImpression = setPerent(setTotal(clickStore.data?.common, 'total'),setTotal(clickStore.data2?.common, 'total'));
        clickStore.percentVisitor = setPerent(setTotal(clickStore.data?.unique_users, 'total'),setTotal(clickStore.data2?.unique_users, 'total'));
      }
    }
  };

  getDateSelect = (e: any) => {
    clickStore.startDate = Moment.getDate(e[0].getTime(), "yyyy-mm-dd");
    clickStore.endDate = Moment.getDate(e[1].getTime(), "yyyy-mm-dd");
    this.props.history.push(`/impressions?start_date=${clickStore.startDate}&end_date=${clickStore.endDate}`)
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
                    <a>{clickStore.option.toUpperCase()} &nbsp;
                    <i className="fas fa-angle-down"></i>    
                    </a>
                  </span>
                  <ul className="dropdown-menu">
                    <li>
                      <a href="#"  onClick={()=> clickStore.optionClick("showAll")}>PLATFORM</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> clickStore.optionClick("android")}>ANDROID</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> clickStore.optionClick("ios")}>IOS</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> clickStore.optionClick("web")}>WEB</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> clickStore.optionClick("wap")}>WAP</a>
                    </li>
                    <li>
                      <a href="#"  onClick={()=> clickStore.optionClick("unknown")}>UNKNOWN</a>
                    </li>
                  </ul>
                </div>
                  
              <DateRangePicker
                format="DD-MM-YYYY"
                // format="MMM D, YYYY"
                value={[
                  new Date(`${clickStore.startDate}`),
                  new Date(`${clickStore.endDate}`),
                ]}
                // disabledDate={combine(allowedMaxDays(7), afterToday())}
                onOk={(e) => this.getDateSelect(e)}
              />

            </div>
            {Object.keys(clickStore.data).length > 0 && (
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
                          {numberWithCommas(setTotal(clickStore.data.common, 'total'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={clickStore.percentImpression} />
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
                        {numberWithCommas(setTotal(clickStore.data.unique_users, 'total'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={clickStore.percentVisitor} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-12" style={{marginBottom: "15px", marginTop:"15px"}}>
                        { clickStore.showOnlyLine ? 
                          <React.Fragment>
                            <h5>Clicks</h5>
                            <Line 
                              data={{
                                labels: clickStore.labels,
                                datasets: [
                                  {...setColorLine(setData(clickStore.data.common, `${clickStore.option}`),`${clickStore.option.toUpperCase()}`, "#f54b24" )},
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
                            <h5>Clicks</h5>
                            <Line
                              data={{
                                labels: clickStore.labels,
                                datasets: [
                                  {...setColorLine(setData(clickStore.data.common, "total"), "ALL", "#3e95cd")},
                                  {...setColorLine(setData(clickStore.data.common, "android"), "ANDROID", "#8e5ea2")},
                                  {...setColorLine(setData(clickStore.data.common, "ios"), "IOS", "#3cba9f")},
                                  {...setColorLine(setData(clickStore.data.common, "web"), "WEB", "#70B746")},
                                  {...setColorLine(setData(clickStore.data.common, "wap"), "WAP", "#CA2D4D")},
                                  {...setColorLine(setData(clickStore.data.common, "unknown"), "UNKNOWN", "red")},
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
                                    }
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
                        { clickStore.showOnlyLine ? 
                          <React.Fragment>
                            <h5>Visitors</h5>
                            <Line 
                              data={{
                                labels: clickStore.labels,
                                datasets: [
                                  {...setColorLine(setData(clickStore.data.unique_users, `${clickStore.option}`), `${clickStore.option.toUpperCase()}`, "#f54b24")},
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
                                labels: clickStore.labels,
                                datasets: [
                                  {...setColorLine(setData(clickStore.data.unique_users, "total"), "ALL", "#3e95cd")},
                                  {...setColorLine(setData(clickStore.data.unique_users, "android"), "ANDROID", "#8e5ea2")},
                                  {...setColorLine(setData(clickStore.data.unique_users, "ios"), "IOS", "#3cba9f")},
                                  {...setColorLine(setData(clickStore.data.unique_users, "web"), "WEB", "#70B746")},
                                  {...setColorLine(setData(clickStore.data.unique_users, "wap"), "WAP", "#CA2D4D")},
                                  {...setColorLine(setData(clickStore.data.unique_users, "unknown"), "UNKNOWN", "red")},
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
            {Object.keys(clickStore.data).length === 0 && (
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
