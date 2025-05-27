import { makeObservable, makeAutoObservable } from "mobx";
class AS {
  as = {};

  setAppState(data) {
    this.as = data;
  }

  updateAppState(data) {
    this.as = { ...this.as, ...data };
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new AS();
