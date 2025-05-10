import { makeObservable, makeAutoObservable } from "mobx";
class stat {
  userstat = [];
  chaptersobj = {};

  setStat(data) {
    this.userstat = data;
  }

  setChaptersObj(data) {
    this.chaptersobj = data;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new stat();
