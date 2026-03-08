import { makeObservable, makeAutoObservable } from "mobx";

class slider {
  state: { [name: string]: number } = {};

  setState(name: string, value: number) {
    this.state[name] = value;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new slider();
