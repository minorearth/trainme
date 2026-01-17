export declare const E_CODES: {
    readonly RESTRICTIONS_PASSED: "restrictions_passed";
    readonly RESTRICTIONS_NOT_PASSED: "restrictions_not_passed";
    readonly EMAIL_NOT_VERIFIED: "email_not_veryfied";
    readonly PSW_RECOVERY: "psw_recovery";
    readonly WRONG_PSW: "wrong_psw";
    readonly UNKNOWN_FB_ERROR: "unknown_FB_error";
    readonly UNKNOWN_ERROR: "unknown_error";
    readonly UNKNOWN_FETCH_ERROR: "unknown_fetch_error";
    readonly INVALID_EMAIL_SIGNUP_ERROR: "invalid_email_signup_error";
    readonly UNKNOWN_SIGNUP_ERROR: "unknown_auth_signup_error";
    readonly NOT_ENOUGHT_TASKS_ERROR: "not_enought_tasks";
    readonly DOCUMENT_NOT_FOUND: "document_not_found";
    readonly NO_CHAMP_FOUND_LIKELY: "no_champ_found_likely";
    readonly CHAMP_OVER: "champ_over";
    readonly CHAMP_COMEBACK: "champ_comedback";
    readonly COURSE_IS_DISABLED: "course_is_disabled";
    readonly COURSE_IS_NOT_PAID: "course_is_not_paid";
    readonly TEXTBOOK_BLOCKED: "textbook_blocked";
    readonly WAKEUP_API_FAILED: "wakeup_api_failed";
    readonly DECRYPTION_FAILED: "decryption_failed";
    readonly ETL_USERPROGRESS_FAILED: "ETLUserProgress_failed";
    readonly PROCEDURE_ERROR: "procedure_error";
    readonly ACCOUNT_CREATED: "account_created";
    readonly CHAPTER_BLOCKED: "chapter_blocked";
    readonly BLOCKED_AND_NOT_PAID: "blocked_and_not_paid";
    readonly NOT_PAID_NO_MONEY: "notpaid_no_money";
    readonly NOT_PAID_BUY: "notpaid_buy";
    readonly RECAP: "recap";
};
export type ECodeKey = (typeof E_CODES)[keyof typeof E_CODES];
export declare const E_FB_CODES: {
    INVALID_SIGNIN_CREDENTIALS: string;
    INVALID_SIGNUP_EMAIL: string;
    NOT_FOUND: number;
};
//# sourceMappingURL=errorCodes.d.ts.map