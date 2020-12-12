import { userStore } from '../userStore';
// import { Moment } from '../../../common/Moment';

export default class myUserParam extends URLSearchParams {
  constructor(search: String | null){
    super(search + "");
    Object.setPrototypeOf(this, myUserParam.prototype)
  }

  get getStartDate(): String {
    let startDate: any = this.get('start_date') 
    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    if(!regex.test(startDate)){
      // startDate =  Moment.getDate(new Date(Date.now() - 6*864e5).getTime(), "yyyy-mm-dd");
      startDate = userStore.startDate;
    }
    return startDate;
  }
  get getEndDate(): String {
    let endDate: any = this.get('end_date') 
    const regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/
    if(!regex.test(endDate)){
      // endDate =  Moment.getDate(new Date().getTime(), "yyyy-mm-dd");
      endDate = userStore.endDate;
    }
    return endDate;
  }

}
