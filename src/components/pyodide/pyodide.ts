import { makeObservable, makeAutoObservable } from "mobx";
import navigator from "../Navigator/layers/store/navigator";

class pyodide {
  //confirm any
  pyodide: any = null;

  //confirm any
  setPyodide(pyodide: any) {
    this.pyodide = pyodide;
    navigator.setPyodideloaded();
  }

  constructor() {
    makeAutoObservable(this);
  }
}
const instance = new pyodide();

export default instance;
