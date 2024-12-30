import { useState, useEffect, useRef } from "react";
import { saveChapterCompleted } from "@/db/domain";

const useTest = ({
  editorRef,
  nav,
  tests,
  setTaskInProgress,
  setCongratPage,
  setTaskInProgressNoEffect,
  setRunTestsPageRecap,
  addRecapTask,
}) => {
  const [currTask, setCurrTask] = useState({});

  const setOutput = (output) => {
    setCurrTask((state) => ({
      ...state,
      output,
    }));
  };

  const setRestrictErrors = (restrictErrors) => {
    setCurrTask((state) => ({
      ...state,
      restrictErrors,
    }));
  };

  const NextTaskOrCompleteTest = async () => {
    editorRef.current.getModel().setValue("");

    switch (true) {
      case nav.taskId != tests.length - 1:
        setTaskInProgress(nav.taskId + 1);
        return;
      case nav.recapTasks.length > 0 && !nav.recap:
        setRunTestsPageRecap(nav.recapTasks);
        return;
      case nav.taskId == tests.length - 1:
        const unlocked = await saveChapterCompleted({
          chapter: nav.chapter,
          errors: 0,
        });
        setCongratPage({
          unlockedtoshow: unlocked,
          lastcompleted: nav.chapter,
        });
        return;
      default:
        return "";
    }
  };

  const NextTaskAndAddRecapNoEffect = async () => {
    addRecapTask(nav.taskId);
    if (nav.taskId != tests.length - 1) {
      setTaskInProgressNoEffect(nav.taskId + 1);
    } else {
      // const unlocked = await saveChapterCompleted({
      //   chapter: nav.chapter,
      //   errors: 0,
      // });
      // setCongrat({ unlockedtoshow: unlocked, lastcompleted: nav.chapter });
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
    setRestrictErrors,
  };
};

export default useTest;
