import local from "./local";
const stn = {
  mode: {
    needCt: false,
    //isAdminNeede in adminPanel
    DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE == "YES",
    allowcopy: true,
    allowpaste: true,
    pyodideCDN: false,
  },

  typepicker: { TYPE_PICKER_TIMEOUT: 400 },
  ui: { FLOAT_BTN_PADDING: 80 },
  SPLASH_DURATION: 2000,
};
export default stn;
