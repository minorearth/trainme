import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import { updateSCP } from "@/db/localstorage";

class course {
  flow: any = [];
  initialFlow: any = [];
  state: any = {};

  eraseStateP() {
    this.flow = {};
    this.state = {};
    updateSCP({
      course: {},
    });
  }

  updateStateP(data: any) {
    this.state = { ...this.state, ...data };
    updateSCP({
      course: { ...this.state, ...data },
    });
  }

  updateState(data: any) {
    this.state = { ...this.state, ...data };
  }

  setFlow = (data: any) => {
    this.flow = data;
  };
  setInitialFlow(data: any) {
    this.initialFlow = data;
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new course();
