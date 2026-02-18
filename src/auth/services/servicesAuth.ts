import { dialogs } from "@/components/common/dialog/dialogMacro";
import { L } from "@/tpconst/src/lang";
import { login, logout } from "@/globals/next/session";

//repository
import {
  signInUser,
  launchAuthStateChangeMonitor,
  createUser,
  signOutUserRep,
} from "@/tpconst/src/RP/FB";
import { getFreeCoursesIds } from "@/db/localRepository/repositoryLocalFiles";
import { getUserMeta } from "@/app/api/apicalls/dataFetch";
import { createNewUserMeta } from "@/tpconst/src/RP/FB";

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
  E_CODES_DIALOG,
  finalErrorHandler,
  throwInnerErrorCause,
  throwInnerError,
} from "@/tpconst/src/errorHandlers";

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
    try {
      createNewUserMeta({ userId, data });
    } catch (e) {
      throw throwInnerErrorCause(
        E_CODES_DIALOG.PROCEDURE_ERROR,
        `usermetaCreationError: ${JSON.stringify(data)}`,
      );
    }
    return userId;
  } catch (error) {
    throw throwInnerError(error);
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
    splash.closeProgress();
  }
};

export const signOut = async (router: AppRouterInstance) => {
  splash.showProgress(false, "progressdots", 0);
  await logout();
  await signOutUserRep();
  // splash.closeProgress();
  router.push(`/${S.P.LOGIN}/`);
};

const actionOnAuthChanged = async (
  resolved: (value: string) => void,
  rejected: (value: string) => void,
  uid: string,
  emailVerified: boolean,
  // login: (value: string) => Promise<void>
) => {
  if (emailVerified && uid) {
    await login("teacher");
    resolved(uid);
  } else if (!uid) {
    rejected(E_CODES_DIALOG.NO_USER);
    logout();
  } else {
    rejected(E_CODES_DIALOG.EMAIL_NOT_VERIFIED);
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
