import { makeObservable, makeAutoObservable } from "mobx";
import { updateSCP, updateKeySCP } from "@/db/localstorage";
import { USERPROGRESS_DEFAULTS } from "@/T/typesdefaults";
import { CourseProgressDB, UserName } from "@/T/typesDB";
import { UserStatePersisted } from "@/T/typesState";
// import { getUserMetaCourseProgress } from "@/userlayers/repository/repositoryUserMeta";

class user {
  userid = "";
  isa = false;
  username: UserName = "";
  progress: CourseProgressDB = USERPROGRESS_DEFAULTS;
  avatarid = 0;
  actions = {};

  setProgressP = (data: CourseProgressDB) => {
    this.progress = data;
    updateKeySCP({ user: { progress: data } }, "user");
  };

  setProgress(data: CourseProgressDB) {
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
