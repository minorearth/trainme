import { makeObservable, makeAutoObservable } from "mobx";
class alertdialog {
  dialogState = { visible: false, text: "", title: "" };

  showDialog(title, text, action = () => {}) {
    this.dialogState.title = title;
    this.dialogState.text = text;
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

export default new alertdialog();
