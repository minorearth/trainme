import L from "./local";
const S = {
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
  CHAMP_SUBSCRIBE_DURATION: 1000 * 60 * 30,

  PROCEED_SUSPENCE: 20 * 1000,
  PROCEED_SPEED: 100,
};
db: {
}
export default S;
