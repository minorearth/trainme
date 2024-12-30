import { runCheckers, getErrorMessage } from "./taskCheckersUtils";
import local from "@/globals/local";
import cowntdown from "@/store/cowntdown";
import alertdialog from "@/store/dialog";
import cowntdownbutton from "@/store/cowntdownbutton";

const useCheck = ({
  setRestrictErrors,
  NextTaskOrCompleteTest,
  NextTaskOrCompleteTestNoEffect,
  runPythonCode,
  setCode,
}) => {
  const checkTask = async (code, test) => {
    const { codeChecked, linesChecked, mustHaveChecked } = await runCheckers(
      code,
      test,
      runPythonCode
    );

    // setRestrictErrors(
    //   getErrorMessage(codeChecked, linesChecked, mustHaveChecked)
    // );

    const error = getErrorMessage(codeChecked, linesChecked, mustHaveChecked);
    if (error != "") {
      setCode("");
      alertdialog.showDialog(
        local.ru.msg.alert.PSW_TEST_ERROR,
        `${error}. Смотри верный код в окне редактора`,
        () => {
          setCode(test.rightcode);
          NextTaskOrCompleteTestNoEffect();
          cowntdownbutton.showDialog();
          // cowntdown.showDialog(NextTaskOrCompleteTest);
        }
      );
    } else {
      NextTaskOrCompleteTest();
    }
  };

  return { checkTask };
};

export default useCheck;
