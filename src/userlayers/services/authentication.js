import { da } from "@/components/common/dialog/dialogMacro";

//repository
import {
  signInUser,
  launchAuthStateChangeMonitor,
  createUser,
  signOutUserRep,
} from "@/userlayers/repository/authrepository";
import { createNewUserMeta } from "@/userlayers/repository/repository";

//api calls
import { getDataFetch } from "@/apicalls/apicalls";
import user from "@/userlayers/store/user";

//server functions
import { logout } from "@/db/SA/session";

export const signIn = async (email, password) => {
  await logout();
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

  const allUserMeta = await getDataFetch({
    data: { uid },
    type: "getusermetadata",
  });

  user.setUserNameP(allUserMeta.name);
  router.push(`/chapters`);
};

export const signOutUser = async (router) => {
  await signOutUserRep();
  router.push(`/login/`);
};

// export async function signInStudent(pincode) {
//   const zz = await checkIfUniqueExistAndReturnDocDM("myusers", {
//     login: pincode,
//   });

//   const allow = zz != "multiple" && zz != "none";
//   allow && login("student");
// }
