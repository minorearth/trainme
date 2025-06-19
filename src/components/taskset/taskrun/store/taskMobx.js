import countdownbutton from "@/components/common/countdown/CountdownButton/store";
import task from "@/components/taskset/taskrun/store/task";
import { toJS } from "mobx";
import { da } from "@/components/common/dialog/dialogMacro";
import { defineTheme } from "@/components/taskset/taskrun/components/monaco/themesetter";

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

export const handleEditorDidMount = ({ editor, monaco, darkmode }) => {
  task.setMonacoRefs(monaco, editor);
  defineTheme(monaco, darkmode);
  setTaskCode(task.currTask, editor);
};

export const handleChangeContent = ({ value }) => {
  const model = task.editorRef.current.getModel();
  const lineCount = model.getLineCount();
  lineCount > task.currTask.maxlines && task.currTask.tasktype != "guide"
    ? task.updateCurrTask({
        code: value || "",
        maxlineserror: "Превышено максимальное количество строк",
      })
    : task.updateCurrTask({ code: value || "", maxlineserror: "" });
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
