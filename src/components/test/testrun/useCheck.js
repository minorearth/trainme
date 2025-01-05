import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";
import cowntdown from "@/store/cowntdown";
import alertdialog from "@/store/dialog";
import cowntdownbutton from "@/store/cowntdownbutton";

const useCheck = ({
  NextTaskOrCompleteTest,
  NextTaskAndAddRecapNoEffect,
  runPythonCode,
  setCode,
  setEditorDisabled,
}) => {
  const checkTask = async (code, test) => {
    const { codeChecked, linesChecked, mustHaveChecked } = await runCheckers(
      code,
      test,
      runPythonCode
    );
    const error = getErrorMessage(codeChecked, linesChecked, mustHaveChecked);
    NextTaskOrCompleteTest({ error: error != "" });
    setCode("");
  };

  return { checkTask };
};

export default useCheck;
