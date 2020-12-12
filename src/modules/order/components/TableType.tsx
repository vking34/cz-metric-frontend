import { observable } from 'mobx';
import { observer } from 'mobx-react';
import React, { Component } from 'react'
import { numberWithCommas } from '../../../common/BaseFunction';

interface propsTable {
  date: String[],
  count: Number[],
  revenue: Number[],
}

@observer
export default class TableType extends Component<propsTable> {

  @observable lengthTable = this.props.count.length;

  render() {

    return (
      <div className="card-content" style={{marginTop: "30px"}}>
      <h4 className="card-title">Thống kê dữ liệu</h4>
      <div className="table-responsive">
        <table className="table text-center">
          <thead className="text-primary">
            <tr>
              <th className="text-center">Ngày</th>
              <th className="text-center">Tổng số đơn hàng</th>
              <th className="text-center">Doanh thu </th>
            </tr></thead>
          <tbody>
            {this.props.count.map( (item, i) => {
              return ( 
                <tr key={i}>
                  <td> {this.props.date[i]} </td>
                  <td className="text-success"> {item} </td>
                  <td className="text-danger"> {numberWithCommas(this.props.revenue[i])} đ </td>
                </tr>
              )
            })}
           </tbody>
        </table>
      </div>
    </div>
    )
  }
}
