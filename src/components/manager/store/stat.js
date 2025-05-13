import { makeObservable, makeAutoObservable } from "mobx";
class stat {
  userstat = [];
  chaptersobj = {};
  code = "";
  report = [];
  userstatvisible = false;
  reportvisible = false;

  setStat(data) {
    this.userstat = data;
    this.reportvisible = false;
    this.userstatvisible = true;
  }

  setReport(data) {
    this.userstat = data;
    this.userstatvisible = false;
    this.reportvisible = true;
  }

  setChaptersObj(data) {
    this.chaptersobj = data;
  }

  setCode(data) {
    this.code = data;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new stat();
