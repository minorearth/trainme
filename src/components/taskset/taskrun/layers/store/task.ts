import { makeObservable, makeAutoObservable, autorun } from "mobx";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";

//services
import { dialogs } from "@/components/common/dialog/dialogMacro";

import {
  checkTaskAction,
  preCheckTaskAction,
  checkOnChangeErrors,
} from "@/components/taskset/taskrun/layers/services/taskCheck";

//tpconst
import { TASK_DEFAULTS } from "@/tpconst/src/typesdefaults";
import { Task, Unit } from "@/tpconst/src/T";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";
import { MonacoStore } from "./monaco";

class task {
  currTask: Unit = TASK_DEFAULTS;
  errorMessage: string = "";
  info: string = "";
  monaco?: MonacoStore;

  actions: any = {
    checkTaskAction,
    preCheckTaskAction,
  };

  setMonacoStore = (monacoStore: MonacoStore) => {
    this.monaco = monacoStore;
  };

  errorHandler = () => {
    if (!this.monaco) {
      return;
    }
    if (this.monaco.editorRef.current) {
      const model = this.monaco.editorRef.current.getModel();
      if (model) {
        const errorMessage = checkOnChangeErrors({
          lineCount: model?.getLineCount(),
        });
        this.errorMessage = errorMessage;
      }
    }
  };

  showRightCodeAfterError = ({ errorMsg }: { errorMsg: string }) => {
    dialogs.action({
      caption: L.ru.ME.TEST_ERROR,
      text: errorMsg,
      action: () => {
        this.showInfo(L.ru.ME.EDITOR_INFO);
        countdownbutton.showButton();
      },
    });
  };

  showInfo(value: string) {
    if (!this.monaco) {
      return;
    }
    this.monaco.editorRef.current?.setValue(
      `'''\n  ${L.ru.ME.RIGHT_CODE}\n'''\n\n${(this.currTask as Task).rightcode} \n\n'''\n  ${L.ru.ME.YOUR_CODE}\n'''\n\n${this.monaco.code}`,
    );
    this.info = value;
    this.monaco.editordisabled = true;
    this.monaco.editorRef.current?.updateOptions({ lineNumbers: "off" });
    this.monaco.editorRef.current?.updateOptions({ readOnly: true });
  }

  hideInfo() {
    if (!this.monaco) {
      return;
    }
    this.info = "";
    this.monaco.editordisabled = false;
    this.monaco.editorRef.current?.updateOptions({ lineNumbers: "on" });
    this.monaco.editorRef.current?.updateOptions({ readOnly: false });
  }

  setCurrTask(task: Unit) {
    this.currTask = task;
    if (!this.monaco || task.tasktype == "guide") {
      return;
    }

    this.monaco.setEditorCode({
      code: task.defaultcode,
      tasktype: task.tasktype,
      inv: task.inout[0].inv,
    });
  }

  eraseState() {
    this.currTask = TASK_DEFAULTS;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

const newinstance = new task();
export default newinstance;
