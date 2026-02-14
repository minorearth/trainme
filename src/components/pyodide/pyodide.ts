import { makeObservable, makeAutoObservable } from "mobx";
import navigator from "../Navigator/layers/store/navigator";

class pyodide {
  //confirm any
  pyodide: any = null;
  worker: any = null;
  executing: Boolean = false;

  //confirm any
  setPyodide(pyodide: any) {
    this.pyodide = pyodide;
    navigator.setPyodideloaded();
  }

  setExecuting(active: Boolean) {
    if (active) {
      this.executing = active;
    } else {
      setTimeout(() => {
        this.executing = active;
      }, 500);
    }
  }

  setPyodideWorker(worker: any) {
    this.worker = worker;
    navigator.setPyodideloaded();
  }

  constructor() {
    makeAutoObservable(this);
  }
}
const instance = new pyodide();

export default instance;
