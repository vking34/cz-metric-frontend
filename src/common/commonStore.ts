import { observable } from "mobx";

class CommonStore {
  @observable namePage: String = "Home";
  // @observable maxDataImpress1: Number = 0;

  setNamePage = (str: String) => {
    this.namePage = str;
  }

}

export const commonStore = new CommonStore();