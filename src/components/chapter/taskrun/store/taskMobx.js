import alertdialog from "@/components/common/dialog/store";
import local from "@/globals/local";
import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import task from "@/components/chapter/taskrun/store/task";
import { toJS } from "mobx";

export const setEditorDisabled = (disabled) => {
  task.editorRef.current.updateOptions({ readOnly: disabled });
};

export const showRightCodeAfterError = ({ errorMsg }) => {
  alertdialog.showDialog(
    local.ru.msg.alert.PSW_TEST_ERROR,
    errorMsg,
    1,

    () => {
      task.editorRef.current.setValue(
        `'''\n  Правильный код:\n'''\n\n${task.currTask.rightcode} \n\n'''\n  Твой код:\n'''\n\n${task.currTask.code}`
      );

      task.updateCurrTask({
        info: "Изучи правильный код",
        editordisabled: true,
      });
      task.editorRef.current.updateOptions({ lineNumbers: "off" });
      setEditorDisabled(true);
      countdownbutton.showButton();
    }
  );
};

export const setRightCode = () => {
  task.editorRef.current.setValue(task.currTask.rightcode);
};

export const setForbiddenCode = () => {
  task.editorRef.current.setValue(task.currTask.forbiddencode);
};
