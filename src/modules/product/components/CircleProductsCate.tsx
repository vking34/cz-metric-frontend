/* eslint-disable eqeqeq */
import { observable } from 'mobx'
import { observer } from 'mobx-react';
import React, { Component } from 'react'
import { Pie } from 'react-chartjs-2';

import { callApi } from '../../../utils/callAPI';

interface circlerProps {
  startDate: String,
  endDate: String
}

@observer
export default class CircleProductsCate extends Component<circlerProps> {
  
  @observable data: any[] = [];
  // @observable dataNum: Number[] = [];
  @observable sumData: Number = 0;
  @observable count: Object[] = [];
  @observable labels: String[] = [];
  componentDidMount() {
    // console.log("props : ", this.props.startDate, this.props.endDate);
    this.requestAPI();
  }
  
  componentDidUpdate(prevProps: Readonly<circlerProps>, prevState: Readonly<any>, snapshot?: any) {
    // console.log("props : ", this.props.startDate, this.props.endDate);
    if(prevProps !== this.props){
      this.requestAPI();
    }
  }
  setCount = (arr: any[], str: String) => {
    let count: Object[] = [];
    arr?.map((item: any) => {
      count.push(item[`${str}`])
      return null;
    });
    return count;
  };
  setData = (arr: Object[], str: String) => {
    let data: number[] = [];
    arr?.map((item: any) => {
      data.push(item[`${str}`])
      return null;
    });
    return data;
  };
  setLabels = (arr: any) => {
    let labels: String[] = [];
    arr?.map( (item: any) => {
      labels.push(item.category);
      return null;
    })    
    labels = labels.map(label => label.toUpperCase());
    return labels;
  }
  requestAPI = async () => {
    const resultApi = await callApi(
      `/v1/logs/statistics/products/categories?start_date=${this.props.startDate}&end_date=${this.props.endDate}`,
      "GET",
      {},
      false
      );
      
      if (resultApi.result.status === 200 ) {
        this.data = resultApi.result.data.data;
        if(this.data.length === 0){
          this.sumData = 0;
          return null;
        }else{
          this.sumData = 1;
          this.count = this.setCount(this.data, 'count');
          this.labels = this.setLabels(this.data);
        }
    }
  }

  options = {
    tooltips: {
      callbacks: {
        label: function(tooltipItem: any, data: any) {
          var dataset = data.datasets[tooltipItem.datasetIndex];
          var meta = dataset._meta[Object.keys(dataset._meta)[0]];
          var total = meta.total;
          var currentValue = dataset.data[tooltipItem.index];
          var percentage = parseFloat((currentValue/total*100).toFixed(1));
          return currentValue + ' (' + percentage + '%)';
        },
        title: function(tooltipItem: any, data: any) {
          return data.labels[tooltipItem[0].index];
        },
      }
    },
    plugins: {
      datalabels: {
        formatter: (value: any, ctx: any) => {
 
          let datasets = ctx.chart.data.datasets;
          let percentage: any;
          if (datasets.indexOf(ctx.dataset) === datasets.length - 1) {
            let sum = 0;
            datasets.map((dataset: any) => {
              sum += dataset.data[ctx.dataIndex];
              return null;
            });
            percentage = Math.round((value / sum) * 100) + '%';
            return percentage;
          } else {
            return percentage;
          }
        },
        color: '#fff',
      }
    }
  }


  render() {
    return (
      <React.Fragment>
        { this.sumData === 0 ? 
            <h5 style={{display: "flex", justifyContent: "center", opacity: 0.3}}>Chưa có dữ liệu</h5>
          :
          <Pie 
            height={213}
            data={{
              labels: this.labels,
              datasets: [{
                data: this.setData(this.count, 'total'),
                backgroundColor: ['#2196f3', '#79f279', '#f41509', "#E78D57", "#F1F1F1", "#E63E71"]
              }],
            }}
            // options={this.options}
            options={{
              title: {
                display: true,
              },
              legend: {
                display: true,
                position: "right",
              },
              tooltips: {
                callbacks: {
                  label: function(tooltipItem: any, data: any) {
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    var total = meta.total;
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = parseFloat((currentValue/total*100).toFixed(1));
                    return currentValue + ' (' + percentage + '%)';
                  },
                  title: function(tooltipItem: any, data: any) {
                    return data.labels[tooltipItem[0].index];
                  },
                }
              },
              plugins: {
                datalabels: {
                  callbacks: {
                    label: function(tooltipItem: any, data: any) {
                      console.log("abc ");
                      var dataset = data.datasets[tooltipItem.datasetIndex];
                      var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                      var total = meta.total;
                      var currentValue = dataset.data[tooltipItem.index];
                      var percentage = parseFloat((currentValue/total*100).toFixed(1));
                      return currentValue + ' (' + percentage + '%)';
                    },
                  },
                  formatter:function(tooltipItem: any, data: any) {
                    console.log("abc ");
                    var dataset = data.datasets[tooltipItem.datasetIndex];
                    var meta = dataset._meta[Object.keys(dataset._meta)[0]];
                    var total = meta.total;
                    var currentValue = dataset.data[tooltipItem.index];
                    var percentage = parseFloat((currentValue/total*100).toFixed(1));
                    return currentValue + ' (' + percentage + '%)';
                  },
                  color: '#fff',
                }
              },
            }}
          />
        }
      </React.Fragment>
    )
  }
}
