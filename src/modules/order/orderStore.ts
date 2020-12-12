import { Moment } from '../../common/Moment';
import {  observable} from "mobx";

class OrderStore {
  private currentDate: Date = new Date();
  @observable data: any = [];
  @observable data2: any = [];
  @observable endDate: String = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDate: String = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable labels: String[] = [];
  @observable percentCount: String | number = 0;
  @observable percentRevenue: String | number = 0;
  @observable minusTime: number = 0;
  @observable startDate2: String = Moment.getDate((this.minusTime), "yyyy-mm-dd")
  

  setMinusTime(){
    let date1 = new Date(`${this.startDate}`);
    let date2 = new Date(`${this.endDate}`);
    this.minusTime = 2* date1.getTime() - date2.getTime();
    this.startDate2 = Moment.getDate((this.minusTime), "yyyy-mm-dd");
    // console.log(Moment.getDate((this.minusTime), "yyyy-mm-dd"));
    return this.startDate2;
  }
}


export const orderStore = new OrderStore()