import { useState, useEffect, useRef } from "react";
// import { saveChapterCompleted } from "@/db/domain";
import dialog from "@/store/dialog";
import { CollectionsOutlined } from "@mui/icons-material";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";
import user from "@/store/user";

import { encrypt2, decrypt2 } from "@/globals/utils/encryption";
import { setUseMetaData } from "@/db/SA/firebaseSA";
import progressStore from "@/components/common/progress/progressStore";
import splashCDStore from "@/components/common/splashCountDown/splashCDStore";
import { useTheme } from "@mui/material/styles";
import tinycolor from "tinycolor2";

import {
  persistState as persistState,
  loadStatePersisted,
} from "@/db/localstorage";

const useTest = ({
  nav,
  tests,
  changeState,
  changeStateNoEffect,
  setRunTestsPageRecap,
  runAccomplish,
}) => {
  const [currTask, setCurrTask] = useState({});
  const editorRef = useRef(null);
  const editorDisabled = useRef({ disabled: false });

  const setEditorDisabled = (disabled) => {
    editorDisabled.current = { disabled };
  };
  const theme = useTheme();

  function handleEditorDidMount({ editor, monaco, darkmode }) {
    editorRef.current = editor;
    monaco.editor.defineTheme("pk", {
      base: darkmode ? "vs-dark" : "vs",
      inherit: true,
      rules: [
        {
          token: "identifier",
          foreground: "9CDCFE",
        },
        {
          token: "identifier.function",
          foreground: "DCDCAA",
        },
        {
          token: "type",
          foreground: "1AAFB0",
        },
      ],
      colors: {
        "editor.background": tinycolor(
          theme.palette.background.default
        ).toHexString(),
      },
    });
    monaco.editor.setTheme("pk");
    editor.onKeyDown((event) => {
      if (editorDisabled.current.disabled) {
        event.preventDefault();
      }
    });
  }

  useEffect(() => {
    processSuspendedAfterError();
  }, []);

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  const nextTask = ({ pts }) => {
    changeState({
      data: {
        taskId: nav.taskId + 1,
        pts,
      },
    });
  };

  const doRecap = ({ pts }) => {
    changeState({
      data: { taskstage: "recap", pts },
    });
    dialog.showDialog(
      "Повторение",
      "Попробуй еще раз решить ошибочные задачи",
      1,
      () => setRunTestsPageRecap(nav.recapTasks)
    );
  };

  const processSuspendedAfterError = async () => {
    switch (true) {
      case nav.taskId == tests.length - 1 &&
        nav.taskstage == "accomplished_suspended":
        runAccomplish(getSense());
        return;
      case nav.taskId == tests.length - 1 && nav.taskstage == "recap_suspended":
        doRecap({ pts: getSense() });
        return;
      default:
        return "";
    }
  };

  const addErrorTaskToRecap = () => {
    const recapTasks = [...nav.recapTasks, nav.taskId];
    nav.recapTasks = recapTasks;
    changeStateNoEffect({
      recapTasks: recapTasks,
      taskId: nav.taskId + 1,
    });
  };

  const errorOnLastRecapTask = () => {
    nav.taskstage = "accomplished_suspended";
    changeStateNoEffect({
      taskstage: "accomplished_suspended",
    });
  };

  const errorOnLastWIPTask = () => {
    nav.taskstage = "recap_suspended";
    const recapTasks = [...nav.recapTasks, nav.taskId];
    nav.recapTasks = recapTasks;
    changeStateNoEffect({
      taskstage: "recap_suspended",
      recapTasks,
    });
  };

  const getSense = () => {
    const { pts } = loadStatePersisted();
    if (!pts) {
      return 0;
    } else {
      return pts;
    }
  };

  const showRightCodeAfterError = ({ errorMsg }) => {
    alertdialog.showDialog(
      local.ru.msg.alert.PSW_TEST_ERROR,
      `${errorMsg}. Смотри верный код в окне редактора`,
      1,

      () => {
        setCode(tests[nav.taskId].rightcode);
        setEditorDisabled(true);
        cowntdownbutton.showButton();
      }
    );
  };

  const ErrorCountDownPressed = async () => {
    editorRef.current.getModel().setValue("");

    if (nav.taskId != tests.length - 1) {
      nextTask({ pts: getSense() });
      return;
    }
    if (
      nav.taskId == tests.length - 1 &&
      (nav.taskstage == "recap" || nav.taskstage == "accomplished_suspended")
    ) {
      runAccomplish(getSense());
    }
    if (
      nav.recapTasks.length > 0 &&
      (nav.taskstage == "WIP" || nav.taskstage == "recap_suspended")
    ) {
      doRecap({ pts: getSense() });
    }
  };

  const NextTaskOrCompleteTest = async ({ error, errorMsg, earned = 0 }) => {
    editorRef.current.getModel().setValue("");
    switch (true) {
      case nav.taskId != tests.length - 1 && !error:
        // progressStore.setShowProgress(true, false, "python", 2000);
        // progressStore.setCloseProgress();
        splashCDStore.setShow(false, "ok", 1500);
        nextTask({ pts: getSense() + earned });
        return;
      case nav.taskId == tests.length - 1 && !error:
        if (nav.taskstage == "recap") {
          runAccomplish(getSense());
        }
        if (nav.recapTasks.length == 0 && nav.taskstage == "WIP") {
          runAccomplish(getSense() + earned);
        }
        if (nav.recapTasks.length > 0 && nav.taskstage == "WIP") {
          doRecap({ pts: getSense() + earned });
        }
        return;
      case error:
        showRightCodeAfterError({ errorMsg });
        if (nav.taskstage != "recap" && nav.taskId != tests.length - 1) {
          addErrorTaskToRecap();
        }

        if (nav.taskstage == "recap" && nav.taskId != tests.length - 1) {
          changeStateNoEffect({
            taskId: nav.taskId + 1,
          });
        }
        if (nav.taskstage != "recap" && nav.taskId == tests.length - 1) {
          errorOnLastWIPTask();
        }
        if (nav.taskstage == "recap" && nav.taskId == tests.length - 1) {
          errorOnLastRecapTask();
        }
        return;

      default:
        return "";
    }
  };

  useEffect(() => {
    nav.taskId != tests.length && setNextTask(nav.taskId);
  }, [nav]);

  const setCode = (code) => {
    setCurrTask((state) => ({
      ...state,
      code,
    }));
  };

  const setNextTask = (id) => {
    const test = tests[id];
    setCurrTask({
      task: test.task,
      input: test.defaultinput.join("\n"),
      code: test.defaultcode,
      expectedOutput: test.defaultoutput.join("\n"),
      output: "",
      restrictErrors: "",
    });
  };

  return {
    NextTaskOrCompleteTest,
    currTask,
    setCode,
    setOutput,
    setEditorDisabled,
    handleEditorDidMount,
    getSense,
    ErrorCountDownPressed,
  };
};

export default useTest;

// const NextTaskOrCompleteTest = async ({ error, errorMsg, earned = 0 }) => {
//   editorRef.current.getModel().setValue("");
//   switch (true) {
//     case nav.taskId != tests.length - 1 && !error:
//       changeState({
//         data: {
//           taskId: nav.taskId + 1,
//           pts: getSense() + earned,
//         },
//       });
//       return;
//     case nav.taskId == tests.length - 1 && !error:
//       if (
//         nav.taskstage == "recap" ||
//         nav.taskstage == "accomplished_suspended"
//       ) {
//         const pts = getSense();
//         runAccomplish(pts);
//       }
//       if (nav.recapTasks.length == 0) {
//         const pts = getSense() + earned;
//         // changeStateNoEffect({ pts });
//         runAccomplish(pts);
//       }
//       if (
//         nav.recapTasks.length > 0 &&
//         (nav.taskstage == "WIP" || nav.taskstage == "recap_suspended")
//       ) {
//         changeState({
//           data: { taskstage: "recap", pts: getSense() + earned },
//         });
//         dialog.showDialog(
//           "Повторение",
//           "Попробуй еще раз решить ошибочные задачи",
//           1,
//           () => setRunTestsPageRecap(nav.recapTasks)
//         );
//       }
//       return;
//     case error:
//       alertdialog.showDialog(
//         local.ru.msg.alert.PSW_TEST_ERROR,
//         `${errorMsg}. Смотри верный код в окне редактора`,
//         1,

//         () => {
//           setCode(tests[nav.taskId].rightcode);
//           setEditorDisabled(true);
//           cowntdownbutton.showButton();
//         }
//       );
//       if (nav.taskstage != "recap" && nav.taskId != tests.length - 1) {
//         const recapTasks = [...nav.recapTasks, nav.taskId];
//         nav.recapTasks = recapTasks;
//         changeStateNoEffect({
//           recapTasks: recapTasks,
//           taskId: nav.taskId + 1,
//         });
//       }

//       if (nav.taskstage == "recap" && nav.taskId != tests.length - 1) {
//         changeStateNoEffect({
//           taskId: nav.taskId + 1,
//         });
//       }
//       if (nav.taskstage != "recap" && nav.taskId == tests.length - 1) {
//         nav.taskstage = "recap_suspended";
//         const recapTasks = [...nav.recapTasks, nav.taskId];
//         nav.recapTasks = recapTasks;
//         changeStateNoEffect({
//           taskstage: "recap_suspended",
//           recapTasks,
//         });
//       }
//       if (nav.taskstage == "recap" && nav.taskId == tests.length - 1) {
//         nav.taskstage = "accomplished_suspended";
//         changeStateNoEffect({
//           taskstage: "accomplished_suspended",
//         });
//       }
//       return;

//     default:
//       return "";
//   }
// };
