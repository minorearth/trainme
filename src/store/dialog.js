import { makeObservable, makeAutoObservable } from "mobx";
class alertdialog {
  dialogState = { visible: false, text: "", title: "" };

  showDialog(title, text, type, actionOk = () => {}, actionCancel = () => {}) {
    this.dialogState.title = title;
    this.dialogState.text = text;
    this.dialogState.visible = true;
    this.dialogState.actionOk = actionOk;
    this.dialogState.actionCancel = actionCancel;
    this.dialogState.type = type;
  }
  okDialog() {
    this.dialogState.visible = false;
    this.dialogState.actionOk();
  }
  cancelDialog() {
    this.dialogState.visible = false;
    this.dialogState.actionCancel();
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new alertdialog();
