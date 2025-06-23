import { makeObservable, makeAutoObservable } from "mobx";

interface ITask {
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
