import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  browserSessionPersistence,
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signOut,
  setPersistence,
} from "firebase/auth";

import { login, logout } from "@/db/SA/session";
import { createNewUserClient } from "@/db/domain/domain";

export const setPersistenceDB = async (auth) => {
  await setPersistence(auth, browserLocalPersistence);
};

export const signIn = async (auth, email, password) => {
  await logout();
  await setPersistenceDB(auth);
  await signInWithEmailAndPassword(auth, email, password);
  const getid = new Promise((resolved, rejected) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        auth.languageCode = "ru";
        if (user.emailVerified) {
          await login("teacher");
          resolved(user.uid);
        } else {
          // sendEmailVerification(user).then(() => {});
          resolved("notVerified");
        }
      } else {
      }
    });
  });
  const uid = await getid;
  return uid;
};

export const resetPsw = (auth, email) => {
  sendPasswordResetEmail(auth, email);
};

export const SignUpUser = async (auth, email, password, name, company) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const userid = userCredential.user.uid;
    sendEmailVerification(userCredential.user).then(() => {});
    createNewUserClient(userid, name, company);
    return userCredential.user.uid;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
  }
};

export const signOutUser = async (auth) => {
  await signOut(auth)
    .then(() => {
      logout();
    })
    .catch((error) => {});
};

// export async function signInStudent(pincode) {
//   const zz = await checkIfUniqueExistAndReturnDocDM("myusers", {
//     login: pincode,
//   });

//   const allow = zz != "multiple" && zz != "none";
//   allow && login("student");
// }
