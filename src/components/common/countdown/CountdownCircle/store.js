import { makeObservable, makeAutoObservable } from "mobx";
class countdowncircle {
  state = { visible: false, action: () => {} };

  show(action = () => {}) {
    this.state.visible = true;
    this.state.action = action;
  }
  close() {
    this.state.visible = false;
    this.state.action();
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new countdowncircle();
