import { Moment } from "./Moment";

export const setPerent = (a: number, b: number) => {
  // a hiện tại, b : quá khứ
  if (a === b) return 0;
  else if (a === 0) { return -100; }
  else if (b === 0) { return 100; }
  else {
    let percent: number = 0;
    percent = 100 * (a - b) / b;
    if (percent - Math.floor(percent) >= 0.95 || percent === Math.floor(percent)) {
      return Math.ceil(percent);
    } else {
      return percent.toFixed(1);
    }
  }
}
export const setLabels = (arr: any) => {
  // chủ nhật là 0, thu 2 là 1, thu 3 là 2,...
  //let days: String[] = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  let months: String[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let labels: String[] = [];
  arr?.map((item: any) => {
    let date = new Date(item.date);
    labels.push(`${months[date.getMonth()]} ${date.getDate()}`);
    // labels.push(this.days[new Date(item.date).getDay()]);
    return null;
  });
  return labels;
};

export const setDay = (arr: any) => {
  let day: String[] = [];
  arr?.map((item: any) => {
    let date = Moment.getDate(new Date(item.date).getTime(), "dd-mm-yyyy");
    day.push(date);
  })
  return day;
}

export const setTotal = (arr: any[], str: String) => {
  let data: number[] = [];
  let sum: number = 0;
  arr?.map((item: any) => {
    data.push(item[`${str}`])
    return null;
  })
  if (data.length > 0)
    sum = data?.reduce((sum: number, item: any) => sum + item)
  return sum;
}

export const setData = (arr: any[], str: String) => {
  let data: number[] = [];
  arr?.map((item: any) => {
    data.push(item[`${str}`])
    return null;
  });
  return data;
};

export const setColorLine = (data: any,label:String, str: String) => {
  let object = {
    data: data,
    label: `${label}`,
    borderColor: `${str}`,
    fill: false,
    tension: 0,
    pointBackgroundColor: `${str}`
  }
  return object;
}
