import { logout } from "@/globals/next/session";

import {
  createUserDB,
  launchAuthStateChangeMonitorDB,
  resetPswDB,
  signInUserDB,
  signOutUserDB,
} from "@/db/FB/CA/fireebaseauth";
import { throwInnerError } from "tpconst/errorHandlers";

export const signInUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    await logout();
    await signInUserDB({ email, password });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const launchAuthStateChangeMonitor = async (
  action: (
    resolved: (value: string) => void,
    uid: string,
    emailVerified: boolean
  ) => void
) => {
  try {
    return await launchAuthStateChangeMonitorDB(action);
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const createUser = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  try {
    return await createUserDB({
      email,
      password,
    });
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const resetPsw = async (email: string) => {
  try {
    await resetPswDB(email);
  } catch (error) {
    throw throwInnerError(error);
  }
};

export const signOutUserRep = async () => {
  try {
    await signOutUserDB();
    await logout();
  } catch (error) {
    throw throwInnerError(error);
  }
};
