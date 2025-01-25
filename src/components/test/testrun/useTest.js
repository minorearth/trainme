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

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    editor.onKeyDown((event) => {
      if (editorDisabled.current.disabled) {
        event.preventDefault();
      }
    });
  }

  useEffect(() => {
    reRunTaskOrCompleteTest();
  }, []);

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  const reRunTaskOrCompleteTest = async () => {
    switch (true) {
      case nav.taskId == tests.length - 1 &&
        nav.taskstage == "accomplished_suspended":
        const pts = getSense();
        // changeStateNoEffect({ pts });
        runAccomplish(pts);
        return;
      case nav.taskId == tests.length - 1 && nav.taskstage == "recap_suspended":
        changeState({ data: { taskstage: "recap" } });
        dialog.showDialog(
          "Повторение",
          "Попробуй еще раз решить ошибочные задачи",
          1,
          () => setRunTestsPageRecap(nav.recapTasks)
        );
        return;

      default:
        return "";
    }
  };

  const getSense = () => {
    const { pts } = loadStatePersisted();
    if (!pts) {
      return 0;
    } else {
      return pts;
    }
  };

  const NextTaskOrCompleteTest = async ({ error, errorMsg, earned = 0 }) => {
    editorRef.current.getModel().setValue("");
    switch (true) {
      case nav.taskId != tests.length - 1 && !error:
        changeState({
          data: {
            taskId: nav.taskId + 1,
            pts: getSense() + earned,
          },
        });
        return;
      case nav.taskId == tests.length - 1 && !error:
        if (
          nav.taskstage == "recap" ||
          nav.taskstage == "accomplished_suspended"
        ) {
          const pts = getSense();
          runAccomplish(pts);
        }
        if (nav.recapTasks.length == 0) {
          const pts = getSense() + earned;
          // changeStateNoEffect({ pts });
          runAccomplish(pts);
        }
        if (
          nav.recapTasks.length > 0 &&
          (nav.taskstage == "WIP" || nav.taskstage == "recap_suspended")
        ) {
          changeState({
            data: { taskstage: "recap", pts: getSense() + earned },
          });
          dialog.showDialog(
            "Повторение",
            "Попробуй еще раз решить ошибочные задачи",
            1,
            () => setRunTestsPageRecap(nav.recapTasks)
          );
        }

        return;
      case error:
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
        if (nav.taskstage != "recap" && nav.taskId != tests.length - 1) {
          const recapTasks = [...nav.recapTasks, nav.taskId];
          nav.recapTasks = recapTasks;
          changeStateNoEffect({
            recapTasks: recapTasks,
            taskId: nav.taskId + 1,
          });
        }

        if (nav.taskstage == "recap" && nav.taskId != tests.length - 1) {
          changeStateNoEffect({
            taskId: nav.taskId + 1,
          });
        }
        if (nav.taskstage != "recap" && nav.taskId == tests.length - 1) {
          nav.taskstage = "recap_suspended";
          const recapTasks = [...nav.recapTasks, nav.taskId];
          nav.recapTasks = recapTasks;
          changeStateNoEffect({
            taskstage: "recap_suspended",
            recapTasks,
          });
        }
        if (nav.taskstage == "recap" && nav.taskId == tests.length - 1) {
          nav.taskstage = "accomplished_suspended";
          changeStateNoEffect({
            taskstage: "accomplished_suspended",
          });
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
  };
};

export default useTest;
