/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import { Line } from "react-chartjs-2";
import { observer } from "mobx-react";

import { callApi } from "../../utils/callAPI";
import { Moment } from "../../common/Moment";
import {setLabels, setPerent, setData, setTotal, setDay, setColorLine} from "../../common/Handler";
import myOrderParam from "./components/myOrderParam";
import TableType from "./components/TableType";
import ShowPercent from "../components/ShowPercent";
import {numberWithCommas} from "../../common/BaseFunction"
import { orderStore } from "./orderStore";
import { commonStore } from "../../common/commonStore";

// const { allowedMaxDays, afterToday, combine } = DateRangePicker;

interface OrderStore {
  history: { push: (path: string) => any };
  location: { search: string };
}

@observer
export default class Order extends Component<OrderStore, any> {

  componentDidMount() {
    commonStore.setNamePage("Orders")
    this.requestAPI();
  }

  componentDidUpdate(prevProps: Readonly<OrderStore>, prevState: Readonly<any>, snapshot?: any) {
    if(prevProps.location.search !== this.props.location.search){
      this.requestAPI()
    }
  }
  requestAPI = async () => {
    if(this.props.location.search){
      const params = new myOrderParam(this.props.location.search)
      orderStore.startDate = params.getStartDate;
      orderStore.endDate = params.getEndDate;
      orderStore.startDate2 = orderStore.setMinusTime();
      const resultApi = await callApi(
        `/v1/logs/statistics/orders?start_date=${orderStore.startDate}&end_date=${orderStore.endDate}`,
        "GET",
        {},
        false
      );
      // console.log("resultapi : ", resultApi);
      const resultApi2 = await callApi(
        `/v1/logs/statistics/orders?start_date=${orderStore.startDate2}&end_date=${orderStore.startDate}`,
        "GET",
        {},
        false
      );  

      if (resultApi.result.status === 200 && resultApi2.result.status === 200) {
        orderStore.data = resultApi.result.data.data;
        orderStore.data2 = resultApi2.result.data.data;
        orderStore.labels = setLabels(orderStore.data);
        orderStore.percentCount = setPerent(setTotal(orderStore.data, 'order_count'),setTotal(orderStore.data2, 'order_count'));
        orderStore.percentRevenue = setPerent(setTotal(orderStore.data, 'total_revenue'),setTotal(orderStore.data2, 'total_revenue'));
      }
    
    };
  }

  getDateSelect = (e: any) => {
    orderStore.startDate = Moment.getDate(e[0].getTime(), "yyyy-mm-dd");
    orderStore.endDate = Moment.getDate(e[1].getTime(), "yyyy-mm-dd");
    this.props.history.push(`/orders?start_date=${orderStore.startDate}&end_date=${orderStore.endDate}`)
  };

  render() {
    window.scroll(0,0);
    return (
      <React.Fragment>
  
        <div className="content">
          <div className="container-fluid">
            <div className="filter-main">
                
              <div></div>
              
              <DateRangePicker
                format="MMM D, YYYY"
                value={[
                  new Date(`${orderStore.startDate}`),
                  new Date(`${orderStore.endDate}`),
                ]}
                // disabledDate={combine(allowedMaxDays(7), afterToday())}
                onOk={(e) => this.getDateSelect(e)}
              />

            </div>
            {Object.keys(orderStore.data).length > 0 && (
              <React.Fragment>
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-warning">
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Orders Count</p>
                        <h3 className="card-title">
                          <i className="fas fa-shopping-cart" style={{color: "#f54b24"}}></i>
                          {numberWithCommas(setTotal(orderStore.data, 'order_count'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={orderStore.percentCount} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-rose">
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total Revenue</p>
                        <h3 className="card-title">
                          <i className="fas fa-dollar-sign" style={{color: "#4CAF50"}}></i>
                          {numberWithCommas(setTotal(orderStore.data, 'total_revenue'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={orderStore.percentRevenue} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row">
                      <div className="col-md-6" style={{marginBottom: "15px", marginTop:"15px"}}>
                        <React.Fragment>
                          <h5>Orders Count</h5>
                          <Line 
                            data={{
                              labels: orderStore.labels,
                              datasets: [
                                {...setColorLine(setData(orderStore.data, 'order_count'), "ORDERS COUNT ", "#f54b24")},
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
                    
                      </div>
                   
                      <div className="col-md-6" style={{marginBottom: "15px", marginTop:"15px"}}>
                          <React.Fragment>
                            <h5>Revenue</h5>
                            <Line 
                              data={{
                                labels: orderStore.labels,
                                datasets: [
                                  {...setColorLine(setData(orderStore.data, 'total_revenue'), "REVENUE", "#4caf50")},
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
              
                      </div>
                  
                    </div>
                  </div>
                  <div className="col-md-12">
                    <TableType date={setDay(orderStore.data)} count={setData(orderStore.data, 'order_count')} revenue={setData(orderStore.data, 'total_revenue')} />
                  </div>
                </div>
              </React.Fragment>
            )}
            {Object.keys(orderStore.data).length === 0 && (
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
