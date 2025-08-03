import { makeObservable, makeAutoObservable } from "mobx";
import { updateKeySCP } from "@/db/localstorageDB";
import { CourseProgressDB, UserName } from "tpconst/T";
import { USERPROGRESS_DEFAULTS } from "tpconst/typesdefaults";
// import { getUserMetaCourseProgress } from "@/userlayers/repository/repositoryUserMeta";

class user {
  userid = "";
  isa = false;
  username: UserName = "";
  progress: CourseProgressDB = USERPROGRESS_DEFAULTS;
  avatarid = 0;

  setProgressP = (data: CourseProgressDB) => {
    this.progress = data;
    updateKeySCP({ user: { progress: data } }, "user");
  };

  setProgress(data: CourseProgressDB) {
    this.progress = data;
  }

  setUserid(id: string) {
    this.userid = id;
  }

  setAvatarId(id: number) {
    this.avatarid = id;
  }

  setUserNameP = (username: string) => {
    this.username = username;
    updateKeySCP(
      {
        user: { username },
      },
      "user"
    );
  };

  setUserName = (username: string) => {
    this.username = username;
  };

  constructor() {
    makeAutoObservable(this);
  }
}

const newinstance = new user();
export default newinstance;
