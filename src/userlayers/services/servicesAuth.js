import { da } from "@/components/common/dialog/dialogMacro";

//repository
import {
  signInUser,
  launchAuthStateChangeMonitor,
  createUser,
  signOutUserRep,
} from "@/userlayers/repository/repositoryAuth";

import {
  createNewUserMeta,
  getUserMeta,
} from "@/userlayers/repository/repositoryUserMeta";

//stores
import user from "@/userlayers/store/user";

export const signUp = async (email, password, name) => {
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

export const signIn = async (email, password, router) => {
  const uid = await getUidAuth(email, password);

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

export const signOut = async (router) => {
  await signOutUserRep();
  router.push(`/login/`);
};

const actionOnAuthChanged = async (resolved, user, login) => {
  if (user) {
    if (user.emailVerified) {
      await login("teacher");
      resolved(user.uid);
    } else {
      resolved("notVerified");
    }
  } else {
  }
};

const getUidAuth = async (email, password) => {
  const res = await signInUser(email, password);
  // const uid =
  //   res == "wrongpsw"
  //     ? "wrongpsw"
  //     : await launchAuthStateChangeMonitor(actionOnAuthChanged);

  return res ?? (await launchAuthStateChangeMonitor(actionOnAuthChanged));
};
