import { makeObservable, makeAutoObservable } from "mobx";
import taskset from "@/components/taskset/layers/store/taskset";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import { editor } from "monaco-editor";
import { toJS } from "mobx";
import { updateSCP } from "@/db/localstorage";
import {
  setRightCode_admin,
  setForbiddenCode_admin,
  setEditorDisabled,
  showRightCodeAfterError,
  refreshEditor,
  handleChangeContent,
  setTaskCode,
  handleEditorDidMount,
} from "@/components/taskset/taskrun/store/taskMobx";

import {
  checkTask,
  runTask,
} from "@/components/taskset/taskrun/store/taskCheck";

interface ITask {
  /**
   * Open course flow page
   * @param courseid - course to show.
   * @returns nothing.
   */
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

class task {
  currTask: ITask = {};
  executing: boolean = false;
  currTaskId: number = -1;
  monacoRef: React.RefObject<Monaco | null> = React.createRef();
  editorRef: React.RefObject<editor.IStandaloneCodeEditor | null> =
    React.createRef();
  actions: any = {
    setRightCode_admin,
    setForbiddenCode_admin,
    setEditorDisabled,
    showRightCodeAfterError,
    refreshEditor,
    handleChangeContent,
    setTaskCode,
    handleEditorDidMount,
    checkTask,
    runTask,
  };

  setMonacoRefs(monacoRef: Monaco, editorRef: editor.IStandaloneCodeEditor) {
    this.monacoRef.current = monacoRef;
    this.editorRef.current = editorRef;
  }

  setCurrTask = (id: number) => {
    if (id != taskset.allTasks.length) {
      this.currTask = taskset.allTasks[id];
      this.currTaskId = id;
      setTaskCode(taskset.allTasks[id], this.editorRef.current);
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

  setCurrTaskData(data: any, id: any) {
    this.currTask = data;
    this.currTaskId = id;
    setTaskCode(data, this.editorRef.current);
    updateSCP({ task: { currTaskId: id } });
  }

  setExecuting(executing: boolean) {
    this.executing = executing;
  }

  updateCurrTask = (data: ITask) => {
    this.currTask = {
      ...this.currTask,
      ...data,
    };
  };

  eraseState() {
    this.currTaskId = -1;
    this.currTask = {};
    updateSCP({
      task: {},
    });
  }

  refreshInput = () => {
    const taskData = taskset.allTasks[this.currTaskId];
    const input = taskData.defaultinput.join("\n");
    this.updateCurrTask({ input });
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export default new task();
