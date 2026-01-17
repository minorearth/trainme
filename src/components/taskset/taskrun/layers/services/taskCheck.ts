import { toJS } from "mobx";

//services(external)
import {
  runCheckers,
  getErrorMessage,
} from "@/components/taskset/taskrun/layers/services/taskCheckHelpers";
import { runPythonCode } from "@/components/pyodide/pythonRunner";

//Stores
import taskset from "@/components/taskset/layers/store/taskset";
import task from "@/components/taskset/taskrun/layers/store/task";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import { dialogs } from "@/components/common/dialog/dialogMacro";
import { E_CODES } from "@/tpconst/src/errorHandlers";

const performTests = async () => {
  if (task.executing) {
    throw new Error();
  }
  if (!task.code) {
    throw new Error();
  }
  return await runCheckers({
    code: task.code,
    task: task.currTask,
    runPythonCode,
  });
};

export const checkTaskAction = async () => {
  try {
    const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
      await performTests();
    try {
      getErrorMessage({
        codeChecked,
        linesChecked,
        mustHaveChecked,
        forbiddenChecked,
      });
      await taskset.actions.nextTaskOrCompleteTestRun({
        error: false,
        code: task.code,
      });
    } catch (error: unknown) {
      const e = error as Error;
      await taskset.actions.nextTaskOrCompleteTestRun({
        error: true,
        errorMsg: e.cause as string,
        code: task.code,
      });
    }
  } catch (e: unknown) {
    return;
  }
};

export const preCheckTaskAction = async () => {
  try {
    const { linesChecked, mustHaveChecked, forbiddenChecked } =
      await performTests();
    const res = !linesChecked || !mustHaveChecked || !forbiddenChecked;
    console.log("res", "asas");

    console.log("res", L.ru.msg[E_CODES.RESTRICTIONS_NOT_PASSED].params);
    if (res) {
      dialogs.basic({
        ...L.ru.msg[E_CODES.RESTRICTIONS_NOT_PASSED].params,
      });
    } else {
      dialogs.basic({
        ...L.ru.msg[E_CODES.RESTRICTIONS_PASSED].params,
      });
    }
  } catch (e: unknown) {
    return;
  }
};

export const runTask = async () => {
  if (task.executing) return;
  task.setExecuting(true);
  const { outputTxt } = await runPythonCode({
    code: task.currTask.filedata + task.code,
    stdIn: task.input,
  });
  task.setOutput(outputTxt);
  task.setExecuting(false);
};

export const checkOnChangeErrors = ({ lineCount }: { lineCount: number }) => {
  return lineCount > task.currTask.restrictions.maxlines &&
    task.currTask.tasktype != TT.guide
    ? L.ru.ME.MAX_LINES_ERROR
    : "";
};
