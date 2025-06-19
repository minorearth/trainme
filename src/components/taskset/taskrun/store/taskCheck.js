import local from "@/globals/local";
import { toJS } from "mobx";

import {
  runCheckers,
  getErrorMessage,
} from "@/components/taskset/taskrun/store/taskCheckersUtils";
import { runPythonCode } from "@/components/taskset/taskrun/store/pythonRunner";

//Stores
import taskset from "@/components/taskset/store/taskset";
import task from "@/components/taskset/taskrun/store/task";

export const checkTask = async () => {
  if (task.executing) return;

  const code = task.currTask.code;
  if (!code) return;
  const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
    await runCheckers(code, task.currTask, runPythonCode);

  const error = getErrorMessage(
    codeChecked,
    linesChecked,
    mustHaveChecked,
    forbiddenChecked
  );
  const isError = error != "";
  await taskset.actions.nextTaskOrCompleteTestRun({
    error: isError,
    errorMsg: error,
    code,
  });

  return error != "";
};

export const runTask = async (e) => {
  if (task.executing) return;
  task.setExecuting(true);
  const { outputTxt } = await runPythonCode(
    task.currTask.filedata + task.currTask.code,
    task.currTask.input
  );

  task.updateCurrTask({ output: outputTxt });
  task.setExecuting(false);
};
