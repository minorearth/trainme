import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";

const useCheck = ({ NextTaskOrCompleteTest, runPythonCode, setCode }) => {
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
    NextTaskOrCompleteTest({
      error: isError,
      errorMsg: error,
    });
    setCode("");
    return error != "";
  };

  return { checkTask };
};

export default useCheck;
