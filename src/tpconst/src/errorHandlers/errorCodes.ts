export const E_CODES = {
  TASK_CHECK_FAIL: "task_check_fail",
} as const;

export const E_CODES_DIALOG = {
  PYODIDE_SUSPENDED: "pyodide_suspended",
  PYODIDE_SINTAX_ERROR: "pyodide_syntax_error",
  RESTRICTIONS_PASSED: "restrictions_passed",
  RESTRICTIONS_NOT_PASSED: "restrictions_not_passed",
  NO_USER: "no_user",
  EMAIL_NOT_VERIFIED: "email_not_veryfied",
  PSW_RECOVERY: "psw_recovery",
  WRONG_PSW: "wrong_psw",
  UNKNOWN_FB_ERROR: "unknown_FB_error",
  UNKNOWN_ERROR: "unknown_error",
  UNKNOWN_FETCH_ERROR: "unknown_fetch_error",
  INVALID_EMAIL_SIGNUP_ERROR: "invalid_email_signup_error",
  EMAIL_IN_USE_ERROR: "email_in_use_error",
  UNKNOWN_SIGNUP_ERROR: "unknown_auth_signup_error",
  NOT_ENOUGHT_TASKS_ERROR: "not_enought_tasks",
  DOCUMENT_NOT_FOUND: "document_not_found",
  NO_CHAMP_FOUND_LIKELY: "no_champ_found_likely",
  CHAMP_OVER: "champ_over",
  CHAMP_COMEBACK: "champ_comedback",
  COURSE_IS_DISABLED: "course_is_disabled",
  COURSE_IS_NOT_PAID: "course_is_not_paid",
  TEXTBOOK_BLOCKED: "textbook_blocked",
  WAKEUP_API_FAILED: "wakeup_api_failed",
  DECRYPTION_FAILED: "decryption_failed",
  ETL_USERPROGRESS_FAILED: "ETLUserProgress_failed",
  PROCEDURE_ERROR: "procedure_error",
  ACCOUNT_CREATED: "account_created",
  CHAPTER_BLOCKED: "chapter_blocked",
  BLOCKED_AND_NOT_PAID: "blocked_and_not_paid",
  NOT_PAID_NO_MONEY: "notpaid_no_money",
  NOT_PAID_BUY: "notpaid_buy",
  RECAP: "recap",
} as const;

export type EDialogCodeKey =
  (typeof E_CODES_DIALOG)[keyof typeof E_CODES_DIALOG];

export const E_FB_CODES = {
  INVALID_SIGNIN_CREDENTIALS: "auth/invalid-credential",
  INVALID_SIGNUP_EMAIL: "auth/invalid-email",
  EMAIL_IN_USE: "auth/email-already-in-use",
  NOT_FOUND: 5,
};
