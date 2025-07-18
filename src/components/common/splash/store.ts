type Animation = "undefined" | "progressdots" | "ok";
type AnimationType =
  | "gotoplayLottie"
  | "lottie"
  | "countdown"
  | "css"
  | "undefined";

import { makeAutoObservable, makeObservable } from "mobx";
interface SplashState {
  background: boolean;
  showCSS: boolean;
  animation: Animation;
  animationtype: AnimationType;
  onCompleteAction: () => void;
  play: boolean;
}

class splash {
  delayed = false;
  shown = false;
  state: SplashState = {
    background: true,
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
    this.shown = false;
  }

  showAppLoader(background = false, delay = 5500) {
    this.shown = true;
    this.delayed = true;

    setTimeout(() => {
      this.delayed = false;
    }, delay);

    this.state = {
      ...this.state,
      animationtype: "css",
      background,
    };
  }

  showProgress(
    background: boolean = false,
    animation: Animation = "progressdots",
    delay: number = 500
  ) {
    this.shown = true;
    this.delayed = true;

    setTimeout(() => {
      this.delayed = false;
    }, delay);

    this.state = {
      ...this.state,
      animationtype: "lottie",
      background,
      animation,
    };
  }

  gotoplayLottie(
    background: boolean = false,
    animation: Animation = "ok",
    action = () => {}
  ) {
    this.shown = true;
    this.delayed = false;

    this.state = {
      ...this.state,
      animationtype: "gotoplayLottie",
      play: true,
      background,
      animation,
      onCompleteAction: () => {
        this.state = { ...this.state, play: false };
        this.shown = false;
        action();
      },
    };
  }

  showCountDown(background = false, action = () => {}) {
    this.shown = true;
    this.delayed = false;

    this.state = {
      ...this.state,
      animationtype: "countdown",
      background,
      onCompleteAction: () => {
        this.shown = false;
        action();
      },
    };
  }
}
const instance = new splash();

export default instance;
