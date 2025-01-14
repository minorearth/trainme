import local from "./local";
const stn = {
  needCt: false,
  collections: {
    SURVEY_RESULTS: "surveysresults",
    SURVEYS: "surveys",
    INDEX: "index",
    INDEX_CURR: "indexcurr",
    USER_META: "usermeta",
  },
  typepicker: { TYPE_PICKER_TIMEOUT: 400 },
  ui: { FLOAT_BTN_PADDING: 80 },
  surveys: {
    filetypes: {
      img: {
        name: "img",
        allowed_ext: {
          "image/png": [".png", ".jpg", ".jpeg", ".bmp", ".gif"],
        },
        SHORTNAME: "i",
        caption: local.ru.caption.FILE_TYPE_IMG,
        save_ext: ".jpg",
        multiple: true,
        drop_message: local.ru.text.DROP_GUIDE_IMG,
        TOOLTIP: local.ru.tooltip.TYPE_IMG,
      },
      zip: {
        name: "zip",
        allowed_ext: {},
        SHORTNAME: "z",
        caption: local.ru.caption.FILE_TYPE_ANYFILE,
        save_ext: ".zip",
        multiple: true,
        drop_message: local.ru.text.DROP_GUIDE_FILES,
        TOOLTIP: local.ru.tooltip.TYPE_ZIP,
      },
      anyfile: {
        name: "anyfile",
        allowed_ext: {},
        SHORTNAME: "a",
        caption: local.ru.caption.FILE_TYPE_SINGLEFILE,
        save_ext: "",
        multiple: false,
        drop_message: local.ru.text.DROP_GUIDE_SINGLEFILE,
        TOOLTIP: local.ru.tooltip.TYPE_FILE,
      },
      text: {
        name: "text",
        allowed_ext: {},
        SHORTNAME: "t",
        caption: local.ru.caption.FILE_TYPE_TEXT,
        save_ext: ".txt",
        multiple: false,
        drop_message: "",
        TOOLTIP: local.ru.tooltip.TYPE_TEXT,
      },
    },
    surveytypes: {
      task: {
        name: "task",
        caption: local.ru.caption.SURVEY_TYPE_TASK,
        SHORTNAME: "t",
        TOOLTIP: local.ru.tooltip.TYPE_TASK,
      },
      collection: {
        name: "collection",
        caption: local.ru.caption.SURVEY_TYPE_COLLECTION,
        SHORTNAME: "c",
        TOOLTIP: local.ru.tooltip.TYPE_COLLECTION,
      },
    },
  },
  files: {
    MAX_SIZE: 10 * 1024 * 1024,
    NAME_CLEANUP_INTERVAL: 5 * 60 * 1000,
  },
  SPLASH_DURATION: 2000,
};
export default stn;
