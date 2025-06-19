import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP, updateKeySCP } from "@/db/localstorage";
import { getUserCourseProgress } from "@/store/userMobx";

class user {
  userid = "";
  isa = false;
  username = "";
  progress = {};
  avatarid = 0;
  nickname = "";
  nicknamechecked = false;
  actions = { getUserCourseProgress };

  changeNickName(nickname) {
    const correctNick = /^[А-яёЁёA-Za-z][А-яёЁA-Za-z0-9 ]{0,25}$/.test(
      nickname
    );
    this.nicknamechecked = correctNick;
    this.nickname = nickname;
  }

  setProgress = (data) => {
    this.progress = data;
    updateKeySCP({ progress: data }, "user");
  };

  setProgressNP(data) {
    this.progress = data;
  }

  setUserid({ id }) {
    this.userid = id;
  }

  setAvatarId(id) {
    this.avatarid = id;
  }

  setUserName = (username) => {
    this.username = username;
    updateSCP({
      user: { username },
    });
  };

  setUserNameNP(name) {
    console.log(name);
    this.username = name;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new user();
