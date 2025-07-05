import { da } from "@/components/common/dialog/dialogMacro";

import { toJS } from "mobx";
import { defineTheme } from "@/components/taskset/taskrun/components/monaco/themesetter";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import task from "@/components/taskset/taskrun/layers/store/task";

//
import { checkOnChangeErrors } from "@/components/taskset/taskrun/layers/services/taskCheck";

export const refreshEditor = () => {
  task.editorRef.current.setValue(task.currTask.defaultcode);
};

export const setEditorDisabled = (disabled) => {
  task.editorRef.current.updateOptions({ lineNumbers: "on" });
  task.editorRef.current.updateOptions({ readOnly: disabled });
};

export const setTaskCode = (currTask, taskeditor) => {
  if (!taskeditor || Object.keys(currTask).length === 0) {
    return;
  }
  taskeditor.setValue(currTask?.code);

  task.currTask.tasktype == "guide"
    ? taskeditor.updateOptions({ lineNumbers: "off" })
    : taskeditor.updateOptions({ lineNumbers: "on" });
};

export const handleMonacoDidMount = ({ editor, monaco, darkmode }) => {
  task.setMonacoRefs(monaco, editor);
  defineTheme(monaco, darkmode);
  setTaskCode(task.currTask, editor);
};

export const handleChangeMonacoContent = ({ value }) => {
  const model = task.editorRef.current.getModel();
  const errorMessage = checkOnChangeErrors({ lineCount: model.getLineCount() });
  task.updateCurrTask({
    code: value || "",
    errorMessage,
  });
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
    task.actions.setEditorDisabled(true);
    countdownbutton.showButton();
  };
  da.info.rightcode(showRCAE, errorMsg);
};

export const setRightCode_admin = () => {
  task.editorRef.current.setValue(task.currTask.rightcode);
};

export const setForbiddenCode_admin = () => {
  task.editorRef.current.setValue(task.currTask.forbiddencode);
};
