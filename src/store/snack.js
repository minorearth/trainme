import { makeObservable, makeAutoObservable } from "mobx";
class snack {
  snackState = { visible: false, text: "" };

  showSnack(text) {
    this.snackState.text = text;
    this.snackState.visible = true;
  }
  closeSnack() {
    this.snackState.visible = false;
  }
  constructor() {
    makeAutoObservable(this);
  }
}

export default new snack();
