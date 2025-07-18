type Animation = "undefined" | "progressdots" | "ok";
type AnimationType =
  | "gotoplayLottie"
  | "lottie"
  | "countdown"
  | "css"
  | "undefined";

import { makeAutoObservable, makeObservable } from "mobx";
interface SplashState {
  showProgress: boolean;
  background: boolean;
  timeelapsed: boolean;
  showCSS: boolean;
  animation: Animation;
  animationtype: AnimationType;
  onCompleteAction: () => void;
  play: boolean;
}

class splash {
  state: SplashState = {
    showProgress: false,
    background: true,
    timeelapsed: true,
    showCSS: false,
    animation: "undefined",
    animationtype: "undefined",
    onCompleteAction: () => {},
    play: false,
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
      ...this.state,
      animationtype: "css",
      showProgress: true,
      background,
      timeelapsed: false,
    };
  }

  setShowProgress(
    background: boolean = false,
    animation: Animation = "progressdots",
    delay: number = 1500
  ) {
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

  setGotoplayLottie(
    background: boolean = false,
    animation: Animation = "ok",
    action = () => {}
  ) {
    this.state = {
      ...this.state,
      animationtype: "gotoplayLottie",
      showProgress: true,
      play: true,
      background,
      animation,
      onCompleteAction: () => {
        this.state = { ...this.state, play: false, showProgress: false };
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
const instance = new splash();

export default instance;
