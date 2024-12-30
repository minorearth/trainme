import { makeAutoObservable, makeObservable } from "mobx";

class progress {
  showProgress = false;
  constructor() {
    makeAutoObservable(this);
  }
  setShowProgress(visible) {
    this.showProgress = visible;
  }
}

export default new progress();
