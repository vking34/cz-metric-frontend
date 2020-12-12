/* eslint-disable eqeqeq */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { Component } from "react";
// import { Link } from "react-router-dom";
import { DateRangePicker } from "rsuite";
import { Line } from "react-chartjs-2";
import { observer } from "mobx-react";

import { callApi } from "../../utils/callAPI";
import { Moment } from "../../common/Moment";
import {setLabels, setPerent, setData, setTotal, setColorLine} from "../../common/Handler";
import { productStore } from "./productStore";
import myProductParam from "./components/myProductParam";
// import CircleProductsCate from "./components/CircleProductsCate";
import ShowPercent from "../components/ShowPercent";
import { commonStore } from "../../common/commonStore";
import { numberWithCommas } from "../../common/BaseFunction";
import CircleProducts from "./components/CircleProducts";
// import Test from "./components/Test"

// const { allowedMaxDays, afterToday, combine } = DateRangePicker;

interface ClickProps {
  history: { push: (path: string) => any };
  location: { search: string };
}

@observer
export default class Product extends Component<ClickProps, any> {

  componentDidMount() {
    commonStore.setNamePage("Products");
    this.requestAPI();
  }

  componentDidUpdate(prevProps: Readonly<ClickProps>, prevState: Readonly<any>, snapshot?: any) {
    if(prevProps.location.search !== this.props.location.search){
      this.requestAPI()
    }
  }

  requestAPI = async () => {
    if(this.props.location.search){
      const params = new myProductParam(this.props.location.search)
      productStore.startDate = params.getStartDate;
      productStore.endDate = params.getEndDate;
      productStore.startDate2 = productStore.setMinusTime();
      const resultApi = await callApi(
        `/v1/logs/statistics/products?start_date=${productStore.startDate}&end_date=${productStore.endDate}`,
        // `/v1/logs/statistics/products?start_date=2020-09-07&end_date=2020-09-15`,
        "GET",
        {},
        false
        );
        
      const resultApi2 = await callApi(
        `/v1/logs/statistics/products?start_date=${productStore.startDate2}&end_date=${productStore.startDate}`,
        "GET",
        {},
        false
      );  
  
      if (resultApi.result.status === 200 && resultApi2.result.status === 200) {
        productStore.data = resultApi.result.data.data;
        productStore.data2 = resultApi2.result.data.data;
        productStore.labels = setLabels(productStore.data);
        productStore.percentNormal = setPerent(setTotal(productStore.data, 'normal'),setTotal(productStore.data2, 'normal'));
        productStore.percentOld = setPerent(setTotal(productStore.data, 'old'),setTotal(productStore.data2, 'old'));
        productStore.percentBid = setPerent(setTotal(productStore.data, 'bid'),setTotal(productStore.data2, 'bid'));
      }
    
    };
  }

  getDateSelect = (e: any) => {
    productStore.startDate = Moment.getDate(e[0].getTime(), "yyyy-mm-dd");
    productStore.endDate = Moment.getDate(e[1].getTime(), "yyyy-mm-dd");
    this.props.history.push(`/products?start_date=${productStore.startDate}&end_date=${productStore.endDate}`)
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
                  <a>{productStore.option.toUpperCase()} &nbsp;
                  <i className="fas fa-angle-down"></i>    
                  </a>
                </span>
                <ul className="dropdown-menu">
                  <li>
                    <a href="#"  onClick={()=> productStore.optionClick("showAll")}>ALL PRODUCTS</a>
                  </li>
                  <li>
                    <a href="#"  onClick={()=> productStore.optionClick("normal")}>PRODUCTS NORMAL</a>
                  </li>
                  <li>
                    <a href="#"  onClick={()=> productStore.optionClick("old")}>PRODUCTS OLD</a>
                  </li>
                  <li>
                    <a href="#"  onClick={()=> productStore.optionClick("bid")}>PRODUCTS BID</a>
                  </li>
                </ul>
              </div>
              
              <DateRangePicker
                format="MMM D, YYYY"
                value={[
                  new Date(`${productStore.startDate}`),
                  new Date(`${productStore.endDate}`),
                ]}
                // disabledDate={combine(allowedMaxDays(7), afterToday())}
                onOk={(e) => this.getDateSelect(e)}
              />

            </div>
            {productStore.data.length > 0 && (
              <React.Fragment>

                <div className="row">

                  <div className="col-lg-4 col-md-4 col-sm-4">
                    <div className="card card-stats">
                      <div className="card-header">
                        <div className="icon icon-warning">
                        </div>
                      </div>
                      <div className="card-content">
                        <p className="category">Total Products Normal</p>
                        <h3 className="card-title">
                          <img src="/assets/icon/gift.png" alt="icon" style={{width: "32px"}} />
                          {numberWithCommas(setTotal(productStore.data, "normal"))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={productStore.percentNormal} />
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
                        <p className="category">Total Products Bid</p>
                        <h3 className="card-title">
                          <img src="/assets/icon/law.png" alt="icon" style={{width: "32px"}} />
                          {/* <i className="fas fa-gavel" style={{color: "#E91E63"}}></i> */}
                          {numberWithCommas(setTotal(productStore.data, 'bid'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={productStore.percentBid} />
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
                        <p className="category">Total Products Old</p>
                        <h3 className="card-title">
                          <img src="/assets/icon/like.png" alt="icon" style={{width: "32px"}} />
                          {numberWithCommas(setTotal(productStore.data, 'old'))}
                        </h3>
                      </div>
                      <div className="card-footer">
                        <div className="stats">
                          <ShowPercent num={productStore.percentOld} />
                        </div>
                      </div>
                    </div>
                  </div>
           
                </div>
                <div className="row">
                  <div className="col-md-7 col-sm-12">
                    <div className="row">
                      <div className="col-md-12" style={{marginBottom: "15px", marginTop:"15px"}}>
                        { productStore.showOnlyLine ? 
                          <React.Fragment>
                            <h5>Daily</h5>
                            <Line 
                              data={{
                                labels: productStore.labels,
                                datasets: [
                                  {...setColorLine(setData(productStore.data, `${productStore.option}`),`${productStore.option.toUpperCase()}`, "#f54b24" )},
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
                            <h5>Daily</h5>
                            <Line
                              data={{
                                labels: productStore.labels,
                                datasets: [
                                  {...setColorLine(setData(productStore.data, "normal"), "NORMAL", "#f54b24")},
                                  {...setColorLine(setData(productStore.data, "bid"), "BID", "#E91e63")},
                                  {...setColorLine(setData(productStore.data, "old"), "OLD", "#f2bc52")},
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
                  <div className="col-md-5 col-sm-12">
                    <div className="row">
                      <div className="col-md-12">
                        <h5 style={{marginTop: "15px"}}>Products By Categories</h5>                        
                        {/* <CircleProductsCate startDate={productStore.startDate} endDate={productStore.endDate} /> */}
                        <CircleProducts startDate={productStore.startDate} endDate={productStore.endDate} />
                      </div>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
            {productStore.data.length === 0 && (
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
