import { makeObservable, makeAutoObservable } from "mobx";
class stat {
  userstat = [];
  chaptersobj = {};
  groupsdata = [];
  code = "";
  report = {};
  userstatvisible = false;
  reportvisible = false;
  userMetaObj = {};
  groupSelected = -1;

  setStat(data) {
    this.userstat = data;
    this.reportvisible = false;
    this.userstatvisible = true;
  }

  setGroupData(data) {
    this.groupsdata = data;
  }

  setUserMetaObj(data) {
    this.userMetaObj = data;
  }

  setGroupSelected(groupid) {
    this.groupSelected = groupid;
  }

  setReport(data) {
    this.report = data;
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
