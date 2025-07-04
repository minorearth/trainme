import { makeObservable, makeAutoObservable } from "mobx";
import navigator from "../Navigator/layers/store/navigator";

interface ITask {
  // openAndRefreshFlowPage?: (courseid: string) => void;
}

class pyodide {
  pyodide: any = null;
  actions: any = {};

  setPyodide(pyodide: any) {
    this.pyodide = pyodide;
    navigator.setPyodideloaded();
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new pyodide();
