"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.finalErrorHandler = exports.throwInnerError = exports.throwErrorValue = exports.getNextErrorResponse = exports.throwFetchAPIError = exports.throwFBError = void 0;
const errorCodes_1 = require("./errorCodes");
const throwFBError = ({ code, message, }) => {
    console.log(`"FB error:${message}, FB error code: ${code}"`);
    if (code === errorCodes_1.E_FB_CODES.INVALID_SIGNIN_CREDENTIALS) {
        throw new Error(errorCodes_1.E_CODES.WRONG_PSW);
    }
    if (code === errorCodes_1.E_FB_CODES.INVALID_SIGNUP_EMAIL) {
        throw new Error(errorCodes_1.E_CODES.INVALID_EMAIL_SIGNUP_ERROR);
    }
    if (Number(code) === errorCodes_1.E_FB_CODES.NOT_FOUND) {
        throw new Error(errorCodes_1.E_CODES.DOCUMENT_NOT_FOUND);
    }
    throw Error(errorCodes_1.E_CODES.UNKNOWN_FB_ERROR);
};
exports.throwFBError = throwFBError;
const throwFetchAPIError = (result) => {
    console.log(`"fetch error:${result.message} ${result.cause}`);
    //do not remove, will be enriched with common fetch errors
    // if (e.code === E.FB.INVALID_SIGNIN_CREDENTIALS) {
    //   throw new Error(E.WRONG_PSW);
    // }
    throw new Error(result.message, { cause: result.cause });
};
exports.throwFetchAPIError = throwFetchAPIError;
exports.default = errorCodes_1.E_CODES;
const getNextErrorResponse = (error) => {
    const e = error;
    return { success: false, message: e.message, cause: e.cause };
};
exports.getNextErrorResponse = getNextErrorResponse;
//To throw informative error. Wrapup specific functions
const throwErrorValue = (code, value) => {
    throw new Error(code, {
        cause: { value },
    });
};
exports.throwErrorValue = throwErrorValue;
const throwInnerError = (e) => {
    const error = e;
    console.log("Interim error:", error.message);
    throw e;
};
exports.throwInnerError = throwInnerError;
const finalErrorHandler = (e, dialogs, msg) => {
    const error = e;
    console.log("final", error.message, error);
    const errorParams = msg[error.message] || undefined;
    if (!errorParams) {
        dialogs["basic"](msg[errorCodes_1.E_CODES.UNKNOWN_ERROR].params);
        return;
    }
    const params = {
        ...errorParams.params,
        ...error.cause,
    };
    dialogs[errorParams.dialog](params);
    return;
};
exports.finalErrorHandler = finalErrorHandler;
//# sourceMappingURL=errorHandlers.js.map