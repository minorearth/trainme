import {
  makeObservable,
  makeAutoObservable,
  autorun,
  runInAction,
  reaction,
  toJS,
} from "mobx";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import { editor } from "monaco-editor";

//themes
import {
  monacoDarktheme,
  monacoLighttheme,
} from "@/components/taskset/taskrun/components/BottomPanel/editor/monaco/themesetter";

import { runPythonCode } from "@/components/pyodide/pythonRunner";

//tpconst
import { TT } from "@/tpconst/src/const";
import dynamic from "next/dynamic";
import themeSwitchStore from "@/components/common/themeswitch/themeSwitchStore";

interface HandleEditorDidMount {
  editor: editor.IStandaloneCodeEditor | null;
  monaco: Monaco | null;
  code: string;
  tasktype: string;
  inv: string[];
  filedata: string;
  containerRef: any;
  resizeObserverRef: any;
}

class monacostore {
  state = {};
  executing: boolean = false;
  output: string = "";
  code: string = "";
  input: string = "";
  filedata: string = "";
  height: number = 50;
  monacoRef: React.RefObject<Monaco | null> = React.createRef();
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null> =
    React.createRef();
  editordisabled: boolean = false;
  darktheme: boolean = true;

  setOutput = (value: string) => {
    this.output = value;
  };

  setInput = (value: string) => {
    this.input = value;
  };

  handleEditorDidMount({
    editor,
    monaco,
    code,
    inv,
    tasktype,
    filedata,
    containerRef,
    resizeObserverRef,
  }: HandleEditorDidMount) {
    this.filedata = filedata;
    this.monacoRef.current = monaco;
    this.editorRef.current = editor;
    this.setEditorCode({ code, inv, tasktype });
    this.defineTheme();
    // this.recalcHeight();
    this.setDarkTheme(themeSwitchStore.darkmode);

    if (editor) {
      editor.onDidContentSizeChange((e) => {
        // console.log("e.contentHeight", e.contentHeight);

        const newHeight = e.contentHeight;
        editor.layout({
          width: containerRef?.current?.clientWidth ?? 0,
          height: newHeight,
        });
        this.recalcHeight(newHeight);
      });

      // Наблюдатель за шириной контейнера (на случай ресайза окна/контейнера)
      if (typeof ResizeObserver !== "undefined" && containerRef.current) {
        // this.recalcHeight();
        // const ro = new ResizeObserver(() => {
        //   const width = containerRef.current?.clientWidth ?? 0;
        //   const currentHeight = editor.getLayoutInfo().height;
        //   editor.layout({ width, height: currentHeight });
        //   this.recalcHeight();
        // });
        // ro.observe(containerRef.current);
        // resizeObserverRef.current = ro;
      }
    }
  }

  defineTheme() {
    this.monacoRef.current?.editor.defineTheme(
      "dark",
      monacoDarktheme as editor.IStandaloneThemeData,
    );
    this.monacoRef.current?.editor.defineTheme(
      "light",
      monacoLighttheme as editor.IStandaloneThemeData,
    );
  }

  setDarkTheme = (darkmode: boolean) => {
    console.log("sss", darkmode, this.monacoRef.current);
    if (darkmode) {
      this.monacoRef.current?.editor.setTheme("dark");
    } else {
      this.monacoRef.current?.editor.setTheme("light");
    }
  };

  refreshEditor = (code: string) => {
    this.editorRef.current?.setValue(code);
  };

  setEditorCode = ({
    code,
    tasktype,
    inv,
  }: {
    code: string;
    tasktype: string;
    inv: string[];
  }) => {
    this.code = code;
    this.input = inv.join("\n");
    this.output = "";

    this.editorRef.current?.setValue(code);
    tasktype == TT.guide
      ? this.editorRef.current?.updateOptions({ lineNumbers: "off" })
      : this.editorRef.current?.updateOptions({ lineNumbers: "on" });
  };

  setExecuting(executing: boolean) {
    this.executing = executing;
  }

  recalcHeight(newHeight2: number) {
    this.height = newHeight2;
    return;
    // const lineHeight =
    //   this.editorRef.current.getOption(
    //     this.monacoRef.current.editor.EditorOption.lineHeight,
    //   ) || 0;
    // const lineCount = this.editorRef.current.getModel().getLineCount() || 0;

    // const newHeight = lineHeight * lineCount + 40;

    // this.height = newHeight2 > newHeight ? newHeight2 : newHeight;
  }

  handleChangeMonacoContent(value: string, errorHandler: () => void) {
    errorHandler();
    // this.recalcHeight();
    this.code = value;
  }

  setRightCode_admin(value: string) {
    this.editorRef.current?.setValue(value);
  }

  setForbiddenCode_admin(value: string) {
    this.editorRef.current?.setValue(value);
  }

  refreshInput = (inv: string[]) => {
    const input = inv.join("\n");
    this.setInput(input);
  };

  runTask = async () => {
    console.log("code", this.code);
    if (this.executing) return;
    this.setExecuting(true);
    const { outputTxt } = await runPythonCode({
      code: this.filedata + this.code,
      stdIn: this.input,
    });
    this.setOutput(outputTxt);
    this.setExecuting(false);
  };

  // disposer: () => void;

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => themeSwitchStore.darkmode,
      (newValue) => {
        runInAction(() => {
          this.setDarkTheme(newValue);
        });
      },
    );

    // this.disposer = autorun(() => {
    //   if (this.editorRef.current && this.code != "loading") {
    //     this.disposer();
    //   }
    //   const newValue = themeSwitchStore.darkmode;
    //   runInAction(() => {
    //     this.setDarkTheme(newValue);
    //     // this.darktheme = newValue;
    //   });
    // });
  }

  // dispose() {
  //   if (this.disposer) {
  //     this.disposer();
  //   }
  // }
}

export type MonacoStore = monacostore;

const monaco2 = new monacostore();
export default monaco2;
export { monacostore };
