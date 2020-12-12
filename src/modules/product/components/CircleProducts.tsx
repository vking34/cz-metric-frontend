import { observable } from "mobx";
import { observer } from "mobx-react";
import React, { Component } from "react";
import Chart from "react-google-charts";
import { callApi } from "../../../utils/callAPI";

@observer
export default class CircleApex extends Component<any> {
  @observable data: any[] = [];
  @observable sumData: Number = 0;
  @observable count: Object[] = [];
  @observable labels: any = [];
  componentDidMount() {
    this.requestAPI();
  }

  componentDidUpdate(prevProps: any, prevState: Readonly<any>, snapshot?: any) {
    if (prevProps !== this.props) {
      this.requestAPI();
    }
  }
  setLabels = (arr: any) => {
    let labels: String[] = [];
    arr?.map((item: any) => {
      labels.push(item.category);
      return null;
    });
    labels = labels.map((label) => label.toUpperCase());
    return labels;
  };
  setCount = (arr: any[], str: String) => {
    let count: Object[] = [];
    arr?.map((item: any) => {
      count.push(item[`${str}`]);
      return null;
    });
    return count;
  };
  setData = (arr: Object[], str: String) => {
    let data: number[] = [];
    arr?.map((item: any) => {
      data.push(item[`${str}`]);
      return null;
    });
    return data;
  };
  requestAPI = async () => {
    const resultApi = await callApi(
      `/v1/logs/statistics/products/categories?start_date=${this.props.startDate}&end_date=${this.props.endDate}`,
      "GET",
      {},
      false
    );

    if (resultApi.result.status === 200) {
      this.data = resultApi.result.data.data;
      if (this.data.length === 0) {
        this.sumData = 0;
        return null;
      } else {
        this.sumData = 1;
        this.count = this.setCount(this.data, "count");
        this.labels = this.setLabels(this.data);
      }
    }
  };

  setDataCir = (labels: any, db: any) => {
    // let data: any = this.setData(this.count, 'total');
    let dataCir: any = [["Task", "Hours per Day"]];
    for (let i = 0; i < this.count.length; i++) {
      let str: any = [labels[i], db[i]];
      dataCir.push(str);
    }
    return dataCir;
  };
  render() {
    return (
      <React.Fragment>
        {this.sumData === 0 ? (
          <h5
            style={{ display: "flex", justifyContent: "center", opacity: 0.3 }}
          >
            Chưa có dữ liệu
          </h5>
        ) : (
          <Chart
            height={"308px"}
            style={{ backgroundColor: "#fff" }}
            chartType="PieChart"
            loader={<div>Loading Chart ... </div>}
            data={this.setDataCir(
              this.labels,
              this.setData(this.count, "total")
            )}
            options={{
              // title: "My Daily Activities",
              // tooltip: { isHtml: true }
            }}
            // rootProps={{ "data-testid": "1" }}
          />
        )}
      </React.Fragment>
    );
  }
}
