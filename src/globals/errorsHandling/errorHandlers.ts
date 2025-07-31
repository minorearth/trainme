import { E_CODES, E_FB_CODES } from "./errorCodes";

export const throwFBError = ({
  code,
  message,
}: {
  code: string;
  message: string;
}): never => {
  console.log(`"FB error:${message}, FB error code: ${code}"`);

  if (code === E_FB_CODES.INVALID_SIGNIN_CREDENTIALS) {
    throw new Error(E_CODES.WRONG_PSW);
  }

  if (code === E_FB_CODES.INVALID_SIGNUP_EMAIL) {
    throw new Error(E_CODES.INVALID_EMAIL_SIGNUP_ERROR);
  }

  if (Number(code) === E_FB_CODES.NOT_FOUND) {
    throw new Error(E_CODES.DOCUMENT_NOT_FOUND);
  }

  throw Error(E_CODES.UNKNOWN_FB_ERROR);
};

//here wee have both FB errors and common fetch errors
export const throwFetchAPIError = (error: unknown): never => {
  const e = error as TypeError;
  //TODO: add impovved loggin here and everywhere
  console.log(`"fetch error:${e.message}`);

  //do not remove, will be enriched with common fetch errors
  // if (e.code === E.FB.INVALID_SIGNIN_CREDENTIALS) {
  //   throw new Error(E.WRONG_PSW);
  // }

  throw Error(e.message);
};

export default E_CODES;

export const getNextErrorResponse = (error: unknown) => {
  const e = error as Error;
  return { success: false, message: e.message };
};

export const throwInnerError = (e: unknown) => {
  const error = e as Error;
  console.log("Interim error:", error.message);
  throw e;
};

export const finalErrorHandler = (
  e: unknown,
  dialogs: { [key: string]: (...params: any) => void },
  msg: any
) => {
  const error = e as Error;
  console.log("final", error.message);
  const errorParams = msg[error.message] || undefined;
  if (!errorParams) {
    dialogs["basic"](msg["unknown_error"].params);
    return;
  }
  const params = {
    ...errorParams.params,
    ...(error.cause as {}),
  };
  dialogs[errorParams.dialog](params);
  return;
};
