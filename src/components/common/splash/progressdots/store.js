import { makeAutoObservable, makeObservable } from "mobx";

class progress {
  state = {
    showProgress: false,
    background: true,
    animation: "progressdots",
    delay: 1500,
  };

  constructor() {
    makeAutoObservable(this);
  }

  setCloseProgress() {
    this.state["showProgress"] = false;
  }

  setShowProgress(
    visible,
    background = false,
    animation = "progressdots",
    delay = 1500
  ) {
    this.state = {
      showProgress: visible,
      background,
      animation,
      delay,
    };
  }
}

export default new progress();
