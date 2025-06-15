import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";
import task from "@/components/chapter/taskrun/store/task";
import chapter from "@/components/chapter/store/chapter";
import { toJS } from "mobx";

const useCheck = ({ runPythonCode }) => {
  const checkTask = async () => {
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
    await chapter.actionsTsk.nextTaskOrCompleteTestRun({
      error: isError,
      errorMsg: error,
      code,
    });

    return error != "";
  };

  const runTask = async (e) => {
    if (task.executing) return;
    task.setExecuting(true);
    const { outputTxt } = await runPythonCode(
      task.currTask.filedata + task.currTask.code,
      task.currTask.input
    );

    task.updateCurrTask({ output: outputTxt });
    task.setExecuting(false);
  };

  return { checkTask, runTask };
};

export default useCheck;
