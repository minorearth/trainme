import local from "./local";
const stn = {
  mode: {
    needCt: false,
    DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE == "YES",
  },

  collections: {
    SURVEY_RESULTS: "surveysresults",
    CHAMPS: "champs",

    SURVEYS: "surveys",
    INDEX: "index",
    INDEX_CURR: "indexcurr",
    USER_META: "usermeta",
  },
  typepicker: { TYPE_PICKER_TIMEOUT: 400 },
  ui: { FLOAT_BTN_PADDING: 80 },
  SPLASH_DURATION: 2000,
};
export default stn;
