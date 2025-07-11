import { makeObservable, makeAutoObservable } from "mobx";
class alertdialog {
  dialogState = {
    visible: false,
    text: "",
    title: "",
    actionOk: () => {},
    actionCancel: () => {},
    type: 0,
  };

  showDialog(
    title: string,
    text: string,
    type: number,
    actionOk: () => void = () => {},
    actionCancel: () => void = () => {}
  ) {
    this.dialogState.title = title;
    // this.dialogState.maxwidth = maxwidth;
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

  hideDialog() {
    this.dialogState.visible = false;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new alertdialog();
