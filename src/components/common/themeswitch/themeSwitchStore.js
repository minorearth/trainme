import { makeAutoObservable, makeObservable } from "mobx";
import { loadSetupPersisted } from "@/db/localstorage";

class themeSwitch {
  darkmode = true;

  constructor() {
    makeAutoObservable(this);
    const setup = loadSetupPersisted();
    this.darkmode = null ? setup.darktheme : true;
  }

  setDarkMode(darkmode) {
    this.darkmode = darkmode;
  }
}

export default new themeSwitch();
