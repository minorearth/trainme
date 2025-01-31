import { makeAutoObservable, makeObservable } from "mobx";

class themeSwitch {
  state = { darkmode: true };

  constructor() {
    makeAutoObservable(this);
  }

  setDarkMode(darkmode) {
    this.state = { ...this.state, darkmode };
  }
}

export default new themeSwitch();
