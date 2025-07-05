import { makeAutoObservable, makeObservable } from "mobx";

class splash {
  state = {
    showProgress: false,
    background: true,
    timeelapsed: true,
    showCSS: false,
    animation: "",
    animationtype: "",
    onCompleteAction: () => {},
    play: "",
  };

  constructor() {
    makeAutoObservable(this);
  }

  closeProgress() {
    this.state = {
      ...this.state,
      showProgress: false,
    };
  }

  showAppLoader(background = false, delay = 1500) {
    setTimeout(() => {
      this.state = {
        ...this.state,
        timeelapsed: true,
      };
    }, delay);

    this.state = {
      animationtype: "css",
      showProgress: true,
      background,
      timeelapsed: false,
    };
  }

  setShowProgress(
    background = false,
    animation = "progressdots",
    delay = 1500
  ) {
    console.log("променад");
    setTimeout(() => {
      this.state = {
        ...this.state,
        timeelapsed: true,
      };
    }, delay);

    this.state = {
      ...this.state,
      animationtype: "lottie",
      showProgress: true,
      background,
      animation,
      timeelapsed: false,
    };
  }

  setGotoplayLottie(background = false, animation = "ok", action = () => {}) {
    this.state = {
      ...this.state,
      animationtype: "gotoplayLottie",
      showProgress: true,
      play: "start",
      background,
      animation,
      onCompleteAction: () => {
        this.state = { ...this.state, play: "", showProgress: false };
        action();
      },
    };
  }

  showCountDown(background = false, action = () => {}) {
    this.state = {
      ...this.state,
      animationtype: "countdown",
      showProgress: true,
      background,
      onCompleteAction: () => {
        this.state = { ...this.state, showProgress: false };
        action();
      },
    };
  }
}

export default new splash();
