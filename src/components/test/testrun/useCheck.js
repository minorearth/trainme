import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";
import cowntdown from "@/store/cowntdown";
import alertdialog from "@/store/dialog";
import cowntdownbutton from "@/store/cowntdownbutton";

const useCheck = ({
  NextTaskOrCompleteTest,
  NextTaskOrCompleteTestNoEffect,
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
    if (error != "") {
      setCode("");
      alertdialog.showDialog(
        local.ru.msg.alert.PSW_TEST_ERROR,
        `${error}. Смотри верный код в окне редактора`,
        () => {
          setCode(test.rightcode);
          setEditorDisabled(true);
          NextTaskOrCompleteTestNoEffect();
          cowntdownbutton.showDialog();
        }
      );
    } else {
      NextTaskOrCompleteTest();
    }
  };

  return { checkTask };
};

export default useCheck;
