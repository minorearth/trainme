import { makeAutoObservable, makeObservable } from "mobx";

class themeSwitch {
  darkmode = true;

  constructor() {
    makeAutoObservable(this);
  }

  setDarkMode(darkmode: boolean) {
    this.darkmode = darkmode;
  }
}

export default new themeSwitch();
