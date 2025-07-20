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
import E, { finalErrorHandler, throwInnerError } from "@/globals/errorMessages";

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
  } catch (e: unknown) {
    finalErrorHandler(e);
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
    finalErrorHandler(e);
  }
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

//ok
const getUidAuth = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await signInUser({ email, password });
    return await launchAuthStateChangeMonitor(actionOnAuthChanged);
  } catch (e: unknown) {
    throw throwInnerError(e);
  }
};
