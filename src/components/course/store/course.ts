import { makeObservable, makeAutoObservable } from "mobx";
import { runInAction } from "mobx";
import { updateSCP } from "@/db/localstorage";

class flow {
  flow: any = [];
  state: any = {};

  updateState(data) {
    this.state = { ...this.state, ...data };
    updateSCP({
      flow: { ...this.state, ...data },
    });
  }

  setFlow(data) {
    this.flow = data;
    // updateSCP({
    //   flow: data,
    // });
  }

  constructor() {
    makeAutoObservable(this);
  }
}

export default new flow();
