type LotieAnimationFileName = string;

export const AT = {
  gotoplayLottie: "gotoplayLottie",
  lottie: "lottie",
  countdown: "countdown",
  css: "css",
  undefined: "undefined",
};

type AnimationType = (typeof AT)[keyof typeof AT];

import { makeAutoObservable, makeObservable } from "mobx";
interface SplashState {
  background: boolean;
  showCSS: boolean;
  animation: LotieAnimationFileName;
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
    animation: "",
    animationtype: AT.undefined,
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
      animationtype: AT.css,
      background,
    };
  }

  showProgress(
    background: boolean = false,
    animation: LotieAnimationFileName = "progressdots",
    delay: number = 500
  ) {
    this.shown = true;
    this.delayed = true;

    setTimeout(() => {
      this.delayed = false;
    }, delay);

    this.state = {
      ...this.state,
      animationtype: AT.lottie,
      background,
      animation,
    };
  }

  gotoplayLottie(
    background: boolean = false,
    animation: LotieAnimationFileName = "ok",
    action = () => {}
  ) {
    this.shown = true;
    this.delayed = false;

    this.state = {
      ...this.state,
      animationtype: AT.gotoplayLottie,
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
      animationtype: AT.countdown,
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
