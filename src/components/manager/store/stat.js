import { makeObservable, makeAutoObservable } from "mobx";
class stat {
  userstat = [];
  chaptersobj = {};
  code = "";

  setStat(data) {
    this.userstat = data;
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
