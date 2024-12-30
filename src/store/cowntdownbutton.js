import { makeObservable, makeAutoObservable } from "mobx";
class countdownbutton {
  dialogState = { visible: false, action: () => {} };

  showDialog(action = () => {}) {
    this.dialogState.visible = true;
    this.dialogState.action = action;
  }
  closeDialog() {
    this.dialogState.visible = false;
    this.dialogState.action();
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new countdownbutton();
