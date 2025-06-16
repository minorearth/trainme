import { makeObservable, makeAutoObservable } from "mobx";
import chapter from "@/components/chapter/store/chapter";
import { Monaco } from "@monaco-editor/react";
import React from "react";
import { editor } from "monaco-editor";
import { toJS } from "mobx";
import { updateSCP } from "@/db/localstorage";

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

  setMonacoRefs(monacoRef: Monaco, editorRef: editor.IStandaloneCodeEditor) {
    this.monacoRef.current = monacoRef;
    this.editorRef.current = editorRef;
  }

  setCurrTask = (id: number) => {
    if (id != chapter.allTasks.length) {
      this.currTask = chapter.allTasks[id];
      this.currTaskId = id;
      updateSCP({
        task: { currTaskId: id },
      });
    }
  };

  setCurrTaskData(data, id) {
    this.currTask = data;
    this.currTaskId = id;
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
    const taskData = chapter.allTasks[this.currTaskId];
    const input = taskData.defaultinput.join("\n");
    //TODO:wtf
    // task.currTask.input = input;
    this.updateCurrTask({ input });
  };

  constructor() {
    makeAutoObservable(this);
  }
}

export default new task();
