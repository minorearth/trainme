import { FirebaseError } from "firebase/app";

import { da } from "@/components/common/dialog/dialogMacro";

const E = {
  EMAIL_NOT_VERIFIED: "notVerified",
  WRONG_PSW: "wrongpsw",
  UNKNOWN_FB_ERROR: "unknown_FB_error",
  INVALID_EMAIL_SIGNUP_ERROR: "invalid_email_signup_error",
  UNKNOWN_SIGNUP_ERROR: "unknown_auth_signup_error",
  NOT_ENOUGHT_TASKS_ERROR: `not_enought_tasks`,

  FB: {
    INVALID_SIGNIN_CREDENTIALS: "auth/invalid-credential",
    INVALID_SIGNUP_EMAIL: "auth/invalid-email",
  },
};

export const handleFBError = (e: unknown): never => {
  const error = e as FirebaseError;
  console.log("FB error:", error.message, error.stack);

  if (error.code === E.FB.INVALID_SIGNIN_CREDENTIALS) {
    throw new Error(E.WRONG_PSW);
  }

  if (error.code === E.FB.INVALID_SIGNUP_EMAIL) {
    throw new Error(E.INVALID_EMAIL_SIGNUP_ERROR);
  }

  throw Error(E.UNKNOWN_FB_ERROR);
};

export default E;

export const throwInnerError = (e: unknown) => {
  const error = e as Error;
  console.log("Interim error:", error.message);
  throw e;
};

export const finalErrorHandler = (e: unknown) => {
  const error = e as Error;
  if (error.message == E.EMAIL_NOT_VERIFIED) {
    da.info.emailnotverified();
    return;
  }
  if (error.message == E.WRONG_PSW) {
    da.info.wrongpsw();
    return;
  }
  if (error.message == E.NOT_ENOUGHT_TASKS_ERROR) {
    const { count } = error.cause as { count: number };
    da.info.notenoughttasks(count);
    return;
  }
  da.info.unknownerror();
};
