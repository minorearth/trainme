import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import { updateSCP } from "@/db/localstorage";

class course {
  flow: any = [];
  state: any = {};

  eraseState() {
    this.flow = {};
    this.state = {};
    updateSCP({
      course: {},
    });
  }

  updateState(data: any) {
    this.state = { ...this.state, ...data };
    updateSCP({
      course: { ...this.state, ...data },
    });
  }

  setFlow(data: any) {
    this.flow = data;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new course();
