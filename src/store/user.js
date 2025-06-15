import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";

class user {
  userid = "";
  isa = false;
  name = "";
  progress = {};

  setProgress(data) {
    this.progress = data;
    updateSCP({
      user: { progress: data },
    });
  }

  setUserid({ id }) {
    this.userid = id;
    // this.isa = !!isadmin;
  }

  setUser({ id, name }) {
    this.userid = id;
    this.name = name;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new user();
