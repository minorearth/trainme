import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP } from "@/db/localstorage";
import { getUserCourseProgress } from "@/store/userMobx";

class user {
  userid = "";
  isa = false;
  name = "";
  progress = {};
  avatarid = 0;
  nickname = "";
  nicknamechecked = false;
  actions = { getUserCourseProgress };

  changeNickName(nickname) {
    //TODO: ё letter is forbidden somehow
    const correctNick = /^[А-яA-Za-z][А-яA-Za-z0-9 ]{0,25}$/.test(nickname);
    this.nicknamechecked = correctNick;
    this.nickname = nickname;
  }
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

  setAvatarId(id) {
    this.avatarid = id;
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
