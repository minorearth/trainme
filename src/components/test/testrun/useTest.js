import { useState, useEffect, useRef } from "react";
import { saveChapterCompleted } from "@/db/domain";
import dialog from "@/store/dialog";

const useTest = ({
  nav,
  tests,
  setTaskInProgress,
  setCongratPage,
  setTaskInProgressNoEffect,
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
    });
    setCongratPage({
      unlockedtoshow: unlocked,
      lastcompleted: nav.chapter,
    });
  };

  useEffect(() => {
    nav.taskId == tests.length - 1 && !nav.recap && runRecap();
    nav.taskId == tests.length - 1 && nav.recap && runAccomplish();
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

  const NextTaskOrCompleteTest = async () => {
    editorRef.current.getModel().setValue("");

    switch (true) {
      case nav.taskId != tests.length - 1:
        setTaskInProgress(nav.taskId + 1);
        return;
      case nav.recapTasks.length > 0 && !nav.recap:
        runRecap();
        return;
      case nav.taskId == tests.length - 1:
        runAccomplish();
        return;
      default:
        return "";
    }
  };

  const NextTaskAndAddRecapNoEffect = async () => {
    nav.recap != true && addRecapTask(nav.taskId);
    if (nav.taskId != tests.length - 1) {
      setTaskInProgressNoEffect({ taskid: nav.taskId + 1 });
    } else {
    }
  };

  useEffect(() => {
    setNextTask(nav.taskId);
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
    NextTaskOrCompleteTestNoEffect: NextTaskAndAddRecapNoEffect,
    currTask,
    setCode,
    setOutput,
    setEditorDisabled,
    handleEditorDidMount,
  };
};

export default useTest;
