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
import splash from "@/components/common/splash/store";

import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "firebase/auth";
import S from "@/globals/settings";

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
  try {
    const response = await getUidAuth({ email, password });
    const userMeta = await getUserMeta(response);

    user.setUserNameP(userMeta.name);
    router.push(`/${S.P.CHAPTERS}`);
  } catch (e) {
    const error = e as Error;
    console.log("error.nenef", error.message);

    if (error.message == "notVerified") {
      da.info.emailnotverified();
      return;
    }
    if (error.message == "wrongpsw") {
      da.info.wrongpsw();
      return;
    }
  }

  //TODO: throw error

  // if (response == "notVerified") {
  //   da.info.emailnotverified();
  //   return;
  // }

  // if (response == "wrongpsw") {
  //   da.info.wrongpsw();
  //   return;
  // }

  // const userMeta = await getUserMeta(response);

  // user.setUserNameP(userMeta.name);
  // router.push(`/${S.P.CHAPTERS}`);
};

export const signOut = async (router: AppRouterInstance) => {
  await signOutUserRep();
  splash.closeProgress();

  router.push(`/${S.P.LOGIN}/`);
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
  try {
    const res = await signInUser({ email, password });
    return res ?? (await launchAuthStateChangeMonitor(actionOnAuthChanged));
  } catch (e: unknown) {
    const error = e as Error; // приведение типа
    throw new Error(error.message);
  }
};
