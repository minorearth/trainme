import { E_CODES } from "./errorCodes";
export declare const throwFBError: ({ code, message, }: {
    code: string;
    message: string;
}) => never;
export declare const throwFetchAPIError: (result: any) => never;
export default E_CODES;
export declare const getNextErrorResponse: (error: unknown) => {
    success: boolean;
    message: string;
    cause: unknown;
};
export declare const throwErrorValue: (code: string, value: string) => never;
export declare const throwInnerError: (e: unknown) => never;
export declare const finalErrorHandler: (e: unknown, dialogs: {
    [key: string]: (...params: any) => void;
}, msg: any) => void;
//# sourceMappingURL=errorHandlers.d.ts.map