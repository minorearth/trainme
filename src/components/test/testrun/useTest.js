import { useState, useEffect, useRef } from "react";
import { saveChapterCompleted } from "@/db/domain";
import dialog from "@/store/dialog";
import { CollectionsOutlined } from "@mui/icons-material";
import alertdialog from "@/store/dialog";
import local from "@/globals/local";
import cowntdownbutton from "@/store/cowntdownbutton";

const useTest = ({
  nav,
  tests,
  changeState,
  setCongratPage,
  changeStateNoEffect,
  setRunTestsPageRecap,
  addRecapTask,
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

  const runRecap = () => {
    dialog.showDialog(
      "Повторение",
      "Попробуй еще раз решить ошибочные задачи",
      () => setRunTestsPageRecap(nav.recapTasks)
    );
  };

  const runAccomplish = async () => {
    const unlocked = await saveChapterCompleted({
      chapter: nav.chapter,
      errors: 0,
      nextchapters: nav.nextchapters,
    });
    setCongratPage({
      unlockedtoshow: unlocked,
      lastcompleted: nav.chapter,
    });
  };

  useEffect(() => {
    reRunTaskOrCompleteTest();
    // nav.taskId == tests.length - 1 && !nav.recap && runRecap();
    // nav.taskId == tests.length - 1 && nav.recap && runAccomplish();
  }, []);

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  // const setRestrictErrors = (restrictErrors) => {
  //   setCurrTask((state) => ({
  //     ...state,
  //     restrictErrors,
  //   }));
  // };

  const reRunTaskOrCompleteTest = async () => {
    switch (true) {
      case nav.taskId == tests.length - 1 && nav.taskstage == "accomplished":
        runAccomplish();
        return;
      case nav.taskId == tests.length - 1 && nav.taskstage == "completed":
        changeState({ data: { taskstage: "recap" } });
        dialog.showDialog(
          "Повторение",
          "Попробуй еще раз решить ошибочные задачи",
          () => setRunTestsPageRecap(nav.recapTasks)
        );
        return;

      default:
        return "";
    }
  };

  const NextTaskOrCompleteTest = async ({ error }) => {
    editorRef.current.getModel().setValue("");
    switch (true) {
      case nav.taskId != tests.length - 1 && !error:
        changeState({ data: { taskId: nav.taskId + 1 } });
        return;
      case nav.taskId == tests.length - 1 && !error:
        if (
          nav.taskstage == "recap" ||
          nav.taskstage == "accomplished" ||
          nav.recapTasks.length == 0
        ) {
          runAccomplish();
        }
        if (
          nav.recapTasks.length > 0 &&
          (nav.taskstage == "" || nav.taskstage == "completed")
        ) {
          changeState({ data: { taskstage: "recap" } });
          dialog.showDialog(
            "Повторение",
            "Попробуй еще раз решить ошибочные задачи",
            () => setRunTestsPageRecap(nav.recapTasks)
          );
        }

        return;
      case error:
        alertdialog.showDialog(
          local.ru.msg.alert.PSW_TEST_ERROR,
          `${error}. Смотри верный код в окне редактора`,
          () => {
            console.log(tests, nav.taskId, nav);
            setCode(tests[nav.taskId].rightcode);
            setEditorDisabled(true);
            cowntdownbutton.showDialog();
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
          nav.taskstage = "completed";
          const recapTasks = [...nav.recapTasks, nav.taskId];
          nav.recapTasks = recapTasks;
          changeStateNoEffect({
            taskstage: "completed",
            recapTasks,
          });
        }
        if (nav.taskstage == "recap" && nav.taskId == tests.length - 1) {
          nav.taskstage = "accomplished";
          changeStateNoEffect({
            taskstage: "accomplished",
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
  };
};

export default useTest;
