import { makeObservable, makeAutoObservable } from "mobx";
class user {
  userid = "";
  isa = false;

  setUserid(id, isadmin) {
    this.userid = id;
    this.isa = !!isadmin;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new user();
