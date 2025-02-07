import { makeAutoObservable, makeObservable } from "mobx";

class splashAction {
  state = {
    showSplashCD: false,
    background: true,
    animation: "progressdots",
    action2: () => {},
  };

  constructor() {
    makeAutoObservable(this);
  }

  setCloseProgress() {
    this.state = { ...this.state, showSplashCD: false };
  }

  setShow(background = false, animation, delay, action2 = () => {}) {
    this.state = {
      showSplashCD: true,
      background,
      animation,
      action2,
    };
  }
}

export default new splashAction();
