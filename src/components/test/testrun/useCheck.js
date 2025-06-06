import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";

const useCheck = ({ actionsTsk, runPythonCode }) => {
  const { nextTaskOrCompleteTestRun, updateCurrTask } = actionsTsk;
  const checkTask = async (code, task) => {
    if (!code) {
      return;
    }
    const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
      await runCheckers(code, task, runPythonCode);
    const error = getErrorMessage(
      codeChecked,
      linesChecked,
      mustHaveChecked,
      forbiddenChecked
    );
    const isError = error != "";
    await nextTaskOrCompleteTestRun({
      error: isError,
      errorMsg: error,
      code,
    });
    console.log("check7");

    // updateCurrTask({ code: "" });
    return error != "";
  };

  return { checkTask };
};

export default useCheck;
