import { makeObservable, makeAutoObservable } from "mobx";

class tutorial {
  visible = false;

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new tutorial();
