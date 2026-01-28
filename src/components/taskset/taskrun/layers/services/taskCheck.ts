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
import { Task } from "@/tpconst/src";

const performTests = async () => {
  if (!task.monaco) {
    throw new Error();
  }
  if (task.monaco.executing) {
    throw new Error();
  }
  if (!task.monaco.code) {
    throw new Error();
  }
  return await runCheckers({
    code: task.monaco.code,
    task: task.currTask as Task,
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
        code: task.monaco?.code || "",
      });
    } catch (error: unknown) {
      const e = error as Error;
      await taskset.actions.nextTaskOrCompleteTestRun({
        error: true,
        errorMsg: e.cause as string,
        code: task.monaco?.code || "",
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

export const checkOnChangeErrors = ({ lineCount }: { lineCount: number }) => {
  return lineCount > (task.currTask as Task).restrictions.maxlines &&
    task.currTask.tasktype != TT.guide
    ? L.ru.ME.MAX_LINES_ERROR
    : "";
};
