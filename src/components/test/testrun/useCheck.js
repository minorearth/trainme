import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";

const useCheck = ({ actionsTsk, runPythonCode }) => {
  const { nextTaskOrCompleteTestRun, setCode } = actionsTsk;
  const checkTask = async (code, test) => {
    if (!code) {
      return;
    }
    const { codeChecked, linesChecked, mustHaveChecked, forbiddenChecked } =
      await runCheckers(code, test, runPythonCode);
    const error = getErrorMessage(
      codeChecked,
      linesChecked,
      mustHaveChecked,
      forbiddenChecked
    );
    const isError = error != "";
    nextTaskOrCompleteTestRun({
      error: isError,
      errorMsg: error,
      code,
    });
    setCode("");
    return error != "";
  };

  return { checkTask };
};

export default useCheck;
