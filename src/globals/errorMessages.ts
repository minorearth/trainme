import { FirestoreError } from "firebase/firestore";
import { NextResponse } from "next/server";

// import { FirestoreError } from '@firebase/util';

import { da } from "@/components/common/dialog/dialogMacro";

const E = {
  EMAIL_NOT_VERIFIED: "notVerified",
  WRONG_PSW: "wrongpsw",
  UNKNOWN_FB_ERROR: "unknown_FB_error",
  INVALID_EMAIL_SIGNUP_ERROR: "invalid_email_signup_error",
  UNKNOWN_SIGNUP_ERROR: "unknown_auth_signup_error",
  NOT_ENOUGHT_TASKS_ERROR: `not_enought_tasks`,
  DOCUMENT_NOT_FOUND: `document_not_found`,

  FB: {
    INVALID_SIGNIN_CREDENTIALS: "auth/invalid-credential",
    INVALID_SIGNUP_EMAIL: "auth/invalid-email",
    NOT_FOUND: 5,
  },
};

export const throwFBError = (error: unknown): never => {
  const e = error as FirestoreError;
  console.log(`"FB error:${e.message}, FB error code: ${e.code}"`);

  if (e.code === E.FB.INVALID_SIGNIN_CREDENTIALS) {
    throw new Error(E.WRONG_PSW);
  }

  if (e.code === E.FB.INVALID_SIGNUP_EMAIL) {
    throw new Error(E.INVALID_EMAIL_SIGNUP_ERROR);
  }

  if (Number(e.code) === E.FB.NOT_FOUND) {
    throw new Error(E.DOCUMENT_NOT_FOUND);
  }

  throw Error(E.UNKNOWN_FB_ERROR);
};

export default E;

export const NextErrorResponseHandler = (error: unknown) => {
  const e = error as Error;
  console.error("Error response");
  return NextResponse.json(
    { success: false, message: e.message },
    { status: 500 }
  );
};

export const throwInnerError = (e: unknown) => {
  const error = e as Error;
  console.log("Interim error:", error.message);
  throw e;
};

export const finalErrorHandler = (e: unknown) => {
  const error = e as Error;
  console.log("error.message", error.message);
  if (error.message == E.DOCUMENT_NOT_FOUND) {
    da.info.DBNotFound();
    return;
  }

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
