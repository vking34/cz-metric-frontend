import { Moment } from '../../common/Moment';
import { observable} from "mobx";

class ImpressionStore {
  private currentDate: Date = new Date();
  @observable data: any = {};
  @observable data2: any = {};
  // var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  @observable endDate: String = Moment.getDate(this.currentDate.getTime(),"yyyy-mm-dd");
  @observable startDate: String = Moment.getDate(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1).getTime(), "yyyy-mm-dd");
  @observable labels: String[] = [];
  @observable option: String = "PLATFORM";
  @observable showOnlyLine: boolean = false;
  @observable percentImpression: String | number = 0;
  @observable percentVisitor: String | number = 0;
  @observable minusTime: number = 0;
  @observable startDate2: String = Moment.getDate((this.minusTime), "yyyy-mm-dd")

  optionClick = (str : string) => {
    if(str === "showAll"){
      this.option="PLATFORM";
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
  // @computed get setMinusTime(){
  //   let date1 = new Date(`${this.startDate}`);
  //   let date2 = new Date(`${this.endDate}`);
  //   this.minusTime = 2* date1.getTime() - date2.getTime();
  //   this.startDate2 = Moment.getDate((this.minusTime), "yyyy-mm-dd");
  //   return this.startDate2;
  // }
}


export const impressionStore = new ImpressionStore()