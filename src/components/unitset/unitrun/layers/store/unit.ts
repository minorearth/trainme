import { makeAutoObservable, toJS, reaction, runInAction } from "mobx";

//themes
import {
  monacoDarktheme,
  monacoLighttheme,
} from "@/components/unitset/unitrun/components/BottomPanel/editor/monaco/themesetter";

interface HandleEditorDidMount {
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
  monacoid: number;
  containerRef: any;
}

import React from "react";
import { editor } from "monaco-editor";

//stores
import countdownbutton from "@/components/common/CountdownButton/store";
import pyodide from "@/components/pyodide/pyodide";

//services
import { dialogs } from "@/components/common/dialog/dialogMacro";

import {
  checkTaskAction,
  preCheckTaskAction,
  checkOnChangeErrors,
} from "@/components/unitset/unitrun/layers/services/taskCheck";

//tpconst
import { UNIT_DEFAULTS } from "@/tpconst/src/typesdefaults";
import { Guide, Task, Unit } from "@/tpconst/src/T";
import { TT } from "@/tpconst/src/const";
import { L } from "@/tpconst/src/lang";

import { Monaco } from "@monaco-editor/react";

import {
  runPythonCode,
  runPythonCodeRace,
  // runPythonCode2,
} from "@/components/pyodide/pythonRunner";
import themeSwitchStore from "@/components/common/themeswitch/themeSwitchStore";
import { terminateWorker } from "@/components/pyodide/newWorkerAPI";

interface Editors {
  defaultcode: string; //to refresh
  // code: string;

  inv: string[]; //to refresh
  input: string;

  output: string;

  unittype: string;
  monacoRef: React.RefObject<Monaco | null>;
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null>;
  executing: boolean;
  editordisabled: boolean;
  errorMessage: string;
  info: string;
  filedata: string;
  codepart: string;
  markdown: string;

  //     monacoRef: React.RefObject<Monaco | null> = React.createRef();
  // editorRef: React.RefObject<editor.IStandaloneCodeEditor | null> =
  //   React.createRef();
}

class unitstore {
  currUnit: Unit = UNIT_DEFAULTS;
  editors: Editors[] = [];
  showanswer: boolean = false;

  setCurrUnit(unit: Unit) {
    this.currUnit = unit;
    if (unit.unittype == "guide") {
      this.editors = (unit as Guide).parts.map((part, id) => {
        return {
          // code: part.part,
          defaultcode: part.codepart,
          unittype: unit.unittype,
          input: part.inout[0].inv.join("\n"),
          output: "",
          inv: part.inout[0].inv,
          filedata: unit.inout[id].filesdata[0] ?? "",
          codepart: part.codepart,
          markdown: part.markdown,

          executing: false,
          editordisabled: false,
          errorMessage: "",
          info: "",
        };
      }) as Editors[];
    } else {
      this.editors = [
        {
          codepart: unit.defaultcode,
          defaultcode: unit.defaultcode,
          unittype: unit.unittype,
          input: unit.inout[0].inv.join("\n"),
          output: "",
          filedata: unit.inout[0].filesdata.join("\n"),
          inv: unit.inout[0].inv,
        },
      ] as Editors[];
    }
  }

  eraseState() {
    this.currUnit = UNIT_DEFAULTS;
  }

  //common
  setOutput = (monacoid: number, value: string) => {
    this.editors[monacoid].output = value;
  };

  refreshInput = (monacoid: number) => {
    this.editors[monacoid].input = this.editors[monacoid].inv.join("\n");
  };

  setExecuting(monacoid: number, executing: boolean) {
    this.editors[monacoid].executing = executing;
  }

  setEditorCode = (monacoid: number) => {
    this.editors[monacoid].editorRef.current?.setValue(
      this.editors[monacoid].codepart,
    );
    this.editors[monacoid].unittype == TT.guide
      ? this.editors[monacoid].editorRef.current?.updateOptions({
          lineNumbers: "off",
        })
      : this.editors[monacoid].editorRef.current?.updateOptions({
          lineNumbers: "on",
        });
  };

  playCode = async (monacoid: number) => {
    this.setExecuting(monacoid, true);
    pyodide.setExecuting(true);
    try {
      const { outputTxt } = await runPythonCodeRace({
        code: this.editors[monacoid].filedata + this.editors[monacoid].codepart,
        stdIn: this.editors[monacoid].input,
      });
      this.setOutput(monacoid, outputTxt);
    } catch (e) {
      this.setOutput(monacoid, "Время выполнения превышено.");
    }
    pyodide.setExecuting(false);
    this.setExecuting(monacoid, false);
  };

  refreshEditor = (monacoid: number) => {
    this.editors[monacoid].editorRef.current?.setValue(
      (this.editors[monacoid].codepart = this.editors[monacoid].defaultcode),
    );
  };

  handleChangeMonacoContent = (
    value: string,
    monacoid: number,
    errorHandler: () => void,
  ) => {
    errorHandler();
    this.editors[monacoid].codepart = value;
  };

  handleEditorDidMount({
    editor,
    monaco,
    monacoid,
    containerRef,
  }: HandleEditorDidMount) {
    this.editors[monacoid].monacoRef = React.createRef();
    this.editors[monacoid].editorRef = React.createRef();
    this.editors[monacoid].monacoRef.current = monaco;
    this.editors[monacoid].editorRef.current = editor;
    this.setEditorCode(monacoid);
    this.defineTheme(monaco);
    this.setDarkTheme(monaco, themeSwitchStore.darkmode);

    if (editor) {
      // editor.layout({
      //   width: containerRef?.current?.clientWidth ?? 0,
      //   height: 300,
      // });
      editor.onDidContentSizeChange((e) => {
        const newHeight = e.contentHeight;
        editor.layout({
          width: containerRef?.current?.clientWidth ?? 0,
          height: newHeight,
        });
      });
    }
  }

  defineTheme(monaco: Monaco | null) {
    monaco?.editor.defineTheme(
      "dark",
      monacoDarktheme as editor.IStandaloneThemeData,
    );
    monaco?.editor.defineTheme(
      "light",
      monacoLighttheme as editor.IStandaloneThemeData,
    );
  }

  setDarkTheme = (monaco: Monaco | null, darkmode: boolean) => {
    if (darkmode) {
      monaco?.editor.setTheme("dark");
    } else {
      monaco?.editor.setTheme("light");
    }
  };

  // task related
  setRightCode_admin(value: string) {
    this.editors[0].editorRef.current?.setValue(value);
  }

  setForbiddenCode_admin(value: string) {
    this.editors[0].editorRef.current?.setValue(value);
  }

  errorHandler = () => {
    if (this.editors[0].editorRef.current) {
      const model = this.editors[0].editorRef.current.getModel();
      if (model) {
        const errorMessage = checkOnChangeErrors({
          lineCount: model?.getLineCount(),
        });
        this.editors[0].errorMessage = errorMessage;
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
    // this.editors[0].editorRef.current?.setValue(
    //   `'''\n  ${L.ru.ME.RIGHT_CODE}\n'''\n\n${(this.currUnit as Task).rightcode} \n\n'''\n  ${L.ru.ME.YOUR_CODE}\n'''\n\n${this.editors[0].codepart}`,
    // );
    this.showanswer = true;
    // this.editors[0].info = value;
    // this.editors[0].editordisabled = true;
    // this.editors[0].editorRef.current?.updateOptions({ lineNumbers: "off" });
    // this.editors[0].editorRef.current?.updateOptions({ readOnly: true });
  }

  hideInfo() {
    // if (!this.monaco) {
    //   return;
    // }
    this.showanswer = false;

    // this.editors[0].info = "";
    // this.editors[0].editordisabled = false;
    // this.editors[0].editorRef.current?.updateOptions({ lineNumbers: "on" });
    // this.editors[0].editorRef.current?.updateOptions({ readOnly: false });
  }

  constructor() {
    makeAutoObservable(this);
    reaction(
      () => themeSwitchStore.darkmode,
      (newValue) => {
        runInAction(() => {
          this.setDarkTheme(this.editors[0].monacoRef.current, newValue);
        });
      },
    );
  }
}

const newinstance = new unitstore();
export default newinstance;

// recalcHeight(
//   monaco: Monaco | null,
//   editor: editor.IStandaloneCodeEditor | null,
//   width: number,
//   newHeight2?: number,
// ) {
//   if (newHeight2) {
//   } else if (monaco && editor) {
//     const lineHeight =
//       editor.getOption(monaco.editor.EditorOption.lineHeight) || 0;
//     const lineCount = editor.getModel()?.getLineCount() || 0;

//     const newHeight = lineHeight * lineCount + 40;
//     // editor.layout({
//     //   width: width,
//     //   height: newHeight,
//     // });
//   }
//   // this.height = newHeight2 > newHeight ? newHeight2 : newHeight;
// }
