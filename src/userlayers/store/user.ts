import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP, updateKeySCP } from "@/db/localstorage";
import { UserProgress } from "@/types";
import { USERPROGRESS_DEFAULTS } from "@/typesdefaults";
// import { getUserMetaCourseProgress } from "@/userlayers/repository/repositoryUserMeta";

class user {
  userid = "";
  isa = false;
  username = "";
  progress: UserProgress = USERPROGRESS_DEFAULTS;
  avatarid = 0;
  actions = {};

  setProgressP = (data: UserProgress) => {
    this.progress = data;
    updateKeySCP({ progress: data }, "user");
  };

  setProgress(data: UserProgress) {
    this.progress = data;
  }

  setUserid({ id }: { id: string }) {
    this.userid = id;
  }

  setAvatarId(id: number) {
    this.avatarid = id;
  }

  setUserNameP = (username: string) => {
    this.username = username;
    updateSCP({
      user: { username },
    });
  };

  setUserName = (username: string) => {
    this.username = username;
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export default new user();
