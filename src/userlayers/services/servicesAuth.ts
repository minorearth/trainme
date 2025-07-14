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

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "firebase/auth";

export const signUp = async ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  try {
    const user = await createUser({ email, password });
    const userid = user.uid;
    createNewUserMeta({ userId: userid, name });
    return userid;
  } catch (error) {
    // const errorCode = error.code;
    // const errorMessage = error.message;
  }
};

export const signIn = async ({
  email,
  password,
  router,
}: {
  email: string;
  password: string;
  router: AppRouterInstance;
}) => {
  const uid = await getUidAuth({ email, password });

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

export const signOut = async (router: AppRouterInstance) => {
  await signOutUserRep();
  router.push(`/login/`);
};

const actionOnAuthChanged = async (
  resolved: (value: string) => void,
  user: User | null,
  login: (value: string) => Promise<void>
) => {
  if (user) {
    if (user.emailVerified) {
      await login("teacher");
      resolved(user.uid);
    } else {
      resolved("notVerified");
    }
  } else {
    resolved("noUser");
  }
};

const getUidAuth = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await signInUser({ email, password });

  return res ?? (await launchAuthStateChangeMonitor(actionOnAuthChanged));
};
