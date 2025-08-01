import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "tpconst/lang";
import { login } from "@/db/FB/SA/session";

//repository
import {
  signInUser,
  launchAuthStateChangeMonitor,
  createUser,
  signOutUserRep,
} from "@/db/repository/repositoryFBAuth";
import { getFreeCoursesIds } from "@/db/repository/repositoryLocalFiles";
import { getUserMeta } from "@/db/repository/repositoryFetch";
import { createNewUserMeta } from "@/db/repository/repositoryFBCA";

//services
import { getInitalDataForFreeCourses } from "@/components/courses/layers/services/services";

//stores
import user from "@/auth/store/user";
import splash from "@/components/common/splash/store";

//types
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { User } from "firebase/auth";

//globals
import S from "@/globals/settings";
import {
  finalErrorHandler,
  throwInnerError,
} from "@/globals/errorsHandling/errorHandlers";

//error handling

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
    const freecoursesIds = getFreeCoursesIds();
    const coursesInitials = getInitalDataForFreeCourses();
    const userId = user.uid;
    const data = {
      name,
      userId,
      paidcourses: freecoursesIds,
      courses: coursesInitials,
    };

    createNewUserMeta({ userId, data });
    return userId;
  } catch (e: unknown) {
    finalErrorHandler(e, dialogs, L.ru.msg);
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
    finalErrorHandler(e, dialogs, L.ru.msg);
  }
};

export const signOut = async (router: AppRouterInstance) => {
  await signOutUserRep();
  splash.closeProgress();
  router.push(`/${S.P.LOGIN}/`);
};

const actionOnAuthChanged = async (
  resolved: (value: string) => void,
  uid: string,
  emailVerified: boolean
  // login: (value: string) => Promise<void>
) => {
  if (user) {
    if (emailVerified) {
      await login("teacher");
      resolved(uid);
    } else {
      resolved("email_not_veryfied");
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
