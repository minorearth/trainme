import { E_CODES_DIALOG, E_FB_CODES } from "./errorCodes";

export const throwFBError = ({
  code,
  message,
}: {
  code: string;
  message: string;
}): never => {
  console.error(`"FB error:${message}, FB error code: ${code}"`);

  if (code === E_FB_CODES.INVALID_SIGNIN_CREDENTIALS) {
    throw new Error(E_CODES_DIALOG.WRONG_PSW);
  }

  if (code === E_FB_CODES.INVALID_SIGNUP_EMAIL) {
    throw new Error(E_CODES_DIALOG.INVALID_EMAIL_SIGNUP_ERROR);
  }

  if (code === E_FB_CODES.EMAIL_IN_USE) {
    throw new Error(E_CODES_DIALOG.EMAIL_IN_USE_ERROR);
  }

  if (Number(code) === E_FB_CODES.NOT_FOUND) {
    throw new Error(E_CODES_DIALOG.DOCUMENT_NOT_FOUND);
  }

  throw Error(E_CODES_DIALOG.UNKNOWN_FB_ERROR);
};

export const throwFetchAPIError = (result: any): never => {
  console.error(`"fetch error:${result.message} ${result.cause}`);

  //do not remove, will be enriched with common fetch errors
  // if (e.code === E.FB.INVALID_SIGNIN_CREDENTIALS) {
  //   throw new Error(E.WRONG_PSW);
  // }

  throw new Error(result.message, { cause: result.cause });
};

export default E_CODES_DIALOG;

export const getNextErrorResponse = (error: unknown) => {
  const e = error as Error;
  return { success: false, message: e.message, cause: e.cause };
};

//To throw informative error. Wrapup specific functions
export const throwInnerErrorCause = (code: string, cause: string) => {
  throw new Error(code, {
    cause,
  });
};

export const throwInnerError = (e: unknown) => {
  const error = e as Error;
  console.error("Interim error:", error.message);
  throw e;
};

export const finalErrorHandler = (
  e: unknown,
  dialogs: { [key: string]: (...params: any) => void },
  msg: any,
) => {
  const error = e as Error;
  console.error("final", error.message, error);
  const errorParams = msg[error.message] || undefined;
  if (!errorParams) {
    dialogs["basic"](msg[E_CODES_DIALOG.UNKNOWN_ERROR].params);
    return;
  }
  const params = {
    ...errorParams.params,
    ...(error.cause as {}),
  };
  dialogs[errorParams.dialog](params);
  return;
};
