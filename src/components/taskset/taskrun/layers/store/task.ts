import { makeObservable, makeAutoObservable, autorun } from "mobx";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import { editor } from "monaco-editor";
import { toJS } from "mobx";
import { L } from "tpconst/lang";

//direct DB call
import { updateKeySCP } from "@/db/localstorage";

//service utils
import { checkOnChangeErrors } from "@/components/taskset/taskrun/layers/services/taskCheck";

//storee
import taskset from "@/components/taskset/layers/store/taskset";
import countdownbutton from "@/components/common/CountdownButton/store";
import { dialogs } from "@/components/common/dialog/dialogMacro";

//themes
import {
  monacoDarktheme,
  monacoLighttheme,
} from "@/components/taskset/taskrun/components/monaco/themesetter";

import {
  checkTask,
  runTask,
} from "@/components/taskset/taskrun/layers/services/taskCheck";

import { TASK_DEFAULTS } from "tpconst/typesdefaults";
import { Task } from "tpconst/T";
import { TT } from "tpconst/constants";

interface HandleEditorDidMount {
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
  darkmode: boolean;
}

class task {
  currTask: Task = TASK_DEFAULTS;
  executing: boolean = false;
  output: string = "";
  code: string = "";
  input: string = "";
  errorMessage: string = "";
  monacoRef: React.RefObject<Monaco | null> = React.createRef();
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null> =
    React.createRef();
  editordisabled: boolean = false;
  info: string = "";
  actions: any = {
    checkTask,
    runTask,
  };

  setRightCode_admin() {
    this.editorRef.current?.setValue(this.currTask.rightcode);
  }

  setForbiddenCode_admin() {
    this.editorRef.current?.setValue(this.currTask.forbiddencode);
  }

  handleEditorDidMount({ editor, monaco, darkmode }: HandleEditorDidMount) {
    this.monacoRef.current = monaco;
    this.editorRef.current = editor;
    this.setEditorCode(this.code);
    this.defineTheme();
  }

  defineTheme() {
    this.monacoRef.current?.editor.defineTheme(
      "dark",
      monacoDarktheme as editor.IStandaloneThemeData
    );
    this.monacoRef.current?.editor.defineTheme(
      "light",
      monacoLighttheme as editor.IStandaloneThemeData
    );
  }

  setTheme(darkmode: boolean) {
    darkmode
      ? this.monacoRef.current?.editor.setTheme("dark")
      : this.monacoRef.current?.editor.setTheme("light");
  }

  setOutput = (value: string) => {
    this.output = value;
  };

  setInput = (value: string) => {
    this.input = value;
  };

  showInfo(value: string) {
    this.editorRef.current?.setValue(
      `'''\n  ${L.ru.ME.RIGHT_CODE}\n'''\n\n${this.currTask.rightcode} \n\n'''\n  ${L.ru.ME.YOUR_CODE}\n'''\n\n${this.code}`
    );
    this.info = value;
    this.editordisabled = true;
    this.editorRef.current?.updateOptions({ lineNumbers: "off" });
    this.editorRef.current?.updateOptions({ readOnly: true });
  }

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

  refreshEditor = () => {
    this.editorRef.current?.setValue(this.currTask.defaultcode);
  };

  hideInfo() {
    this.info = "";
    this.editordisabled = false;
    this.editorRef.current?.updateOptions({ lineNumbers: "on" });
    this.editorRef.current?.updateOptions({ readOnly: false });
  }

  setCurrTask(task: Task) {
    this.currTask = task;
    this.code = task.defaultcode;
    this.input = task.inout[0].inv.join("\n");
    this.output = "";

    this.setEditorCode(task.defaultcode);
  }

  setEditorCode = (code: string) => {
    this.editorRef.current?.setValue(code);
    this.currTask.tasktype == TT.guide
      ? this.editorRef.current?.updateOptions({ lineNumbers: "off" })
      : this.editorRef.current?.updateOptions({ lineNumbers: "on" });
  };

  setExecuting(executing: boolean) {
    this.executing = executing;
  }

  handleChangeMonacoContent(value: string) {
    if (this.editorRef.current) {
      const model = this.editorRef.current.getModel();
      if (model) {
        const errorMessage = checkOnChangeErrors({
          lineCount: model?.getLineCount(),
        });
        this.errorMessage = errorMessage;
      }
      this.code = value;
    }
  }

  eraseState() {
    this.currTask = TASK_DEFAULTS;
  }

  refreshInput = () => {
    const input = this.currTask.inout[0].inv.join("\n");
    this.setInput(input);
  };

  disposer: () => void;

  constructor() {
    makeAutoObservable(this);
    this.disposer = autorun(() => {
      if (this.editorRef.current && this.code != "loading") {
        this.disposer();
      }
    });
  }

  dispose() {
    if (this.disposer) {
      this.disposer();
    }
  }
}

const newinstance = new task();
export default newinstance;
