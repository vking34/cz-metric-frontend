import { Moment } from './../../common/Moment';
import { observable} from "mobx";


class ProductStore {
  private currentDate: Date = new Date();
  @observable data: any = [];
  @observable data2: any = [];
  @observable endDate: String = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDate: String = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable labels: String[] = [];
  @observable option: String = "ALL PRODUCTS";
  @observable showOnlyLine: boolean = false;
  @observable percentNormal: String| number = 0;
  @observable percentOld: String| number = 0;
  @observable percentBid: String| number = 0;
  @observable minusTime: number = 0;
  @observable startDate2: String = Moment.getDate((this.minusTime), "yyyy-mm-dd")

  optionClick = (str : string) => {
    if(str === "showAll"){
      this.option="ALL PRODUCTS";
      this.showOnlyLine = false;
      return null;
    }
    if(str !== this.option){
      this.option = str;
      this.showOnlyLine = true;
      return null;
    }
  }
  setMinusTime(){
    let date1 = new Date(`${this.startDate}`);
    let date2 = new Date(`${this.endDate}`);
    this.minusTime = 2* date1.getTime() - date2.getTime();
    this.startDate2 = Moment.getDate((this.minusTime), "yyyy-mm-dd");
    return this.startDate2;
  }
}


export const productStore = new ProductStore()