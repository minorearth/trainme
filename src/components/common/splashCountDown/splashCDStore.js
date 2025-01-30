import { makeAutoObservable, makeObservable } from "mobx";

class splashCD {
  state = {
    showSplashCD: false,
    background: true,
    animation: "progressdots",
  };

  constructor() {
    makeAutoObservable(this);
  }

  setCloseProgress() {
    this.state = { showSplashCD: false };
  }

  setShow(background = false, animation, delay) {
    this.state = {
      showSplashCD: true,
      background,
      animation,
    };
    // setTimeout(() => {
    //   this.state["showSplashCD"] = false;
    // }, delay);
  }
}

export default new splashCD();
