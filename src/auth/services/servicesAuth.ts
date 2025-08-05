import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "tpconst/lang";
import { login, logout } from "@/globals/next/session";

//repository
import {
  signInUser,
  launchAuthStateChangeMonitor,
  createUser,
  signOutUserRep,
} from "tpconst/RP/FB";
import { getFreeCoursesIds } from "@/db/localRepository/repositoryLocalFiles";
import { getUserMeta } from "@/app/api/apicalls/dataFetch";
import { createNewUserMeta } from "tpconst/RP/FB";

//services
import { getInitalDataForFreeCourses } from "@/components/courses/layers/services/services";

//stores
import user from "@/auth/store/user";
import splash from "@/components/common/splash/store";

//types
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

//globals
import S from "@/globals/settings";
import {
  E_CODES,
  finalErrorHandler,
  throwInnerError,
} from "tpconst/errorHandlers";

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
      paidcourses2: {},
    };
    //hello
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
    const uid = await getUidAuth({ email, password });
    const userMeta = await getUserMeta(uid);

    user.setUserNameP(userMeta.name);
    router.push(`/${S.P.CHAPTERS}`);
  } catch (e) {
    finalErrorHandler(e, dialogs, L.ru.msg);
  }
};

export const signOut = async (router: AppRouterInstance) => {
  splash.showProgress(false, "progressdots", 0);
  await logout();
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
  if (emailVerified && uid) {
    await login("teacher");
    // user.setUserid({ id: uid });
    resolved(uid);
  } else if (!uid) {
    resolved("noUser");
    logout();
  } else {
    resolved(E_CODES.EMAIL_NOT_VERIFIED);
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
    await logout();
    await signInUser({ email, password });
    return await launchAuthStateChangeMonitor(actionOnAuthChanged);
  } catch (e: unknown) {
    throw throwInnerError(e);
  }
};
