import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP, updateKeySCP } from "@/db/localstorage";
import { getUserCourseProgress } from "@/userlayers/repository/repository";
import { checkNickName } from "@/components/champ/layers/services/utils";

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
    this.nicknamechecked = checkNickName(nickname);
    this.nickname = nickname;
  }

  setProgressP = (data) => {
    this.progress = data;
    updateKeySCP({ progress: data }, "user");
  };

  setProgress(data) {
    this.progress = data;
  }

  setUserid({ id }) {
    this.userid = id;
  }

  setAvatarId(id) {
    this.avatarid = id;
  }

  setUserNameP = (username) => {
    this.username = username;
    updateSCP({
      user: { username },
    });
  };

  setUserName = (username) => {
    this.username = username;
    this.nickname = username;
    this.nicknamechecked = checkNickName(username);
  };

  // setUserName(name) {
  //   this.username = name;
  //   this.nickname = nickname;
  // }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new user();
