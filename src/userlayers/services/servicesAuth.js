import { da } from "@/components/common/dialog/dialogMacro";

//repository
import {
  signInUser,
  launchAuthStateChangeMonitor,
  createUser,
  signOutUserRep,
  getUserMeta,
} from "@/userlayers/repository/repositoryAuth";
import { createNewUserMeta } from "@/userlayers/repository/repositoryUserMeta";

//stores
import user from "@/userlayers/store/user";

export const signIn = async (email, password) => {
  const res = await signInUser(email, password);
  const uid =
    res == "wrongpsw" ? "wrongpsw" : await launchAuthStateChangeMonitor();
  return uid;
};

export const signUpUser = async (email, password, name) => {
  try {
    const user = await createUser(email, password);
    const userid = user.uid;
    createNewUserMeta(userid, name);
    return userid;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

export const signInNow = async (email, password, router) => {
  const uid = await signIn(email, password);

  if (uid == "notVerified") {
    da.info.emailnotverified();
    return;
  }

  if (uid == "wrongpsw") {
    da.info.wrongpsw();
    return;
  }

  const userMeta = await getUserMeta(uid);

  user.setUserNameP(userMeta.name);
  router.push(`/chapters`);
};

export const signOutUser = async (router) => {
  await signOutUserRep();
  router.push(`/login/`);
};
