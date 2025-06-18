import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import task from "@/components/taskset/taskrun/store/task";
import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";

export const setEditorDisabled = (disabled) => {
  task.editorRef.current.updateOptions({ readOnly: disabled });
};

export const showRightCodeAfterError = ({ errorMsg }) => {
  const showRCAE = () => {
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
  };
  da.info.rightcode(showRCAE, errorMsg);
};

export const setRightCode = () => {
  task.editorRef.current.setValue(task.currTask.rightcode);
};

export const setForbiddenCode = () => {
  task.editorRef.current.setValue(task.currTask.forbiddencode);
};
