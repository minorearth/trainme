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

export const checkTask = async () => {
  if (task.executing) return;

  const code = task.code;
  const taskCurr = task.currTask;

  if (!code) return;
  const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
    await runCheckers({ code, task: taskCurr, runPythonCode });

  const error = getErrorMessage({
    codeChecked,
    linesChecked,
    mustHaveChecked,
    forbiddenChecked,
  });
  const isError = error != "";
  await taskset.actions.nextTaskOrCompleteTestRun({
    error: isError,
    errorMsg: error,
    code,
  });

  return error != "";
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
    task.currTask.tasktype != "guide"
    ? "Превышено максимальное количество строк"
    : "";
};
