import { makeObservable, makeAutoObservable, autorun } from "mobx";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import { editor } from "monaco-editor";
import { toJS } from "mobx";

//direct DB call
import { updateSCP } from "@/db/localstorage";

//actions
import { showRightCodeAfterError } from "@/components/taskset/taskrun/layers/services/services";

//service utils
import { checkOnChangeErrors } from "@/components/taskset/taskrun/layers/services/taskCheck";

//storee
import taskset from "@/components/taskset/layers/store/taskset";

//themes
import {
  monacoDarktheme,
  monacoLighttheme,
} from "@/components/taskset/taskrun/components/monaco/themesetter";

import {
  checkTask,
  runTask,
} from "@/components/taskset/taskrun/layers/services/taskCheck";

import { Task } from "@/types";

import { TASK_DEFAULTS } from "@/typesdefaults";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

interface HandleEditorDidMount {
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
  darkmode: boolean;
}

class task {
  currTask: Task = TASK_DEFAULTS;
  executing: boolean = false;
  output: string = "";
  currTaskId: number = -1;
  code: string = "";
  input: string = "";
  errorMessage: string = "";
  monacoRef: React.RefObject<Monaco | null> = React.createRef();
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null> =
    React.createRef();
  editordisabled: boolean = false;
  info: string = "";
  actions: any = {
    showRightCodeAfterError,
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
    //     const { mode, setMode } = useColorScheme();

    // if (!mode) {
    //   return null;
    // }

    // const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    //   const mode = event.target.checked ? "dark" : "light";
    //   setMode(mode);
    //   task.setTheme(mode == "dark");
    // };
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
      `'''\n  Правильный код:\n'''\n\n${this.currTask.rightcode} \n\n'''\n  Твой код:\n'''\n\n${this.code}`
    );
    this.info = value;
    this.editordisabled = true;
    this.editorRef.current?.updateOptions({ lineNumbers: "off" });
    this.editorRef.current?.updateOptions({ readOnly: true });
  }

  refreshEditor = () => {
    this.editorRef.current?.setValue(this.currTask.defaultcode);
  };

  hideInfo() {
    this.info = "";
    this.editordisabled = false;
    this.editorRef.current?.updateOptions({ lineNumbers: "on" });
    this.editorRef.current?.updateOptions({ readOnly: false });
  }

  setCurrTaskP(task: Task, id: number) {
    this.currTask = task;
    this.currTaskId = id;
    this.code = task.defaultcode;
    this.input = task.inout[0].inv.join("\n");
    updateSCP({ task: { currTaskId: id } });
  }

  switchTaskP = (id: number) => {
    if (id != taskset.tasks.length) {
      this.setCurrTaskP(taskset.tasks[id], id);
      this.setEditorCode(this.currTask.defaultcode);
      updateSCP({
        task: { currTaskId: id },
      });
    }
  };

  setCurrTaskCSPOnly = (id: number) => {
    updateSCP({
      task: { currTaskId: id },
    });
  };

  setTaskCode(task: Task) {
    const code = task.defaultcode;
    this.code = code;
    this.setEditorCode(code);
  }

  setEditorCode = (code: string) => {
    this.editorRef.current?.setValue(code);
    this.currTask.tasktype == "guide"
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

  eraseStateP() {
    this.currTaskId = -1;
    this.currTask = TASK_DEFAULTS;
    updateSCP({
      task: {},
    });
  }

  refreshInput = () => {
    const task = taskset.tasks[this.currTaskId];
    const input = task.inout[0].inv.join("\n");
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

export default new task();

// class task {
//   monacoRef: React.RefObject<Monaco | null> = React.createRef();
//   editorRef: React.RefObject<editor.IStandaloneCodeEditor | null> =
//     React.createRef();
//   };

// interface handleEditorDidMount {
//   editor: Monaco;
//   monaco: editor.IStandaloneCodeEditor;
//   darkmode: boolean;
// }

//   handleEditorDidMount({ editor, monaco, darkmode }: handleEditorDidMount) {
//     this.monacoRef.current = monaco;
//     this.editorRef.current = editor;
//   }
