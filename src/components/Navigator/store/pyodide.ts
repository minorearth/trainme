import { makeObservable, makeAutoObservable } from "mobx";
import taskset from "@/components/taskset/layers/store/taskset";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import { editor } from "monaco-editor";
import { toJS } from "mobx";
import { updateSCP } from "@/db/localstorage";
import // setRightCode_admin,

"@/components/taskset/taskrun/store/taskMobx";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

class pyodide {
  pyodide: any = null;
  actions: any = {};

  setPyodide(pyodide: any) {
    this.pyodide = pyodide;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new pyodide();
