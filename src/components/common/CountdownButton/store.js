import { makeObservable, makeAutoObservable } from "mobx";
class countdownbutton {
  state = { visible: false, action: () => {} };

  showButton(action = () => {}) {
    this.state.visible = true;
    this.state.action = action;
  }
  hideButton() {
    this.state.visible = false;
    this.state.action();
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new countdownbutton();
