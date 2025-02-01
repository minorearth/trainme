import { makeAutoObservable, makeObservable } from "mobx";

class themeSwitch {
  darkmode = true;

  constructor() {
    makeAutoObservable(this);
  }

  setDarkMode(darkmode) {
    this.darkmode = darkmode;
  }
}

export default new themeSwitch();
