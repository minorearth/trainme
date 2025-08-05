export const S = {
  mode: {
    needCt: false,
    //isAdminNeede in adminPanel
    DEV_MODE: process.env.NEXT_PUBLIC_DEV_MODE == "YES",
    allowcopy: true,
    allowpaste: true,
    pyodideCDN: false,
  },
  USER_SESSION: "session",
  typepicker: { TYPE_PICKER_TIMEOUT: 400 },
  ui: { FLOAT_BTN_PADDING: 80 },
  SPLASH_DURATION: 2000,
  CHAMP_SUBSCRIBE_DURATION: 1000 * 60 * 30,
  SESSION_TIME_LIFE: 60 * 60 * 20 * 1000,

  PROCEED_SUSPENCE: 20 * 1000,
  PROCEED_SPEED: 100,
  ls: {
    STATE: "state",
    VERSION: "version",
  },
  // pages
  P: {
    JOINGROUP: "joingroup",
    LOGIN: "login",
    CHAPTERS: "chapters",
    GROUPS: "groups",
    DASHBOARD: "dashboard",
    SETMETA: `/api/setmeta`,
    GETMETA: "/api/getmeta",
    PURCHASE: "purchase",
  },
  PYODIDE_VERSION: "0.26.4",
  CURRENT_LS_VERSION: "0.14",

  FLOW_AREA_SIZE: [
    [0, -250],
    [1300, 8500],
  ] as [[number, number], [number, number]],
  CHAMP_RANGE: [1, 30],
};

export default S;
